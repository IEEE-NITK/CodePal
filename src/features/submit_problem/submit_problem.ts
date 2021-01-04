import open = require("open");

export enum SubmitProblemType {
  contest,
  problemset,
}
export const submitProblem = async (
  type: SubmitProblemType,
  contestID: number,
  problemIndex: string
) => {
  type === SubmitProblemType.contest
    ? open(`https://codeforces.com/contest/${contestID}/submit`)
    : open(`https://codeforces.com/problemset/submit`);
};