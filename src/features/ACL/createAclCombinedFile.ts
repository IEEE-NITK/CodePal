import * as vscode from "vscode";
const fs = require("fs");
var path = require('path');
import { platform } from "os";
import {
    extensionPaths,
    OS
} from "../../utils/consts";

import { Utils} from "../../utils/utils";
import { runTests } from "../run_test_cases/run_solution";



export const createAclCombinedFile = async(
    filePath: string
): Promise<any> =>{

    const os = platform() === "win32"?OS.windows : OS.linuxMac;
    
    let solutionFilePath = Utils.pathRefine(filePath, os);
    let combinedFilePath = path.dirname(solutionFilePath) + '/combined.cpp';

    let compilationLanguage = `python3`;
    
    // TODO: maybe change compilationLanguage to suit different OS
    let runCommand = `${compilationLanguage} "${extensionPaths.expanderPyPath}" "${solutionFilePath}" --lib "${extensionPaths.libraryPath}" -c > "${combinedFilePath}"`;

    console.log(runCommand);

    // to see the logic behind runCommand: https://atcoder.github.io/ac-library/production/document_en/appendix.html

    runTests(
        runCommand,
        '',
        ''
    );

    try{
        await vscode.window.showTextDocument(vscode.Uri.file(combinedFilePath), {
            preview: false,
            preserveFocus: true,
        });
    }
    catch{
        vscode.window.showErrorMessage('Unable to create combined.cpp file');
    }
};
