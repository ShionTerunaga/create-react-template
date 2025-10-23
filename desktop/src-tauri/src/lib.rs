// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod example;
use example::greet;
mod cli_tools;
use cli_tools::zip_folder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, zip_export])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn zip_export(platform: &str, dest_dir: &str) -> Result<String, String> {
    // determine source path based on platform
    let root = std::env::current_dir().map_err(|e| e.to_string())?;
    let repo_root = root
        .parent()
        .and_then(|p| p.parent())
        .unwrap_or(&root)
        .to_path_buf();

    let src_rel = match platform {
        "mac" => "../export/execution/mac",
        "win" => "../export/execution/win",
        _ => return Err("unsupported platform".to_string()),
    };

    let src_path = repo_root.join(src_rel);
    if !src_path.exists() {
        return Err(format!("source path not found: {}", src_path.display()));
    }

    // create a filename using unix timestamp
    let ts = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let filename = format!("template-{}-{}.zip", platform, ts);

    zip_folder(
        &src_path.to_string_lossy(),
        dest_dir,
        &filename,
    )
}
