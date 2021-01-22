import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";
import {promises as fs} from "fs";
import { createProblemDirectory } from "./problem_folder_creation";

export const createContestDirectory = async (
    contest: ContestClass| undefined,
    rootPath: string
): Promise<void> => {

    if(contest === undefined) {
        return;
    }

    if(contest.problems.length === 0) {
        await contest.init();
    } 
    
    let contestName : string = contest.name;
    contestName = contestName.replace(/[^a-zA-Z 0-9.]+/g,''); // replacing special characters to fit naming convention
    const folderPath = rootPath +  `${contestName}/`;

    try {
        await fs.mkdir(folderPath);

        contest.problems.forEach(async (problem) =>{
            await createProblemDirectory(problem, folderPath);
        });
        vscode.window.showInformationMessage('Contest folder created Successfully');
    }
    catch(err) {
        if(err.code === "EEXIST") {
            vscode.window.showErrorMessage('Contest folder already exists');
        }
        else {
            vscode.window.showErrorMessage('Open a workspace to create problem folder');
        }
    }
};