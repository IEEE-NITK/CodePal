import fetch from "node-fetch";
import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";

import {
    CodepalConfig,
    codepalConfigName,
    SubmissionStatus
} from "../../utils/consts";

export const updateSubmissionStatus = async (
    problems: ProblemClass[]
): Promise<ProblemClass[]> => {

    const codeforcesHandle: String | undefined = vscode.workspace
        .getConfiguration(codepalConfigName)
        .get<String>(CodepalConfig.codeforcesHandle);

    if(codeforcesHandle === "") {
        return problems;
    }

    let url: string = "https://codeforces.com/api/user.status?";
    url = `${url}handle=${codeforcesHandle}`;
    // console.log(url);
    try {
        // fetching the list of submissions of the user
        const response = await fetch(url);
        if(response.ok) {
            const jsonResponse = await response.json();
            if(jsonResponse.status === SubmissionStatus.failed) {
                vscode.window.showErrorMessage("Invalid Codeforces handle");
                return problems;
            }
            const submissions = jsonResponse.result;
            await submissions.sort((a: any, b: any) => {
                if (compareIds(a.contestId, a.problem.index, b.contestId, b.problem.index)) {
                    return 1;
                } else {
                    return -1;
                }
            });

            // console.log(submissions.length);
            // console.log(problems.length);
            let problemIdx: number = 0;    // Iterator for the list of problem objects
            let submissionIdx: number = 0;  // Iterator for the list of submission objects
            while(submissionIdx < submissions.length && problemIdx < problems.length) {
                // console.log(submissions[i].contestId, submissions[i].problem.index);
                const submission: any = submissions[submissionIdx];
                // console.log(`${submission.problem.name} ${submission.contestId} ${submission.problem.index}`);
                while(problemIdx < problems.length && compareIds(submission.contestId, submission.problem.index, problems[problemIdx].contestID, problems[problemIdx].index)) {
                    problemIdx++;
                }
                let resolvedProblemIdx: number = problemIdx;
                if(submission.problem.name !== problems[problemIdx].name) {
                    let tempIdx: number = problemIdx + 1;
                    let problemFound: boolean = false;
                    while(tempIdx < problems.length && tempIdx <= (problemIdx + 15) )
                    {
                        if(problems[tempIdx].name === submission.problem.name) {
                            resolvedProblemIdx = tempIdx;
                            problemFound = true;
                            break;
                        }
                        tempIdx++;
                    }
                    // console.log(problemFound);
                    if(!problemFound) {
                        submissionIdx++;
                        continue;
                    }
                }
                // console.log(problemIdx);
                if(submission.verdict === SubmissionStatus.accepted) {
                    problems[resolvedProblemIdx].submissionStatus = SubmissionStatus.accepted;
                } else if(submission.verdict !== SubmissionStatus.accepted && problems[resolvedProblemIdx].submissionStatus === SubmissionStatus.unattempted) {
                    problems[resolvedProblemIdx].submissionStatus = SubmissionStatus.failed;
                }

                submissionIdx++;
            }

            return problems;
        }
    }
    catch(error) {
        console.log(error);
    }
    return problems;
};

const compareIds = (
    contestId1:number, 
    problemIndex1: string, 
    contestId2: number, 
    problemIndex2: string
): boolean => {
    if (contestId1 < contestId2) {
        return true;
    } else if (contestId1 === contestId2) {
        if (problemIndex1 < problemIndex2) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};