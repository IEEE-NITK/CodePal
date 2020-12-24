import { root } from "cheerio";
import * as vscode from "vscode";
import { ContestClass } from "../classes/contest";
import { ProblemClass } from "../classes/problem";
import { ContestTreeItem } from "../data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "../data_providers/problems/problem_tree_item";
import { CodePalAPI } from "./api_calls";

import {promises as fs} from "fs";

const templatePath = ''; // take it from settings
let templateCode = '';

const getTemplateCode = async () =>{
  return '';// returning empty file for now

  // let data =  fs.readFile(templatePath, 'ascii').catch((err: object) => '');
  // return data;
};

export class Utils {
  static createProblemDirectory = async (
    problem: ProblemClass | undefined,
    folderPath: string
   ): Promise<void> => {

    if(problem === undefined){
      console.log('Empty Problem class');
      return;
    }

    const problemFolderPath = folderPath + `${problem.index}. ${problem.name}/`;
    const problemFilePath = problemFolderPath + `${problem.index}. ${problem.name}.cpp`;

    try{
      await fs.mkdir(problemFolderPath);

      fs.writeFile(problemFilePath,templateCode); // cpp file
      
      console.log('Problem folder created');
      vscode.window.showInformationMessage('Problem folder created successfully');
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

  static createContestDirectory = async (
    contest: ContestClass| undefined,
    rootPath: string
  ): Promise<void> =>{
    if(contest === undefined){
      console.log('Empty ContestClass object');
      return;
    }

    templateCode = await getTemplateCode();

    const folderPath = rootPath +  `${contest.name}/`;

    try{
      await fs.mkdir(folderPath);

      contest.problems.forEach(async (problem) =>{
        await Utils.createProblemDirectory(problem, folderPath);
      });
      console.log('Contest folder created successfully');
      vscode.window.showInformationMessage('Contest folder created Successfully');
    }
    catch(err){
      if(err.code === "EEXIST"){
        console.log('Contest already exists');
        vscode.window.showInformationMessage('Contest folder already exists');
      }
      else{
        console.log('Unkown error');
        vscode.window.showInformationMessage('Could not create folder');
      }
    }
  };

  static getProblems = async (): Promise<ProblemTreeItem[]> => {
    let problems: ProblemClass[] = await CodePalAPI.fetchProblems();
    return problems.map<ProblemTreeItem>(
      (problem: ProblemClass): ProblemTreeItem => {
          return new ProblemTreeItem(
            `${problem.name}`,
            "problem",
            vscode.TreeItemCollapsibleState.None,
            problem
          );
      }
    ); 
  };

  // static getRatings = ():RatingsTreeItem[]=>{
  //   return []; //TODO: CALL FUNCTION THAT FETCHES Ratings IN PLACE OF []
  // }

  static fetchContests = async (type: string): Promise<ContestTreeItem[]> => {
    let contests: ContestClass[] = await CodePalAPI.fetchContests(type); //TODO: CALL FUNCTION THAT FETCHES CONTESTS IN PLACE OF []
    return contests.map<ContestTreeItem>(
      (contest): ContestTreeItem => {
        return new ContestTreeItem(
          `${contest.name}`,
          type === "Future"?"FutureContest":"contest",
          type === "Future"
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Collapsed,
          type,
          contest
        );
      }
    );
  };
}
