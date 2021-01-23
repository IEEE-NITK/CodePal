import fetch from "node-fetch";
import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";
import { ContestTreeItem } from "../../data_providers/contests/contest_tree_item";
import { ContestTreeEnum, ContestsPhase, Urls } from "../../utils/consts";

const contestsList = async (
    contestsType: string
): Promise<ContestClass[]> => {
    let arr: ContestClass[] = [];
    return fetch(Urls.fetchContestsList)
        .then((response: any) => {
            if (!response.ok) {
                throw new Error(response.error);
            } else {
                return response.json();
            }
        })
        .catch((err: any) => {
            return arr;
        })
        .then(async (users: { result: string | any[] }) => {
            for (let i:number = 0; i < users.result.length; i++) {
                let contestID = users.result[i].id;

                let sec : number = users.result[i].durationSeconds;
                //console.log(sec);

                let h : number = Math.floor(sec/3600);

                var hour : string = "";
                var minute : string = "";
                var second : string = "";

                (h >= 1) ? sec = sec - (h*3600) : hour = "";

                (h.toString().length<10) ? hour = '0' + h.toString() : hour = h.toString();
                
                let min : number = Math.floor(sec/60);

                (min >= 1) ? sec = sec - (min*60) : minute = "";
                (min.toString().length<10) ? minute = '0' + min.toString() : minute = min.toString();

                (sec.toString().length < 10) ? second = '0'+ sec.toString() : second = sec.toString();    

                var duration : string = hour + ':' + minute + ':' + second;

                //console.log(duration);

                var startDate = new Date(users.result[i].startTimeSeconds*1000).toLocaleDateString();
                //console.log(startDate);

                var startTime = new Date(users.result[i].startTimeSeconds*1000).toLocaleTimeString();

                //console.log(startTime);

                let type = "";
                let x = users.result[i].phase;
                if (x === ContestsPhase.finished) {
                    type = ContestTreeEnum.pastContestType;
                }
                if (x === ContestsPhase.coding) {
                    type = ContestTreeEnum.runningContestType;
                }
                if (x === ContestsPhase.before) {
                    type = ContestTreeEnum.futureContestType;
                }
                if (type === contestsType) {
                    let c = new ContestClass(contestID, type, users.result[i].name, startTime, startDate, duration);
                    arr.push(c);
                }
            }
            return arr;
        });
};

export const fetchContests = async (type: string): Promise<ContestTreeItem[]> => {
    let contests: ContestClass[] = await contestsList(type);
    const contestsMap= contests.map<ContestTreeItem> (
        (contest): ContestTreeItem => {
            return new ContestTreeItem(
            `${contest.name}`,
            type === ContestTreeEnum.futureContestType?ContestTreeEnum.futureContestLabel:ContestTreeEnum.contestLabel,
            (type === ContestTreeEnum.futureContestType) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
            type,
            contest
            );
        }
    );
    const noContestFoundTreeItem=new ContestTreeItem('No Contests Found','empty',vscode.TreeItemCollapsibleState.None);
    return contestsMap.length===0?[noContestFoundTreeItem]:contestsMap;
};