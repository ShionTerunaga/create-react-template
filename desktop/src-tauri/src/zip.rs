use std::fs::File;
use std::io::{self};
use std::path::{Path,PathBuf};

use walkdir::WalkDir;
use zip::write::FileOptions;

pub enum TemplateFileType {
    WINCLI,
    MACCLI,
    APP,
    PAGES,
    TANSTACK
}


fn zip_download(
    template_type: TemplateFileType,
    dest_dir: &str,
) -> Result<String, String> {
    let manifest_dir = env!("CARGO_MANIFEST_DIR");
    let template_dir_base = Path::new(manifest_dir).join("..").join("export");

    let template_path = match template_type {
        TemplateFileType::MACCLI => template_dir_base.join("execution").join("mac"),
        TemplateFileType::WINCLI => template_dir_base.join("execution").join("win"),
        TemplateFileType::APP => template_dir_base.join("template").join("next"),
        TemplateFileType::PAGES => template_dir_base.join("template").join("pages"),
        TemplateFileType::TANSTACK => template_dir_base.join("template").join("tanstack-router"),
    };

    if !template_path.exists() {
        return Err(format!(
            "template path not found: {}",
            template_path.display()
        ));
    }

    let dest = PathBuf::from(dest_dir);

    let file = File::create(&dest).map_err(|e| format!("failed to create zip file: {}", e))?;
    let mut zip = zip::ZipWriter::new(file);
    let options = FileOptions::default().compression_method(zip::CompressionMethod::Deflated);


    let walk_iter = WalkDir::new(&template_path).into_iter();

    for entry in walk_iter.filter_map(|e| e.ok()) {
        let path = entry.path();
        let name = path.strip_prefix(&template_path).unwrap();

        if path.is_file() {
            zip.start_file(name.to_string_lossy(), options)
                .map_err(|e| format!("failed to add file to zip: {}", e))?;
            let mut f = File::open(path).map_err(|e| format!("failed to open file: {}", e))?;
            io::copy(&mut f, &mut zip)
                .map_err(|e| format!("failed to write file to zip: {}", e))?;
        } else if !name.as_os_str().is_empty() {
            zip.add_directory(name.to_string_lossy(), options)
                .map_err(|e| format!("failed to add directory to zip: {}", e))?;
        }
    }

    zip.finish()
        .map_err(|e| format!("failed to finalize zip file: {}", e))?;
    Ok(dest.to_string_lossy().to_string())
}


#[tauri::command]
pub fn zip_template(src: &str, dest_dir: &str) -> Result<String, String> {
    let template_type = match src {
        "win_cli" => TemplateFileType::WINCLI,
        "mac_cli" => TemplateFileType::MACCLI,
        "next/app" => TemplateFileType::APP,
        "next/pages" => TemplateFileType::PAGES,
        "tanstack-router" => TemplateFileType::TANSTACK,
        _ => return Err("unsupported template type".to_string()),
    };

    let result = zip_download(template_type, &format!("{}", dest_dir));

    if result.is_ok() {
        Ok(format!("{}", dest_dir))
    } else {
        Err(result.err().unwrap_or("unknown error".to_string()))
    }
}


