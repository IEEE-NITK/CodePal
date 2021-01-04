import * as open from "open";
export enum OpenProblemType {
  contest,
  problemset,
}
export const openProblemStatement = (
  type: OpenProblemType,
  contestID: number,
  index: String
) => {
  type === OpenProblemType.problemset
    ? open(`https://codeforces.com/problemset/problem/${contestID}/${index}`)
    : open(`https://codeforces.com/contest/${contestID}/problem/${index}`);
};
