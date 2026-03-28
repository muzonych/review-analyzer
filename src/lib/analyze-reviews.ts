export type SentimentSlice = {
  name: string;
  value: number;
  color: string;
};

export type TopicScore = {
  name: string;
  score: number;
};

export type SentimentPoint = {
  segment: number;
  score: number;
};

export type AnalysisResult = {
  sentiment: SentimentSlice[];
  topics: TopicScore[];
  sentimentFlow: SentimentPoint[];
  insights: string[];
  summary: {
    overall: "positive" | "neutral" | "negative";
    sentenceCount: number;
    wordCount: number;
    topTopic: string;
    avgScore: number;
  };
};

const POSITIVE = new Set([
  "love",
  "loved",
  "great",
  "excellent",
  "amazing",
  "fantastic",
  "good",
  "best",
  "happy",
  "perfect",
  "wonderful",
  "awesome",
  "recommend",
  "impressed",
  "satisfied",
  "helpful",
  "fast",
  "easy",
  "smooth",
  "quality",
  "brilliant",
  "outstanding",
  "pleased",
  "thank",
  "thanks",
]);

const NEGATIVE = new Set([
  "bad",
  "worst",
  "terrible",
  "awful",
  "hate",
  "poor",
  "disappointed",
  "slow",
  "broken",
  "useless",
  "waste",
  "horrible",
  "frustrated",
  "never",
  "refund",
  "problem",
  "issue",
  "defect",
  "cheap",
  "rude",
  "unhelpful",
]);

const TOPICS: { name: string; keywords: string[] }[] = [
  {
    name: "Product",
    keywords: ["product", "item", "quality", "feature", "design", "build"],
  },
  {
    name: "Support",
    keywords: ["support", "help", "team", "staff", "service", "response"],
  },
  {
    name: "Shipping",
    keywords: ["shipping", "delivery", "package", "arrived", "tracking"],
  },
  {
    name: "Price",
    keywords: ["price", "cost", "value", "expensive", "affordable", "worth"],
  },
  {
    name: "Experience",
    keywords: ["experience", "easy", "simple", "intuitive", "interface", "app"],
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function sentenceScore(words: string[]): number {
  let pos = 0;
  let neg = 0;
  for (const w of words) {
    if (POSITIVE.has(w)) pos += 1;
    if (NEGATIVE.has(w)) neg += 1;
  }
  const n = words.length || 1;
  return (pos - neg) / Math.sqrt(n);
}

function classifySentence(score: number): "positive" | "neutral" | "negative" {
  if (score > 0.35) return "positive";
  if (score < -0.35) return "negative";
  return "neutral";
}

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0 && text.trim()) return [text.trim()];
  return parts.length ? parts : [];
}

function topicScores(text: string): TopicScore[] {
  const lower = text.toLowerCase();
  return TOPICS.map(({ name, keywords }) => {
    let score = 0;
    for (const k of keywords) {
      const re = new RegExp(`\\b${k}\\w*\\b`, "gi");
      const m = lower.match(re);
      score += m ? m.length : 0;
    }
    return { name, score };
  }).sort((a, b) => b.score - a.score);
}

export function analyzeReviews(raw: string): AnalysisResult | null {
  const text = raw.trim();
  if (!text) return null;

  const sentences = splitSentences(text);
  const words = tokenize(text);

  let posC = 0;
  let neuC = 0;
  let negC = 0;
  const flow: SentimentPoint[] = [];
  let sumScore = 0;

  sentences.forEach((s, i) => {
    const w = tokenize(s);
    const sc = sentenceScore(w);
    sumScore += sc;
    flow.push({ segment: i + 1, score: Math.round(sc * 100) / 100 });
    const c = classifySentence(sc);
    if (c === "positive") posC += 1;
    else if (c === "negative") negC += 1;
    else neuC += 1;
  });

  const total = sentences.length || 1;
  const sentiment: SentimentSlice[] = [
    { name: "Positive", value: Math.round((posC / total) * 1000) / 10, color: "#34d399" },
    { name: "Neutral", value: Math.round((neuC / total) * 1000) / 10, color: "#94a3b8" },
    { name: "Negative", value: Math.round((negC / total) * 1000) / 10, color: "#fb7185" },
  ];

  const topics = topicScores(text);
  const top = topics[0]?.name ?? "General";

  const avg = sumScore / total;
  let overall: "positive" | "neutral" | "negative" = "neutral";
  if (avg > 0.2) overall = "positive";
  else if (avg < -0.2) overall = "negative";

  const insights: string[] = [];

  const posPct = sentiment[0].value;
  const negPct = sentiment[2].value;

  if (posPct >= 50) {
    insights.push(
      `Strong positive tone: about ${posPct}% of sentences read as favorable—great signal for social proof.`,
    );
  } else if (negPct >= 40) {
    insights.push(
      `Elevated criticism: ${negPct}% of sentences skew negative—prioritize follow-up on recurring themes.`,
    );
  } else {
    insights.push(
      `Balanced feedback: sentiment is mixed with ${posPct}% positive and ${negPct}% negative—room to double down on wins.`,
    );
  }

  const sortedTopics = [...topics].sort((a, b) => b.score - a.score);
  if (sortedTopics[0].score > 0) {
    insights.push(
      `Most discussed theme: "${sortedTopics[0].name}" appears frequently—highlight this in positioning or FAQs.`,
    );
  }

  if (flow.length >= 3) {
    const last = flow.slice(-2).reduce((a, b) => a + b.score, 0) / 2;
    const first = flow.slice(0, 2).reduce((a, b) => a + b.score, 0) / 2;
    if (last > first + 0.15) {
      insights.push("Sentiment improves toward the end—readers may finish on a high note; use that in testimonials.");
    } else if (last < first - 0.15) {
      insights.push("Sentiment dips toward the end—check closing remarks for friction or unresolved issues.");
    }
  }

  if (words.length < 40) {
    insights.push("Short sample: add more reviews for more stable topic and sentiment estimates.");
  }

  return {
    sentiment,
    topics,
    sentimentFlow: flow,
    insights,
    summary: {
      overall,
      sentenceCount: sentences.length,
      wordCount: words.length,
      topTopic: top,
      avgScore: Math.round(avg * 100) / 100,
    },
  };
}
