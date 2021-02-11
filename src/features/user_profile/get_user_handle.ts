import { platform } from "os";
import * as vscode from "vscode";
import * as fs from "fs";
import { ProfileProvider } from "../../data_providers/user_profile/profile_data_provider";
import { CodepalConfig, codepalConfigName, OS } from "../../utils/consts";
import path = require("path");
export const getUserHandle = async (profileProvider: ProfileProvider) => {
    let userHandle = await vscode.window.showInputBox({
        placeHolder: "Enter your user handle",
    });
    if (userHandle) {
        const os = platform() === "win32" ? OS.windows : OS.linuxMac;
        if (os === OS.linuxMac) {
            const rootPath = vscode.workspace.workspaceFolders
                ? vscode.workspace.workspaceFolders[0].uri.fsPath + "/"
                : "/";
            if (rootPath !== "/") {
                try {
                    if (!fs.existsSync(path.join(rootPath, ".vscode"))) {
                        try {
                            await fs.promises.mkdir(
                                path.join(rootPath, ".vscode")
                            );
                        } catch (e) {
                            console.log("error inside");
                        }
                    }
                    const settingsPath = path.join(
                        rootPath,
                        ".vscode",
                        "settings.json"
                    );
                    console.log(settingsPath);
                    if (!fs.existsSync(settingsPath)) {
                        await fs.promises.writeFile(
                            settingsPath,
                            JSON.stringify({})
                        );
                        console.log("written settings");
                    }
                    console.log("123");
                    const jsonData =await JSON.parse(
                        fs.readFileSync(settingsPath).toString()
                    );
                    console.log(jsonData);
                    jsonData[
                        `${codepalConfigName}.${CodepalConfig.codeforcesHandle}`
                    ] = userHandle;
                    console.log(JSON.stringify(jsonData));
                    await fs.promises.writeFile(
                        settingsPath,
                        JSON.stringify(jsonData)
                    );

                    console.log("1234");
                } catch (e) {
                    console.log(`error ${e}`);
                }
            }
        }
        profileProvider.refresh();
    }
};
