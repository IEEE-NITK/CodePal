import * as vscode from "vscode";
import { promises as fs } from "fs";
import { ErrorCodes } from "../../utils/consts";
import { manualProblemFolderCreation } from "./manual_problem_folder";

export const manualContestFolderCreation = async (
    folderPath: string
): Promise<void> => {

    let contestName: string = await contestNameInput();
    if(contestName === "") {
        vscode.window.showErrorMessage("No contest name entered.");
        return;
    }
    contestName = contestName.replace(/[^a-zA-Z 0-9.]+/g,''); // replacing special characters to fit naming convention

    const inputNumberOfProblems: string = await numberInput();
    if(inputNumberOfProblems === "") {
        // vscode.window.showErrorMessage("Number of problems not entered.");
        return;
    }
    let numberOfProblems = parseInt(String(inputNumberOfProblems));

    const contestFolderPath: string = folderPath + `${contestName}/`;

    try {
        await fs.mkdir(contestFolderPath);

        for(let problemId = 1; problemId <= numberOfProblems; problemId++) {
            vscode.window.setStatusBarMessage("Creating Contest Folder...",1000);
            await manualProblemFolderCreation(contestFolderPath, `problem${problemId}`);
        }
        vscode.window.showInformationMessage('Contest folder created Successfully');
    }
    catch(err) {
        if(err.code === ErrorCodes.folderExists) {
            vscode.window.showErrorMessage('Contest folder already exists');
        }else if(err.code ===ErrorCodes.noWritePermission) {
            vscode.window.showErrorMessage("Please open a folder in your workspace");
        }else {
            vscode.window.showErrorMessage("Could not create folder.\nUnknown error occurred");
        }
    }
};

const contestNameInput = async(): Promise<string> => {

    const contestName: string | undefined = await vscode.window.showInputBox({placeHolder: "Enter the name of the contest."});

    if(typeof(contestName) === "string") {
        return contestName;
    }

    return "";
};

const numberInput = async(): Promise<string> => {

    const numberOfProblems: string | undefined = await vscode.window.showInputBox({placeHolder: "Enter the number of problems in the contest."});


    if(typeof(numberOfProblems) === "string" && isNum(numberOfProblems)) {
        return numberOfProblems;
    }
    else if(typeof(numberOfProblems) === "string" && !isNum(numberOfProblems)) {
        vscode.window.showErrorMessage("Invalid input to number of problems.");
        return "";
    }
    else {
        vscode.window.showErrorMessage("Number of problems not entered.");
        return "";
    }
    
};

const isNum = (val:string) => /^\d+$/.test(val); // check if a string has only digits