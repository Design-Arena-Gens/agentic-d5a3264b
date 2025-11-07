import Link from "next/link";
import { QuestionPaper } from "@/data/grades";

type QuestionPaperDeckProps = {
  papers: QuestionPaper[];
};

export const QuestionPaperDeck = ({ papers }: QuestionPaperDeckProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {papers.map((paper) => (
        <article
          key={paper.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-200">
              {paper.subject}
            </span>
            <span className="text-xs text-slate-400">{paper.year}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white">
            {paper.title}
          </h3>
          <p className="mt-2 text-sm text-slate-300">{paper.description}</p>
          <Link
            href={paper.downloadUrl}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Download Paper
          </Link>
        </article>
      ))}
    </div>
  );
};

