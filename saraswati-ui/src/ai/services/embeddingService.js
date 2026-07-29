import { delay } from "../state/requestState";

export async function generateEmbedding(_text) {
  await delay(50);

  const dimensions = 384;
  const vector = Array.from({ length: dimensions }, () => (Math.random() - 0.5) * 2);

  return {
    status: "mock",
    message: "Real embeddings require an embedding model backend.",
    vector,
    dimensions,
    model: "mock-384",
  };
}

export async function computeSimilarity(vectorA, vectorB) {
  await delay(10);

  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    return { similarity: 0, status: "error", message: "Invalid vectors." };
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  const similarity = denom > 0 ? dotProduct / denom : 0;

  return {
    similarity: parseFloat(similarity.toFixed(4)),
    status: "mock",
    message: "Computed cosine similarity on mock vectors.",
  };
}
