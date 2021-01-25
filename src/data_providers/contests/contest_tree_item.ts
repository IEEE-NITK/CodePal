import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";
import { ProblemClass } from "../../classes/problem";

export class ContestTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly contextValue: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type:string='',
        public readonly contest?:ContestClass|undefined,
        public readonly problem?:ProblemClass|undefined, 
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.contextValue = contextValue;
        this.type=type;
        this.contest=contest;
        this.command = command;
    }
}