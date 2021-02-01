import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { promises as fs } from "fs";
import { readFileSync as fs_readFileSync } from "fs";
import { fetchTestCases } from "./test_cases_fetch";
import { CodepalConfig, codepalConfigName, CompilationLanguages, ErrorCodes } from "../../utils/consts";

let templateCode = ""; // will hold the code that is stored in the path given in settings

const getTemplateCode = async () => {
    const templatePath = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<string>(CodepalConfig.codeTemplatePath);
    let data = "";
    try {
        if (templatePath) {
            data = fs_readFileSync(templatePath, "ascii").toString();
        }
    } catch (e) {
        vscode.window.showErrorMessage("error fetching templatecode");
    }

    return data;
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

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }

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
            vscode.window.showErrorMessage("Problem folder already exists");
        } else if(err.code ===ErrorCodes.noWritePermission) {
            vscode.window.showErrorMessage("No write permission.\nPlease open a folder with write permissions.");
        } else{
            vscode.window.showErrorMessage("Could not create folder.\nUnknown error occurred");
        }
    }
};
