/// Winget package identifiers are passed as a single argv token (not via a shell).
/// They can include backslashes (`MSIX\...`), spaces, plus signs, etc.—matching what
/// `winget list` returns. Reject only empty IDs, excessive length, and line breaks/NUL.
pub fn validate_package_id(id: &str) -> Result<(), String> {
    let trimmed = id.trim();
    const MAX_ID_LEN: usize = 512;
    if trimmed.is_empty() || trimmed.len() > MAX_ID_LEN {
        return Err("Invalid package id".into());
    }
    if trimmed
        .chars()
        .any(|c| matches!(c, '\0' | '\r' | '\n'))
    {
        return Err("Package id contains invalid characters".into());
    }
    Ok(())
}

pub fn sanitize_search_query(query: &str) -> String {
    query
        .chars()
        .filter(|c| c.is_alphanumeric() || c.is_whitespace() || *c == '.' || *c == '-' || *c == '_')
        .take(200)
        .collect()
}
