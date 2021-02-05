import * as vscode from "vscode";
import fetch from "node-fetch";
import { ProfileTreeItem } from "../../data_providers/user_profile/profile_tree_item";
import { ProfileTreeEnum } from "../../utils/consts";
export const fetchUserInfoApi = async (
    codeforcesHandle: string
): Promise<ProfileTreeItem[]> => {
    let arr: ProfileTreeItem[] = [];
    arr.push(
        new ProfileTreeItem(
            `Handle: ` + codeforcesHandle,
            ProfileTreeEnum.codeforcesHandleExists,
            vscode.TreeItemCollapsibleState.None
        )
    );
    try {
        arr.push(...(await getInfo(codeforcesHandle)));
    } catch {}
    return arr;
};
const getTreeItem = (label: string): ProfileTreeItem => {
    return new ProfileTreeItem(
        label,
        "userInfo",
        vscode.TreeItemCollapsibleState.None
    );
};
const getInfo = async (
    codeforcesHandle: string
): Promise<ProfileTreeItem[]> => {
    const arr: ProfileTreeItem[] = [];
    const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`
    );
    if (response.ok) {
        const jsonResponse = await response.json();
        const userObj = jsonResponse.result[0];
        if (userObj.firstName || userObj.lastName) {
            arr.push(
                getTreeItem(`Name: ${userObj.firstName} ${userObj.lastName}`)
            );
        }
        arr.push(getTreeItem(`Rating: ${userObj.rating}`));
        arr.push(getTreeItem(`maxRating: ${userObj.maxRating}`));
        arr.push(getTreeItem(`contribution: ${userObj.contribution}`));
        arr.push(getTreeItem(`Rank: ${userObj.rank}`));
        arr.push(getTreeItem(`maxRank: ${userObj.maxRank}`));
        arr.push(getTreeItem(`Friend of: ${userObj.friendOfCount} Users`));
    }
    return arr;
};
