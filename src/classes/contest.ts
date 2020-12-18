import {ProblemClass} from "./problem";

export class ContestClass{
    problems: ProblemClass[];
    name: string;
    contestID: string;
    contestLink: string;

    constructor(contestID:string){
        this.problems = [];
        this.name = '';
        this.contestID = contestID;
        this.contestLink = `https://codeforces.com/contest/${this.contestID}`;
    }
};