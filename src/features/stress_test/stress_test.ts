import * as vscode from "vscode";
const fs = require("fs");
import { Utils} from "../../utils/utils";
import { platform } from "os";
import { maxLimitOfTestCases, minLimitOfTestCases, OS,  CompilationLanguages, timeLimit} from "../../utils/consts";
import { compileAllFiles } from "./compile_all_files";
import { compareOutputs, readFile } from "../run_test_cases/run_test_cases";
import { runTestsWithTimeout } from "../run_test_cases/run_solution";
import { CodepalConfig, codepalConfigName, stressTestingFlag } from "../../utils/consts";

let numOfTestCases: number|undefined;
let testsFolderPath       : string;
let solnOutputFilePath    : string;
let solnStderrFilePath    : string;
let brutePath             : string;
let bruteOutputFilePath   : string;
let bruteStderrFilePath   : string;
let genPath               : string;
let emptyInputFilePath    : string;
let generatedInputFilePath: string;
let genStderrFilePath     : string;

const assignValuesToPath = async (solnPath: string):Promise<void> => {
    numOfTestCases = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<number>(CodepalConfig.numLimitOfTestCases);

    let fileExtension: string;

    const compilationLanguage = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.compilationLanguage);

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

    const lastIndexOfSlash: number = solnPath.lastIndexOf("/");
    const problemFolderPath: string = solnPath.slice(0, lastIndexOfSlash + 1);

    testsFolderPath = problemFolderPath + "stress_tests/";

    solnOutputFilePath = testsFolderPath + 'soln.txt';
    solnStderrFilePath = testsFolderPath + 'soln_stderr.txt';

    brutePath = problemFolderPath + 'brute.' + fileExtension;
    bruteOutputFilePath = testsFolderPath + 'brute.txt';
    bruteStderrFilePath = testsFolderPath + 'brute_stderr.txt';
    
    genPath =  problemFolderPath + 'gen.' + fileExtension;
    emptyInputFilePath = testsFolderPath + 'empty.txt';
    generatedInputFilePath = `${testsFolderPath}gen.txt`;
    genStderrFilePath = `${testsFolderPath}gen_stderr.txt`;
};

export const stressTest = async (filePath: string):Promise<void> => {
    const os = platform() === "win32"?OS.windows : OS.linuxMac;

    let solnPath = Utils.pathRefine(filePath, os);

    await assignValuesToPath(solnPath);

    let successfulCompilation: boolean = await compileAllFiles(testsFolderPath, solnPath, brutePath, genPath);

    if(!successfulCompilation){
        vscode.window.showErrorMessage('Unable to stress test.');
        return;
    }

    if(numOfTestCases === undefined || numOfTestCases ===    0){
        numOfTestCases = 100; // default value
    }
    if(numOfTestCases >= maxLimitOfTestCases){
        numOfTestCases = maxLimitOfTestCases;
    }
    if(numOfTestCases <= minLimitOfTestCases){
        numOfTestCases = minLimitOfTestCases;
    }

    let keyBinding:string = '';
    if(platform() === "darwin"){ // Mac OS
        keyBinding = "Cmd+Shift+z";
    }
    else{ // Windows or Linux
        keyBinding = "Ctrl+Shift+z";
    }

    const resultFilePath: string = `${testsFolderPath}result.txt`;
    let i: number = 1;
    let passed: boolean = true;

    while (i <= numOfTestCases) {
        if(stressTestingFlag.stop === true){
            break;
        }
        const commandLineArguments: string = `${i}`;

        vscode.window.setStatusBarMessage(`Running test case ${i}. Press ${keyBinding} to force stop Stress Testing`,timeLimit);
        
        try {

            let runResultGen = await runTestsWithTimeout (
                genPath,
                emptyInputFilePath,
                generatedInputFilePath,
                testsFolderPath,
                genStderrFilePath,
                os,
                'gen',
                commandLineArguments
            );
            let runResultBrute = await runTestsWithTimeout (
                brutePath,
                generatedInputFilePath,
                bruteOutputFilePath,
                testsFolderPath,
                bruteStderrFilePath,
                os,
                'brute'
            );
            let runResultSoln = await runTestsWithTimeout (
                solnPath,
                generatedInputFilePath,
                solnOutputFilePath,
                testsFolderPath,
                solnStderrFilePath,
                os,
                'soln'
            );

            if (runResultGen === "Run time error" || runResultBrute === "Run time error" || runResultSoln === "Run time error") {
                return;
            }

            let testResult: boolean = await compareOutputs(
                bruteOutputFilePath,
                solnOutputFilePath
            );

            let input: string = await readFile(generatedInputFilePath);
            let expectedOutput: string = await readFile(bruteOutputFilePath);
            let codeOutput: string = await readFile(solnOutputFilePath);
            let result : string = "";
            if (testResult===true) {
                result = result + `Test ${i} Passed\n\n`;
            }
            else {
                result = result + `Test ${i} Failed\n\n`;
            }
            result = result + `Input ${i}: \n${input}\n\nBrute Force Output: \n${expectedOutput}\n\nObtained Output: \n${codeOutput}\n\n`;
            
            result = result + "________________________________________________________\n\n";
            fs.writeFileSync(resultFilePath, result, (err: any) => {
                if (err) {
                    vscode.window.showErrorMessage("Could not write result.");
                }
            });

            if (!testResult) {
                vscode.window.showTextDocument(vscode.Uri.file(resultFilePath), {
                    preview: false,
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true,
                });

                passed = false;
                break;
            }
        } catch (err) {
            // Runtime errors also get logged here
            passed = false;
            return;
        }

        i++;
    }

    if(stressTestingFlag.stop === true){
        vscode.window.showErrorMessage('Stress Testing interrupted');
        stressTestingFlag.stop = false;
    }
    else if (passed === true) {
        vscode.window.showInformationMessage(
            `Solution matches with brute force for ${numOfTestCases} test cases.`,
        );
    }
    else{
        vscode.window.showInformationMessage(
            `In testcase ${i}, solution differs from brute force`
        );
    }

    vscode.window.setStatusBarMessage('Stress Testing Done', timeLimit);
};
