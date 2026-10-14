# Full-page screenshots of the local preview with headless Edge.
# usage: powershell -File scripts\shots.ps1 -Out <dir> -Pages "/","/shop/" -Width 1366 -Height 6000
param([string]$Out, [string[]]$Pages = @("/"), [int]$Width = 1366, [int]$Height = 6000, [string]$Tag = "d")
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe" }
foreach ($p in $Pages) {
  $name = ($p.Trim("/") -replace "[/]", "_"); if (-not $name) { $name = "home" }
  $file = Join-Path $Out "$name-$Tag.png"
  $url = "http://localhost:4173$p" + "?shot=1"
  $proc = Start-Process -FilePath $edge -ArgumentList "--headless=new","--disable-gpu","--hide-scrollbars","--virtual-time-budget=8000","--window-size=$Width,$Height","--screenshot=$file",$url -PassThru -WindowStyle Hidden
  $proc.WaitForExit(60000) | Out-Null
  Write-Output "$file"
}
