import fetch from "node-fetch";
import { ContestClass } from "../classes/contest";

export class CodePalAPI {
  static fetchContests = async (
    contestsType: string
  ): Promise<ContestClass[]> => {
    let arr: ContestClass[] = [];
    return fetch("https://codeforces.com/api/contest.list?gym=false")
      .then((response: any) => {
        if (!response.ok) {
          throw new Error(response.error);
        } else {
          return response.json();
        }
      })
      .catch((err: any) => {
        console.log("fetch error " + err);
        return arr;
      })
      .then(async (users: { result: string | any[] }) => {
        let i: number;
        for (i = 0; i < users.result.length; i++) {
          let contestID = users.result[i].id;
          let type = "";
          let x = users.result[i].phase;
          if (x === "FINISHED") {
            type = "Past";
          }
          if (x === "CODING") {
            type = "Running";
          }
          if (x === "BEFORE") {
            type = "Future";
          }
          if (type === contestsType) {
            let c = new ContestClass(contestID, type,users.result[i].name);
            arr.push(c);
          }
        }
        return arr;
      });
  };
}
