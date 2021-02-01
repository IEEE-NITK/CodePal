import * as vscode from "vscode";
const fs = require("fs");
import { exec } from "child_process";
import { reportError } from "./report_error";
import { Errors, OS } from "../../utils/consts";

import {
    CodepalConfig,
    codepalConfigName,
    CompilationFlags,
    CompilationLanguages,
} from "../../utils/consts";

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
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.compilationLanguage);

    switch (compilationLanguage) {
        case CompilationLanguages.gcc:
        case CompilationLanguages.cpp:
            if (os === OS.linuxMac) {
                // Command for linux
                executable = `${testsFolderPath}a.out`;
            } else if (os === OS.windows) {
                // Command for windows
                executable = `${testsFolderPath}a.exe`;
            } else {
                vscode.window.showErrorMessage("Operating System not supported.");
                return;
            }
            runCommand = `"${executable}" < "${inputFilePath}" > "${codeOutputFilePath}"`;
            break;

        case CompilationLanguages.python:
        case CompilationLanguages.python2:
        case CompilationLanguages.python3:
            const compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.python);
            executable = "python.exe";
            runCommand = `${compilationLanguage} "${solutionFilePath}" ${compilationFlags} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            break;

        case CompilationLanguages.java:
            executable = solutionFilePath.slice(
                solutionFilePath.lastIndexOf("/") + 1,
                solutionFilePath.lastIndexOf(".")
            );
            const javaClassPath: string = solutionFilePath.slice(
                0,
                solutionFilePath.lastIndexOf("/")
            );
            runCommand = `java -cp "${javaClassPath}" ${executable} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            executable = "java.exe";
            break;

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }

    return Promise.race([
        runTests(runCommand, testsFolderPath, stderrFilePath),
        timeoutPromise,
    ])
        .then((result) => {
            clearTimeout(timeoutHandle);
            return result;
        })
        .catch(async (error) => {
            if (error ===Errors.timeLimitExceeded) {
                vscode.window.showErrorMessage("Time limit exceeded!!");
                if (os === OS.windows) {
                    // Kill the executing process on windows
                    exec(
                        `taskkill /F /IM ${executable}`,
                        (error: any, stdout: any, stderr: any) => {
                            if (error) {
                                console.log(
                                    `Could not kill timed out process.\nError: ${error.message}`
                                );
                            }
                            if (stderr) {
                                console.log(
                                    `Could not kill timed out process.\nstderr: ${stderr}`
                                );
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

                resolve(stdout);
            });
        });
    } catch (err) {
        console.log("Run time error: " + err);
    }
};
