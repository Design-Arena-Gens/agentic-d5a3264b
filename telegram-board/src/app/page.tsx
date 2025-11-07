"use client";

import { useMemo, useState } from "react";
import { AiMentorPanel } from "@/components/AiMentorPanel";
import { GradeSelector } from "@/components/GradeSelector";
import { QuestionPaperDeck } from "@/components/QuestionPaperDeck";
import { QuizPanel } from "@/components/QuizPanel";
import { gradeResources } from "@/data/grades";

export default function Home() {
  const [activeGrade, setActiveGrade] = useState(gradeResources[0]);

  const gradeLabel = useMemo(
    () => `Grade ${activeGrade.grade}`,
    [activeGrade.grade],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.25),_transparent_55%)]" />
      <div className="absolute inset-0 -z-20 bg-slate-950" />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-10 sm:px-8 lg:px-10">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-xl shadow-emerald-500/5 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                FaceBond Telegram Board
              </span>
              <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
                Unified learning hub for grades 9 to 12
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-300">
                Board-ready resources, AI mentorship, and quiz studios crafted
                for your Telegram community. Switch between grades instantly,
                drop curated question papers, and launch timed or relaxed quiz
                experiences on demand.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-sm text-emerald-100">
              <p className="font-semibold tracking-wide text-emerald-200">
                {gradeLabel} Snapshot
              </p>
              <ul className="mt-3 space-y-2 text-emerald-50/90">
                {activeGrade.focusAreas.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-emerald-400/80">
                {activeGrade.quizzes.timed.length} timed ·{" "}
                {activeGrade.quizzes.practice.length} practice quizzes
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <header className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Choose your cohort
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Select a grade to sync resources with your Telegram board.
            </h2>
          </header>
          <GradeSelector
            grades={gradeResources}
            activeGrade={activeGrade}
            onSelect={setActiveGrade}
          />
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <header className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Grade {activeGrade.grade} focus stream
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Weekly sprints to broadcast on Telegram
                </h2>
                <p className="text-sm text-slate-300">
                  Pin these pillars to your FaceBond board to orient the cohort
                  before pushing quizzes or question papers.
                </p>
              </header>
              <div className="mt-5 flex flex-wrap gap-3">
                {activeGrade.focusAreas.map((focus) => (
                  <span
                    key={focus}
                    className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <header>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Ready-download question papers
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Launch into revision with curated PDFs
                </h2>
              </header>
              <QuestionPaperDeck papers={activeGrade.questionPapers} />
            </section>
          </div>
          <AiMentorPanel resource={activeGrade} />
        </div>

        <QuizPanel resource={activeGrade} />

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Drop FaceBond updates straight into Telegram
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Share the board link, schedule AI office hours, and rotate between
            timed sprints and practice flows for a complete grade 9-12 command
            center.
          </p>
        </section>
      </div>
    </main>
  );
}
