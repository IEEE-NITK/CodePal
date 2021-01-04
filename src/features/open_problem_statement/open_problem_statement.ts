import * as open from "open";
export enum SubmitProblemType {
  contest,
  problemset,
}
export const openProblemStatement = (
  type: SubmitProblemType,
  contestID: number,
  index: String
) => {
  type === SubmitProblemType.problemset
    ? open(`https://codeforces.com/problemset/problem/${contestID}/${index}`)
    : open(`https://codeforces.com/contest/${contestID}/problem/${index}`);
};
