/**
 * Converts any text into a clean URL-safe slug.
 * Examples:
 *   "Architecte IA & Domotique" → "architecte-ia-domotique"
 *   "Jour 1 : Pipeline RAG" → "jour-1-pipeline-rag"
 *   "Réseau Neuronal (GAN)" → "reseau-neuronal-gan"
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")                             // Decompose accents: é → e + ́
        .replace(/[\u0300-\u036f]/g, "")              // Remove accent marks
        .replace(/[^a-z0-9\s-]/g, "")                // Remove special chars
        .trim()
        .replace(/\s+/g, "-")                         // Spaces → hyphens
        .replace(/-+/g, "-")                          // Collapse multiple hyphens
        .substring(0, 80);                            // Max 80 chars
}
