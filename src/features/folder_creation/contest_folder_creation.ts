import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";
import {promises as fs} from "fs";
import { createProblemDirectory } from "./problem_folder_creation";

export const createContestDirectory = async (
    contest: ContestClass| undefined,
    rootPath: string
): Promise<void> => {

    if(contest === undefined) {
        console.log('Empty ContestClass object');
        return;
    }

    if(contest.problems.length === 0) {
        await contest.init();
    } 

    const folderPath = rootPath +  `${contest.name}/`;

    try {
        await fs.mkdir(folderPath);

        contest.problems.forEach(async (problem) =>{
            await createProblemDirectory(problem, folderPath);
        });
        console.log('Contest folder created successfully');
        vscode.window.showInformationMessage('Contest folder created Successfully');
    }
    catch(err) {
        if(err.code === "EEXIST") {
            console.log('Contest already exists');
            vscode.window.showInformationMessage('Contest folder already exists');
        }
        else {
            console.log('Unkown error');
            vscode.window.showInformationMessage('Could not create folder');
        }
    }
};