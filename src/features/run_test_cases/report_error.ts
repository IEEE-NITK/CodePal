import * as vscode from "vscode";
const fs = require("fs");

export const reportError = async (
    error: string,
    errorType: string,
    testsFolderPath: string
  ): Promise<void> => {
    const click: string | undefined = await vscode.window.showErrorMessage(
      `${errorType} Error!!!`,
      "Show Error"
    );
    if (click === "Show Error") {
      const errorFilePath: string = `${testsFolderPath}error.txt`;
      fs.writeFileSync(errorFilePath, error, (err: any) => {
        if (err) {
          vscode.window.showErrorMessage("Could not display error message.");
        }
      });
      vscode.window.showTextDocument(vscode.Uri.file(errorFilePath), {
        preview: false,
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true,
      });
    }
  };