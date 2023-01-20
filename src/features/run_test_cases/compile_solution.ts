import * as vscode from "vscode";
const fs = require("fs");
import { exec } from "child_process";
import { reportError } from "./report_error";
import { platform } from "os";
import {
    codepalConfigName,
    CodepalConfig,
    CompilationFlags,
    CompilationLanguages,
    extensionPaths
} from "../../utils/consts";

export const compileFile = async (
    solutionFilePath: string,
    testsFolderPath: string,
    outputFileName: string = 'a'
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
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.compilationLanguage);

    if (
        compilationLanguage === CompilationLanguages.python ||
        compilationLanguage === CompilationLanguages.python2 ||
        compilationLanguage === CompilationLanguages.python3
    ) {
        return new Promise((resolve, reject) => {
            resolve("");
        });
    }

    let aclSupportEnabled:boolean = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<boolean>(CodepalConfig.enableAclSupport, false);
                        
    let compileCommand: string;
    let compilationFlags: String | undefined;
    switch (compilationLanguage) {
        case CompilationLanguages.cpp:
            compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.cpp);
            
            if(aclSupportEnabled === true){
                compilationFlags += ` -I "${extensionPaths.libraryPath}"`;
            }

            if(platform() === "win32"){
                compileCommand = `g++ -o "${testsFolderPath}${outputFileName}.exe" "${solutionFilePath}" ${compilationFlags}`;
            }
            else{
                compileCommand = `g++ -o "${testsFolderPath}${outputFileName}.out" "${solutionFilePath}" ${compilationFlags}`;
            }
            break;
        
        case CompilationLanguages.gcc:
            compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.gcc);
            
            if(platform() === "win32"){
                compileCommand = `gcc -o "${testsFolderPath}${outputFileName}.exe" "${solutionFilePath}" ${compilationFlags}`;
            }
            else{
                compileCommand = `gcc -o "${testsFolderPath}${outputFileName}.out" "${solutionFilePath}" ${compilationFlags}`;
            }
            break;

        case CompilationLanguages.java:
            compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.java);
            compileCommand = `javac "${solutionFilePath}" ${compilationFlags}`;
            break;
        
        case CompilationLanguages.kotlin:
            compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.kotlin);
            compileCommand = `kotlinc "${solutionFilePath}" -include-runtime -d "${testsFolderPath}${outputFileName}.jar" ${compilationFlags}`;
            break;
        case CompilationLanguages.haskell:
            compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.haskell);
            if(platform() === "win32"){
                compileCommand = `ghc -o "${testsFolderPath}${outputFileName}.exe" "${solutionFilePath}" ${compilationFlags}`;
            }
            else{
                compileCommand = `ghc -o "${testsFolderPath}${outputFileName}.out" "${solutionFilePath}" ${compilationFlags}`;
            }
            break;
        case CompilationLanguages.rust:
            compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.rust);
            if(platform() === "win32"){
                compileCommand = `rustc -o "${testsFolderPath}${outputFileName}.exe" "${solutionFilePath}" ${compilationFlags}`;
            }
            else{
                compileCommand = `rustc -o "${testsFolderPath}${outputFileName}.out" "${solutionFilePath}" ${compilationFlags}`;
            }
            break;

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }

    try {
        return new Promise(async (resolve, reject) => {
            exec(compileCommand, async (error: any, stdout: any, stderr: any) => {
                if (error) {
                    await reportError(error.message, "Compilation", testsFolderPath);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    await reportError(stderr, "Compilation", testsFolderPath);
                    reject(stderr);
                    return;
                }
                vscode.window.setStatusBarMessage("Compilation Done",2000);
                resolve(stdout);
            });
        });
    } catch (err) {
        console.log(err);
    }
};
