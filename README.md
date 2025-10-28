# Create React Project

This is template of react projects. For now, it will be for macos only.We will
not put this repository on npm for now.

## setup

### mac os

1. Go to root directory.

```bash
cd ~
```

2. Check your location

```bash
pwd
```

It should be as follows

```
Users/<yourname>
```

3. Make `tools` directory

```bash
mkdir tools
```

4. Go to `tools` directory

```bash
cd tools
```

5. Get template files

```bash
curl -L "https://github.com/ShionTerunaga/create-react-template/archive/refs/heads/release.zip" -o repo.zip
```

6. Unzip

```bash
unzip repo.zip "*/execution/mac/*" -d .
```

7. Move files

```bash
 mv /Users/<username>/tools/create-react-template-release/execution/mac/* /Users/<username>/tools/
```

8. Remove files

```bash
rm repo.zip
rm -rf create-react-template-release
```

9. Authorization

```bash
chmod 755 ~/tools/*
```

10. pass through

```
#.zprofile
export PATH="$PATH:/Users/<username>/tools/"
```

or

```
# .bash_profile
export PATH="$PATH:/Users/<username>/tools/"
```

### windows os

1. Go to root directory.

```bash
cd ~
```

2. Check your location

```bash
pwd
```

It should be as follows

```
C:\Users\<yourname>
```

3. Make `tools` directory

```bash
mkdir tools
```

4. Go to `tools` directory

```bash
cd tools
```

5. Get template files

```bash
Invoke-WebRequest -Uri "https://github.com/ShionTerunaga/create-react-template/archive/refs/heads/release.zip" -OutFile "repo.zip"
```

6. Unzip

```bash
Expand-Archive -Path "repo.zip" -DestinationPath ".\extract" -Force
$root = Get-ChildItem -Directory .\extract | Where-Object { Test-Path (Join-Path $_.FullName "execution\win") } | Select-Object -First 1
Move-Item -Path (Join-Path $root.FullName "execution\win\*") -Destination "$env:USERPROFILE\tools" -Force
```

7. Remove "repo.zip"

```bash
Remove-Item "repo.zip" -Force
```

8. Remove extract

```bash
rm extract -Recurse -Force
```

9. set Environment Variable

```bash
[Environment]::SetEnvironmentVariable(
  "Path",
  $env:Path + ";C:\Users\<yourname>\tools",
  "User"
)
```

## usage

### create template

```bash
create-react-tmp
```

### new update

```bash
upgrade-tmp && chmod 755 ~/tools/*
```
