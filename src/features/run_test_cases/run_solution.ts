import * as vscode from "vscode";
const fs= require("fs");
import { exec } from "child_process";
import {reportError} from "./report_error";

export const runTestsWithTimeout = async (
    solutionFilePath: string,
    inputFilePath: string,
    codeOutputFilePath: string,
    testsFolderPath: string,
    stderrFilePath: string,
    os: number
): Promise<any> => {

    let timeoutHandle: NodeJS.Timeout;
    // Declaring a promise that rejects after 6s
    const timeoutPromise = new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(() => reject("Time limit exceeded"), 6000);
    });

    let runCommand: string;
    let executable: string;

    const compilationLanguage = vscode.workspace
        .getConfiguration("codepal")
        .get<String>("compilationLanguage");

    switch(compilationLanguage) {
        case "gcc":
        case "g++":
            if(os === 0) {
                // Command for linux
                executable = `./a.out`;
            }
            else if(os === 1) {
                // Command for windows
                executable = `a.exe`;
            }
            else {
                vscode.window.showErrorMessage("Operating System not supported.");
                return;
            }
            runCommand = `${executable} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            break;

        case "python":
        case "python3":
            const compilationFlags = vscode.workspace
                .getConfiguration("codepal")
                .get<String>("pythonCompilationFlags");
            executable = 'python.exe';
            runCommand = `${compilationLanguage} "${solutionFilePath}" ${compilationFlags} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            break;

        case "java":
            executable = solutionFilePath.slice(
                solutionFilePath.lastIndexOf('/') + 1, 
                solutionFilePath.lastIndexOf('.')
            );
            runCommand = `java ${executable} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            break;

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }
  
    return Promise.race([
        runTests(
            runCommand,
            testsFolderPath,
            stderrFilePath,
        ),
        timeoutPromise,
    ])
    .then((result) => {
        clearTimeout(timeoutHandle);
        return result;
    })
    .catch(async (error) => {
        // console.log("Inside catch block of runTestsWithTimeout : " + error);
        if (error === "Time limit exceeded") {
            vscode.window.showErrorMessage("Time limit exceeded!!");
            if (os === 1) {
                // Kill the executing process on windows
                exec(
                    `taskkill /F /IM ${executable}`,
                    (error: any, stdout: any, stderr: any) => {
                        if (error) {
                            console.log(`Could not kill timed out process.\nError: ${error.message}`);
                        }
                        if (stderr) {
                            console.log(`Could not kill timed out process.\nstderr: ${stderr}`);
                        }
                    }
                );
            }
        }
        return "Run time error";
    });
};
  
const runTests = async (
    runCommand: string,
    testsFolderPath: string,
    stderrFilePath: string
): Promise<any> => {
  
    try {
        return new Promise(async (resolve, reject) => {
            exec(runCommand, async (error: any, stdout: any, stderr: any) => {
                if (error) {
                    console.log(`Runtime Error: ${error}`);
                    await reportError(error.message, "Run Time", testsFolderPath);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    fs.writeFileSync(stderrFilePath, stderr, (err: any) => {
                        if (err) {
                            vscode.window.showErrorMessage("Could not write stderr.");
                        }
                    });
                } else if (fs.existsSync(stderrFilePath)) {
                    fs.unlinkSync(stderrFilePath, (err: any) => {
                        console.log(err);
                    });
                }
                // console.log("Output Written.");
                resolve(stdout);
            });
        });
    } 
    catch (err) {
        console.log("Run time error: " + err);
    }
};