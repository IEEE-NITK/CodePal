import fetch from "node-fetch";
import { ContestClass } from "../classes/contest";
import { ProblemClass } from "../classes/problem";

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
        for (let i:number = 0; i < users.result.length; i++) {
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

  static fetchProblems = async (
      tags: Array<string> = [], 
      fromRating: number = 0, 
      toRating: number = 3500
  ): Promise<ProblemClass[]> => {
      let url = 'https://codeforces.com/api/problemset.problems';

      // Appending the tags to the url
      if(tags.length) {
          url = `${url}?tags=`;
      }
      tags.forEach((element) => {
          url = `${url}${element};`;
      });

      console.log(url);

      try {
          // Fetching the problems using the codeforces problemset API call
          const response = await fetch(url);
          if(response.ok) {
              const jsonResponse = await response.json();
              let problems: ProblemClass[] = [];

              // Filtering the problems based on rating, and making a list of problem objects 
              // res is the json response obtained from the API call
              jsonResponse.result.problems.forEach((element: any) => {
                  if(element.rating >= fromRating && element.rating <= toRating) {
                      const p = new ProblemClass (element.contestId, element.index, element.name, element.tags, element.rating);
                      problems.push(p);
                  } 
              });
              return problems;
          }
      }
      catch(error) {
          throw new Error(error);
      }

      return [];
  };
}
