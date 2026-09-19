# Builds the Nodes Editor frontend and packages the plugin as dist/parametric_modeling.rbz

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

npm run build --prefix 'source/parametric_modeling/Nodes Editor'
if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }

New-Item dist -ItemType Directory -Force | Out-Null
Remove-Item dist/parametric_modeling.rbz -ErrorAction Ignore

# Zip source/ (minus the frontend project). Entry names use "/" as the zip format requires;
# Windows tools sometimes write "\", which breaks extraction on macOS.

Add-Type -AssemblyName System.IO.Compression.FileSystem

$source = (Resolve-Path source).Path
$zip = [IO.Compression.ZipFile]::Open("$PSScriptRoot/dist/parametric_modeling.rbz", 'Create')

foreach ($file in Get-ChildItem source -Recurse -File | Where-Object FullName -NotMatch 'Nodes Editor') {
    $name = $file.FullName.Substring($source.Length + 1).Replace('\', '/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $name) | Out-Null
}
$zip.Dispose()

Write-Host 'Wrote dist/parametric_modeling.rbz'
