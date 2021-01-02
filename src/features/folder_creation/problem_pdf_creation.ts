const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs").promises;
import { assert } from 'console';
import { ProblemClass } from '../../classes/problem';

export const fetchProblemPdf = async (
    problem: ProblemClass,
    problemFolderPath: string
): Promise<void> => {
    // TODO : Fill in code for fetching problem pdf
};