import fetch from "node-fetch";
import * as vscode from "vscode";
import { ProblemClass } from "../../classes/problem";
import { ProblemTreeItem } from "../../data_providers/problems/problem_tree_item";
import { updateSubmissionStatus } from "./submission_status";
import { Urls, tagsByOR, statusofproblem, ProblemTreeEnum, SubmissionStatus} from "../../utils/consts";
import * as path from 'path';

const problemsList = async (
): Promise<ProblemClass[]> => {

    try {
        // Fetching the problems using the codeforces problemset API call
        const response = await fetch(Urls.fetchProblemSet);
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
    catch(error) {}

    return [];
};

export const fetchProblems = async (): Promise<ProblemTreeItem[]> => {
    let problems: ProblemClass[] = await problemsList();
    problems = await updateSubmissionStatus(problems);
    return problems.map<ProblemTreeItem> (
        (problem: ProblemClass): ProblemTreeItem => {
            let problemLabel: string = `${problem.name} (${(problem.rating === 0 ? "Not yet defined" : problem.rating)})`;
            let iconPath: string = "";
            if(problem.submissionStatus !== SubmissionStatus.unattempted) {
                iconPath = problem.submissionStatus === SubmissionStatus.accepted 
                    ? path.join(__filename, '..', '..', 'res', 'svg', 'green-tick.png') 
                    : path.join(__filename, '..', '..', 'res', 'svg', 'cross-mark.png');
            }

            return new ProblemTreeItem (
                problemLabel,
                ProblemTreeEnum.problemContextValue,
                vscode.TreeItemCollapsibleState.Collapsed,
                problem,
                iconPath
            );
        }
    ); 
};

// returns true if the problem is within the given rating range
const validRating = ( 
    problem: ProblemClass | undefined, 
    fromRating: number, 
    toRating: number): boolean =>{
    if(problem === undefined || problem.rating === undefined){
        return false;
    }

    if(fromRating <= problem.rating && problem.rating <= toRating){
        return true;
    }
    else{
        return false;
    }
};

// returns the true if the problem has all the tags needed or atleast one depending on tagsByOR
const validTags = (
    problem: ProblemClass | undefined, 
    tags:string[]): boolean =>{ // 
    if(problem === undefined || problem.tags === undefined){
        return false;
    }

    if(tags.includes(tagsByOR)){ // union of all tags
        if(tags.length === 1 || tags.some(tag => problem.tags.includes(tag))){
            return true;
        }
        else{
            return false;
        }
    }

    else{ // intersection of all tags
        if(tags.length === 0 || tags.every(tag => problem.tags.includes(tag))){
            return true;
        }
        else{
            return false;
        }
    }
};

// returns the true if the problem status is the required one
const validStatus = (
    problem: ProblemClass | undefined, 
    status:string[]): boolean =>{ // 
    if(problem === undefined || problem.tags === undefined){
        return false;
    }

    if(status.length === 0 || status.includes(problem.submissionStatus)){
        return true;
    }
    else{
        return false;
    }
};

// filter the problems from already fetched list
export const filterProblems = (
    problems : ProblemTreeItem[],
    fromRating : number,
    toRating : number,
    tags : string[],
    statuses : string[]
) : ProblemTreeItem[] => {


    let filteredProblems : ProblemTreeItem[] = [];
    problems.forEach(function(problem : ProblemTreeItem) : void{
        let currentProblem : ProblemClass | undefined = problem.problem;
        

        if( currentProblem !== undefined && 
            validRating(currentProblem,fromRating,toRating) === true && 
            validTags(currentProblem,tags) === true && validStatus(currentProblem, statuses)) {

            filteredProblems.push(problem);
        }
    }); 

    // if the combination of filter results in no problem then display "No problem found"
    if(filteredProblems.length === 0){ 
        filteredProblems.push(new ProblemTreeItem (
            `No problem found`,
            "empty",
            vscode.TreeItemCollapsibleState.None,
        ));
    }
    return filteredProblems;
};
