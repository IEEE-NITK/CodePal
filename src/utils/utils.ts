import * as vscode from "vscode";
import { ContestClass } from "../classes/contest";
import { ContestTreeItem } from "../data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "../data_providers/problems/problem_tree_item";
//import { RatingsTreeItem } from "../data_providers/ratings/ratings_tree_item";

export const createContestDirectories = (contestID:string,rootPath: string): void=>{
  //TODO: ADD FUNCTION THAT CREATES CONTEST DIRECTORY STRUCTURE.
};

export const getProblems = ():ProblemTreeItem[]=>{
  return []; //TODO: CALL FUNCTION THAT FETCHES PROBLEMS IN PLACE OF [] 
};

// export const getRatings = ():RatingsTreeItem[]=>{
//   return []; //TODO: CALL FUNCTION THAT FETCHES Ratings IN PLACE OF [] 
// }

export const getContests = (type: string): ContestTreeItem[] => {
  let children: ContestTreeItem[] = [];
  let contests: ContestClass[]=[]; //TODO: CALL FUNCTION THAT FETCHES CONTESTS IN PLACE OF [] 
  children.push(
    ...contests.map<ContestTreeItem>(
      (contest): ContestTreeItem => {
        return new ContestTreeItem(
          `${contest.contestID}`,
          type === "Future"?"FutureContest":"contest",
          type === "Future"
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Collapsed,
          type,
          contest
        );
      }
    )
  );
  return children;
};
