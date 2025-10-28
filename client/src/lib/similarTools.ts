import type { Tool } from "@shared/schema";

interface ScoredTool extends Tool {
  similarityScore: number;
}

/**
 * Calculate similarity score between two tools
 * Higher score = more similar
 */
function calculateSimilarity(currentTool: Tool, candidateTool: Tool): number {
  let score = 0;

  // Primary category match (highest weight - 40 points)
  if (currentTool.primary_category === candidateTool.primary_category) {
    score += 40;
  }

  // Secondary category match (medium weight - 25 points)
  if (
    currentTool.secondary_category &&
    candidateTool.secondary_category &&
    currentTool.secondary_category === candidateTool.secondary_category
  ) {
    score += 25;
  }

  // Pricing similarity (15 points)
  if (currentTool.pricing === candidateTool.pricing) {
    score += 15;
  }

  // Platform type match (10 points)
  if (currentTool.platform_type === candidateTool.platform_type) {
    score += 10;
  }

  // Description keyword overlap (up to 20 points)
  const currentKeywords = extractKeywords(
    currentTool.description + " " + currentTool.short_description
  );
  const candidateKeywords = extractKeywords(
    candidateTool.description + " " + candidateTool.short_description
  );

  const commonKeywords = currentKeywords.filter((keyword) =>
    candidateKeywords.includes(keyword)
  );
  
  // Award points based on keyword overlap (max 20 points)
  const keywordScore = Math.min(20, commonKeywords.length * 2);
  score += keywordScore;

  return score;
}

/**
 * Extract meaningful keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "up", "about", "into", "through", "during",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "should", "could", "may", "might",
    "can", "this", "that", "these", "those", "your", "you", "our", "their",
    "it", "its", "as", "use", "using", "used", "help", "helps", "make", "makes",
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 50); // Limit to first 50 keywords for performance
}

/**
 * Find similar tools using multi-factor similarity scoring
 */
export function findSimilarTools(
  currentTool: Tool,
  allTools: Tool[],
  limit: number = 6
): Tool[] {
  // Score all tools except the current one
  const scoredTools: ScoredTool[] = allTools
    .filter((tool) => tool.id !== currentTool.id)
    .map((tool) => ({
      ...tool,
      similarityScore: calculateSimilarity(currentTool, tool),
    }));

  // Sort by similarity score (descending) and return top N
  return scoredTools
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .map(({ similarityScore, ...tool }) => tool);
}
