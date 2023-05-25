/**
 * Author: Norfloxaciner Bai
 * Version: V0.1.2
 * Date: 2023.05.25
 * License: MIT
 *
 * Description: This is a server-side script for running function tests and storing results in MongoDB.
 * The script is based on the following technologies:
 * - Express: https://expressjs.com/
 * - Multer: https://www.npmjs.com/package/multer
 * - CSV Parser: https://www.npmjs.com/package/csv-parser
 * - Mongoose: https://mongoosejs.com/
 * - Winston: https://www.npmjs.com/package/winston
 * - Jest: https://jestjs.io/
 * - TypeScript: https://www.typescriptlang.org/
 * - MongoDB: https://www.mongodb.com/
 * 
 * Update history:
 * 2021.05.25 - V0.1.0 - Initial version
 * 2021.05.25 - V0.1.1 - Add function information parsing
 * 2021.05.25 - V0.1.2 - Add function call and test case execution, fix bugs in storing test results to MongoDB
 * 
 * Issues:
 * 1. 存储在MongoDB中的测试结果的结构还需要修改, 现在保存的functionId和testCaseId是函数的名称和测试用例的完整输出, 需要修改为函数的ID和测试用例的ID
 * 2. 在Issue 1的基础上, 把存储的字段改为functionId, functionName, testCaseId, testCaseInput, testCaseOutput, result(true/false), timestamp, message(错误信息)
 */

import express, { Express, Request, Response } from 'express';
import multer, { Multer } from 'multer';
import csv from 'csv-parser';
import mongoose, { Document, Schema, Model } from 'mongoose';
import fs from 'fs';
import winston, { Logger } from 'winston';
import { runCLI } from 'jest';
import { Config } from '@jest/types';
import ts from 'typescript';

// Define the interface for the test result document
interface ITestResult extends Document {
  timestamp: Date;
  functionId: string;
  testCaseId: string;
  result: boolean;
}

// Create a logger
const logger: Logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Create an Express application instance
const app: Express = express();
const upload: Multer = multer({ dest: 'uploads/' });

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/testtool');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create the test result data model
const TestResultSchema: Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  functionId: String,
  testCaseId: String,
  result: Boolean,
});

const TestResult: Model<ITestResult> = mongoose.model<ITestResult>('TestResult', TestResultSchema);

// Define the function information structure
interface FunctionInfo {
  name: string;
  params: string[];
  body: string;
}

/**
 * Parse function code and extract function information
 * @param code The code of the function
 * @returns FunctionInfo object or null
 */
function parseFunctionCode(code: string): FunctionInfo | null {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.ES2015, true);
  const functionDeclaration = findFunctionDeclaration(sourceFile);

  if (!functionDeclaration) {
    return null;
  }

  const functionName = functionDeclaration.name?.getText(sourceFile);
  const params = functionDeclaration.parameters.map((param) => param.name.getText(sourceFile));
  const body = functionDeclaration.body?.getText(sourceFile);

  if (!functionName || !body) {
    return null;
  }

  return {
    name: functionName,
    params: params,
    body: body,
  };
}

/**
 * Find the function declaration in the syntax tree
 * @param node The current node
 * @returns Function declaration or undefined
 */
function findFunctionDeclaration(node: ts.Node): ts.FunctionDeclaration | undefined {
  if (ts.isFunctionDeclaration(node)) {
    return node;
  }

  return node.forEachChild(findFunctionDeclaration);
}

/**
 * Call the function with the given input parameters
 * @param functionInfo The function information
 * @param inputParams The input parameters
 * @returns The result of the function call
 */
function callFunction(functionInfo: FunctionInfo, inputParams: Record<string, any>): any {
  logger.debug(`Calling function ${functionInfo.name} with parameters ${JSON.stringify(inputParams)}`);
  const { name, params, body } = functionInfo;

  const functionCall = `${name}(${params.map((param) => inputParams[param]).join(', ')})`;

  try {
    const fn = new Function(...params, body);
    return fn(...Object.values(inputParams));
  } catch (error) {
    logger.error('Error calling function.', error);
    return null;
  }
}

