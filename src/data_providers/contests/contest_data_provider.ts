import * as vscode from "vscode";
import { ContestTreeItem } from "./contest_tree_item";
import { fetchContests } from "../../features/contests_list/contests_list";
import { submissionStatus } from "../../features/contests_list/submission_status";
import { ContestClass } from "../../classes/contest";
import { ContestTreeEnum } from "../../utils/consts";
import { SubmissionStatus } from "../../utils/consts";
import * as path from 'path';

export class ContestsProvider implements vscode.TreeDataProvider<ContestTreeItem> {
       
    private rootPath: string;

    constructor(private workspaceRoot: string) {
        this.rootPath = workspaceRoot;
    }   
    private _onDidChangeTreeData: vscode.EventEmitter<ContestTreeItem | undefined | void> = new vscode.EventEmitter<ContestTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ContestTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    reload():void {
        this.refresh();
    }

    getTreeItem(
        element: ContestTreeItem
    ): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(
        element?: ContestTreeItem
    ): vscode.ProviderResult<ContestTreeItem[]> {
        if (!element) {
            return this.getContestTypes();
        } else if (element.label === ContestTreeEnum.runningContestType) {
            return fetchContests(element.label);
        } else if (element.label === ContestTreeEnum.futureContestType && !element.contest) {
            return fetchContests(element.label);
        } else if (element.label === ContestTreeEnum.pastContestType) {
            return fetchContests(element.label);
        } else {
            if(element.contest && element.type === ContestTreeEnum.futureContestType){
                return this.constestStats(element.contest);
            }
            if (element.contest) {
                return this.fetchProblemsOfContest(element.contest);
            }
            return Promise.resolve([]);
        }
    }
    
    async fetchProblemsOfContest(
        contest: ContestClass
    ): Promise<ContestTreeItem[]> {
        if(!contest.problems.length) {
            await contest.init();
        }
        let submissionList : any = await submissionStatus(contest.contestID);
        
        return contest.problems.map<ContestTreeItem>((problem) => {
            if(submissionList !== undefined){
                let i : number;
                for(i= 0;i<submissionList.length;i++)
                {
                    if(submissionList[i].problem.index === problem.index && submissionList[i].verdict === "OK")
                    {
                        problem.submissionStatus = SubmissionStatus.accepted;
                        break;
                    }
                    if(submissionList[i].problem.index === problem.index)
                    {
                        problem.submissionStatus = SubmissionStatus.failed;
                        continue;
                    }
                }
            }
            let iconPath: string = "";
            if(problem.submissionStatus !== SubmissionStatus.unattempted) {
                iconPath = problem.submissionStatus === SubmissionStatus.accepted 
                    ? path.join(__filename, '..', '..', 'res', 'svg', 'green-tick.png') 
                    : path.join(__filename, '..', '..', 'res', 'svg', 'cross-mark.png');
            }

            return new ContestTreeItem(
                problem.name,
                "contestproblem",
                vscode.TreeItemCollapsibleState.None,
                "none",
                undefined,
                problem,
                iconPath     
            );
        });
    }
    getContestTypes(): Thenable<ContestTreeItem[]> {

        return Promise.resolve([
            new ContestTreeItem(
                ContestTreeEnum.runningContestType,
                ContestTreeEnum.contestTypeContextValue,
                vscode.TreeItemCollapsibleState.Collapsed
            ),
            new ContestTreeItem(
                ContestTreeEnum.futureContestType,
                ContestTreeEnum.contestTypeContextValue,
                vscode.TreeItemCollapsibleState.Collapsed
            ),
            new ContestTreeItem(
                ContestTreeEnum.pastContestType,
                ContestTreeEnum.contestTypeContextValue,
                vscode.TreeItemCollapsibleState.Collapsed
            ),
        ]);
    }

    constestStats(
        contest: ContestClass
    ): Thenable<ContestTreeItem[]> {
        let timing : string = "";
        let duration : string = "";
    
        timing = contest.startDate + ' '  + contest.startTime;
        duration = contest.duration;
    
        return Promise.resolve([
            new ContestTreeItem(
                `Timing : ${timing}`,
                "Timing",
                vscode.TreeItemCollapsibleState.None,
                "",
                contest,
                undefined,
                undefined
            ),
            new ContestTreeItem(
                `Duration : ${duration}`,
                "Duration",
                vscode.TreeItemCollapsibleState.None,
                "",
                contest,
                undefined,
                undefined
            ),
        ]);
    }

}
