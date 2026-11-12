# C++ 本地判题小服务（只监听 127.0.0.1:8777，不对外暴露）
# 启动方式：双击同目录的 start-lab.bat，保持黑窗口开着即可。
# 它会自动找 g++ 或 Visual Studio 的 cl.exe，找不到会在窗口里提示。

$ErrorActionPreference = 'Stop'
$Port = 8777
$AllowedOrigins = @(
  'https://zijiashanggan.github.io',
  'http://127.0.0.1:8766',
  'http://localhost:8766'
)
$CompileTimeout = 20000
$RunTimeout = 5000
$Root = Join-Path $env:TEMP 'cpp-lab-run'

function Find-Compiler {
  $g = Get-Command g++ -ErrorAction SilentlyContinue
  if ($g) {
    $ver = (& $g.Source --version 2>$null | Select-Object -First 1)
    return @{ kind = 'g++'; path = $g.Source; name = "$ver" }
  }
  $vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
  if (Test-Path $vswhere) {
    $inst = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
    if ($inst) {
      $vcvars = Join-Path $inst.Trim() 'VC\Auxiliary\Build\vcvars64.bat'
      if (Test-Path $vcvars) {
        return @{ kind = 'cl'; path = $vcvars; name = 'MSVC cl.exe' }
      }
    }
  }
  return $null
}