/**
 * Run function tests
 * @param functionInfo The function information
 * @param testCases The test cases
 * @returns Promise of the test results
 */
function runTests(functionInfo: FunctionInfo, testCases: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const jestConfig: Config.InitialOptions = {
      silent: true,
      roots: [process.cwd()],
      testMatch: ['**/__temp_test__.ts'],
      testEnvironment: 'node',
    };

    let jestScript = `
  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
  };
  ${callFunction.toString()}
`;

    jestScript += `
      const functionInfo = ${JSON.stringify(functionInfo)};
      const testCases = ${JSON.stringify(testCases)};

      describe('Function Tests', () => {
        test.each(testCases)('Test case %#: %p', (testCase) => {
          const inputParams = {};
          Object.keys(testCase).forEach((column) => {
            if (functionInfo.params.includes(column)) {
              inputParams[column] = JSON.parse(testCase[column]);
            }
          });

          const output = callFunction(functionInfo, inputParams);
          
          const expectedOutput = JSON.parse(testCase.expectedOutput);
          expect(output).toEqual(expectedOutput);
        });
      });
    `;

    const tempTestFile = '__temp_test__.ts';
    fs.writeFileSync(tempTestFile, jestScript, 'utf8');

    runCLI(
      {
        config: JSON.stringify(jestConfig),
        _: [],
        $0: '',
      },
      [process.cwd()]
    )
      .then(({ results }) => {
        const testResults = results.testResults[0].testResults.map((testResult) => {
          const { title, status } = testResult;
          return {
            functionId: functionInfo.name,
            testCaseId: title,
            result: status === 'passed',
          };
        });

        logger.debug(`Test results: ${JSON.stringify(testResults)}`);

        fs.unlinkSync(tempTestFile);

        resolve(testResults);
      })
      .catch(reject);
  });
}

/**
 * Request handler for running tests
 * @param req The request object
 * @param res The response object
 */
async function handleRunTests(req: Request, res: Response) {
  logger.info('Running tests...');
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  logger.debug(`Files: ${JSON.stringify(files)}`);

  const functionFile = files['function']?.[0];
  const testCasesFile = files['testcases']?.[0];

  logger.debug(`Function file: ${functionFile}`);
  logger.debug(`Test cases file: ${testCasesFile}`);

  logger.debug(`Function file: ${functionFile.originalname}`);
  logger.debug(`Test cases file: ${testCasesFile.originalname}`);

  const functionCode = fs.readFileSync(functionFile.path, 'utf8');
  if (!functionCode) {
    logger.warn('Empty function code.');
    return res.status(400).send('Empty function code.');
  }
  logger.debug(`Function code: ${functionCode}`);

  const testCases: any[] = [];

  const functionInfo = parseFunctionCode(functionCode);
  if (!functionInfo) {
    logger.warn('Invalid function code.');
    return res.status(400).send('Invalid function code.');
  }

  fs.createReadStream(testCasesFile.path)
    .pipe(csv())
    .on('data', (data) => {
      testCases.push(data);
    })
    .on('end', () => {
      logger.debug(`Test cases: ${JSON.stringify(testCases)}`);
      runTests(functionInfo, testCases)
        .then((results) => {
          const savePromises = results.map((result: any) => {
            const testResult = new TestResult(result);
            return testResult.save();
          });

          Promise.all(savePromises)
            .then(() => {
              res.json(results);
            })
            .catch((err) => {
              logger.error('Error saving test results.', err);
              res.status(500).send('Error saving test results.');
            });
        })
        .catch((err) => {
          logger.error('Error running tests.', err);
          res.status(500).send('Error running tests.');
        });
    });
}

// Set up the route for running tests
app.post('/run-tests', upload.fields([{ name: 'function', maxCount: 1 }, { name: 'testcases', maxCount: 1 }]), handleRunTests);

// Start the server
app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
