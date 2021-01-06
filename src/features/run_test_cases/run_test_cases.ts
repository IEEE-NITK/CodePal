import * as vscode from "vscode";
const fs = require("fs");
import { exec } from "child_process";
export const runTestCases = async function (
  filePath: string,
  os: number
): Promise<void> {
  // Code for running test cases and returning verdict
  console.log(filePath);
  let path = pathRefine(filePath, os);
  console.log(path);

  if (!fs.existsSync(path)) {
    vscode.window.showErrorMessage("Problem solution file not found.");
    return;
  }

  const lastIndexOfSlash: number = path.lastIndexOf("/");
  const problemFolderPath: string = path.slice(0, lastIndexOfSlash + 1);
  // console.log(problemFolderPath);

  const testsFolderPath = problemFolderPath + "Tests/";

  if (!fs.existsSync(testsFolderPath)) {
    vscode.window.showErrorMessage("Tests not found.");
    // console.log("Tests not found.");
    return;
  }

  try {
    await compileFile(path, testsFolderPath);
  } catch (err) {
    console.log(err);
    return;
  }

  const resultFilePath: string = `${testsFolderPath}result.txt`;

  let i: number = 1;
  let passed: boolean = true;
  while (true) {
    const inputFilePath: string = `${testsFolderPath}input_${i}.txt`;

    if (!fs.existsSync(inputFilePath)) {
      break;
    }

    const outputFilePath: string = `${testsFolderPath}output_${i}.txt`;
    const codeOutputFilePath: string = `${testsFolderPath}code_output_${i}.txt`;
    const stderrFilePath: string = `${testsFolderPath}stderr_${i}.txt`;

    try {
      let runResult = await runTestsWithTimeout(
        inputFilePath,
        codeOutputFilePath,
        testsFolderPath,
        stderrFilePath,
        os
      );
      if (runResult === "Run time error") {
        return;
      }

      let testResult: boolean = await compareOutputs(
        outputFilePath,
        codeOutputFilePath
      );
      // console.log(testResult);

      let input: string = await readFile(inputFilePath);
      let expectedOutput: string = await readFile(outputFilePath);
      let codeOutput: string = await readFile(codeOutputFilePath);
      let result: string = `Input ${i}: \n${input}\n\nExpected Output : \n${expectedOutput}\n\nObtained Output : \n${codeOutput}\n\n`;
      if (fs.existsSync(stderrFilePath)) {
        let stderr: string = await readFile(stderrFilePath);
        result = `${result}Standard Error : \n${stderr}\n\n`;
      }
      result =
        result + "________________________________________________________\n\n";
      fs.appendFileSync(resultFilePath, result, (err: any) => {
        if (err) {
          vscode.window.showErrorMessage("Could not write result.");
        }
      });

      if (!testResult) {
        // console.log(`Test ${i} failed.`);
        const click: string | undefined = await vscode.window.showErrorMessage(
          `Test ${i} failed`,
          "Show Result"
        );
        if (click === "Show Result") {
          vscode.window.showTextDocument(vscode.Uri.file(resultFilePath), {
            preview: false,
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: true,
          });
        }
        passed = false;
      }
    } catch (err) {
      // console.log("Inside catch block of while loop : " + err);
      // Runtime errors also get logged here
      passed = false;
      return;
    }

    i++;
  }

  if (passed === true) {
    const click:
      | string
      | undefined = await vscode.window.showInformationMessage(
      `All test cases passed.`,
      "Show Results"
    );
    if (click === "Show Results") {
      vscode.window.showTextDocument(vscode.Uri.file(resultFilePath), {
        preview: false,
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true,
      });
    }
  }
};

