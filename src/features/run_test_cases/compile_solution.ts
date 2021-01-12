import * as vscode from "vscode";
const fs = require("fs");
import { exec } from "child_process";
import {reportError} from "./report_error";

export const compileFile = async (
    solutionFilePath: string,
    testsFolderPath: string
): Promise<any> => {

    if (fs.existsSync(`${testsFolderPath}result.txt`)) {
        fs.unlink(`${testsFolderPath}result.txt`, (err: any) => {
            console.log(err);
        });
    }
    if (fs.existsSync(`${testsFolderPath}error.txt`)) {
        fs.unlink(`${testsFolderPath}error.txt`, (err: any) => {
            console.log(err);
        });
    }
    
    const compilationLanguage = vscode.workspace
        .getConfiguration("codepal")
        .get<String>("compilationLanguage");

    if(compilationLanguage === "python" || compilationLanguage === "python3") {
        return new Promise((resolve, reject) => {
            resolve("");
        });
    }
    
    let compileCommand: string;
    let compilationFlags: String | undefined;
    switch (compilationLanguage) {
        case "g++":
            compilationFlags = vscode.workspace
                .getConfiguration("codepal")
                .get<String>("g++ CompilationFlags");
            compileCommand = `g++ "${solutionFilePath}" ${compilationFlags}`;
            break;
        
        case "gcc":
            compilationFlags = vscode.workspace
                .getConfiguration("codepal")
                .get<String>("gccCompilationFlags");
            compileCommand = `gcc "${solutionFilePath}" ${compilationFlags}`;
            break;

        case "java": 
            compilationFlags = vscode.workspace
                .getConfiguration("codepal")
                .get<String>("javaCompilationFlags");
            compileCommand = `javac "${solutionFilePath}" ${compilationFlags}`;
            break;

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }

    try {
        return new Promise(async (resolve, reject) => {
            exec(
            compileCommand,
            async (error: any, stdout: any, stderr: any) => {
                if (error) {
                    // console.log(`Compilation Error: \n${error.message}`);
                    await reportError(error.message, "Compilation", testsFolderPath);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    // console.log(`stderr: ${stderr}`);
                    await reportError(stderr, "Compilation", testsFolderPath);
                    reject(stderr);
                    return;
                }
                // console.log("Compilation Done.");
                vscode.window.showInformationMessage("Compilation Done.");
                resolve(stdout);
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }
};