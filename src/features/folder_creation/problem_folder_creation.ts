import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";
import { ProblemClass } from "../../classes/problem";
import { ContestTreeItem } from "../../data_providers/contests/contest_tree_item";
import { ProblemTreeItem } from "../../data_providers/problems/problem_tree_item";
import { promises as fs } from "fs";
import { fetchTestCases } from "./test_cases_fetch";
import { fetchProblemPdf } from "./problem_pdf_creation";

const templatePath = ""; // take it from settings
let templateCode = "";

const getTemplateCode = async () => {
  return ""; // returning empty file for now

  // let data =  fs.readFile(templatePath, 'ascii').catch((err: object) => '');
  // return data;
};

export const createProblemDirectory = async (
  problem: ProblemClass | undefined,
  folderPath: string
): Promise<void> => {
  if (problem === undefined) {
    console.log("Empty Problem class");
    return;
  }

  const problemFolderPath = folderPath + `${problem.index}. ${problem.name}/`;
  const problemFilePath =
    problemFolderPath + `${problem.index}. ${problem.name}.cpp`;

  templateCode = await getTemplateCode();

  try {
    await fs.mkdir(problemFolderPath);
    {
      // creating .json
      fs.writeFile(
        problemFolderPath + ".problem.json",
        JSON.stringify({
          contestID: problem.contestID,
          index: problem.index,
        })
      );
    }
    fs.writeFile(problemFilePath, templateCode); // cpp file

    await fetchTestCases(problem, problemFolderPath); // Fetch tests cases into the problem folder

    await fetchProblemPdf(problem, problemFolderPath); // Fetch pdf of problem statement

    console.log("Problem folder created");
    vscode.window.showInformationMessage("Problem folder created successfully");
  } catch (err) {
    if (err.code === "EEXIST") {
      console.log("Problem already exists");
      vscode.window.showInformationMessage("Problem folder already exists");
    } else {
      console.log("Unkown error");
      vscode.window.showInformationMessage("Could not create folder");
    }
  }
};