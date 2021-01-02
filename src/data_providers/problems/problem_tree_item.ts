import * as vscode from "vscode";
import {ProblemClass} from "../../classes/problem";
export class ProblemTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly contextValue: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly problem?:ProblemClass,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    console.log(`contest tree item ${label} ${contextValue}`);
    this.contextValue = contextValue;
    this.problem=problem;
    this.command = command;
  }
}