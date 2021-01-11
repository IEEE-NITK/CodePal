import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { promises as fs } from "fs";
import { readFileSync as fs_readFileSync } from "fs";
import { fetchTestCases } from "./test_cases_fetch";
import { fetchProblemPdf } from "./problem_pdf_creation";

let templateCode = "";

const getTemplateCode = async () => {
  const templatePath = vscode.workspace
  .getConfiguration("codepal")
  .get<string>("codeTemplatePath");
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
  let problemName : string = problem.name;
  problemName = problemName.replace(/[^a-zA-Z 0-9.]+/g,'');
  const problemFolderPath = folderPath + `${problem.index}-${problemName}/`;
  const problemFilePath =
    problemFolderPath + `${problem.index}-${problemName}.cpp`;

  templateCode = await getTemplateCode();

  try {
    await fs.mkdir(problemFolderPath);
      // creating .json
      fs.writeFile(
        problemFolderPath + ".problem.json",
        JSON.stringify({
          contestID: problem.contestID,
          index: problem.index,
        })
      );
    
    fs.writeFile(problemFilePath, templateCode); // cpp file

    await fetchTestCases(problem, problemFolderPath); // Fetch tests cases into the problem folder

    await fetchProblemPdf(problem, problemFolderPath); // Fetch pdf of problem statement

    vscode.window.showTextDocument(vscode.Uri.file(problemFilePath), {
      preview: false,
      preserveFocus: true,
    });

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
