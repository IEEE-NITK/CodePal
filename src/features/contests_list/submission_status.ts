import fetch from "node-fetch";
import * as vscode from "vscode";

import {
    CodepalConfig,
    codepalConfigName,
    SubmissionStatus
} from "../../utils/consts";

export const submissionStatus = async (contestId : number): Promise<any> => {
    
    const codeforcesHandle: String | undefined = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.codeforcesHandle);

    if(codeforcesHandle === "") {
        return undefined;
    }

    let url: string = "https://codeforces.com/api/contest.status?";
    url = `${url}contestId=${contestId}&handle=${codeforcesHandle}`;
    // console.log(url);
    try {
        // fetching the list of submissions of the user
        const response = await fetch(url);
        if(response.ok) {
            const jsonResponse = await response.json();
            if(jsonResponse.status === SubmissionStatus.failed) {
                vscode.window.showErrorMessage("Invalid Codeforces handle");
                return undefined;
            }
            const submissions = jsonResponse.result;
            await submissions.sort((a: any, b: any) => {
                if (compareIds(a.problem.index, b.problem.index)) {
                    return -1;
                } else {
                    return 1;
                }
            });
            
            return submissions;
        }

    }
    catch(error) {
        console.log(error);
    }

    return undefined;
};

const compareIds = (
    problemIndex1: string, 
    problemIndex2: string
): boolean => {
    if (problemIndex1 < problemIndex2) {
        return true;
    } else {
        return false;
    }
};