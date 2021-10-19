const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import * as vscode from "vscode";
import { ProblemClass } from '../../classes/problem';
import { isRCPCTokenRequired,getCookie } from '../../utils/scraper';


const getInputOutput = async (problem: ProblemClass) => {
    let rcpcValue = "";
    try{
        const response = await axios.get("https://codeforces.com");
        let [_,a,b,c] = isRCPCTokenRequired(response);
        rcpcValue = getCookie(a,b,c);
        console.log(rcpcValue);
        // somehow get rcpc_value
    } catch(err) {
        console.log(err);
    }  
    try {
        // const rcpcValue = "6164ef00544d3b5266657b2349cea803";
        const { data } = await axios.get(
            `https://codeforces.com/contest/${problem.contestID}/problem/${problem.index}`,
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Cookie: `RCPC=${rcpcValue}; expires=Thu, 31-Dec-37 23:55:55 GMT; path=/`,
                }
            }
        );
        const $ = cheerio.load(data);
        const postTitleInput = $('div > div.input > pre');
        const postTitleOutput = $('div > div.output > pre');

        let input: string[] = [];
        let output: string[] = [];

        postTitleInput.each((i: Number, element: string) => {
            input.push($(element).html().replace(/<br>/g, '\n'));
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
