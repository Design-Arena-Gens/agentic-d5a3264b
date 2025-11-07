import { GradeResources } from "@/data/grades";
import { cn } from "@/lib/utils";

type GradeSelectorProps = {
  grades: GradeResources[];
  activeGrade: GradeResources;
  onSelect: (grade: GradeResources) => void;
};

export const GradeSelector = ({
  grades,
  activeGrade,
  onSelect,
}: GradeSelectorProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {grades.map((grade) => {
        const isActive = grade.grade === activeGrade.grade;
        return (
          <button
            key={grade.grade}
            type="button"
            onClick={() => onSelect(grade)}
            className={cn(
              "group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20",
              isActive && "border-emerald-500 bg-slate-900 shadow-lg",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                Grade {grade.grade}
              </span>
              <span className="text-xs text-slate-400">
                {grade.quizzes.timed.length + grade.quizzes.practice.length}{" "}
                quizzes
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold text-white">
              FaceBond Cohort {grade.grade}
            </p>
            <p className="mt-2 text-sm text-slate-300">{grade.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {grade.focusAreas.slice(0, 3).map((focus) => (
                <span
                  key={focus}
                  className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 transition group-hover:bg-emerald-400/20"
                >
                  {focus}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

