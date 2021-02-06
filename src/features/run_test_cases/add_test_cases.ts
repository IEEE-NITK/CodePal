import * as vscode from "vscode";
const fs = require("fs");
import { platform } from "os";
import { Utils } from "../../utils/utils";
import { Command, OS } from "../../utils/consts";

export const addTestCases = async function (filePath: string): Promise<void> {
    // Code for adding test cases
    const os = platform() === "win32"?OS.windows : OS.linuxMac;
    let path = Utils.pathRefine(filePath, os);

    if (vscode.window.activeTextEditor) {
        path = vscode.window.activeTextEditor.document.uri.fsPath;
        path = path.replace(/\\/g, '/');
    }
    const lastIndexOfSlash: number = path.lastIndexOf("/");
    const problemFolderPath: string = path.slice(0, lastIndexOfSlash + 1);

    const testsFolderPath: string = `${problemFolderPath}Tests/`;

    if (!fs.existsSync(testsFolderPath)) {
        fs.mkdir(testsFolderPath, function (e: any) {
            if (!e || (e && e.code === "EEXIST")) {}
        });
    }

    let i: number = 1;

    let inputFilePath: string = `${testsFolderPath}input_${i}.txt`;

    while (fs.existsSync(inputFilePath)) {
        i++;
        inputFilePath = `${testsFolderPath}input_${i}.txt`;
    }

    const addedInputFilePath = `${testsFolderPath}input_${i}.txt`;
    fs.writeFile(addedInputFilePath, "", function (err: any, result: any) {
        if (err) {}
    });

    const addedOutputFilePath = `${testsFolderPath}output_${i}.txt`;
    fs.writeFile(addedOutputFilePath, "", function (err: any, result: any) {
        if (err) {
        }
    });

    vscode.commands.executeCommand(Command.setEditorLayout, {
        orientation: 0,
        groups: [
            { groups: [{}], size: 1 },
            { groups: [{}, {}], size: 0.5 },
        ],
    });

    vscode.window.showInformationMessage(
        `Input and Output files created successfully. Please enter the input and expected output in the input${i}.txt and output${i}.txt respectively`
    );

    vscode.commands.executeCommand(
        Command.vscodeOpen,
        vscode.Uri.file(addedOutputFilePath),
        vscode.ViewColumn.Two
    );

    vscode.commands.executeCommand(
        Command.vscodeOpen,
        vscode.Uri.file(addedInputFilePath),
        vscode.ViewColumn.One
    );
};
