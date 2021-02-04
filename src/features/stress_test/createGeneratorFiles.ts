import * as vscode from "vscode";
const fs = require("fs");
import { Utils} from "../../utils/utils";
import { platform } from "os";
import { OS, generatorTemplate, CompilationLanguages, CodepalConfig, codepalConfigName } from "../../utils/consts";
import { getTemplateCode } from "../folder_creation/problem_folder_creation";

export const createGeneratorFiles = async (filePath: string):Promise<void> => {
    const os = platform() === "win32"?OS.windows : OS.linux_mac;
    let path = Utils.pathRefine(filePath, os);

    const lastIndexOfSlash: number = path.lastIndexOf("/");
    const problemFolderPath: string = path.slice(0, lastIndexOfSlash + 1);
    const testsFolderPath = problemFolderPath + "stress_tests/";

    const compilationLanguage = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.compilationLanguage);
    

    let fileExtension: string;
    let genTemplateCode:string;

    switch(compilationLanguage) {
        case CompilationLanguages.gcc:
            fileExtension = 'c';
            genTemplateCode = generatorTemplate.c;
            break;

        case CompilationLanguages.cpp:
            fileExtension = 'cpp';
            genTemplateCode = generatorTemplate.cpp;
            break;

        case CompilationLanguages.python:
        case CompilationLanguages.python2:
        case CompilationLanguages.python3:
            fileExtension = 'py';
            
            if(compilationLanguage === CompilationLanguages.python2){
                genTemplateCode = generatorTemplate.python2;
            }
            else{
                genTemplateCode = generatorTemplate.python3;
            }
            break;

        case CompilationLanguages.java:
            fileExtension = 'java';
            genTemplateCode = generatorTemplate.java;
            break;

        default:
            vscode.window.showErrorMessage("Language used is not supported");
            throw Error();
    }

    const brutePath = problemFolderPath + 'brute.' + fileExtension;

    const genPath =  problemFolderPath + 'gen.' + fileExtension;

    const emptyInputFilePath = testsFolderPath + 'empty.txt';
    // TODO: I think making gen cpp file is best as we can give command line arguments 

    if (!fs.existsSync(testsFolderPath)) {
        fs.mkdir(testsFolderPath, function (e: any) {
            if (!e || (e && e.code === "EEXIST")) {}
        });
    }
    
    // creating brute.cpp if it doesnt exist
    let templateCode:string = await getTemplateCode();
    if(!fs.existsSync(brutePath)) {
        fs.writeFile(brutePath, templateCode, function (err: any, result: any) {
            if (err) {
                vscode.window.showErrorMessage('Error creating brute file');
            }
        });
    }

    // creating gen.cpp if it doesnt exist
    if(genTemplateCode === ''){
        genTemplateCode = templateCode;
    }
    if(!fs.existsSync(genPath)) {
        fs.writeFile(genPath, genTemplateCode, function (err: any, result: any) {
            if (err) {
                vscode.window.showErrorMessage('Error creating gen file');
            }
        });
    }

    // empty input file to feed into generator
    if(!fs.existsSync(emptyInputFilePath)) { 
        fs.writeFile(emptyInputFilePath, '', function (err: any, result: any) {
            if (err) {
                vscode.window.showErrorMessage('Error creating empty input file');
            }
        });
    }

    await vscode.window.showTextDocument(vscode.Uri.file(brutePath), {
        preview: false,
        preserveFocus: true,
    });
    vscode.window.showTextDocument(vscode.Uri.file(genPath), {
        preview: false,
        preserveFocus: true,
    });
};