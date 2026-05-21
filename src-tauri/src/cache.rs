use crate::database::Database;
use std::path::PathBuf;

pub fn icon_cache_dir(app_data_dir: &PathBuf) -> PathBuf {
    app_data_dir.join("icons")
}

pub fn clearbit_url(domain: &str) -> String {
    format!("https://logo.clearbit.com/{domain}")
}

pub fn favicon_url(domain: &str) -> String {
    format!("https://www.google.com/s2/favicons?domain={domain}&sz=128")
}

pub fn domain_from_url(url: &str) -> Option<String> {
    let trimmed = url.trim();
    let without_scheme = trimmed
        .strip_prefix("https://")
        .or_else(|| trimmed.strip_prefix("http://"))
        .unwrap_or(trimmed);
    without_scheme.split('/').next().map(|s| s.to_string())
}

pub async fn fetch_and_cache_icon(
    db: &Database,
    cache_dir: &PathBuf,
    package_id: &str,
    website: Option<&str>,
) -> Result<Option<String>, String> {
    if let Some(existing) = db.get_icon_path(package_id)? {
        if std::path::Path::new(&existing).exists() {
            return Ok(Some(existing));
        }
    }

    let domain = website.and_then(domain_from_url);
    let urls: Vec<String> = if let Some(ref d) = domain {
        vec![clearbit_url(d), favicon_url(d)]
    } else {
        return Ok(None);
    };

    std::fs::create_dir_all(cache_dir).map_err(|e| e.to_string())?;
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| e.to_string())?;

    for url in urls {
        if let Ok(response) = client.get(&url).send().await {
            if response.status().is_success() {
                if let Ok(bytes) = response.bytes().await {
                    let ext = if url.contains("favicon") {
                        "png"
                    } else {
                        "png"
                    };
                    let safe_id: String = package_id
                        .chars()
                        .map(|c| if c.is_alphanumeric() { c } else { '_' })
                        .collect();
                    let path = cache_dir.join(format!("{safe_id}.{ext}"));
                    if std::fs::write(&path, &bytes).is_ok() {
                        let path_str = path.to_string_lossy().to_string();
                        db.save_icon(package_id, &path_str, Some(&url))?;
                        return Ok(Some(path_str));
                    }
                }
            }
        }
    }
    Ok(None)
}

pub fn clear_icon_cache(cache_dir: &PathBuf) -> Result<(), String> {
    if cache_dir.exists() {
        std::fs::remove_dir_all(cache_dir).map_err(|e| e.to_string())?;
    }
    std::fs::create_dir_all(cache_dir).map_err(|e| e.to_string())?;
    Ok(())
}
