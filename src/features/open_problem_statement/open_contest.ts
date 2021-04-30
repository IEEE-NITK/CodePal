import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";

export const openContest = async (
    contest: ContestClass | undefined
): Promise<void> => {
    if (contest === undefined) {
        return;
    }
    try {
        vscode.env.openExternal(vscode.Uri.parse(contest.contestLink, true));
        vscode.window.showInformationMessage("Opened contest page");
    }
    catch (err) {
        vscode.window.showErrorMessage("Could not open contest page.\nUnknown error occurred. Try copying contest URL.");
    }
};