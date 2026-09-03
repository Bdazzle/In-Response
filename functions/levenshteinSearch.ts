/**
 * Used to match search options in cached cards. May allow extending size of cache storage (if I decide to cache more).
 * And could be used if I create my own suggestion table.
 * @param a 
 * @param b 
 * @returns 
 */

const levenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(b.length + 1).fill(null).map(
        () => Array(a.length + 1).fill(null)
    );

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + cost
            );
        }
    }

    return matrix[b.length][a.length]
}

/*
Convert to similarity score (0-1)
similarity scores are a ratio of distance of edits 
ex: 
*/
const similarityScore = (a: string, b: string): number => {
    const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

function smartMatch(input: string, candidate: string): number {
    const cleanInput = input.toLowerCase();
    const cleanCandidate = candidate.toLowerCase();

    // Exact prefix match bonus
    if (cleanCandidate.startsWith(cleanInput)) {
        return 0.95; // Very high score for prefixes
    }

    // Contains as substring
    if (cleanCandidate.includes(cleanInput)) {
        return 0.8;
    }

    // Levenshtein similarity score for fuzzy matching
    const distance = levenshteinDistance(cleanInput, cleanCandidate);
    const maxLen = Math.max(cleanInput.length, cleanCandidate.length);
    const baseScore = 1 - distance / maxLen;

    // Boost scores for reasonable matches
    return baseScore * 1.2 > 1 ? 0.95 : baseScore * 1.2;
}

const findMatches = (candidates: string[], input: string) => {
    // Use with threshold of 0.6
    // const results = candidates
    //     .map(text => ({
    //         text,
    //         score: smartMatch(input, text)
    //     }))
    //     .filter(r => r.score >= 0.6)
    //     .sort((a, b) => b.score - a.score);
    const results = candidates.filter(text => smartMatch(input, text) > 0.6).sort((a,b) => smartMatch(input, b) - smartMatch(input, a) )

    return results
}



export default findMatches

// Find closest matches
// function findClosestMatches(input: string, candidates: string[], limit = 3) {
//     return candidates.map(candidate => ({
//         text: candidate,
//         score: similarityScore(input, candidate)
//     })).sort((a,b) => b.score - a.score).slice(0,limit);
// }

// export default findClosestMatches