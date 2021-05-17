import * as vscode from "vscode";
import { promises as fs } from "fs";
import { ErrorCodes } from "../../utils/consts";
import { getFileExtension, getTemplateCode } from "./problem_folder_creation";

export const manualProblemFolderCreation = async (
    folderPath: string,
    problemName: string = ""
): Promise<void> => {
    if(problemName === "") {
        problemName = await problemNameInput();
    }
    if(problemName === "") {
        vscode.window.showErrorMessage("No problem name entered.");
        return;
    }

    problemName = problemName.replace(/[^a-zA-Z 0-9.]+/g,'');
    problemName = problemName.replace(/[^a-zA-Z0-9]/g,'_');
    const problemFolderPath = folderPath + `${problemName}/`;
    
    const fileExtension = getFileExtension();
    
    const problemFilePath =
        problemFolderPath + `${problemName}.${fileExtension}`;

    const templateCode = await getTemplateCode();

    try {
        await fs.mkdir(problemFolderPath);

        fs.writeFile(problemFilePath, templateCode); // solution file
        vscode.window.showTextDocument(vscode.Uri.file(problemFilePath), {
            preview: false,
            preserveFocus: true,
        });
        vscode.window.showInformationMessage("Problem folder created successfully");
    } 
    catch (err) {
        if (err.code === ErrorCodes.folderExists) {
            vscode.window.showErrorMessage("Problem folder already exists");
        } else if(err.code === ErrorCodes.noAccessPermission) {
            vscode.window.showErrorMessage("No access permission.\nPlease open a folder in your workspace.");
        } else if(err.code === ErrorCodes.noWritePermission) {
            vscode.window.showErrorMessage("No write permission.\nPlease open a folder in your workspace.");
        } else{
            vscode.window.showErrorMessage("Could not create folder.\nUnknown error occurred");
        }
    }

    
};

const problemNameInput = async(): Promise<string> => {

    const problemName: string | undefined = await vscode.window.showInputBox({placeHolder: "Enter the name of the problem."});

    if(typeof(problemName) === "string") {
        return problemName;
    }

    return "";
};
