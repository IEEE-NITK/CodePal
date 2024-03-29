const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import * as vscode from "vscode";
import { ProblemClass } from '../../classes/problem';

const getInputOutput = async (problem: ProblemClass) => {
    try {
        const { data } = await axios.get(
            `https://codeforces.com/contest/${problem.contestID}/problem/${problem.index}`
        );
        const $ = cheerio.load(data);
        const postTitleInput = $('div > div.input > pre');
        const postTitleOutput = $('div > div.output > pre');

        let input: string[] = [];
        let output: string[] = [];

        postTitleInput.each((i: Number, element: any) => {
            let testBlock: string = "";

            if (element.children.length > 1){ // there is mutli-test highlighting enabled 
                element.children.forEach((testLine: any) => {
                    testBlock += $(testLine).html() + '\n';
                });;
            }
            else{
                testBlock = $(element).html().replace(/<br>/g, '\n');
            }
            
            input.push(testBlock);
        });
        postTitleOutput.each((i: Number, element: string) => {
            output.push($(element).html().replace(/<br>/g, '\n'));
        });

        return {input,output};

    }
    catch (error) {
        throw error;
    }
};


export const fetchTestCases = async (
    problem: ProblemClass,
    folderPath: string
): Promise<void> => {
      
    const problemFolderPath = folderPath + `Tests/`;
  
    try{
        await fs.mkdir(problemFolderPath);
        getInputOutput(problem)
            .then((data) => {
                for(let i=0; i<data.input.length; i++) {
                    const problemFilePath = problemFolderPath + `input_${i+1}.txt`;
                    fs.writeFile(problemFilePath, data.input[i],function(err: any, result: any) {
                        if(err){ vscode.window.showErrorMessage(err); }
                    });
                }
            });
  
        getInputOutput(problem)
            .then((data) => {
                for(let i=0; i<data.output.length; i++) {
                    const problemFilePath = problemFolderPath + `output_${i+1}.txt`;
                    fs.writeFile(problemFilePath, data.output[i],function(err: any, result: any) {
                    });
                }
            });
  
    }
    catch(err){
        vscode.window.showErrorMessage('Could not fetch test cases');
    }
};
