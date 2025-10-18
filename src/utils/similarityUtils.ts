import { distance as levenshteinDistance } from "fastest-levenshtein";

export const similarityUtils = {
    similarity(a: string, b: string) {
        const na = normalize(a);
        const nb = normalize(b);
        if (!(na && nb)) return 0;
        const maxLen = Math.max(na.length, nb.length);
        if (maxLen === 0) return 1;
        const dist = levenshteinDistance(na, nb);
        return 1 - dist / maxLen;
    },
};

// Normalization and optimized Levenshtein-based similarity using fastest-levenshtein
const normalize = (s: string) =>
    s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
