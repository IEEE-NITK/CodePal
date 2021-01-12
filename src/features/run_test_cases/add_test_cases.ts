import * as vscode from "vscode";
const fs = require("fs");
import {platform} from "os";

export const addTestCases = async function (
    filePath: string
): Promise<void> {
    
    // Code for adding test cases

    console.log(filePath);
    const os = platform() === "linux" ? 0 : 1;
    let path = pathRefine(filePath, os);
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

const pathRefine = (filePath: string, os: number): string => {
    let path = String(filePath);
    path = path.replace(/\%20/g, ' ');
    path = path.replace(/\%21/g, '!');
    path = path.replace(/\%28/g, '(');
    path = path.replace(/\%29/g, ')');
    path = path.replace(/\%23/g, '#');
    path = path.replace(/\%27/g, '\'');
    path = path.replace(/\%2C/g, ',');
    path = path.replace(/\%3A/g, ':');
    path = path.replace(/\%2B/g, '+');
    path = path.replace(/\%3D/g, '=');
    if(os === 1) {
        // For Windows
        path = path.slice(8);
    }
    else {
        // For Linux
        path = path.slice(7);
    }

    return path;
};