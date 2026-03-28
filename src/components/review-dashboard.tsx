"use client";

import { useCallback, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Lightbulb,
  Loader2,
  MessageSquareQuote,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { analyzeReviews, type AnalysisResult } from "@/lib/analyze-reviews";

const SAMPLE_TEXT =
  "The product exceeded expectations and the quality feels premium. Shipping was faster than quoted. " +
  "Support answered within minutes—huge win. Only nitpick: the onboarding could be simpler for first-time users.";

const chartTooltipClass =
  "rounded-lg border border-slate-700/80 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-xl backdrop-blur-sm";

function SentimentBadge({ overall }: { overall: AnalysisResult["summary"]["overall"] }) {
  const styles = {
    positive: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    neutral: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
    negative: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  };
  const labels = { positive: "Positive", neutral: "Neutral", negative: "Negative" };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[overall]}`}
    >
      {labels[overall]}
    </span>
  );
}

export function ReviewDashboard() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [result, setResult] = useState<AnalysisResult | null>(() => analyzeReviews(SAMPLE_TEXT));
  const [loading, setLoading] = useState(false);

  const runAnalyze = useCallback(() => {
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(analyzeReviews(text));
      setLoading(false);
    }, 900);
  }, [text]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(56,189,248,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-6 border-b border-slate-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200 ring-1 ring-violet-500/20">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden />
              AI Review Analyzer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Turn raw reviews into{" "}
              <span className="bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
                actionable insight
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">
              Paste customer feedback, run analysis, and explore sentiment breakdowns, topic focus, and narrative
              momentum—styled like the analytics suite your team actually wants to open.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
              <Zap className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Live preview</p>
              <p className="text-sm font-medium text-slate-200">Demo-grade heuristics</p>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
          <section className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <MessageSquareQuote className="h-4 w-4 text-cyan-400" aria-hidden />
                  Review input
                </div>
                <span className="text-xs text-slate-500">{text.length.toLocaleString()} chars</span>
              </div>
              <label htmlFor="reviews" className="sr-only">
                Customer reviews
              </label>
              <textarea
                id="reviews"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                placeholder="Paste one or more customer reviews, testimonials, or support threads..."
                className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={runAnalyze}
                  disabled={loading || !text.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Analyze
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-500">Runs client-side demo analysis—swap in your model later.</p>
              </div>
            </div>
          </section>

          <section className="min-w-0 space-y-6">
            {!result && !loading && (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/20 p-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60">
                  <BarChart3 className="h-7 w-7 text-slate-500" aria-hidden />
                </div>
                <p className="text-sm font-medium text-slate-300">No results yet</p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Add reviews on the left and click Analyze to populate sentiment charts and key insights.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400" aria-hidden />
                <p className="mt-4 text-sm font-medium text-slate-300">Parsing sentiment &amp; themes…</p>
                <p className="mt-1 text-xs text-slate-500">Building charts from your text.</p>
              </div>
            )}

            {result && !loading && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Overall</p>
                    <div className="mt-2 flex items-center gap-2">
                      <SentimentBadge overall={result.summary.overall} />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tabular-nums text-white">
                      {result.summary.avgScore > 0 ? "+" : ""}
                      {result.summary.avgScore}
                    </p>
                    <p className="text-xs text-slate-500">Avg. polarity (heuristic)</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Coverage</p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
                      {result.summary.sentenceCount}
                    </p>
                    <p className="text-xs text-slate-500">
                      sentences · {result.summary.wordCount.toLocaleString()} words
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Top theme</p>
                    <p className="mt-2 truncate text-lg font-semibold text-white">{result.summary.topTopic}</p>
                    <p className="text-xs text-slate-500">Keyword density winner</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Momentum</p>
                    <div className="mt-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-400" aria-hidden />
                      <span className="text-lg font-semibold text-white">Narrative arc</span>
                    </div>
                    <p className="text-xs text-slate-500">See area chart below</p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <PieChartIcon className="h-4 w-4 text-violet-400" aria-hidden />
                      Sentiment split
                    </div>
                    <div className="h-[260px] w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                        <PieChart>
                          <Pie
                            data={result.sentiment}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={88}
                            paddingAngle={3}
                            stroke="none"
                          >
                            {result.sentiment.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload as { name: string; value: number; color: string };
                              return (
                                <div className={chartTooltipClass}>
                                  <p className="font-medium">{d.name}</p>
                                  <p className="text-slate-300">{d.value}% of sentences</p>
                                </div>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                      {result.sentiment.map((s) => (
                        <li key={s.name} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.name} {s.value}%
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <BarChart3 className="h-4 w-4 text-cyan-400" aria-hidden />
                      Topic focus
                    </div>
                    <div className="h-[260px] w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                        <BarChart data={result.topics} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const row = payload[0].payload as { name: string; score: number };
                              return (
                                <div className={chartTooltipClass}>
                                  <p className="font-medium text-slate-300">{row.name}</p>
                                  <p className="text-cyan-300">{row.score} keyword hits</p>
                                </div>
                              );
                            }}
                          />
                          <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
                          <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
                    <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden />
                    Sentiment by sentence
                  </div>
                  <div className="h-[240px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                      <AreaChart data={result.sentimentFlow} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="areaSentiment" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                          dataKey="segment"
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          label={{ value: "Sentence #", position: "insideBottom", offset: -4, fill: "#64748b" }}
                        />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                              <div className={chartTooltipClass}>
                                <p className="font-medium text-slate-300">Sentence {label}</p>
                                <p className="text-violet-300">Score {payload[0].value}</p>
                              </div>
                            );
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#c4b5fd"
                          strokeWidth={2}
                          fill="url(#areaSentiment)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-slate-900/80 to-violet-950/40 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Lightbulb className="h-4 w-4 text-amber-300" aria-hidden />
                    Key insights
                  </div>
                  <ul className="space-y-3">
                    {result.insights.map((line, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-xl border border-slate-800/60 bg-slate-950/30 px-4 py-3 text-sm leading-relaxed text-slate-300"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-semibold text-violet-300">
                          {i + 1}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </section>
        </div>

        <footer className="mt-auto border-t border-slate-800/80 pt-8 text-center text-xs text-slate-600">
          Built with Next.js · Tailwind CSS · Recharts · Lucide
        </footer>
      </div>
    </div>
  );
}
