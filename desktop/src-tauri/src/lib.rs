mod download_template;
use download_template::zip_template;
mod download_cli;
use download_cli::download_cli;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![download_cli, zip_template])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
