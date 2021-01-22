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
                    let c = new ContestClass(contestID, type,users.result[i].name);
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
            type === ContestTreeEnum.futureContestType
                ? vscode.TreeItemCollapsibleState.None
                : vscode.TreeItemCollapsibleState.Collapsed,
            type,
            contest
            );
        }
    );
    const noContestFoundTreeItem=new ContestTreeItem('No Contests Found','empty',vscode.TreeItemCollapsibleState.None);
    return contestsMap.length===0?[noContestFoundTreeItem]:contestsMap;
};