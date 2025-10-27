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

6. pass through

```
#.zprofile
export PATH="$PATH:/Users/<username>/tools/"
```

or

```
# .bash_profile
export PATH="$PATH:/Users/<username>/tools/create-react-template/execution/mac"
```

### windows

coming soon...

## usage

### create template

```bash
create-react-tmp
```

### new update

```bash
upgrade-tmp
```
