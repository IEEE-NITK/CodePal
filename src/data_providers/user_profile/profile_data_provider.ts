import * as vscode from "vscode";
import { fetchUserInfoApi } from "../../features/user_profile/fetch_user_info_api";
import {
    CodepalConfig,
    codepalConfigName,
    Command,
    ProfileTreeEnum,
} from "../../utils/consts";
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
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    getChildren(
        element?: ProfileTreeItem
    ): vscode.ProviderResult<ProfileTreeItem[]> {
        if (!element) {
            const codeforcesHandle = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<string>(CodepalConfig.codeforcesHandle);
            if (codeforcesHandle) {
                return fetchUserInfoApi(codeforcesHandle);
            }
        }
        return [
            new ProfileTreeItem(
                `No Handle Entered: Please click here to enter the handle`,
                ProfileTreeEnum.codeforcesHandleUndefined,
                vscode.TreeItemCollapsibleState.None,
            ),new ProfileTreeItem(
                "Handle can also be entered from settings",
                ProfileTreeEnum.codeforcesHandleUndefined,
                vscode.TreeItemCollapsibleState.None,
                {
                    'title': 'UserHandleUndefined',
                    'command': Command.getUserHandle
                }
            ),
        ];
    }
}
