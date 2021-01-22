export const enum Command {
  helloWorld = "codepal.helloWorld",
  setEditorLayout = "vscode.setEditorLayout",
  vscodeOpen = "vscode.open",
  reloadProblems="codepal.reloadProblems",
  reloadContests="codepal.reloadContests",
  createContestDirectory="codepal.createContestDirectory",
  createProblemDirectory="codepal.createProblemDirectory",
  runTestCases="codepal.runTestCases",
  openProblemStatement="codepal.openProblemStatement",
  submitProblem="codepal.submitProblem",
  addTestCases="codepal.addTestCases",
  getProblemFilters="codepal.getProblemFilters",
}
export const codepalConfigName = "codepal";
export const enum CodepalConfig {
  compilationLanguage = "compilationLanguage",
  codeTemplatePath="codeTemplatePath",
}
export const enum TreeViewIDs{
  contests="codepalContests",
  problems = "codepalProblems",
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
export const enum ContestTreeEnum {
  runningContestType = "Running",
  futureContestType = "Future",
  pastContestType = "Past",
  contestLabel = "contest",
  futureContestLabel = "FutureContest",
  contestProblemType = "ContestProblem",
  contestTypeContextValue = "ContestType",
}
export const enum ProblemTreeEnum{
  problemContextValue="problem",
}
export enum RatingsEnum {
  initialFromRating = 0,
  initialToRating = 4000,
}
export enum Urls {
  fetchContestsList = "https://codeforces.com/api/contest.list?gym=false",
  fetchProblemSet = "https://codeforces.com/api/problemset.problems"
}

export enum OS {
    linux,
    windows
}
export const enum ErrorCodes{
  fileExists="EEXIST",
  folderExists="EEXIST",
  noWritePermission="EACCES",
}
export const enum Errors{
  timeLimitExceeded= "Time limit exceeded",
}
export const tagsByOR: string = "*combine tags by OR";
export const  allTags: string[] = [
  tagsByOR,
  "2-sat",
  "binary search",
  "bitmasks",
  "brute force",
  "chinese remainder theorem",
  "combinatorics",
  "constructive algorithms",
  "data structures",
  "dfs and similar",
  "divide and conquer",
  "dp",
  "dsu",
  "expression parsing",
  "fft",
  "flows",
  "games",
  "geometry",
  "graph matchings",
  "graphs",
  "greedy",
  "hashing",
  "implementation",
  "interactive",
  "math",
  "matrices",
  "meet-in-the-middle",
  "number theory",
  "probabilities",
  "schedules",
  "shortest paths",
  "sortings",
  "string suffix structures",
  "strings",
  "ternary search",
  "trees",
  "two pointers",
];