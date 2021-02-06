import * as vscode from "vscode";

export class ProfileTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly contextValue: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.contextValue = contextValue;
        this.command = command;
    }
}