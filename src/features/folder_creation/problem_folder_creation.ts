import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { promises as fs } from "fs";
import { readFileSync as fs_readFileSync } from "fs";
import { fetchTestCases } from "./test_cases_fetch";
import { fetchProblemPdf } from "./problem_pdf_creation";
import { CodepalConfig, codepalConfigName, CompilationLanguages } from "../../utils/consts";

let templateCode = "";

const getTemplateCode = async () => {
  const templatePath = vscode.workspace
  .getConfiguration(codepalConfigName)
  .get<string>(CodepalConfig.codeTemplatePath);
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
    return;
  }
  let problemName : string = problem.name;
  problemName = problemName.replace(/[^a-zA-Z 0-9.]+/g,'');
  const problemFolderPath = folderPath + `${problem.index}-${problemName}/`;

  const compilationLanguage = vscode.workspace
    .getConfiguration(codepalConfigName)
    .get<String>(CodepalConfig.compilationLanguage);
  
  let fileExtension: string;
  console.log(compilationLanguage);
  switch(compilationLanguage) {
      case CompilationLanguages.gcc:
        fileExtension = 'c';
        break;

      case CompilationLanguages.cpp:
        fileExtension = 'cpp';
        break;

      case CompilationLanguages.python:
      case CompilationLanguages.python3:
        fileExtension = 'py';
        break;

      case CompilationLanguages.java:
        fileExtension = 'java';
        break;

      default:
        vscode.window.showErrorMessage("Language used is not supported");
        throw Error();
  }

  const problemFilePath =
    problemFolderPath + `${problem.index}-${problemName}.${fileExtension}`;

  templateCode = await getTemplateCode();

  try {
    console.log('start');
    await fs.mkdir(problemFolderPath);
    console.log('folder created');
      // creating .json
      fs.writeFile(
        problemFolderPath + ".problem.json",
        JSON.stringify({
          contestID: problem.contestID,
          index: problem.index,
        })
      );
      console.log('json created');
    fs.writeFile(problemFilePath, templateCode); // solution file
    console.log('temp created');
    await fetchTestCases(problem, problemFolderPath); // Fetch tests cases into the problem folder
    console.log('test created');
    vscode.window.showTextDocument(vscode.Uri.file(problemFilePath), {
      preview: false,
      preserveFocus: true,
    });
    vscode.window.showInformationMessage("Problem folder created successfully");
  } catch (err) {
    console.log(err); 
    if (err.code === "EEXIST") {
      vscode.window.showInformationMessage("Problem folder already exists");
    } else if(err.code ==="EACCES") {
      vscode.window.showErrorMessage("No write permission.\nPlease open a folder with write permissions.");
    }else{
      vscode.window.showErrorMessage("Could not create folder.\nUnknown error occurred");
    }
  }
};
