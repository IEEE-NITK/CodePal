import * as open from "open";
import * as vscode from "vscode";
import {platform} from "os";
import * as fs from "fs";
import {Utils} from "../../utils/utils";
export const openProblemStatement = (path: string) => {
  try {
    path = Utils.pathRefine(path, platform() === "linux" ? 0 : 1);
    const jsonPath = path.substr(0, path.lastIndexOf("/")) + `/.problem.json`;
    const jsonData = JSON.parse(fs.readFileSync(jsonPath).toString());
    open(
      `https://codeforces.com/contest/${jsonData["contestID"]}/problem/${jsonData["index"]}`
    );
    vscode.window.showInformationMessage("opened problem statement");
  } catch (err) {
    console.log(err);
    vscode.window.showErrorMessage(err);
  }
};
