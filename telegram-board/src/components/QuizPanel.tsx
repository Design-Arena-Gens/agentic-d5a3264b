/* eslint-disable @typescript-eslint/no-use-before-define */
"use client";

import { useEffect, useMemo, useState } from "react";
import { GradeResources, QuizQuestion } from "@/data/grades";
import { cn } from "@/lib/utils";

type QuizPanelProps = {
  resource: GradeResources;
};

type QuizMode = "timed" | "practice";

type QuizSessionState = {
  mode: QuizMode;
  questions: QuizQuestion[];
  currentIndex: number;
  selections: Record<string, string | null>;
  completed: boolean;
  remainingSeconds: number;
  started: boolean;
  score: number;
};

const TIMED_DURATION = 90; // seconds per timed sprint

export const QuizPanel = ({ resource }: QuizPanelProps) => {
  const [session, setSession] = useState<QuizSessionState>(() =>
    createSessionState("practice", resource.quizzes.practice),
  );

  const activeQuestion = session.questions[session.currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (session.mode === "timed" && session.started && !session.completed) {
      interval = setInterval(() => {
        setSession((current) => {
          if (current.remainingSeconds <= 1) {
            return finishQuiz(current);
          }
          return { ...current, remainingSeconds: current.remainingSeconds - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [session.mode, session.started, session.completed]);

  useEffect(() => {
    setSession(createSessionState(session.mode, getQuestions(session.mode)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.grade]);

  const summary = useMemo(() => summarizeSession(session), [session]);

  function getQuestions(mode: QuizMode) {
    if (mode === "timed") {
      return resource.quizzes.timed;
    }
    return resource.quizzes.practice;
  }

  function handleModeSwitch(mode: QuizMode) {
    setSession(createSessionState(mode, getQuestions(mode)));
  }

  function handleStart() {
    setSession((state) => ({
      ...state,
      started: true,
      remainingSeconds: state.mode === "timed" ? TIMED_DURATION : state.remainingSeconds,
    }));
  }

  function handleSelect(option: string) {
    if (session.completed || !session.started) return;
    setSession((state) => {
      const updatedSelections = {
        ...state.selections,
        [state.questions[state.currentIndex].id]: option,
      };
      const isCorrect = option === state.questions[state.currentIndex].answer;
      return {
        ...state,
        selections: updatedSelections,
        score: isCorrect ? state.score + 1 : state.score,
      };
    });
  }

  function handleAdvance(direction: "next" | "previous") {
    setSession((state) => {
      const nextIndex =
        direction === "next"
          ? Math.min(state.questions.length - 1, state.currentIndex + 1)
          : Math.max(0, state.currentIndex - 1);
      return {
        ...state,
        currentIndex: nextIndex,
      };
    });
  }

  function handleSubmit() {
    setSession((state) => finishQuiz(state));
  }

  if (!activeQuestion) {
    return null;
  }

  const selection = session.selections[activeQuestion.id];
  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
            FaceBond Quiz Studio
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {session.mode === "timed" ? "Timed Sprint Quiz" : "Practice Flow"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleModeSwitch("practice")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              session.mode === "practice"
                ? "bg-emerald-500 text-emerald-950"
                : "border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/10",
            )}
          >
            Normal Quiz
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("timed")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              session.mode === "timed"
                ? "bg-violet-500 text-violet-50"
                : "border border-violet-400/50 text-violet-200 hover:bg-violet-500/10",
            )}
          >
            Timed Quiz
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,280px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Question {session.currentIndex + 1}/{session.questions.length}
            </span>
            {session.mode === "timed" && session.started && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-semibold",
                  session.remainingSeconds <= 15
                    ? "bg-rose-500/10 text-rose-200"
                    : "bg-slate-800 text-emerald-200",
                )}
              >
                ⏱ {session.remainingSeconds}s
              </span>
            )}
          </div>

          <h3 className="mt-4 text-xl font-semibold text-white">
            {activeQuestion.prompt}
          </h3>

          <div className="mt-5 grid gap-3">
            {activeQuestion.options.map((option) => {
              const isActive = selection === option;
              const isLocked = session.completed;
              const isCorrect = option === activeQuestion.answer;
              const showState = session.completed && isActive;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200",
                    isActive && !session.completed && "border-emerald-500 bg-emerald-500/10 text-emerald-100",
                    showState && isCorrect && "border-emerald-400 bg-emerald-500/10 text-emerald-100",
                    showState && !isCorrect && "border-rose-400 bg-rose-500/10 text-rose-100 cursor-not-allowed",
                    isLocked && !isActive && "opacity-90",
                  )}
                  disabled={session.completed}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400"
                onClick={() => handleAdvance("previous")}
                disabled={session.currentIndex === 0}
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400"
                onClick={() => handleAdvance("next")}
                disabled={isLastQuestion}
              >
                Next
              </button>
            </div>
            {!session.started ? (
              <button
                type="button"
                className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                onClick={handleStart}
              >
                Start Quiz
              </button>
            ) : (
              <button
                type="button"
                className="rounded-full bg-violet-500 px-6 py-2 text-sm font-semibold text-violet-50 transition hover:bg-violet-400 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={session.completed}
              >
                {session.completed ? "Completed" : "Submit"}
              </button>
            )}
          </div>

          {session.completed && (
            <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <p>
                Score:{" "}
                <span className="font-semibold text-white">
                  {session.score}/{session.questions.length}
                </span>
              </p>
              <p className="mt-2 text-slate-100">
                {activeQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <h4 className="text-sm font-semibold text-white">Navigator</h4>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {session.questions.map((question, index) => {
                const answered = Boolean(session.selections[question.id]);
                const isActive = index === session.currentIndex;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() =>
                      setSession((state) => ({
                        ...state,
                        currentIndex: index,
                      }))
                    }
                    className={cn(
                      "h-9 rounded-lg border border-slate-800 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-200",
                      answered && "border-emerald-500/50 bg-emerald-500/10 text-emerald-100",
                      isActive && "border-emerald-400 bg-emerald-500/20 text-white",
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <h4 className="text-sm font-semibold text-white">Session Digest</h4>
            <dl className="mt-3 space-y-2 text-xs uppercase tracking-[0.2em] text-slate-300/80">
              <div className="flex justify-between">
                <dt>Mode</dt>
                <dd>{session.mode === "timed" ? "Timed sprint" : "Practice"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Answered</dt>
                <dd>{summary.answered}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Pending</dt>
                <dd>{summary.pending}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Score</dt>
                <dd>{session.score}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );

  function getInitialSelections(questions: QuizQuestion[]) {
    return questions.reduce<Record<string, string | null>>((acc, question) => {
      acc[question.id] = null;
      return acc;
    }, {});
  }

  function createSessionState(mode: QuizMode, questions: QuizQuestion[]): QuizSessionState {
    return {
      mode,
      questions,
      currentIndex: 0,
      selections: getInitialSelections(questions),
      completed: false,
      remainingSeconds: mode === "timed" ? TIMED_DURATION : 0,
      started: false,
      score: 0,
    };
  }

  function finishQuiz(state: QuizSessionState): QuizSessionState {
    return {
      ...state,
      completed: true,
      started: true,
      remainingSeconds: 0,
    };
  }

  function summarizeSession(state: QuizSessionState) {
    const answered = Object.values(state.selections).filter(Boolean).length;
    return {
      answered,
      pending: state.questions.length - answered,
    };
  }
};

