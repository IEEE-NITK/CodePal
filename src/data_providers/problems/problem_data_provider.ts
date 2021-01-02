import * as vscode from "vscode";
import { ProblemTreeItem } from "./problem_tree_item";
import { fetchProblems } from "../../features/problems_list/problems_list";
import { ProblemClass } from "../../classes/problem";

export class ProblemsProvider
  implements vscode.TreeDataProvider<ProblemTreeItem> {
  private rootPath: string;
  constructor(private workspaceRoot: string) {
    console.log(workspaceRoot);
    this.rootPath = workspaceRoot;
  }
  onDidChangeTreeData?:
    | vscode.Event<ProblemTreeItem | null | undefined>
    | undefined;

  getTreeItem(
    element: ProblemTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: ProblemTreeItem
  ): vscode.ProviderResult<ProblemTreeItem[]> {
    if (!element) {
      return fetchProblems();
    } else if (element.problem) {
      return this.problemStats(element.problem);
    } 
    
  }

  problemStats(
    problem: ProblemClass
    ): Thenable<ProblemTreeItem[]> {
    let tagList : string = "";
    
    for(let i = 0; i < problem.tags.length; i+=1){
      if (i === 0) {
        tagList += problem.tags[i];
      } else {
        tagList += " , " + problem.tags[i];
      }
    }
    
    return Promise.resolve([
      new ProblemTreeItem(
        `Rating : ${(problem.rating === 0 ? "Not yet defined" : problem.rating)}`,
        "ratings",
        vscode.TreeItemCollapsibleState.None
      ),
      new ProblemTreeItem(
        `Tags : ${tagList}`,
        "tags",
        vscode.TreeItemCollapsibleState.None
      ),
    ]);
  }

}
