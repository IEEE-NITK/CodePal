import * as vscode from "vscode";
import { ContestTreeItem } from "./contest_tree_item";
import { getContests } from "../../utils/utils";

export class ContestsProvider
  implements vscode.TreeDataProvider<ContestTreeItem> {
  private rootPath: any;
  constructor(private workspaceRoot: string) {
    console.log(workspaceRoot);
    this.rootPath = workspaceRoot;
  }
  onDidChangeTreeData?: vscode.Event<ContestTreeItem | null | undefined> | undefined;

  getTreeItem(element: ContestTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
      return element;  
  }

  getChildren(
    element?: ContestTreeItem
  ): vscode.ProviderResult<ContestTreeItem[]> {
    if (!element) {
      return this.getContestTypes();
    } 
    else if (element.label === "Running") {
      return getContests(element.label);
    } else if (element.label === "Future") {
      return getContests(element.label);
    } else if (element.label === "Past") {
      return getContests(element.label);
    }
     else {
      console.log("get children []");
      return Promise.resolve([]);
    }
  }

  getContestTypes(): Thenable<ContestTreeItem[]> {
    return Promise.resolve([
      new ContestTreeItem(
        "Running",
        "ContestType",
        vscode.TreeItemCollapsibleState.Collapsed
      ),
      new ContestTreeItem(
        "Future",
        "ContestType",
        vscode.TreeItemCollapsibleState.Collapsed
      ),
      new ContestTreeItem(
        "Past",
        "ContestType",
        vscode.TreeItemCollapsibleState.Collapsed
      ),
    ]);
  }
}
