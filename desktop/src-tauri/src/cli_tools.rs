use std::fs::File;
use std::io::{self};
use std::path::{Path};

use walkdir::WalkDir;
use zip::write::FileOptions;

pub fn zip_folder(src: &str, dest_dir: &str, name: &str) -> Result<String, String> {
    let src_path = Path::new(src);
    if !src_path.exists() {
        return Err(format!("source path does not exist: {}", src));
    }

    let dest_path = Path::new(dest_dir);
    if !dest_path.exists() {
        std::fs::create_dir_all(dest_path).map_err(|e| e.to_string())?;
    }

    let zip_path = dest_path.join(format!("{}", name));
    let zip_file = File::create(&zip_path).map_err(|e| e.to_string())?;
    let mut zip = zip::ZipWriter::new(zip_file);

    let options = FileOptions::default().compression_method(zip::CompressionMethod::Stored);

    for entry in WalkDir::new(src_path) {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let name_in_zip = path.strip_prefix(src_path).map_err(|e| e.to_string())?;

        if path.is_file() {
            zip.start_file(name_in_zip.to_string_lossy(), options)
                .map_err(|e| e.to_string())?;
            let mut f = File::open(path).map_err(|e| e.to_string())?;
            io::copy(&mut f, &mut zip).map_err(|e| e.to_string())?;
        } else if name_in_zip.as_os_str().len() != 0 {
            // directory
            zip.add_directory(name_in_zip.to_string_lossy(), options)
                .map_err(|e| e.to_string())?;
        }
    }

    zip.finish().map_err(|e| e.to_string())?;

    Ok(zip_path.to_string_lossy().to_string())
}
