import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";

export const copyProblemURL = async (
    problem: ProblemClass | undefined
): Promise<void> => {
    if (problem === undefined) {
        return;
    }
    try {
        vscode.env.clipboard.writeText(problem.contestLink);
        vscode.window.showInformationMessage("Problem URL copied successfully");
    }
    catch (err) {
        vscode.window.showErrorMessage("Could not copy problem URL to clipboard.\nUnknown error occurred");
    }
};
