import * as vscode from "vscode";
const fs = require("fs");
import { compileFile } from "../run_test_cases/compile_solution";

export const compileAllFiles = async (
    testsFolderPath: string,
    solnPath: string,
    brutePath: string,
    genPath: string
):Promise<boolean> => {
    
    if (!fs.existsSync(solnPath)) {
        vscode.window.showErrorMessage("Problem solution file not found. Please try again.");
        return false;
    }

    if (!fs.existsSync(testsFolderPath)) {
        vscode.window.showErrorMessage("Stress Tests folder not found. Create Stress Testing files.");
        return false;
    }

    if (!fs.existsSync(brutePath)) {
        vscode.window.showErrorMessage("Brute force solution file not found. Create Stress Testing files.");
        return false;
    }
    if (!fs.existsSync(genPath)) {
        vscode.window.showErrorMessage("Generator file not found. Create Stress Testing files.");
        return false;
    }

    try {
        await compileFile(solnPath, testsFolderPath, 'soln');
    } catch (err) {
        console.log(err);
        return false;
    }

    try {
        await compileFile(brutePath, testsFolderPath, 'brute');
    } catch (err) {
        console.log(err);
        return false;
    }

    try {
        await compileFile(genPath, testsFolderPath, 'gen');
    } catch (err) {
        console.log(err);
        return false;
    }

    return true;
};
