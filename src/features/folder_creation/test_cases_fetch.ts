const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import { assert } from 'console';
import { ProblemClass } from '../../classes/problem';

export const fetchTestCases = async (
    problem: ProblemClass,
    problemFolderPath: string
): Promise<void> => {
    // TODO : Fill in the code for test case fetching 
    // Create a folder called 'tests' inside the folder 'problemFolderPath' 
    // and create input and output text files of the sample test cases
};