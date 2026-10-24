param([ValidateRange(1024,65535)][int]$Port=8787)
$ErrorActionPreference='Stop'
$nodeCommand=Get-Command node -ErrorAction Stop
$nodeMajor=[int]((& $nodeCommand.Source --version).TrimStart('v').Split('.')[0])
if($nodeMajor -lt 24){throw 'Node.js 24 or later is required.'}
$runtimePath=Join-Path $PSScriptRoot '.local-demo'
New-Item -ItemType Directory -Path $runtimePath -Force | Out-Null
$secretPath=Join-Path $runtimePath 'admin-token.txt'
if(-not (Test-Path -LiteralPath $secretPath)){
  $newAdminToken=(& $nodeCommand.Source (Join-Path $PSScriptRoot 'server\cli.mjs') admin-token).Trim()
  [System.IO.File]::WriteAllText($secretPath,$newAdminToken,[System.Text.UTF8Encoding]::new($false))
}
$demoEnvironmentKeys=@('ADMIN_TOKEN','NODE_ENV','PAYMENT_MODE','HOST','PORT','PUBLIC_URL','WEBSITE_URL','DATA_DIR','CORS_ORIGINS','DISTRIBUTION')
$previousDemoEnvironment=@{}
foreach($environmentName in $demoEnvironmentKeys){$previousDemoEnvironment[$environmentName]=[Environment]::GetEnvironmentVariable($environmentName,'Process')}
try {
$env:ADMIN_TOKEN=[System.IO.File]::ReadAllText($secretPath).Trim()
$env:NODE_ENV='development'
$env:PAYMENT_MODE='sandbox'
$env:HOST='127.0.0.1'
$env:PORT=[string]$Port
$env:PUBLIC_URL="http://127.0.0.1:$Port"
$env:WEBSITE_URL=$env:PUBLIC_URL
$env:DATA_DIR=$runtimePath
$env:CORS_ORIGINS=''
$env:DISTRIBUTION='play-consumption'
Write-Output "LOCAL DEMO ONLY - no real payments. Website: $env:PUBLIC_URL"
Write-Output "Student: $env:PUBLIC_URL/student/"
Write-Output "Publish bank: $env:PUBLIC_URL/admin.html"
Write-Output "Admin secret is stored locally at: $secretPath (do not share or upload it)."
Write-Output 'Create an account, select a plan, and use the clearly labelled sandbox checkout. Press Ctrl+C to stop.'
& $nodeCommand.Source (Join-Path $PSScriptRoot 'server\server.mjs')
} finally {
  foreach($environmentName in $demoEnvironmentKeys){[Environment]::SetEnvironmentVariable($environmentName,$previousDemoEnvironment[$environmentName],'Process')}
}
