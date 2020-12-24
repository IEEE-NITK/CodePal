import * as vscode from "vscode";
import { ContestClass } from "../classes/contest";
import { ProblemClass } from "../classes/problem";
import { ContestTreeItem } from "../data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "../data_providers/problems/problem_tree_item";
import { CodePalAPI } from "./api_calls";

export class Utils {
  static createContestDirectories = (
    contest: ContestClass | undefined,
    rootPath: string
  ): void => {
    //TODO: ADD FUNCTION THAT CREATES CONTEST DIRECTORY STRUCTURE.
    console.log(rootPath);
  };

  static getProblems = async (): Promise<ProblemTreeItem[]> => {
    let problems: ProblemClass[] = await CodePalAPI.fetchProblems();
    return problems.map<ProblemTreeItem>(
      (problem: ProblemClass): ProblemTreeItem => {
          return new ProblemTreeItem(
            `${problem.name}`,
            "problem",
            vscode.TreeItemCollapsibleState.None,
            problem
          );
      }
    ); //TODO: CALL FUNCTION THAT FETCHES PROBLEMS IN PLACE OF []
  };

  // static getRatings = ():RatingsTreeItem[]=>{
  //   return []; //TODO: CALL FUNCTION THAT FETCHES Ratings IN PLACE OF []
  // }

  static fetchContests = async (type: string): Promise<ContestTreeItem[]> => {
    let contests: ContestClass[] = await CodePalAPI.fetchContests(type); //TODO: CALL FUNCTION THAT FETCHES CONTESTS IN PLACE OF []
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
}
