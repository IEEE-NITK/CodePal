import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { promises as fs } from "fs";
import { readFileSync as fs_readFileSync } from "fs";
import { fetchTestCases } from "./test_cases_fetch";
import { CodepalConfig, codepalConfigName, CompilationLanguages, ErrorCodes } from "../../utils/consts";

let templateCode = ""; // will hold the code that is stored in the path given in settings

export const getTemplateCode = async () => {
    const templatePath = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<string>(CodepalConfig.codeTemplatePath);
    let data = "";
    try {
        if (templatePath) {
            data = fs_readFileSync(templatePath, "ascii").toString();
        }
    } catch (err) {
        if (err.code === ErrorCodes.notFound) {
            vscode.window.showErrorMessage("Template path specied does not exist.");
        } else {
            vscode.window.showErrorMessage("Error reading template code.");
        }
    }

    return data;
};

export const getFileExtension = (): string => {

    const compilationLanguage = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.compilationLanguage);
    
    let fileExtension: string;
    switch(compilationLanguage) {
        case CompilationLanguages.gcc:
            fileExtension = 'c';
            break;

        case CompilationLanguages.cpp:
            fileExtension = 'cpp';
            break;

        case CompilationLanguages.python:
        case CompilationLanguages.python2:
        case CompilationLanguages.python3:
            fileExtension = 'py';
            break;

        case CompilationLanguages.java:
            fileExtension = 'java';
            break;

        case CompilationLanguages.kotlin:
            fileExtension = 'kt';
            break;
        
        case CompilationLanguages.haskell:
            fileExtension = 'hs';
            break;

        case CompilationLanguages.rust:
            fileExtension = 'rs';
            break;

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }

    return fileExtension;
};

export const createProblemDirectory = async (
    problem: ProblemClass | undefined,
    folderPath: string
): Promise<void> => {
    if (problem === undefined) {
        return;
    }
    let problemName : string = problem.name;
    problemName = problemName.replace(/[^a-zA-Z 0-9.]+/g,'');
    problemName = problemName.replace(/[^a-zA-Z0-9]/g,'_');
    const problemFolderPath = folderPath + `${problem.index}_${problemName}/`;

    const fileExtension = getFileExtension();

    const problemFilePath =
        problemFolderPath + `${problem.index}_${problemName}.${fileExtension}`;

    templateCode = await getTemplateCode();

    try {
        await fs.mkdir(problemFolderPath);
        // creating .json
        fs.writeFile(
            problemFolderPath + ".problem.json",
            JSON.stringify({
                contestID: problem.contestID,
                index: problem.index,
            })
        );
        fs.writeFile(problemFilePath, templateCode); // solution file

        await fetchTestCases(problem, problemFolderPath); // Fetch tests cases into the problem folder

        vscode.window.showTextDocument(vscode.Uri.file(problemFilePath), {
            preview: false,
            preserveFocus: true,
        });
        vscode.window.showInformationMessage("Problem folder created successfully");
    } 
    catch (err) {
        if (err.code === ErrorCodes.folderExists) {
            vscode.window.showErrorMessage("Problem folder already exists.");
        } else if(err.code === ErrorCodes.noAccessPermission) {
            vscode.window.showErrorMessage("No access permission.\nPlease open a folder in your workspace.");
        } else if(err.code === ErrorCodes.noWritePermission) {
            vscode.window.showErrorMessage("No write permission.\nPlease open a folder in your workspace.");
        } else{
            vscode.window.showErrorMessage("Could not create folder.\nUnknown error occurred");
        }
    }
};
