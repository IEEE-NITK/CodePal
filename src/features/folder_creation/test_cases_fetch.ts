const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import * as vscode from "vscode";
import { assert } from 'console';
import { ProblemClass } from '../../classes/problem';

export const fetchTestCases = async (
    problem: ProblemClass,
    folderPath: string
): Promise<void> => {
    // TODO : Fill in the code for test case fetching 
    // Create a folder called 'tests' inside the folder 'problemFolderPath' 
    // and create input and output text files of the sample test cases
    if(problem === undefined){
        console.log('Empty Problem class');
        return;
      }
      
      const getinput = async (problem1: ProblemClass) => {
        try {
          const { data } = await axios.get(
            `https://codeforces.com/contest/${problem1.contestID}/problem/${problem1.index}`
          );
          const $ = cheerio.load(data);
      
              const postTitle = $('div > div.input > pre');
              //console.log(postTitle.length);
      
              let input:any = [];
      
              const callbackFunction = (i:any, element:any) => {
                  input.push($(element).text());
              };
      
              postTitle.each(callbackFunction);
      
          return input;
    
        } catch (error) {
              console.log("ERROR");
          throw error;
        }
      };
  
      const getoutput = async (problem1: ProblemClass) => {
        try {
          const { data } = await axios.get(
            `https://codeforces.com/contest/${problem1.contestID}/problem/${problem1.index}`
          );
          const $ = cheerio.load(data);
      
              const postTitle = $('div > div.output > pre');
              //console.log(postTitle.length);
      
              let output:any = [];
      
              const callbackFunction = (i:any, element:any) => {
                  output.push($(element).text());
              };
      
              postTitle.each(callbackFunction);
      
          return output;
        } catch (error) {
              console.log("ERROR");
          throw error;
        }
      };
      
      const problemFolderPath = folderPath + `Tests/`;
      //const problemFilePath = problemFolderPath + ``;
  
      try{
        await fs.mkdir(problemFolderPath);
        getinput(problem)
        .then((input) => {
          for(let i=0; i<input.length; i++) {
            const problemFilePath = problemFolderPath + `Input ${i}.txt`;
            fs.writeFile(problemFilePath, input[i],);
          }
        });
  
        getoutput(problem)
        .then((output) => {
          for(let i=0; i<output.length; i++) {
            const problemFilePath = problemFolderPath + `Output ${i}.txt`;
            fs.writeFile(problemFilePath, output[i],);
          }
        });
  
      }
      catch(err){
        if(err.code === "EEXIST"){
          console.log('Problem already exists');
          vscode.window.showInformationMessage('Problem folder already exists');
        }
        else{
          console.log('Unkown error');
          vscode.window.showInformationMessage('Could not create folder');
        }
      }
};