const compileFile = async (
  cppFilePath: string,
  testsFolderPath: string
): Promise<any> => {
  const compilationLanguage = vscode.workspace
    .getConfiguration("codepal")
    .get<String>("compilationLanguage");
  let compileCommand: string;
  switch (compilationLanguage) {
    case "c++":
      const compilationFlag = vscode.workspace
    .getConfiguration("codepal")
    .get<String>("g++ CompilerType");
      compileCommand = `g++ "${cppFilePath}" ${compilationFlag}`;
      break;
    default:
      vscode.window.showErrorMessage("Language used is not supported");
      throw Error();
  }

  if (fs.existsSync(`${testsFolderPath}result.txt`)) {
    fs.unlink(`${testsFolderPath}result.txt`, (err: any) => {
      console.log(err);
    });
  }
  if (fs.existsSync(`${testsFolderPath}error.txt`)) {
    fs.unlink(`${testsFolderPath}error.txt`, (err: any) => {
      console.log(err);
    });
  }

  try {
    return new Promise(async (resolve, reject) => {
      exec(
        compileCommand,
        async (error: any, stdout: any, stderr: any) => {
          if (error) {
            // console.log(`Compilation Error: \n${error.message}`);
            await reportError(error.message, "Compilation", testsFolderPath);
            reject(error.message);
            return;
          }
          if (stderr) {
            // console.log(`stderr: ${stderr}`);
            await reportError(stderr, "Compilation", testsFolderPath);
            reject(stderr);
            return;
          }
          // console.log("Compilation Done.");
          vscode.window.showInformationMessage("Compilation Done.");
          resolve(stdout);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const runTestsWithTimeout = async (
  inputFilePath: string,
  codeOutputFilePath: string,
  testsFolderPath: string,
  stderrFilePath: string,
  os: number
): Promise<any> => {
  let timeoutHandle: NodeJS.Timeout;
  // Declaring a promise that rejects after 6s
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(() => reject("Time limit exceeded"), 6000);
  });

  return Promise.race([
    runTests(
      inputFilePath,
      codeOutputFilePath,
      testsFolderPath,
      stderrFilePath,
      os
    ),
    timeoutPromise,
  ])
    .then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    })
    .catch(async (error) => {
      // console.log("Inside catch block of runTestsWithTimeout : " + error);
      if (error === "Time limit exceeded") {
        vscode.window.showErrorMessage("Time limit exceeded!!");
        if (os === 1) {
          // Kill the executing process
          exec(
            "taskkill /F /IM a.exe",
            (error: any, stdout: any, stderr: any) => {
              if (error) {
                console.log(
                  `Could not kill timed out process.\nError: ${error.message}`
                );
              }
              if (stderr) {
                console.log(
                  `Could not kill timed out process.\nstderr: ${stderr}`
                );
              }
            }
          );
        }
      }

      return "Run time error";
    });
};

const runTests = async (
  inputFilePath: string,
  codeOutputFilePath: string,
  testsFolderPath: string,
  stderrFilePath: string,
  os: number
): Promise<any> => {
  let runCommand: string;

  if (os === 0) {
    // Command for linux
    runCommand = `./a.out < "${inputFilePath}" > "${codeOutputFilePath}"`;
  } else if (os === 1) {
    // Command for windows
    runCommand = `a.exe < "${inputFilePath}" > "${codeOutputFilePath}"`;
  } else {
    vscode.window.showErrorMessage("Operating System not supported.");
    return;
  }

  try {
    return new Promise(async (resolve, reject) => {
      exec(runCommand, async (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(`Runtime Error: ${error}`);
          await reportError(error.message, "Run Time", testsFolderPath);
          reject(error.message);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          fs.writeFileSync(stderrFilePath, stderr, (err: any) => {
            if (err) {
              vscode.window.showErrorMessage("Could not write stderr.");
            }
          });
        } else if (fs.existsSync(stderrFilePath)) {
          fs.unlinkSync(stderrFilePath, (err: any) => {
            console.log(err);
          });
        }
        // console.log("Output Written.");
        resolve(stdout);
      });
    });
  } catch (err) {
    console.log("Run time error: " + err);
  }
};

const reportError = async (
  error: string,
  errorType: string,
  testsFolderPath: string
): Promise<void> => {
  const click: string | undefined = await vscode.window.showErrorMessage(
    `${errorType} Error!!!`,
    "Show Error"
  );
  if (click === "Show Error") {
    const errorFilePath: string = `${testsFolderPath}error.txt`;
    fs.writeFileSync(errorFilePath, error, (err: any) => {
      if (err) {
        vscode.window.showErrorMessage("Could not display error message.");
      }
    });
    vscode.window.showTextDocument(vscode.Uri.file(errorFilePath), {
      preview: false,
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: true,
    });
  }
};

const compareOutputs = async (
  outputFilePath: string,
  codeOutputFilePath: string
): Promise<boolean> => {
  // Code to compare the expected output and the obtained output

  let expectedOutput: string = await readFile(outputFilePath);

  let obtainedOutput: string = await readFile(codeOutputFilePath);

  expectedOutput = refine(expectedOutput);
  obtainedOutput = refine(obtainedOutput);

  // console.log("Expected Output : ");
  // for(let i = 0; i<expectedOutput.length; i++) {
  //     console.log(expectedOutput.charCodeAt(i));
  // }
  // console.log(expectedOutput);
  // console.log("Obtained Output : ");
  // for(let i = 0; i<obtainedOutput.length; i++) {
  //     console.log(obtainedOutput.charCodeAt(i));
  // }
  // console.log(obtainedOutput);

  // console.log(expectedOutput === obtainedOutput);

  if (expectedOutput === obtainedOutput) {
    return true;
  } else {
    return false;
  }
};

const refine = (content: string): string => {
  content = content.trim();
  content = content.replace(/\r/g, "");
  content = content.replace(/ \n/g, "\n");

  return content;
};

const pathRefine = (filePath: string, os: number): string => {
  let path = String(filePath);
  path = path.replace(/\%20/g, " ");
  path = path.replace(/\%21/g, "!");
  path = path.replace(/\%28/g, "(");
  path = path.replace(/\%29/g, ")");
  path = path.replace(/\%23/g, "#");
  path = path.replace(/\%27/g, "'");
  path = path.replace(/\%2C/g, ",");
  path = path.replace(/\%3A/g, ":");
  path = path.replace(/\%2B/g, "+");
  path = path.replace(/\%3D/g, "=");
  if (os === 1) {
    // For Windows
    path = path.slice(8);
  } else {
    // For Linux
    path = path.slice(7);
  }

  return path;
};

const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error: any, fileContent: string) => {
      if (error !== null) {
        reject(error);
        return;
      }

      resolve(fileContent);
    });
  });
};
