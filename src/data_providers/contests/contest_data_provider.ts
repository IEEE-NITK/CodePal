import * as vscode from "vscode";
import { ContestTreeItem } from "./contest_tree_item";
import { fetchContests } from "../../features/contests_list/contests_list";
import { ContestClass } from "../../classes/contest";
import { ContestTreeItemEnum } from "../../utils/consts";

export class ContestsProvider
  implements vscode.TreeDataProvider<ContestTreeItem> {
  private rootPath: string;
  constructor(private workspaceRoot: string) {
    console.log(workspaceRoot);
    this.rootPath = workspaceRoot;
  }
  private _onDidChangeTreeData: vscode.EventEmitter<ContestTreeItem | undefined | void> = new vscode.EventEmitter<ContestTreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ContestTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  
  reload():void {
    this.refresh();
  }

  getTreeItem(
    element: ContestTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: ContestTreeItem
  ): vscode.ProviderResult<ContestTreeItem[]> {
    if (!element) {
      return this.getContestTypes();
    } else if (element.label === ContestTreeItemEnum.runningContestLabel ) {
      return fetchContests(element.label);
    } else if (element.label === ContestTreeItemEnum.futureContestLabel) {
      return fetchContests(element.label);
    } else if (element.label === ContestTreeItemEnum.pastContestLabel) {
      return fetchContests(element.label);
    } else {
      if (element.contest) {
        return this.fetchProblemsOfContest(element.contest);
      }
      return Promise.resolve([]);
    }
  }
  async fetchProblemsOfContest(
    contest: ContestClass
  ): Promise<ContestTreeItem[]> {
    if(!contest.problems.length) {
      await contest.init();
    }
    return contest.problems.map<ContestTreeItem>((problem) => {
      return new ContestTreeItem(
        problem.name,
        problem.problemID,
        vscode.TreeItemCollapsibleState.None,
       
      );
    });
  }
  getContestTypes(): Thenable<ContestTreeItem[]> {
    return Promise.resolve([
      new ContestTreeItem(
        ContestTreeItemEnum.runningContestLabel,
        ContestTreeItemEnum.contestTypeContextValue,
        vscode.TreeItemCollapsibleState.Collapsed
      ),
      new ContestTreeItem(
        ContestTreeItemEnum.futureContestLabel,
        ContestTreeItemEnum.contestTypeContextValue,
        vscode.TreeItemCollapsibleState.Collapsed
      ),
      new ContestTreeItem(
        ContestTreeItemEnum.pastContestLabel,
        ContestTreeItemEnum.contestTypeContextValue,
        vscode.TreeItemCollapsibleState.Collapsed
      ),
    ]);
  }
}
