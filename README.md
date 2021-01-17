# CodePal 
A Visual Studio Code Extension to help Codeforces Users ***Code with Convenience.*** This extension is specially for people who want to save time in a live codeforces contest and upsolve problems comfortably. This extension responds quickly to users. It can swiftly filter through the problem list by specifying tags and ratings, create folders for contests and problems containing sample tests of each problem in them and compile and run tests automatically. For added convenience we've created buttons to directly open problem statements and submission pages on the default browser. 

# Features of this Extension
- View Complete ProblemSet List along with their associated tags and ratings. 
- Swiftly Filter through the ProblemSet by specifying Ratings and Tags.
- View Currently Running , Upcoming and all Past contests. 
- Fast Folder Creation on a single click for Contests from the Codeforces contest list and Problems from the Codeforces problem list.
  - Folder for a contest contains a folder for each problem and also contain all sample test cases and program files for each problem.
  - Folder for a problem consists of all its sample test cases and a program file loaded with a template whose path may be specified in the settings.
- Add additional tests to any problem.
- Compile and run any program file against the testcases and get comprehensive results.
- Open problem statement or submission page with a single click on your default browser.(You must be logged into codeforces before hand to open the submission page successfully)
- Compiler may be selected and compilation flags can be set through the codepal settings. 

# Languages Supported
- C++ (compiler : g++)
- C (compiler : gcc)
- Java (compiler : javac)
- Python 
- Note : You may add additional compilation flags through the codepal settings (example : -std=c++14) and also choose between python and python3 depending upon the version you prefer.

# Usage Guide 
The following is the usage guide to use the following features : 

1) Filtering problems
- Click on the ‘Filter’ icon to filter the problem set.
- Add the lower bound for problem’s rating (default lower bound is 0)
- Add the upper bound for problem’s rating (default upper bound is 4000)
- Tick the tags you want for the problems. (if no tags are selected, all tags will be 
displayed)

2) Creating problem folder
- Click on the ‘Create Problem Folder’ button beside the problem name to open a problem folder containing the cpp file and test cases. (make sure you have opened a folder on vscode where you want the problem folder)

3) Creating contest folder
- Click on the type of contest you want to participate. (Past, Running or Future)
- Click on the ‘Create Contest Folder’ button beside the contest name to open a contest folder containing the problems folders of each problem of the contest. (make sure you have opened a folder on vscode where you want the problem folder)

4) Viewing problems
- Click on the ‘View problem statement’ button on the top right side of the cpp file to open the problem statement in your default browser

5) Submitting problems
- Click on the ‘Submit problem statement’ button on the top right side of the cpp file to submit the problem in your default browser

6) Add test cases
- Click on the ‘Add Test cases’ button on the top right side of the cpp file to add manual test cases for the problem.

7) Run test cases
- Click on the ‘Run Test cases’ button on the top right side of the cpp file to run the code for all sample and manual test cases.

8) Adding your own template
- 

9) Change language from settings
- 


# Contributing 
We're glad you'd like to contribute to CodePal. Please claim an issue from the issue list and you may then start working on it. You may also create a new issue incase you'd like to propose a new feature in the extension. Please refer [Developer Docs](CONTRIBUTING.md) for more help.









