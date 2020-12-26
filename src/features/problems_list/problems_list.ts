import fetch from "node-fetch";
import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { ProblemTreeItem } from "../../data_providers/problems/problem_tree_item";

const problemsList = async (
    tags: Array<string> = [], 
    fromRating: number = 0, 
    toRating: number = 3500
): Promise<ProblemClass[]> => {

    let url = 'https://codeforces.com/api/problemset.problems';

    // Appending the tags to the url
    if(tags.length) {
        url = `${url}?tags=`;
    }
    tags.forEach((element) => {
        url = `${url}${element};`;
    });

    console.log(url);

    try {
        // Fetching the problems using the codeforces problemset API call
        const response = await fetch(url);
        if(response.ok) {
            const jsonResponse = await response.json();
            let problems: ProblemClass[] = [];

            // Filtering the problems based on rating, and making a list of problem objects 
            // res is the json response obtained from the API call
            jsonResponse.result.problems.forEach((element: any) => {
                if((fromRating === 0 && toRating === 3500) || (element.rating >= fromRating && element.rating <= toRating)) {
                    const p = new ProblemClass (element.contestId, element.index, element.name, element.tags, element.rating);
                    problems.push(p);
                } 
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
                `${problem.name}`,
                "problem",
                vscode.TreeItemCollapsibleState.None,
                problem
            );
        }
    ); 
};