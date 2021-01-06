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
  const problemProvider = new ProblemsProvider(rootPath);
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
    vscode.commands.registerCommand("codepal.getProblemFilters", async() => {
      let fromRating = await vscode.window.showInputBox({placeHolder:"Enter the rating's lower limit. Leave blank for defaulting to 0."}); 
      let toRating = await vscode.window.showInputBox({placeHolder:"Enter the rating's upper limit. Leave blank for defaulting to 4000."}); 
      let tags : string[] = []; // read tags here with quick input and assign to the variable
      if(typeof(fromRating)==="string" && typeof(toRating)==="string"){
        if(toRating===""){
          toRating = "4000";
        }
        if(fromRating===""){
          fromRating = "0";
        }
        problemProvider.refresh(parseInt(fromRating),parseInt(toRating),tags);
      }

    })
  );
  disposable.push(
    vscode.commands.registerCommand("codepal.reloadProblems", () => {
      problemProvider.reload();
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
      problemProvider
    )
  );
  context.subscriptions.push(...disposable);
}

export function deactivate() {}
