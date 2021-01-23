const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import { assert } from 'console';

import {ProblemClass} from "./problem";

export class ContestClass{
    problems: ProblemClass[] = [];
    name: string;
    contestID: number;
    contestLink: string;
    type: string;
    startTime: string;
    startDate: string;
    duration: string;

    constructor(contestID: number, type: string, name:string, startTime: string, startDate: string, duration: string){
        this.problems = [];
        this.name = name;
        this.type = type; // PAST, RUNNING OR FUTURE
        this.contestID = contestID;
        this.contestLink = `https://codeforces.com/contest/${this.contestID}`;
        this.startTime = startTime;
        this.startDate = startDate;
        this.duration = duration;
    }

    async init(){
        try{
            assert(this.type !== "FUTURE");
            const { data } = await axios.get(this.contestLink);
                                    
            const $ = cheerio.load(data);

            // const contestName = $('.rtable > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > a:nth-child(1)');
            // this.name = contestName.text();

            let problemIndices = $('table.problems > tbody > tr > td.id > a');
            let problemNames = $('tr > td > div > div > a');

            assert(problemIndices.length === problemNames.length);
            for(let i = 0; i < problemNames.length; i++){
                let index = $(problemIndices[i]).text().trim();
                let name = $(problemNames[i]).text().trim();

                let p = new ProblemClass(this.contestID, index, name);
                this.problems.push(p);
            }
        }
        catch{
            console.log('Could not find contest. Either the codeforces servers are down or internet connection is not stable');
        }
    }
};