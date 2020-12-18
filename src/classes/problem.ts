export class ProblemClass {
    index: string;
    contestID: string;
    problemID: string;
    name: string;
    tags: string[];
    rating: string;
    problemsetLink: string;
    contestLink: string;

    constructor (contestID: string, problemIndex: string, problemName = '', tags = [], rating = '') {
        this.index = problemIndex;
        this.contestID = contestID;
        this.problemID = contestID + problemIndex;
        this.name = problemName;
        this.tags = tags;
        this.rating = rating;
        this.problemsetLink = `https://codeforces.com/problemset/problem/${contestID}/${problemIndex}`;
        this.contestLink = `https://codeforces.com/contest/${contestID}/problem/${problemIndex}`;
    }
};