use std::env;
use std::error::Error;
use std::fs;
use std::io::{self};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Copy)]
pub enum Platform {
    Win,
    Mac,
    Error,
}

fn download_and_install(platform: Platform) -> Result<(), Box<dyn Error>> {
    let home = env::var("HOME").map(PathBuf::from).map_err(|_| "$HOME not set")?;
    let tools_dir = home.join("tools");
    fs::create_dir_all(&tools_dir)?;

    let src_dir = match platform {
        Platform::Mac => Path::new("../export/execution/mac").to_path_buf(),
        Platform::Win => Path::new("../export/execution/win").to_path_buf(),
        Platform::Error => return Err("unsupported platform".into()),
    };

    if let Platform::Error = platform {
        return Err("unsupported platform".into());
    }

    if !src_dir.exists() {
        return Err(format!("source directory does not exist: {}", src_dir.display()).into());
    }

    // make a temp working dir
    let mut tmp = env::temp_dir();
    let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs();
    tmp.push(format!("download_cli_{}", now));
    fs::create_dir_all(&tmp)?;

    let zip_path = tmp.join("download.zip");

    // create zip of the contents of src_dir
    // we use system `zip -r` for simplicity (available on macOS). Zip target must be absolute or relative path.
    let zip_status = Command::new("zip")
        .arg("-r")
        .arg(zip_path.to_str().ok_or("invalid zip path")?)
        .arg(".")
        .current_dir(&src_dir)
        .status();

    match zip_status {
        Ok(s) if s.success() => (),
        Ok(s) => return Err(format!("zip failed with status: {}", s).into()),
        Err(e) => return Err(format!("failed to run zip: {} (is zip installed?)", e).into()),
    }

    // copy the zip into ~/tools
    let tools_zip = tools_dir.join("download.zip");
    fs::copy(&zip_path, &tools_zip)?;

    // extract zip into a temporary extraction dir
    let extract_dir = tmp.join("extracted");
    fs::create_dir_all(&extract_dir)?;

    let unzip_status = Command::new("unzip")
        .arg(tools_zip.to_str().ok_or("invalid tools_zip path")?)
        .arg("-d")
        .arg(extract_dir.to_str().ok_or("invalid extract path")?)
        .status();

    match unzip_status {
        Ok(s) if s.success() => (),
        Ok(s) => return Err(format!("unzip failed with status: {}", s).into()),
        Err(e) => return Err(format!("failed to run unzip: {} (is unzip installed?)", e).into()),
    }

    // Move contents from extract_dir into tools_dir
    for entry in fs::read_dir(&extract_dir)? {
        let entry = entry?;
        let from = entry.path();
        let file_name = entry.file_name();
        let to = tools_dir.join(file_name);

        if let Err(e) = fs::rename(&from, &to) {
            // fallback to copy + remove if rename fails (e.g., cross-filesystem)
            copy_recursively(&from, &to)?;
            if from.is_file() {
                fs::remove_file(&from)?;
            } else {
                fs::remove_dir_all(&from)?;
            }
        }
    }

    // remove the zip in tools
    let _ = fs::remove_file(&tools_zip);

    // remove extraction and temp dirs
    let _ = fs::remove_dir_all(&extract_dir);
    let _ = fs::remove_dir_all(&tmp);

    // If mac, set execute permission 755 for everything directly under ~/tools
    if let Platform::Mac = platform {
        set_mode_every_entry(&tools_dir, 0o755)?;
    }

    Ok(())
}

fn copy_recursively(src: &Path, dst: &Path) -> io::Result<()> {
    if src.is_file() {
        if let Some(parent) = dst.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::copy(src, dst)?;
        return Ok(());
    }

    // directory
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let from = entry.path();
        let to = dst.join(entry.file_name());
        if from.is_dir() {
            copy_recursively(&from, &to)?;
        } else {
            fs::copy(&from, &to)?;
        }
    }
    Ok(())
}

#[tauri::command]
pub fn download_cli(platform: &str) -> Result<(), String> {
    let main_platform = match platform{
        "win" => Platform::Win,
        "mac" => Platform::Mac,
        _ => Platform::Error,
    };

    if let Platform::Error = main_platform {
        return Err(format!("failed to parse platform: {}", platform).into());
    }

    if let Err(e) = download_and_install(main_platform) {
        return Err(format!("failed to download and install CLI: {}", e).into());
    }
    Ok(())
}


#[cfg(unix)]
fn set_mode_every_entry(dir: &Path, mode: u32) -> Result<(), Box<dyn Error>> {
    use std::os::unix::fs::PermissionsExt;

    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        let mut perms = fs::metadata(&path)?.permissions();
        perms.set_mode(mode);
        fs::set_permissions(&path, perms)?;
    }
    Ok(())
}


