import fetch from "node-fetch";
import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { ProblemTreeItem } from "../../data_providers/problems/problem_tree_item";

const problemsList = async (
): Promise<ProblemClass[]> => {

    let url = 'https://codeforces.com/api/problemset.problems';

    console.log(url);

    try {
        // Fetching the problems using the codeforces problemset API call
        const response = await fetch(url);
        if(response.ok) {
            const jsonResponse = await response.json();
            let problems: ProblemClass[] = [];

            // res is the json response obtained from the API call
            jsonResponse.result.problems.forEach((element: any) => {
                const p = new ProblemClass (element.contestId, element.index, element.name, element.tags, element.rating);
                problems.push(p); 
            });
            return problems;
        }
    }
    catch(error) {
        throw new Error(error);
    }

    return [];
};

export const fetchProblems = async (): Promise<ProblemTreeItem[]> => {
    let problems: ProblemClass[] = await problemsList();
    return problems.map<ProblemTreeItem> (
        (problem: ProblemClass): ProblemTreeItem => {
            return new ProblemTreeItem (
                `${problem.name} ( ${(problem.rating === 0 ? "Not yet defined" : problem.rating)} )`,
                "problem",
                vscode.TreeItemCollapsibleState.Collapsed,
                problem
            );
        }
    ); 
};

// filter the problems from already fetched list
export const filterProblems = (
    problems : ProblemTreeItem[],
    fromRating : number,
    toRating : number,
    tags : string
    ) : ProblemTreeItem[] => {
    let filteredProblems : ProblemTreeItem[] = [];
    problems.forEach(function(problem : ProblemTreeItem) : void{
    let currentProblem : ProblemClass | undefined = problem.problem;
    if(currentProblem && currentProblem.rating){
        if(currentProblem.rating >= fromRating && currentProblem.rating <= toRating){
            filteredProblems.push(problem);
        }
    }
    });
    return filteredProblems;
};
