# Change Log

All notable changes to the "codepal" extension will be documented in this file.

## [1.1.2]
- Add more meaningful error messages. 

## [1.1.1]
- Fixed icon dimensions according to the new VS Code update 1.56.0.

## [1.1.0] 
- Added feature to manually create a folder for any problem or contest (No of problems to be specified manually along with name of contest or problem). 
- Added a feature to automatically copy code written by user when he clicks submit button. 
- Add a button in tree view to open problem statement to view problem before creating folder.
- Fixed [Issue #63](https://github.com/IEEE-NITK/CodePal/issues/63) by displaying future contests in ascending order. 
- Fixed [Issue #58](https://github.com/IEEE-NITK/CodePal/issues/58) by adding a provision in settings to specify generator file template path. 

## [1.0.1]
- Added a feature to filter problems based on submission status.
- Added a feature to copy the link of Codeforces problems and contests.
- Fixed a bug related to displaying submission status of contest problems.

## [1.0.0]
- Added a feature to stress test.
- Added a feature to accept handle and give a personalized experience by showing submission status on problems and user profile.
- Added Keyboard shortcuts for many features. 
- Fixed a bug by killing process after TLE on Linux/Mac

## [0.0.3]
- Fixed a bug regarding running of test cases on Windows Operating System, where a process that times out will have to be killed explicitly. 

## [0.0.2]
- Fixed g++,gcc run testcases features that were creating a.out on compiling in a folder without write access on MAC.
- Changed the file naming conventions for contests/problems folder creation because java needs file name same as class name and spaces and hyphens aren't allowed in a class name.

## [0.0.1] (First Release) 
- Added treeviews for viewing problem set and Contest list along with date and time of future contests. 
- Added feature to make problems explandable to show tags associated as well.
- Added feature to create a folder consisting of all sample tests for a contest or for any individual problem.
- Added feature to filter through problem set based on tags and rating. 
- Added Feature to Run test cases feature with language configurable in the settings. Languages that can be chosen are C,C++,Java,Python.Additional compilation flags may also be added through the codepal settings.
- Added feature to add additional test for any problem. 
- Added feature to directly open problem statement and Submission page on users default website. 


