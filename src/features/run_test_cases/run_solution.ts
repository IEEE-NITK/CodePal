import * as vscode from "vscode";
const fs = require("fs");
import { exec } from "child_process";
import { reportError } from "./report_error";
import { Errors, OS, tle } from "../../utils/consts";

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
    os: number,
    executableFileName: string = 'a',
    commandLineArguments: string = '',
): Promise<any> => {
    let timeoutHandle: NodeJS.Timeout;
    // Declaring a promise that rejects after 6s
    const timeoutPromise = new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(() => reject(Errors.timeLimitExceeded), 6000);
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
                executable = `${executableFileName}.out`;
            } else if (os === OS.windows) {
                // Command for windows
                executable = `${executableFileName}.exe`;
            } else {
                vscode.window.showErrorMessage("Operating System not supported.");
                return;
            }
            runCommand = `"${testsFolderPath}${executable}" ${commandLineArguments} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            break;

        case CompilationLanguages.python:
        case CompilationLanguages.python2:
        case CompilationLanguages.python3:
            const compilationFlags = vscode.workspace
                .getConfiguration(codepalConfigName)
                .get<String>(CompilationFlags.python);
            executable = (os === OS.windows)
                ? `python.exe`
                : `${compilationLanguage}`;

            runCommand = `${compilationLanguage} "${solutionFilePath}" ${commandLineArguments} ${compilationFlags} < "${inputFilePath}" > "${codeOutputFilePath}"`;
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
            runCommand = `java -cp "${javaClassPath}" ${executable} ${commandLineArguments} < "${inputFilePath}" > "${codeOutputFilePath}"`;
            executable = (os === OS.windows)
                ? "java.exe"
                : "java";
            break;

        case CompilationLanguages.kotlin:
            // const kotlinClassPath: string = solutionFilePath.slice(
            //     0,
            //     solutionFilePath.lastIndexOf("/")
            // );
            // console.log(kotlinClassPath);
            runCommand = `java -jar "${testsFolderPath}${executableFileName}.jar" < "${inputFilePath}" > "${codeOutputFilePath}"`;
            executable = (os === OS.windows)
                ? "java.exe"
                : "java";
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
            if (error === Errors.timeLimitExceeded) {
                tle.tleFlag = true;
                vscode.window.showErrorMessage("Time limit exceeded!!");
                let killCommand: string;
                killCommand = (os === OS.windows) 
                    ? `taskkill /F /IM ${executable}`
                    : `pkill -9 ${executable}`;
                // Kill the executing process
                exec(
                    killCommand,
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
                return Errors.timeLimitExceeded;
            }
            return Errors.runTimeError;
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
                    if(tle.tleFlag) {
                        return;
                    }
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
