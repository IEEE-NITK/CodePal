import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";

export const openProblemURL = async (
    problem: ProblemClass | undefined
): Promise<void> => {
    if (problem === undefined) {
        return;
    }
    try {
        vscode.env.openExternal(vscode.Uri.parse(problem.contestLink, true));
        vscode.window.showInformationMessage("Opened problem statement");
    }
    catch (err) {
        vscode.window.showErrorMessage("Could not open problem URL.\nUnknown error occurred. Try copying the URL instead.");
    }
};