function Write-Resp($stream, [int]$code, [string]$json, [string]$origin) {
  $body = [Text.Encoding]::UTF8.GetBytes($json)
  $head = "HTTP/1.1 $code OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n"
  if ($origin -and ($AllowedOrigins -contains $origin)) {
    $head += "Access-Control-Allow-Origin: $origin`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type`r`nAccess-Control-Max-Age: 600`r`n"
  }
  $head += "`r`n"
  $hb = [Text.Encoding]::ASCII.GetBytes($head)
  $stream.Write($hb, 0, $hb.Length)
  if ($body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
  $stream.Flush()
}

function Read-Request($stream) {
  # 逐字节读到 \r\n\r\n，避免 StreamReader 缓冲把 body 吃掉
  $buf = New-Object System.Collections.Generic.List[byte]
  $state = 0
  while ($true) {
    $one = $stream.ReadByte()
    if ($one -lt 0) { break }
    $buf.Add([byte]$one)
    if ($state -eq 0 -and $one -eq 13) { $state = 1 }
    elseif ($state -eq 1 -and $one -eq 10) { $state = 2 }
    elseif ($state -eq 2 -and $one -eq 13) { $state = 3 }
    elseif ($state -eq 3 -and $one -eq 10) { break }
    else { $state = 0 }
    if ($buf.Count -gt 65536) { break }
  }
  $headText = [Text.Encoding]::UTF8.GetString($buf.ToArray())
  $lines = $headText -split "`r`n"
  if (-not $lines -or $lines.Count -eq 0) { return $null }
  $parts = $lines[0] -split ' '
  $req = @{ method = $parts[0]; path = ($parts[1] -split '\?')[0]; headers = @{}; body = '' }
  for ($i = 1; $i -lt $lines.Count; $i++) {
    $ln = $lines[$i]
    $c = $ln.IndexOf(':')
    if ($c -gt 0) { $req.headers[$ln.Substring(0, $c).ToLower()] = $ln.Substring($c + 1).Trim() }
  }
  $len = 0
  if ($req.headers.ContainsKey('content-length')) { [int]::TryParse($req.headers['content-length'], [ref]$len) | Out-Null }
  if ($len -gt 0 -and $len -le 300000) {
    $bodyBuf = New-Object byte[] $len
    $read = 0
    while ($read -lt $len) {
      $n = $stream.Read($bodyBuf, $read, $len - $read)
      if ($n -le 0) { break }
      $read += $n
    }
    $req.body = [Text.Encoding]::UTF8.GetString($bodyBuf, 0, $read)
  }
  return $req
}

function Norm-Path([string]$p) { if ($null -eq $p) { return '' }; ($p -replace "`r`n", "`n").TrimEnd() }

function Compile-Code($comp, [string]$dir, [string]$src) {
  $exe = Join-Path $dir 'prog.exe'
  if ($comp.kind -eq 'g++') {
    $psi = New-Object Diagnostics.ProcessStartInfo
    $psi.FileName = $comp.path
    $psi.Arguments = '-std=c++17 -O2 -o "' + $exe + '" "' + $src + '"'
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    $psi.WorkingDirectory = $dir
    $p = [Diagnostics.Process]::Start($psi)
    $o = $p.StandardOutput.ReadToEndAsync()
    $e = $p.StandardError.ReadToEndAsync()
    if (-not $p.WaitForExit($CompileTimeout)) {
      try { $p.Kill() } catch {}
      return @{ ok = $false; timeout = $true; output = '编译超时（20 秒），请检查是不是写了超大模板或死循环宏。' }
    }
    $out = (Norm-Path $o.Result) + "`n" + (Norm-Path $e.Result)
    return @{ ok = (Test-Path $exe); output = $out.Trim(); exe = $exe }
  }
  # MSVC：先 call vcvars64.bat，再 cl
  $bat = Join-Path $dir 'build.bat'
  $lines = @(
    '@echo off',
    ('call "' + $comp.path + '" >nul'),
    ('cl /nologo /EHsc /std:c++17 /Fe:"' + $exe + '" "' + $src + '"')
  )
  Set-Content -Path $bat -Value $lines -Encoding ASCII
  $psi = New-Object Diagnostics.ProcessStartInfo
  $psi.FileName = 'cmd.exe'
  $psi.Arguments = '/c "' + $bat + '"'
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $psi.WorkingDirectory = $dir
  $p = [Diagnostics.Process]::Start($psi)
  $o = $p.StandardOutput.ReadToEndAsync()
  $e = $p.StandardError.ReadToEndAsync()
  if (-not $p.WaitForExit($CompileTimeout)) {
    try { $p.Kill() } catch {}
    return @{ ok = $false; timeout = $true; output = '编译超时（20 秒），请检查代码。' }
  }
  $out = (Norm-Path $o.Result) + "`n" + (Norm-Path $e.Result)
  return @{ ok = (Test-Path $exe); output = $out.Trim(); exe = $exe }
}

function Run-Case([string]$exe, [string]$stdin, [string]$dir) {
  # 用文件重定向而不是管道：更稳，超时被杀也能拿到已经写出的输出
  $inFile = Join-Path $dir 'in.txt'
  $outFile = Join-Path $dir 'out.txt'
  $errFile = Join-Path $dir 'err.txt'
  [IO.File]::WriteAllText($inFile, [string]$stdin, (New-Object Text.UTF8Encoding($false)))
  if (Test-Path $outFile) { Remove-Item $outFile -Force -ErrorAction SilentlyContinue }
  if (Test-Path $errFile) { Remove-Item $errFile -Force -ErrorAction SilentlyContinue }

  $sw = [Diagnostics.Stopwatch]::StartNew()
  $p = Start-Process -FilePath $exe -WorkingDirectory $dir -NoNewWindow -PassThru `
       -RedirectStandardInput $inFile -RedirectStandardOutput $outFile -RedirectStandardError $errFile
  if (-not $p.WaitForExit($RunTimeout)) {
    try { $p.Kill() } catch {}
    $sw.Stop()
    Start-Sleep -Milliseconds 120
    $partial = if (Test-Path $outFile) { [IO.File]::ReadAllText($outFile) } else { '' }
    return @{ timeout = $true; out = $partial; err = ''; ms = $sw.ElapsedMilliseconds }
  }
  $sw.Stop()
  $out = if (Test-Path $outFile) { [IO.File]::ReadAllText($outFile) } else { '' }
  $err = if (Test-Path $errFile) { [IO.File]::ReadAllText($errFile) } else { '' }
  return @{ timeout = $false; out = $out; err = $err; ms = $sw.ElapsedMilliseconds }
}

# ---------------- 启动 ----------------
$script:Comp = Find-Compiler
[System.Net.Sockets.TcpListener]$listener = $null
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
try { $listener.Start() }
catch {
  Write-Host ""
  Write-Host "端口 $Port 被占用了（可能已经开着一个判题服务）。" -ForegroundColor Yellow
  Write-Host "把已经打开的窗口关掉，再重新双击 start-lab.bat。"
  Read-Host "按回车退出"
  exit 1
}

Write-Host ""
Write-Host "  C++ 本地判题服务已启动" -ForegroundColor Green
Write-Host "  地址：http://127.0.0.1:$Port"
if ($script:Comp) { Write-Host "  编译器：$($script:Comp.name)" -ForegroundColor Green }
else { Write-Host "  编译器：没找到 g++ 或 cl.exe，只能启动、不能判题" -ForegroundColor Yellow }
Write-Host "  用法：回到网页点「运行」，不要关这个窗口。按 Ctrl+C 停止。"
Write-Host ""

while ($true) {
  $client = $null
  try {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $req = Read-Request $stream
    if ($null -eq $req) { $client.Close(); continue }
    $origin = ''
    if ($req.headers.ContainsKey('origin')) { $origin = $req.headers['origin'] }

    if ($req.method -eq 'OPTIONS') {
      Write-Resp $stream 204 '' $origin
      $client.Close(); continue
    }

    if ($req.method -eq 'GET' -and $req.path -eq '/ping') {
      $json = @{
        ok = $true
        service = 'cpp-lab'
        port = $Port
        compiler = $(if ($script:Comp) { $script:Comp.name } else { '' })
        canRun = [bool]$script:Comp
      } | ConvertTo-Json -Compress
      Write-Resp $stream 200 $json $origin
      $client.Close(); continue
    }

    if ($req.method -eq 'POST' -and $req.path -eq '/run') {
      $t0 = Get-Date
      if (-not $script:Comp) {
        Write-Resp $stream 200 (@{ ok = $false; error = '没有找到编译器：请装 VS（含 C++ 工作负载）或把 g++ 加进 PATH，然后重启 start-lab.bat。' } | ConvertTo-Json -Compress) $origin
        $client.Close(); continue
      }
      $payload = $null
      try { $payload = $req.body | ConvertFrom-Json } catch { $payload = $null }
      if (-not $payload -or -not $payload.code) {
        Write-Resp $stream 200 (@{ ok = $false; error = '请求里没有代码。' } | ConvertTo-Json -Compress) $origin
        $client.Close(); continue
      }
      if ($payload.code.Length -gt 200000) {
        Write-Resp $stream 200 (@{ ok = $false; error = '代码太长（超过 200KB）。' } | ConvertTo-Json -Compress) $origin
        $client.Close(); continue
      }

      $dir = Join-Path $Root ([guid]::NewGuid().ToString('N'))
      New-Item -ItemType Directory -Path $dir -Force | Out-Null
      $src = Join-Path $dir 'main.cpp'
      [IO.File]::WriteAllText($src, [string]$payload.code, (New-Object Text.UTF8Encoding($false)))

      $c = Compile-Code $script:Comp $dir $src
      if (-not $c.ok) {
        $json = @{
          ok = $false
          compiled = $false
          compileTimeout = [bool]$c.timeout
          compileOutput = [string]$c.output
          cases = @()
          ms = [int]((Get-Date) - $t0).TotalMilliseconds
        } | ConvertTo-Json -Depth 5 -Compress
        Write-Resp $stream 200 $json $origin
        try { Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue } catch {}
        $client.Close(); continue
      }

      $results = @()
      foreach ($cs in @($payload.cases)) {
        $expect = Norm-Path ([string]$cs.expected)
        $r = Run-Case $c.exe ([string]$cs.stdin) $dir
        $actual = Norm-Path $r.out
        $pass = (-not $r.timeout) -and ($actual -eq $expect)
        $results += @{
          pass = $pass
          timeout = [bool]$r.timeout
          expected = $expect
          actual = $(if ($actual.Length -gt 4000) { $actual.Substring(0, 4000) } else { $actual })
          stderr = $(if ($r.err.Length -gt 3000) { $r.err.Substring(0, 3000) } else { $r.err })
          ms = [int]$r.ms
        }
      }
      $allPass = ($results.Count -gt 0)
      foreach ($x in $results) { if (-not $x.pass) { $allPass = $false } }
      $json = @{
        ok = $allPass
        compiled = $true
        compileOutput = [string]$c.output
        compiler = $script:Comp.name
        cases = $results
        ms = [int]((Get-Date) - $t0).TotalMilliseconds
      } | ConvertTo-Json -Depth 5 -Compress
      Write-Resp $stream 200 $json $origin
      try { Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue } catch {}
      $client.Close(); continue
    }

    Write-Resp $stream 404 (@{ ok = $false; error = 'not found' } | ConvertTo-Json -Compress) $origin
    $client.Close()
  }
  catch {
    Write-Host ("请求出错：" + $_.Exception.Message) -ForegroundColor Red
    try { if ($client) { $client.Close() } } catch {}
  }
}
