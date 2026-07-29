import { generateCitationsForContext, formatCitationsForDisplay } from "./citationService";
import { buildMindMapPrompt } from "../prompts/promptBuilder";
import { delay } from "../state/requestState";

export function createMindMapNode(id, label, children) {
  return { id, label, children: children ?? [] };
}

function buildMockMindMap(context) {
  const subjectId = context.subjectId ?? "general";

  const trees = {
    dbms: createMindMapNode("root", "DBMS", [
      createMindMapNode("n1", "ER Diagrams", [
        createMindMapNode("n1a", "Entities"),
        createMindMapNode("n1b", "Relationships"),
        createMindMapNode("n1c", "Cardinality"),
      ]),
      createMindMapNode("n2", "Normalization", [
        createMindMapNode("n2a", "1NF"),
        createMindMapNode("n2b", "2NF"),
        createMindMapNode("n2c", "3NF / BCNF"),
      ]),
      createMindMapNode("n3", "SQL", [
        createMindMapNode("n3a", "Joins"),
        createMindMapNode("n3b", "Subqueries"),
      ]),
      createMindMapNode("n4", "Transactions", [
        createMindMapNode("n4a", "ACID"),
        createMindMapNode("n4b", "Concurrency"),
      ]),
    ]),
    "computer-networks": createMindMapNode("root", "Computer Networks", [
      createMindMapNode("n1", "OSI Model", [
        createMindMapNode("n1a", "Physical"),
        createMindMapNode("n1b", "Data Link"),
        createMindMapNode("n1c", "Network"),
        createMindMapNode("n1d", "Transport"),
        createMindMapNode("n1e", "Application"),
      ]),
      createMindMapNode("n2", "Protocols", [
        createMindMapNode("n2a", "TCP/IP"),
        createMindMapNode("n2b", "UDP"),
      ]),
      createMindMapNode("n3", "Security", [
        createMindMapNode("n3a", "Encryption"),
        createMindMapNode("n3b", "Firewalls"),
      ]),
    ]),
    "machine-learning": createMindMapNode("root", "Machine Learning", [
      createMindMapNode("n1", "Supervised", [
        createMindMapNode("n1a", "Linear Regression"),
        createMindMapNode("n1b", "Classification"),
      ]),
      createMindMapNode("n2", "Unsupervised", [
        createMindMapNode("n2a", "K-Means"),
        createMindMapNode("n2b", "PCA"),
      ]),
      createMindMapNode("n3", "Deep Learning", [
        createMindMapNode("n3a", "Neural Networks"),
        createMindMapNode("n3b", "Backpropagation"),
      ]),
    ]),
  };

  return trees[subjectId] ?? createMindMapNode("root", "Document Topics", [
    createMindMapNode("n1", "Core Concepts"),
    createMindMapNode("n2", "Key Definitions"),
    createMindMapNode("n3", "Applications"),
  ]);
}

export async function generateMindMap(context) {
  await delay(1500 + Math.random() * 500);

  const prompt = buildMindMapPrompt(context);
  const citations = generateCitationsForContext(context, 2);
  const tree = buildMockMindMap(context);

  const lines = [];
  function walk(node, depth) {
    const indent = "  ".repeat(depth);
    const bullet = depth === 0 ? "📌" : "•";
    lines.push(`${indent}${bullet} **${node.label}**`);
    for (const child of node.children) {
      walk(child, depth + 1);
    }
  }
  walk(tree, 0);

  return {
    id: `mindmap-${Date.now()}`,
    text: `Here's a mind map of the key concepts:\n\n${lines.join("\n")}`,
    tree,
    citations: formatCitationsForDisplay(citations),
    prompt,
    generatedAt: new Date().toISOString(),
  };
}
