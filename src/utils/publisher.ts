/** Display publisher; winget search often omits it — infer from package id prefix. */
export function displayPublisher(pkg: { id: string; publisher?: string }): string {
  const publisher = pkg.publisher?.trim();
  if (publisher) return publisher;
  const segment = pkg.id.split(".")[0]?.trim();
  return segment || pkg.id;
}
