export const enum Command {
    helloWorld = "codepal.helloWorld",
    setEditorLayout = "vscode.setEditorLayout",
    vscodeOpen = "vscode.open",
    reloadProblems = "codepal.reloadProblems",
    reloadContests = "codepal.reloadContests",
    copyContestURL = "codepal.copyContestURL",
    createContestDirectory = "codepal.createContestDirectory",
    registerContest = "codepal.registerContest",
    copyProblemURL = "codepal.copyProblemURL",
    copyContestProblemURL = "codepal.copyContestProblemURL",
    openContest = "codepal.openContest",
    openProblemURL = "codepal.openProblemURL",
    openContestProblem = "codepal.openContestProblem",
    createProblemDirectory = "codepal.createProblemDirectory",
    createContestProblemDirectory = "codepal.createContestProblemDirectory",
    runTestCases = "codepal.runTestCases",
    openProblemStatement = "codepal.openProblemStatement",
    submitProblem = "codepal.submitProblem",
    addTestCases = "codepal.addTestCases",
    getProblemFilters = "codepal.getProblemFilters",
    stressTest = "codepal.stressTest",
    createStressTestingFiles = "codepal.createStressTestingFiles",
    stopStressTesting = "codepal.stopStressTesting",
    manualProblemFolderCreation = "codepal.manualProblemFolderCreation",
    manualContestFolderCreation = "codepal.manualContestFolderCreation",
    openAclDocumentation = "codepal.openAclDocumentation",
    creatAclCombinedFile = "codepal.createAclCombinedFile"
}
export const codepalConfigName = "codepal";
export const enum CodepalConfig {
    compilationLanguage = "compilationLanguage",
    codeTemplatePath = "codeTemplatePath",
    generatorTemplatePath = "generatorTemplatePath",
    codeforcesHandle = "codeforcesHandle",
    numberOfStressTestingTestCases = "numberOfStressTestingTestCases",
    enableAclSupport = "enableAclSupport"
}
export const enum TreeViewIDs {
    contests = "codepalContests",
    problems = "codepalProblems",
    profile = 'codepalProfile'
}
export const enum SubmissionStatus {
    unattempted = "unattempted",
    accepted = "OK",
    failed = "FAILED"
}
export const enum CompilationLanguages {
    cpp = "g++",
    gcc = "gcc",
    java = "java",
    python = "python",
    python2 = "python2",
    python3 = "python3",
    kotlin =  "kotlin"

}
export const enum CompilationFlags {
    cpp = "g++ CompilationFlags",
    gcc = "gccCompilationFlags",
    java = "javaCompilationFlags",
    python = "pythonCompilationFlags",
    kotlin = "kotlinCompilationFlags",
}
export const enum ContestsPhase {
    finished = "FINISHED",
    coding = "CODING",
    before = "BEFORE",
}
export const enum ContestTreeEnum {
    runningContestType = "Running",
    futureContestType = "Future",
    pastContestType = "Past",
    contestLabel = "contest",
    futureContestLabel = "FutureContest",
    contestProblemType = "ContestProblem",
    contestTypeContextValue = "ContestType",
}
export const enum ProblemTreeEnum {
    problemContextValue = "problem",
}
export const enum ProfileTreeEnum {
    codeforcesHandleUndefined = "codeforcesHandleUndefined",
    codeforcesHandleExists = "codeforcesHandleExists"
}
export enum RatingsEnum {
    initialFromRating = 0,
    initialToRating = 4000,
}
export enum Urls {
    fetchContestsList = "https://codeforces.com/api/contest.list?gym=false",
    fetchProblemSet = "https://codeforces.com/api/problemset.problems",
    userInfo = "https://codeforces.com/api/user.info?handles"
}

export enum OS {
    linuxMac,
    windows
}
export const enum ErrorCodes {
    fileExists = "EEXIST",
    folderExists = "EEXIST",
    notFound = "ENOENT",
    noAccessPermission = "EACCES",
    noWritePermission = "EROFS" 
}
export const enum Errors {
    timeLimitExceeded = "Time limit exceeded",
    runTimeError = "Run time error"
}
export const tagsByOR: string = "*combine tags by OR";
export const allTags: string[] = [
    tagsByOR,
    "2-sat",
    "binary search",
    "bitmasks",
    "brute force",
    "chinese remainder theorem",
    "combinatorics",
    "constructive algorithms",
    "data structures",
    "dfs and similar",
    "divide and conquer",
    "dp",
    "dsu",
    "expression parsing",
    "fft",
    "flows",
    "games",
    "geometry",
    "graph matchings",
    "graphs",
    "greedy",
    "hashing",
    "implementation",
    "interactive",
    "math",
    "matrices",
    "meet-in-the-middle",
    "number theory",
    "probabilities",
    "schedules",
    "shortest paths",
    "sortings",
    "string suffix structures",
    "strings",
    "ternary search",
    "trees",
    "two pointers",
];

export const statusOfProblem: string[] = [
    "unattempted",
    "OK",
    "FAILED",
];

export const generatorTemplate = {
    cpp:
        `#include <bits/stdc++.h>

using namespace std;

signed main(signed argc, char* argv[]){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    srand(atoi(argv[1]));

    // generate test cases with same format as given in problem

    return 0;
}`,

    c:
        `#include <stdio.h>
#include <stdlib.h>

int main(signed argc, char* argv[]){
    srand(atoi(argv[1]));

    // generate test cases with same format as given in problem

    return 0;
}
`,

    python:
        `import sys, random

random.seed(int(sys.argv[1]))

# generate test cases with same format as given in problem

`,

    python2:
        `import sys, random

random.seed(int(sys.argv[1]))

# generate test cases with same format as given in problem

`,

    python3:
        `import sys, random

random.seed(int(sys.argv[1]))

# generate test cases with same format as given in problem

`,

    java:
        `import java.util.*;
public class gen {
    public static void main(String[] args)
    {
        Random r = new Random();
        r.setSeed(Integer.parseInt(args[0]));
        // generate test cases with same format as given in problem

    }
}
`,
    kotlin:
        `import java.util.*

        val random = Random()
        
        fun rand(from: Int, to: Int) : Int {
            return random.nextInt(to - from) + from
        }
        fun main(){
            var r = rand(1, 100);
        }
`
};

export let stressTestingFlag = {
    stop: false as boolean
};

export let extensionPaths = {
    path: '' as String,
    libraryPath: '' as String,
    expanderPyPath: '' as String
};

export let tle = {
    tleFlag: false as boolean
};

export const maxLimitOfTestCases = 10000;
export const minLimitOfTestCases = 10;
export const timeLimit = 6000; // 6000 milliseconds
