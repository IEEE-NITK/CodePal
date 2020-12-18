import * as vscode from "vscode";
import { ContestsProvider } from "./data_providers/contests/contest_data_provider";
import { ProblemsProvider } from "./data_providers/problems/problem_data_provider";
import { createContestDirectories } from "./utils/utils";
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "codepal" is now active!');
  let disposable: vscode.Disposable[];
  disposable = [
    vscode.commands.registerCommand("codepal.helloWorld", () => {
      vscode.window.showInformationMessage("Namaste World from IEEE/CodePal!");
    }),
  ];
  disposable.push(
    vscode.commands.registerCommand("codepal.fetchContests", () => {
      vscode.window.showInformationMessage("Fetch Contests");
    })
  );
  disposable.push(
    vscode.commands.registerCommand(
      "codepal.createContestDirectories",
      (contestID: string,rootPath: string='/') => {
        createContestDirectories(contestID,rootPath);
      }
    )
  );

  disposable.push(
    vscode.window.registerTreeDataProvider(
      "codepalContests",
      new ContestsProvider(vscode.workspace.workspaceFolders?vscode.workspace.workspaceFolders[0].uri.fsPath+'/':'/')
    )
  );
  disposable.push(
    vscode.window.registerTreeDataProvider(
      "codepalProblems",
      new ProblemsProvider(vscode.workspace.workspaceFolders?vscode.workspace.workspaceFolders[0].uri.fsPath+'/':'/')
    )
  );
  context.subscriptions.push(...disposable);
}

export function deactivate() {}
