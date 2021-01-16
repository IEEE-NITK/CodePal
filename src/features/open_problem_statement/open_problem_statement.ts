import * as vscode from "vscode";
import {platform} from "os";
import * as fs from "fs";
import {OS, Utils} from "../../utils/utils";
export const openProblemStatement = (path: string) => {
  try {
    path = Utils.pathRefine(path, platform() === "linux" ? OS.linux : OS.windows);
    const jsonPath = path.substr(0, path.lastIndexOf("/")) + `/.problem.json`;
    const jsonData = JSON.parse(fs.readFileSync(jsonPath).toString());
    vscode.env.openExternal(vscode.Uri.parse(`https://codeforces.com/contest/${jsonData["contestID"]}/problem/${jsonData["index"]}`, true));
    vscode.window.showInformationMessage("Opened problem statement");
  } catch (err) {
    console.log(err);
    vscode.window.showErrorMessage(err);
  }
};
