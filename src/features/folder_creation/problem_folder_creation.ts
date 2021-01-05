import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { promises as fs } from "fs";
import { readFileSync as fs_readFileSync } from "fs";
import { fetchTestCases } from "./test_cases_fetch";
import { fetchProblemPdf } from "./problem_pdf_creation";

const templatePath = vscode.workspace
  .getConfiguration("codepal")
  .get<string>("codeTemplatePath"); // take it from settings
let templateCode = "";

const getTemplateCode = async () => {
  let data = "";
  try {
    if (templatePath) {
      data = fs_readFileSync(templatePath, "ascii").toString();
    }
  } catch (e) {
      console.log("error fetching templatecode");
  }

  return data;
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
