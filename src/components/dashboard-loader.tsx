"use client";

import dynamic from "next/dynamic";

const ReviewDashboard = dynamic(
  () => import("@/components/review-dashboard").then((m) => m.ReviewDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"
            aria-hidden
          />
          <p className="text-sm">Loading dashboard…</p>
        </div>
      </div>
    ),
  },
);

export function DashboardLoader() {
  return <ReviewDashboard />;
}
