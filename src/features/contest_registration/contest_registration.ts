import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";

export const contestRegistration = async (path: ContestClass | undefined) => {
    try {
        if(path !== undefined){
            vscode.env.openExternal(vscode.Uri.parse(`https://codeforces.com/contestRegistration/${path.contestID}`, true));
        }
        vscode.window.showInformationMessage("Contest Registration page opened");
    } catch (err) {
        vscode.window.showErrorMessage(err);
    }
};