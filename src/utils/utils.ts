import * as vscode from "vscode";
import { ContestClass } from "../classes/contest";
import { ContestTreeItem } from "../data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "../data_providers/problems/problem_tree_item";
import {fetchContests as fetchContestsAPI} from "./api_calls";

export const createContestDirectories = (contestID:string,rootPath: string): void=>{
  //TODO: ADD FUNCTION THAT CREATES CONTEST DIRECTORY STRUCTURE.
};

export const getProblems = ():ProblemTreeItem[]=>{
  return []; //TODO: CALL FUNCTION THAT FETCHES PROBLEMS IN PLACE OF [] 
};

// export const getRatings = ():RatingsTreeItem[]=>{
//   return []; //TODO: CALL FUNCTION THAT FETCHES Ratings IN PLACE OF [] 
// }

export const fetchContests =async (type: string): Promise<ContestTreeItem[]> => {
  let contests: ContestClass[]=await fetchContestsAPI(type); //TODO: CALL FUNCTION THAT FETCHES CONTESTS IN PLACE OF [] 
    return contests.map<ContestTreeItem>(
      (contest): ContestTreeItem => {
        return new ContestTreeItem(
          `${contest.name}`,
          type === "Future"?"FutureContest":"contest",
          type === "Future"
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Collapsed,
          type,
          contest
        );
      }
    );
 
  
};
