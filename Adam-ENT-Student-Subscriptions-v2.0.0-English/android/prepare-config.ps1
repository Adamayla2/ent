param(
    [Parameter(Mandatory = $true)][string]$ApiOrigin,
    [Parameter(Mandatory = $true)][string]$PublicKeyPath,
    [string]$WebsiteOrigin = '',
    [ValidateSet('disabled', 'sandbox')][string]$PaymentMode = 'disabled'
)
$ErrorActionPreference = 'Stop'
$apiUri = [Uri]$ApiOrigin
if ($apiUri.Scheme -ne 'https' -or -not $apiUri.Host -or $apiUri.UserInfo -or $apiUri.Query -or $apiUri.Fragment -or ($apiUri.AbsolutePath -ne '/')) { throw 'ApiOrigin must be an HTTPS origin, for example https://api.your-domain.com' }
if ($WebsiteOrigin) {
    $websiteUri = [Uri]$WebsiteOrigin
    if ($websiteUri.Scheme -ne 'https' -or -not $websiteUri.Host -or $websiteUri.UserInfo -or $websiteUri.Query -or $websiteUri.Fragment -or ($websiteUri.AbsolutePath -ne '/')) { throw 'WebsiteOrigin must be an HTTPS origin.' }
}
# This file must contain only a PUBLIC JWK or the public /api/config response.
$publicInput = Get-Content -LiteralPath $PublicKeyPath -Raw | ConvertFrom-Json
$publicJwk = if ($publicInput.publicKey) { $publicInput.publicKey } else { $publicInput }
if ($publicJwk.d -or $publicJwk.kty -ne 'EC' -or $publicJwk.crv -ne 'P-256' -or $publicJwk.x -cnotmatch '^[A-Za-z0-9_-]{43}$' -or $publicJwk.y -cnotmatch '^[A-Za-z0-9_-]{43}$') { throw 'Supply a valid public P-256 JWK (kty/crv/x/y), never a private key.' }
$cleanPublicKey = [ordered]@{ kty = 'EC'; crv = 'P-256'; x = $publicJwk.x; y = $publicJwk.y; ext = $true; key_ops = @('verify') }
$publicConfig = [ordered]@{ apiBaseUrl = $ApiOrigin.TrimEnd('/'); websiteUrl = $WebsiteOrigin.TrimEnd('/'); publicKey = $cleanPublicKey; paymentMode = $PaymentMode; distribution = 'play-consumption' }
$publicConfig | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'public-config.json') -Encoding utf8
Write-Output 'Prepared public-config.json. It contains public configuration only; build will bundle it with the student assets.'
