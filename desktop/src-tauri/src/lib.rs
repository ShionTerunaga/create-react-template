mod example;
use example::greet;
mod zip;
use zip::zip_template;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, zip_template])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
