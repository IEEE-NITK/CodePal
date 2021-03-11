import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";

export const copyContestURL = async (
    contest: ContestClass | undefined
): Promise<void> => {
    if (contest === undefined) {
        return;
    }
    try {
        vscode.env.clipboard.writeText(contest.contestLink);
        vscode.window.showInformationMessage("Contest URL copied successfully");
    }
    catch (err) {
        vscode.window.showErrorMessage("Could not copy contest URL to clipboard.\nUnknown error occurred");
    }
};