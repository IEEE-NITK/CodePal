import * as vscode from "vscode";
import { ContestsProvider } from "./data_providers/contests/contest_data_provider";
import { ContestTreeItem } from "./data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "./data_providers/problems/problem_tree_item";
import { ProblemsProvider } from "./data_providers/problems/problem_data_provider";
import { createContestDirectory } from "./features/folder_creation/contest_folder_creation";
import { createProblemDirectory } from "./features/folder_creation/problem_folder_creation";
import { runTestCases } from "./features/run_test_cases/run_test_cases";
import { addTestCases } from "./features/run_test_cases/add_test_cases";
import { submitProblem } from "./features/submit_problem/submit_problem";
import { openProblemStatement } from "./features/open_problem_statement/open_problem_statement";

const tagOR:string = "*combine tags by OR";
const allTags:string[] = [tagOR,"2-sat","binary search","bitmasks","brute force","chinese remainder theorem","combinatorics","constructive algorithms","data structures","dfs and similar","divide and conquer","dp","dsu","expression parsing","fft","flows","games","geometry","graph matchings","graphs","greedy","hashing","implementation","interactive","math","matrices","meet-in-the-middle","number theory","probabilities","schedules","shortest paths","sortings","string suffix structures","strings","ternary search","trees","two pointers"];
const isNum = (val:string) => /^\d+$/.test(val); // check if a string has only digits

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

        if(toRating==="" || !isNum(toRating)){
          toRating = "4000";
        }
        if(fromRating==="" || !isNum(fromRating)){
          fromRating = "0";
        }

        const quickPick = vscode.window.createQuickPick();
        quickPick.items = allTags.map(label => ({ label }));
        quickPick.canSelectMany = true;
        
        quickPick.onDidAccept(() => {

          quickPick.selectedItems.forEach(item => {
            tags.push(item.label);
            console.log(item.label);
          });

          quickPick.hide();

          problemProvider.refresh(parseInt(String(fromRating)),parseInt(String(toRating)),tags);
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
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
    vscode.commands.registerCommand(
      "codepal.runTestCasesLinux",
      (param: any) => {
        // console.log("Run test cases icon parameter : " + String(param));
        runTestCases(String(param), 0);
      }
    )
  );

  disposable.push(
    vscode.commands.registerCommand(
      "codepal.runTestCasesWindows",
      (param: any) => {
        // console.log("Run test cases icon parameter : " + String(param));
        runTestCases(String(param), 1);
      }
    )
  );
  disposable.push(
    vscode.commands.registerCommand(
      "codepal.openProblemStatement",
      (param: any) => {
        openProblemStatement(String(param));
      }
    )
  );
  disposable.push(
    vscode.commands.registerCommand(
      "codepal.submitProblem",
      async (param: any) => {
        await submitProblem(String(param));
      }
    )
  );

  disposable.push(
    vscode.commands.registerCommand(
      "codepal.addTestCasesLinux",
      (param: any) => {
        console.log("Add test cases icon parameter : " + String(param));
        addTestCases(String(param), 0);
      }
    )
  );
  disposable.push(
    vscode.commands.registerCommand(
      "codepal.addTestCasesWindows",
      (param: any) => {
        console.log("Add test cases icon parameter : " + String(param));
        addTestCases(String(param), 1);
      }
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
