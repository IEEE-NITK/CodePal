import * as vscode from "vscode";
import { ContestsProvider } from "./data_providers/contests/contest_data_provider";
import { ContestTreeItem } from "./data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "./data_providers/problems/problem_tree_item";
import { ProblemsProvider } from "./data_providers/problems/problem_data_provider";
import { copyContestURL } from "./features/copy_url/copy_contest_url";
import { copyProblemURL } from "./features/copy_url/copy_problem_url";
import { createContestDirectory } from "./features/folder_creation/contest_folder_creation";
import { createProblemDirectory } from "./features/folder_creation/problem_folder_creation";
import { runTestCases } from "./features/run_test_cases/run_test_cases";
import { addTestCases } from "./features/run_test_cases/add_test_cases";
import { submitProblem } from "./features/submit_problem/submit_problem";
import { openProblemStatement } from "./features/open_problem_statement/open_problem_statement";
import { openProblemURL } from "./features/open_problem_statement/open_problem_from_problem_list";
import { openContest } from "./features/open_problem_statement/open_contest";
import {
    CodepalConfig,
    codepalConfigName,
    stressTestingFlag,
    Command,
    TreeViewIDs,
    extensionPaths
} from "./utils/consts";
import { ProfileProvider } from "./data_providers/user_profile/profile_data_provider";
import { problemsFilterInput } from "./features/problems_list/problems_filter_input";
import { createStressTestingFiles } from "./features/stress_test/createStressTestingFiles";
import { stressTest } from "./features/stress_test/stress_test";
import { contestRegistration } from "./features/contest_registration/contest_registration";
import { manualProblemFolderCreation } from "./features/folder_creation/manual_problem_folder";
import { manualContestFolderCreation } from "./features/folder_creation/manual_contest_folder";
import { openAclDocumentation } from "./features/ACL/openAclDocumentation";
import { createAclCombinedFile } from "./features/ACL/createAclCombinedFile";

function initExtensionPaths(){
    let extensionPath:string|undefined = vscode.extensions.getExtension('IEEE-NITK.codepal')?.extensionUri.path;

    //TODO: maybe take this from the user through setttings. They might have their own edited atcoder library version
    if(extensionPath !== undefined){   
        extensionPaths.path = extensionPath;
        extensionPaths.expanderPyPath = extensionPath + '/res/library/expander.py';
        extensionPaths.libraryPath = extensionPath + '/res/library';
    }
    else{
        vscode.window.showErrorMessage('Unable to get path of Codepal extension');
    }
};
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "codepal" is now active!');
    let disposable: vscode.Disposable[];
    const rootPath = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath + "/"
        : "/";

    initExtensionPaths();
    let aclSupportEnabled:boolean = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<boolean>(CodepalConfig.enableAclSupport, false);
    
    const problemProvider = new ProblemsProvider(rootPath);
    const contestsProvider = new ContestsProvider(rootPath);
    const profileProvider = new ProfileProvider(rootPath);
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (
            event.affectsConfiguration(
                codepalConfigName + "." + CodepalConfig.codeforcesHandle
            )
        ) {
            profileProvider.refresh();
        }
    });
    disposable = [
        vscode.commands.registerCommand(Command.helloWorld, () => {
            vscode.window.showInformationMessage(
                "Namaste World from IEEE/CodePal!"
            );
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
            Command.copyContestURL,
            (param: ContestTreeItem) =>
                copyContestURL(param.contest)
        )
    );
    disposable.push(
        vscode.commands.registerCommand(
            Command.openContest,
            (param: ContestTreeItem) =>
                openContest(param.contest)
        )
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
            Command.registerContest,
            async (param: ContestTreeItem) => {
                await contestRegistration(param.contest);
            }
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.copyProblemURL,
            (param: ProblemTreeItem) =>
                copyProblemURL(param.problem)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.openProblemURL,
            (param: ProblemTreeItem) =>
                openProblemURL(param.problem)
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
            Command.manualProblemFolderCreation,
            () => manualProblemFolderCreation(rootPath)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.manualContestFolderCreation,
            () => manualContestFolderCreation(rootPath)
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
        vscode.commands.registerCommand(
            Command.openContestProblem,
            (param: ContestTreeItem) =>
                openProblemURL(param.problem)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.copyContestProblemURL,
            (param: ContestTreeItem) =>
                copyProblemURL(param.problem)
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
            (param: any) => openProblemStatement(String(param))
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
    vscode.commands.registerCommand(
        Command.createStressTestingFiles,
        (param: any) => createStressTestingFiles(param)
    );

    disposable.push(
        vscode.commands.registerCommand(Command.stressTest, (param: any) =>
            stressTest(param)
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.stopStressTesting,
            (param: any) => {
                stressTestingFlag.stop = true;
            }
        )
    );
        
    disposable.push(
        vscode.commands.registerCommand(
            Command.openAclDocumentation,
            (param: any) => openAclDocumentation()
        )
    );

    disposable.push(
        vscode.commands.registerCommand(
            Command.creatAclCombinedFile,
            (param: any) => createAclCombinedFile(param)
        )
    );
    
    context.subscriptions.push(...disposable);
}
export function deactivate() { }
