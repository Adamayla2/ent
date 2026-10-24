param(
    [switch]$PreflightOnly,
    [switch]$Install,
    [switch]$BuildDebug,
    [switch]$AcceptAndroidLicenses
)
# All tools/caches stay under this project's .toolchain directory. No global installation.
# No arguments => print a plan without network access or filesystem changes.
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$runtimeRoot = [IO.Path]::GetFullPath((Join-Path $projectRoot '.toolchain'))
$manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'toolchain-manifest.json') -Raw | ConvertFrom-Json
if ($BuildDebug) { $Install = $true }
function Assert-RuntimePath([string]$Candidate) {
    $absolute = [IO.Path]::GetFullPath($Candidate)
    if (-not $absolute.StartsWith($runtimeRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw "Path escapes the local toolchain directory: $absolute" }
    return $absolute
}
function Get-OfficialText([string]$Url, [int]$MaxBytes = 2000000) {
    if (-not $Url.StartsWith('https://')) { throw 'HTTPS is required for toolchain metadata.' }
    $textLines = & node (Join-Path $PSScriptRoot 'official-fetch.mjs') text $Url $MaxBytes 60000
    if ($LASTEXITCODE -ne 0) { throw "Verified-TLS metadata request failed: $Url" }
    return [string]::Join("`n", $textLines)
}
function Get-VerifiedArchive([string]$Url, [string]$Hash, [string]$Destination, [long]$MaxBytes) {
    $Destination = Assert-RuntimePath $Destination
    if ($Hash -cnotmatch '^[A-Fa-f0-9]{64}$') { throw 'A valid official SHA-256 checksum is required.' }
    if (Test-Path -LiteralPath $Destination) {
        if ((Get-FileHash -LiteralPath $Destination -Algorithm SHA256).Hash -ine $Hash) { throw "Cached archive checksum differs; inspect/remove this exact file before retrying: $Destination" }
        return
    }
    & node (Join-Path $PSScriptRoot 'official-fetch.mjs') download $Url $Destination $Hash $MaxBytes 720000
    if ($LASTEXITCODE -ne 0) { throw "Verified-TLS archive request failed: $Url" }
}

Write-Output "Local Android build plan: $runtimeRoot"
Write-Output "JDK $($manifest.jdk.version), Gradle $($manifest.gradle.version), Android SDK 36 / Build Tools 36.0.0"
Write-Output "Estimated download: $($manifest.estimatedDownloadGiB) GiB; require $($manifest.minimumFreeDiskGiB) GiB free. No emulator/NDK."
Write-Output "JDK: $($manifest.jdk.url)"
Write-Output "JDK checksum fetched from its official version-specific sidecar: $($manifest.jdk.sha256Url)"
Write-Output "Gradle: $($manifest.gradle.url) SHA256 $($manifest.gradle.sha256)"
Write-Output "Android tools: $($manifest.commandLineTools.url) SHA256 $($manifest.commandLineTools.sha256)"
if (-not $PreflightOnly -and -not $Install) { Write-Output 'Plan only. Use -PreflightOnly for metadata checks, or -Install/-BuildDebug -AcceptAndroidLicenses after network access is authorized.'; return }
if ($Install -and -not $AcceptAndroidLicenses) { throw 'Installation requires explicit -AcceptAndroidLicenses after reviewing https://developer.android.com/studio/terms.html. No downloads were started.' }
if ($BuildDebug -and -not (Test-Path -LiteralPath (Join-Path $projectRoot 'public-config.json'))) { throw 'Run prepare-config.ps1 with the deployed HTTPS origin and public JWK before building. No archives were downloaded.' }

Write-Output 'Checking official artifact availability before downloading archives…'
$agp = Get-OfficialText $manifest.agpPom
if ($agp -notmatch '<version>9\.4\.0</version>') { throw 'Official AGP 9.4.0 POM unavailable or unexpected. Do not silently substitute versions.' }
$webkit = Get-OfficialText $manifest.webKitPom
if ($webkit -notmatch '<version>1\.18\.0</version>') { throw 'Official WebKit 1.18.0 POM unavailable or unexpected.' }
$sdkMetadata = Get-OfficialText $manifest.sdkRepository 12000000
if (-not $sdkMetadata.Contains('platforms;android-36') -or -not $sdkMetadata.Contains('build-tools;36.0.0')) { throw 'Required stable Android SDK packages were not found in official repository metadata.' }
$jdkChecksumText = Get-OfficialText $manifest.jdk.sha256Url 4096
$jdkHashMatch = [regex]::Match($jdkChecksumText, '(?i)\b[a-f0-9]{64}\b')
if (-not $jdkHashMatch.Success) { throw 'The official JDK checksum sidecar did not contain a valid SHA-256 value.' }
$jdkHash = $jdkHashMatch.Value.ToLowerInvariant()
Write-Output "Official JDK SHA256: $jdkHash"
Write-Output 'Official metadata preflight passed. This confirms metadata availability, not a completed Android build.'
if ($PreflightOnly -and -not $Install) { return }

if ($env:OS -ne 'Windows_NT' -or $env:PROCESSOR_ARCHITECTURE -notin @('AMD64', 'ARM64')) { throw 'This bootstrap targets Windows; x64 tools require Windows x64 or compatible ARM64 emulation.' }
$drive = [IO.DriveInfo]::new([IO.Path]::GetPathRoot($projectRoot))
if ($drive.AvailableFreeSpace -lt ([long]$manifest.minimumFreeDiskGiB * 1GB)) { throw 'Not enough free disk space for the bounded local toolchain.' }
New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
$downloads = Assert-RuntimePath (Join-Path $runtimeRoot 'downloads')
New-Item -ItemType Directory -Path $downloads -Force | Out-Null
$jdkZip = Join-Path $downloads 'jdk.zip'; $gradleZip = Join-Path $downloads 'gradle.zip'; $toolsZip = Join-Path $downloads 'commandline-tools.zip'
Get-VerifiedArchive $manifest.jdk.url $jdkHash $jdkZip $manifest.jdk.maxBytes
Get-VerifiedArchive $manifest.gradle.url $manifest.gradle.sha256 $gradleZip $manifest.gradle.maxBytes
Get-VerifiedArchive $manifest.commandLineTools.url $manifest.commandLineTools.sha256 $toolsZip $manifest.commandLineTools.maxBytes

$jdkExtract = Assert-RuntimePath (Join-Path $runtimeRoot 'jdk')
$gradleExtract = Assert-RuntimePath (Join-Path $runtimeRoot 'gradle')
$toolsExtract = Assert-RuntimePath (Join-Path $runtimeRoot 'commandline-tools')
Expand-Archive -LiteralPath $jdkZip -DestinationPath $jdkExtract -Force
Expand-Archive -LiteralPath $gradleZip -DestinationPath $gradleExtract -Force
Expand-Archive -LiteralPath $toolsZip -DestinationPath $toolsExtract -Force
$jdkFolder = Get-ChildItem -LiteralPath $jdkExtract -Directory | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'bin/java.exe') } | Select-Object -First 1
if (-not $jdkFolder) { throw 'The verified JDK archive did not contain the expected runtime.' }
$sdkRoot = Assert-RuntimePath (Join-Path $runtimeRoot 'android-sdk')
$cliTarget = Assert-RuntimePath (Join-Path $sdkRoot 'cmdline-tools/latest')
New-Item -ItemType Directory -Path $cliTarget -Force | Out-Null
Get-ChildItem -LiteralPath (Join-Path $toolsExtract 'cmdline-tools') | Copy-Item -Destination $cliTarget -Recurse -Force
$sdkManager = Join-Path $cliTarget 'bin/sdkmanager.bat'
$gradle = Join-Path $gradleExtract "gradle-$($manifest.gradle.version)/bin/gradle.bat"
if (-not (Test-Path -LiteralPath $sdkManager) -or -not (Test-Path -LiteralPath $gradle)) { throw 'Verified archives did not expose expected build commands.' }
$priorJavaHome = $env:JAVA_HOME; $priorAndroidHome = $env:ANDROID_HOME; $priorAndroidUserHome = $env:ANDROID_USER_HOME; $priorGradleUserHome = $env:GRADLE_USER_HOME; $priorPath = $env:PATH
try {
    $env:JAVA_HOME = $jdkFolder.FullName
    $env:ANDROID_HOME = $sdkRoot
    $env:ANDROID_USER_HOME = Assert-RuntimePath (Join-Path $runtimeRoot 'android-user-home')
    $env:GRADLE_USER_HOME = Assert-RuntimePath (Join-Path $runtimeRoot 'gradle-home')
    $localJavaUserHome = Assert-RuntimePath (Join-Path $runtimeRoot 'java-user-home')
    New-Item -ItemType Directory -Path $env:ANDROID_USER_HOME, $env:GRADLE_USER_HOME, $localJavaUserHome -Force | Out-Null
    $env:PATH = (Join-Path $env:JAVA_HOME 'bin') + [IO.Path]::PathSeparator + $priorPath
    & (Join-Path $env:JAVA_HOME 'bin/java.exe') -version
    # The caller explicitly accepted the SDK license switch. No global SDK paths are touched.
    # Accept only license prompts for the requested stable build packages,
    # rather than all optional/evaluation SDK packages in the repository.
    (1..30 | ForEach-Object { 'y' }) | & $sdkManager "--sdk_root=$sdkRoot" @($manifest.sdkPackages)
    if ($LASTEXITCODE -ne 0) { throw 'SDK package installation failed.' }
    "sdk.dir=$($sdkRoot.Replace('\', '/'))" | Set-Content -LiteralPath (Join-Path $projectRoot 'local.properties') -Encoding utf8
    Write-Output 'Local toolchain installed. No global PATH, registry, or permanent environment settings changed.'
    if ($BuildDebug) {
        Push-Location -LiteralPath $projectRoot
        try {
            & $gradle --no-daemon --max-workers=2 --console=plain "-Duser.home=$localJavaUserHome" :app:assembleDebug
            if ($LASTEXITCODE -ne 0) { throw 'Android debug build failed. No APK success is claimed.' }
            $apk = Join-Path $projectRoot 'app/build/outputs/apk/debug/app-debug.apk'
            if (-not (Test-Path -LiteralPath $apk)) { throw 'Gradle returned without the expected debug APK.' }
            Write-Output "DEBUG APK (test installation only; not a signed Play release): $apk"
            Get-FileHash -LiteralPath $apk -Algorithm SHA256
        } finally { Pop-Location }
    }
} finally {
    $env:JAVA_HOME = $priorJavaHome; $env:ANDROID_HOME = $priorAndroidHome; $env:ANDROID_USER_HOME = $priorAndroidUserHome; $env:GRADLE_USER_HOME = $priorGradleUserHome; $env:PATH = $priorPath
}
