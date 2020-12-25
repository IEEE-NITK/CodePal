import * as vscode from "vscode";
import { ProblemTreeItem } from "./problem_tree_item";
import { fetchProblems } from "../../features/problems_list/problems_list";

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
    return fetchProblems();
  }
}
