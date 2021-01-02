import * as vscode from "vscode";
import { ContestsProvider } from "./data_providers/contests/contest_data_provider";
import { ContestTreeItem } from "./data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "./data_providers/problems/problem_tree_item";
import { ProblemsProvider } from "./data_providers/problems/problem_data_provider";
import { createContestDirectory } from "./features/folder_creation/contest_folder_creation";
import { createProblemDirectory } from "./features/folder_creation/problem_folder_creation";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "codepal" is now active!');
  let disposable: vscode.Disposable[];
  const rootPath = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath + "/"
    : "/";
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
      "codepal.createContestDirectory",
      (param: ContestTreeItem) =>
        createContestDirectory(param.contest, rootPath)
    )
  );

  disposable.push(
    vscode.commands.registerCommand(
      "codepal.createProblemDirectory",
      (param: ProblemTreeItem) =>
        createProblemDirectory(param.problem, rootPath)
    )
  );

  disposable.push(
    vscode.window.registerTreeDataProvider(
      "codepalContests",
      new ContestsProvider(rootPath)
    )
  );
  disposable.push(
    vscode.window.registerTreeDataProvider(
      "codepalProblems",
      new ProblemsProvider(rootPath)
    )
  );
  context.subscriptions.push(...disposable);
}

export function deactivate() {}
