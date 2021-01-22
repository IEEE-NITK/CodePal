export const enum Command {
  helloWorld = "codepal.helloWorld",
  setEditorLayout = "vscode.setEditorLayout",
  vscodeOpen = "vscode.open",
}
export const codepalConfigName = "codepal";
export const enum CodepalConfig {
  compilationLanguage = "compilationLanguage",
}
export const enum CompilationLanguages {
  cpp = "g++",
  gcc = "gcc",
  java="java",
  python = "python",
  python3 = "python3",
}
export const enum CompilationFlags {
  cpp = "g++ CompilationFlags",
  gcc = "gccCompilationFlags",
  java="javaCompilationFlags",
  python="pythonCompilationFlags",
}
export const enum ContestsPhase {
  finished = "FINISHED",
  coding = "CODING",
  before = "BEFORE",
}
export const enum ContestEnum {
  runningContestType = "Running",
  futureContestType = "Future",
  pastContestType = "Past",
  contestLabel = "contest",
  futureContestLabel = "FutureContest",
  contestProblemType = "ContestProblem",
  contestTypeContextValue = "ContestType",
}
export enum RatingsEnum {
  initialFromRating = 0,
  initialToRating = 4000,
}
export enum Urls {
  fetchContestsList = "https://codeforces.com/api/contest.list?gym=false",
  fetchProblemSet = "https://codeforces.com/api/problemset.problems"
}

export enum ProblemTags{
  tagsByOR = "*combine tags by OR"
}

export enum OS {
    linux,
    windows
}
