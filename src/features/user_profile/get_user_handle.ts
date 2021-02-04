import * as vscode from "vscode";
import { ProfileProvider } from "../../data_providers/user_profile/profile_data_provider";
import { CodepalConfig, codepalConfigName } from "../../utils/consts";
export const getUserHandle = async (profileProvider: ProfileProvider) => {
    let userHandle = await vscode.window.showInputBox({
        placeHolder: "Enter your user handle",
    });
    if (userHandle) {
        let config=vscode.workspace
            .getConfiguration(codepalConfigName);
        // config.set(CodepalConfig.codeforcesHandle, userHandle);
        profileProvider.refresh();
    }
};
