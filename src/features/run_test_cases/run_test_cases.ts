import * as vscode from "vscode";
const fs = require("fs");
const { exec } = require("child_process");


export const runTestCases = async function (
    filePath: string
): Promise<void> {
    // Code for running test cases and returning verdict
    console.log(filePath);
    let path = String(filePath);
    path = path.replace(/\%20/g, ' ');
    path = path.replace(/\%21/g, '!');
    path = path.replace(/\%28/g, '(');
    path = path.replace(/\%29/g, ')');
    path = path.replace(/\%23/g, '#');
    path = path.replace(/\%27/g, '\'');
    path = path.replace(/\%2C/g, ',');
    path = path.slice(7);
    console.log(path);

    if(!fs.existsSync(path)) {
        vscode.window.showErrorMessage("Problem solution file not found.");
        return;
    }

    const lastIndexOfSlash: number = path.lastIndexOf('/');
    const problemFolderPath: string = path.slice(0, lastIndexOfSlash+1);
    console.log(problemFolderPath);

    const testsFolderPath = problemFolderPath + "Tests/";

    if(!fs.existsSync(testsFolderPath)) {
        vscode.window.showErrorMessage("Tests not found.");
        // console.log("Tests not found.");
        return;
    }

    try {
        await compileFile(path, testsFolderPath);
    }
    catch(err) {
        console.log(err);
        return;
    }

    let i: number = 0;
    let passed: boolean = true;
    while(true) {
        const inputFilePath: string = `${testsFolderPath}Input ${i}.txt`;

        if(!fs.existsSync(inputFilePath)) {
            break;
        }

        const outputFilePath: string = `${testsFolderPath}Output ${i}.txt`;
        const codeOutputFilePath: string = `${testsFolderPath}code_output ${i}.txt`;

        // await fs.readFile(inputFilePath, 'utf8', function(err: any, data: any) { 
        //     // Display the file content 
        //     console.log(data); 
        // });
        // await fs.readFile(outputFilePath, 'utf8', function(err: any, data: any) { 
        //     // Display the file content 
        //     console.log(data); 
        // });

        try{
            await runTests(inputFilePath, codeOutputFilePath, testsFolderPath);

            let testResult: boolean = await compareOutputs(outputFilePath, codeOutputFilePath);
            console.log(testResult);

            if(testResult) {
                // vscode.window.showInformationMessage(`Test ${i} passed.`);
                // console.log(`Test ${i} passed.`);
            }
            else {
                // console.log(`Test ${i} failed.`);
                let input: string = await readFile(inputFilePath);
                let expectedOutput: string = await readFile(outputFilePath);
                let codeOutput: string = await readFile(codeOutputFilePath);
                const result: string = `Input ${i}: \n${input}\n\nExpected Output : \n${expectedOutput}\n\nObtained Output : \n${codeOutput}\n\n`;
                const click: string | undefined = await vscode.window.showErrorMessage(`Test ${i} failed`, "Open the Result");
                if(click === "Open the Result") {
                    const resultFilePath: string = `${testsFolderPath}result.txt`;
                    fs.appendFileSync(resultFilePath, result, (err: any) => {
                        if(err) {
                            vscode.window.showErrorMessage("Could not fetch result.");
                        }
                    });
                    vscode.window.showTextDocument(vscode.Uri.file(resultFilePath), {preview: false, viewColumn: vscode.ViewColumn.Beside, preserveFocus: true});
                }
                passed = false;
            }
        }
        catch(err) {
            // console.log(err);
            // Compilation / Runtime errors also get logged here
            passed = false;
        }
        

        i++;
    }

    if(passed === true) {
        vscode.window.showInformationMessage(`All test cases passed.`);
    }
};

const compileFile = async(cppFilePath: string, testsFolderPath: string): Promise<any> => {
    const compileCommand: string = `g++ "${cppFilePath}" -std=c++14`;

    if(fs.existsSync(`${testsFolderPath}result.txt`)) {
        fs.unlink(`${testsFolderPath}result.txt`, (err: any) => {
            console.log(err);
        });
    }
    if(fs.existsSync(`${testsFolderPath}error.txt`)) {
        fs.unlink(`${testsFolderPath}error.txt`, (err: any) => {
            console.log(err);
        });
    }

    try {
        return new Promise(async (resolve, reject) => {
            await exec(compileCommand, async (error: any, stdout: any, stderr: any) => {
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
            });
        });
    }
    catch(err) {
        console.log(err);
    }
};

const runTests = async (inputFilePath: string, codeOutputFilePath: string, testsFolderPath: string): Promise<any> => {

    const runCommand: string = `timeout 6s ./a.out < "${inputFilePath}" > "${codeOutputFilePath}"`;

    try {
        return new Promise(async (resolve, reject) => {
            await exec(runCommand, async (error: any, stdout: any, stderr: any) => {
                if (error) {
                    // console.log(`Runtime Error: ${error.message}`);
                    await reportError(error.message, "Run Time", testsFolderPath);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    // console.log(`stderr: ${stderr}`);
                    await reportError(error.message, "Run Time", testsFolderPath);
                    reject(stderr);
                    return;
                }
                // console.log("Output Written.");
                resolve(stdout);
            });
        });
    }
    catch(err) {
        console.log(err);
    }
};

const reportError = async (error: string, errorType: string, testsFolderPath: string): Promise<void> => {
    const click: string | undefined = await vscode.window.showErrorMessage(`${errorType} Error!!!`, "Show Error");
    if(click === "Show Error") {
        const errorFilePath: string = `${testsFolderPath}error.txt`;
        fs.writeFileSync(errorFilePath, error, (err: any) => {
            if(err) {
                vscode.window.showErrorMessage("Could not display error message.");
            }
        });
        vscode.window.showTextDocument(vscode.Uri.file(errorFilePath), {preview: false, viewColumn: vscode.ViewColumn.Beside, preserveFocus: true});
    }
};

const compareOutputs = async (outputFilePath: string, codeOutputFilePath: string): Promise<boolean> => {

    // Code to compare the expected output and the obtained output

    let expectedOutput: string = await readFile(outputFilePath);

    let obtainedOutput: string = await readFile(codeOutputFilePath);

    expectedOutput = refine(expectedOutput);
    obtainedOutput = refine(obtainedOutput);

    // console.log("Expected Output : ");
    // console.log(expectedOutput);
    // for(let i=0; i<expectedOutput.length; i++) {
    //     console.log(expectedOutput.charCodeAt(i));
    // }
    // console.log("Obtained Output : ");
    // console.log(obtainedOutput);
    // for(let i=0; i<obtainedOutput.length; i++) {
    //     console.log(obtainedOutput.charCodeAt(i));
    // }

    // console.log(expectedOutput === obtainedOutput);

    if(expectedOutput === obtainedOutput) {
        return true;
    }
    else {
        return false;
    }
};

const refine = (content: string): string => {
    while(content.slice(-1) === '\n') {
        content = content.slice(0, content.lastIndexOf('\n'));
    }

    while(content[0] === '\n') {
        content = content.slice(1);
    }

    content = content.replace(/\r/g, '');

    return content;
};

const readFile = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error: any, fileContent: string) => {
            if (error !== null) {
                reject(error);
                return;
            }
        
            resolve(fileContent);
        });
    });
};