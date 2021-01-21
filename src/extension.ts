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
import { Command} from "./utils/consts";
import { filterProblems } from "./features/problems_list/problems_filter_input";

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
  const contestsProvider = new ContestsProvider(rootPath);
  disposable = [
    vscode.commands.registerCommand(Command.helloWorld, () => {
      vscode.window.showInformationMessage("Namaste World from IEEE/CodePal!");
    }),
  ];
  disposable.push(
    vscode.commands.registerCommand("codepal.getProblemFilters", filterProblems.bind(problemProvider))
  );
  disposable.push(
    vscode.commands.registerCommand("codepal.reloadProblems", () => {
      problemProvider.reload();
    })
  );
  disposable.push(
    vscode.commands.registerCommand("codepal.reloadContests", () => {
      contestsProvider.reload();
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
      "codepal.runTestCases",
      (param: any) => {
        // console.log("Run test cases icon parameter : " + String(param));
        runTestCases(String(param));
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
      "codepal.addTestCases",
      (param: any) => {
        console.log("Add test cases icon parameter : " + String(param));
        addTestCases(String(param));
      }
    )
  );

  disposable.push(
    vscode.window.registerTreeDataProvider(
      "codepalContests",
      contestsProvider
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
