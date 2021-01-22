import * as vscode from "vscode";
import { ProblemsProvider } from "../../data_providers/problems/problem_data_provider";
import { ProblemTags } from "../../utils/consts";

const allTags:string[] = [ProblemTags.tagsByOR,"2-sat","binary search","bitmasks","brute force","chinese remainder theorem","combinatorics","constructive algorithms","data structures","dfs and similar","divide and conquer","dp","dsu","expression parsing","fft","flows","games","geometry","graph matchings","graphs","greedy","hashing","implementation","interactive","math","matrices","meet-in-the-middle","number theory","probabilities","schedules","shortest paths","sortings","string suffix structures","strings","ternary search","trees","two pointers"];
const isNum = (val:string) => /^\d+$/.test(val); // check if a string has only digits


export const filterProblems = async (problemProvider: ProblemsProvider):Promise<void> =>{
    
    let fromRating = await vscode.window.showInputBox({placeHolder:"Enter the rating's lower limit. Leave blank for defaulting to 0."}); 
    let toRating = await vscode.window.showInputBox({placeHolder:"Enter the rating's upper limit. Leave blank for defaulting to 4000."}); 
    let tags : string[] = []; // read tags here with quick input and assign to the variable

    if(typeof(fromRating)==="string" && typeof(toRating)==="string"){

        if(toRating==="" || !isNum(toRating)){
            toRating = "4000";
        }
        if(fromRating==="" || !isNum(fromRating)){
            fromRating = "0";
        }

        const quickPick = vscode.window.createQuickPick();
        quickPick.items = allTags.map(label => ({ label }));
        quickPick.canSelectMany = true;
        
        quickPick.onDidAccept(() => {

            quickPick.selectedItems.forEach(item => {
            tags.push(item.label);
            });
        
            quickPick.hide();

            problemProvider.refresh(parseInt(String(fromRating)),parseInt(String(toRating)),tags);
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }
};