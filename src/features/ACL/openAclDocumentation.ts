import * as vscode from "vscode";
export const openAclDocumentation = () => {
    try {
        // TODO: add option for en and ja documentation
        vscode.env.openExternal(vscode.Uri.parse(`https://atcoder.github.io/ac-library/production/document_en/`, true));
        vscode.window.showInformationMessage("Opened ACL Documentation");
    } catch (err) {
        // vscode.window.showErrorMessage(err);
        console.log(err);
    }
};
