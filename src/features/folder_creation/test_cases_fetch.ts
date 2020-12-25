const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import * as vscode from "vscode";
import { assert } from 'console';
import { ProblemClass } from '../../classes/problem';


const getInputOutput = async (problem1: ProblemClass) => {  
    try {
        const { data } = await axios.get(
            `https://codeforces.com/contest/${problem1.contestID}/problem/${problem1.index}`
        );
        const $ = cheerio.load(data);
        const postTitle = $('div > div.input > pre');
        const postTitle1 = $('div > div.output > pre');
        //console.log(postTitle.length);
        let input:string[] = [];
        let output:string[] = [];
        const callbackFunctionInput = (i:Number, element:string) => {
            input.push($(element).text());
        };

        const callbackFunctionOutput = (i:Number, element:string) => {
            output.push($(element).text());
        };

        postTitle.each(callbackFunctionInput);
        postTitle1.each(callbackFunctionOutput);

        return {input,output};

    }
    catch (error) {
        console.log("ERROR");
        throw error;
    }
};


export const fetchTestCases = async (
    problem: ProblemClass,
    folderPath: string
): Promise<void> => {
    // TODO : Fill in the code for test case fetching 
    // Create a folder called 'tests' inside the folder 'problemFolderPath' 
    // and create input and output text files of the sample test cases
      
    const problemFolderPath = folderPath + `Tests/`;
    //const problemFilePath = problemFolderPath + ``;
  
    try{
        await fs.mkdir(problemFolderPath);
        getInputOutput(problem)
        .then((data) => {
            for(let i=0; i<data.input.length; i++) {
                const problemFilePath = problemFolderPath + `Input ${i}.txt`;
                fs.writeFile(problemFilePath, data.input[i],);
            }
        });
  
        getInputOutput(problem)
        .then((data) => {
            for(let i=0; i<data.output.length; i++) {
                const problemFilePath = problemFolderPath + `Output ${i}.txt`;
                fs.writeFile(problemFilePath, data.output[i],);
            }
        });
  
    }
    catch(err){
        console.log('Error');
        vscode.window.showInformationMessage('Could not create test cases');
    }
};