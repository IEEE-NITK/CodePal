import * as vscode from "vscode";
const fs = require("fs");
import {platform} from "os";
import {OS, Utils} from "../../utils/utils";

export const addTestCases = async function (
    filePath: string
): Promise<void> {
    
    // Code for adding test cases

    console.log(filePath);
    const os = platform() === "linux" ? OS.linux : OS.windows;
    let path = Utils.pathRefine(filePath, os);
    console.log(path);

    const lastIndexOfSlash: number = path.lastIndexOf('/');
    const problemFolderPath: string = path.slice(0, lastIndexOfSlash+1);
    // console.log(problemFolderPath);

    const testsFolderPath:string = `${problemFolderPath}Tests/`;

    if(!fs.existsSync(testsFolderPath)) {
        console.log("no tests folder");
        fs.mkdir(testsFolderPath,function(e: any){
            if(!e || (e && e.code === 'EEXIST')){
                console.log("folder created");
            } else {
                //debug
                console.log(e);
            }
        });
    }

    let i:number = 1;

    let inputFilePath: string = `${testsFolderPath}input_${i}.txt`;

    while(fs.existsSync(inputFilePath)){
        i++;
        inputFilePath = `${testsFolderPath}input_${i}.txt`;
    }

    const addedInputFilePath = `${testsFolderPath}input_${i}.txt`;
    fs.writeFile(addedInputFilePath, "",function(err: any, result: any) {
        if (err) {console.log('error', err);}
    });

    const addedOutputFilePath = `${testsFolderPath}output_${i}.txt`;
    fs.writeFile(addedOutputFilePath, "",function(err: any, result: any) {
        if (err) {console.log('error', err);}
    });


    vscode.commands.executeCommand("vscode.setEditorLayout",{ 
        orientation: 0,
        groups: [{ groups: [{}], size: 1 }, { groups: [{}, {}], size: 0.5 }] 
    });

    vscode.window.showInformationMessage(`Input and Output files created successfully. Please enter the input and expected output in the input${i}.txt and output${i}.txt respectively`);

    vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(addedOutputFilePath),
        vscode.ViewColumn.Two
    );

    vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(addedInputFilePath),
        vscode.ViewColumn.One
    );

    //vscode.window.showTextDocument(vscode.Uri.file(addedInputFilePath), {preview: false, viewColumn: vscode.ViewColumn.Beside, preserveFocus: true});
    //vscode.window.showTextDocument(vscode.Uri.file(addedOutputFilePath), {preview: false, viewColumn: vscode.ViewColumn.Beside, preserveFocus: true});

    return;
};