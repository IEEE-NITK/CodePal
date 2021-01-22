import * as vscode from "vscode";
import { ProblemTreeItem } from "./problem_tree_item";

import { ProblemClass } from "../../classes/problem";
import { RatingsEnum } from "../../utils/consts";
import { fetchProblems, filterProblems } from "../../features/problems_list/problems_filter";

export class ProblemsProvider
  implements vscode.TreeDataProvider<ProblemTreeItem> {
  private rootPath: string;
  private alreadyfetched : boolean;
  private fromRating : number;
  private toRating : number;
  private tags : string[];
  private allProblems : ProblemTreeItem[];

  constructor(private workspaceRoot: string) {
    this.alreadyfetched = false;
    this.fromRating = RatingsEnum.initialFromRating;
    this.toRating = RatingsEnum.initialToRating;
    this.tags = [];
    this.allProblems = [];
    this.rootPath = workspaceRoot;
  }
  
	private _onDidChangeTreeData: vscode.EventEmitter<ProblemTreeItem | undefined | void> = new vscode.EventEmitter<ProblemTreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ProblemTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  refresh(newFromRating : number,newToRating : number,newtags : string[]): void {
    this.fromRating = newFromRating;
    this.toRating = newToRating;
    this.tags = newtags;
    this._onDidChangeTreeData.fire();
  }
  
  reload():void {
    this.alreadyfetched = false;
    this.refresh(RatingsEnum.initialFromRating,RatingsEnum.initialToRating,[]);
  }

  getTreeItem(
    element: ProblemTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getAllProblems = async() : Promise<ProblemTreeItem[]> => {
      this.allProblems = await fetchProblems();
      this.alreadyfetched = true;
      return this.allProblems;
  };

  getChildren(
    element?: ProblemTreeItem
  ): vscode.ProviderResult<ProblemTreeItem[]> {
    if(this.alreadyfetched===false){
      return this.getAllProblems();
    }
    if (!element) {
      return filterProblems(this.allProblems,this.fromRating,this.toRating,this.tags);
    } else if (element.problem) {
      return this.problemStats(element.problem);
    } 
    
  }

  problemStats(
    problem: ProblemClass
    ): Thenable<ProblemTreeItem[]> {
    let tagList : string = "";
    
    for(let i = 0; i < problem.tags.length; i+=1){
      if (i === 0) {
        tagList += problem.tags[i];
      } else {
        tagList += " , " + problem.tags[i];
      }
    }
    
    return Promise.resolve([
      new ProblemTreeItem(
        `Tags : ${tagList}`,
        "tags",
        vscode.TreeItemCollapsibleState.None
      ),
    ]);
  }

}
