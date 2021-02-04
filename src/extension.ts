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
import { Command, TreeViewIDs } from "./utils/consts";
import { problemsFilterInput } from "./features/problems_list/problems_filter_input";
import { ProfileProvider } from "./data_providers/user_profile/profile_data_provider";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "codepal" is now active!');
    let disposable: vscode.Disposable[];
    const rootPath = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath + "/"
        : "/";

    const problemProvider = new ProblemsProvider(rootPath);
    const contestsProvider = new ContestsProvider(rootPath);
    const profileProvider = new ProfileProvider(rootPath);
    disposable = [
        vscode.commands.registerCommand(Command.helloWorld, () => {
            vscode.window.showInformationMessage("Namaste World from IEEE/CodePal!");
        }),
    ];
    disposable.push(
        vscode.commands.registerCommand(Command.getProblemFilters, () =>
            problemsFilterInput(problemProvider)
        ) // takes input for toRating, FromRatings and selected tags and then refreshes problem list with given filter
    );
    disposable.push(
        vscode.commands.registerCommand(Command.reloadProblems, () => {
            problemProvider.reload();
        })
    );
    disposable.push(
        vscode.commands.registerCommand(Command.reloadContests, () => {
            contestsProvider.reload();
        })
    );
    disposable.push(
        vscode.commands.registerCommand(
            Command.createContestDirectory,
            (param: ContestTreeItem) =>
                createContestDirectory(param.contest, rootPath)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.createProblemDirectory,
            (param: ProblemTreeItem) =>
                createProblemDirectory(param.problem, rootPath)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.createContestProblemDirectory,
            (param: ContestTreeItem) =>
                createProblemDirectory(param.problem, rootPath)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(Command.runTestCases, (param: any) =>
            runTestCases(String(param))
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.openProblemStatement,
            (param: any) => 
                openProblemStatement(String(param))
        )
    );
    disposable.push(
        vscode.commands.registerCommand(
            Command.submitProblem,
            async (param: any) => {
                await submitProblem(String(param));
            }
        )
    );

    disposable.push(
        vscode.commands.registerCommand(Command.addTestCases, (param: any) =>
            addTestCases(String(param))
        )
    );

    disposable.push(
        vscode.window.registerTreeDataProvider(
            TreeViewIDs.contests,
            contestsProvider
        )
    );
    disposable.push(
        vscode.window.registerTreeDataProvider(
            TreeViewIDs.problems,
            problemProvider
        )
    );
    disposable.push(
        vscode.window.registerTreeDataProvider(
            TreeViewIDs.profile,
            profileProvider
        )
    );
    context.subscriptions.push(...disposable);
}
export function deactivate() {}
