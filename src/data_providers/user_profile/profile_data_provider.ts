import * as vscode from "vscode";
import { ProfileTreeItem } from "./profile_tree_item";

export class ProfileProvider
implements vscode.TreeDataProvider<ProfileTreeItem> {
    constructor(private workspaceRoot: string) {}

  private _onDidChangeTreeData: vscode.EventEmitter<
    ProfileTreeItem | undefined | void
  > = new vscode.EventEmitter<ProfileTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ProfileTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  getTreeItem(
      element: ProfileTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
      return element;
  }
  getChildren(
      element?: ProfileTreeItem
  ): vscode.ProviderResult<ProfileTreeItem[]> {
      return [];
  }
}
