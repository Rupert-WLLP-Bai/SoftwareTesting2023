/**
 * Author: Norfloxaciner Bai
 * Version: V0.1.2 fix-2
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
 * 2021.05.25 - V0.1.2-fix-1
 *                     - Fix bugs in storing test results to MongoDB
 *                     - Made MongoDB connection and handling asynchronous
 *                     - Made file handling and test execution asynchronous
 *                     - Added optimization suggestions in issues section
 * 2021.05.26 - V0.1.2-fix-2
 *                    - 传入的函数只能使用JS语法，不能使用TS语法
 *                    - 传入的函数只能有一个
 *                    - 传入的函数的参数默认是string类型，需要进行类型转换
 *                    - TODO: 传入的函数可以有很多个, 但是用于测试的函数只能有一个
 *
 * Issues:
 * 1. The structure of the test results stored in MongoDB needs to be modified. Currently, the functionId and testCaseId are saved as the function's name and the complete output of the test case, respectively. They should be changed to the function's ID and the test case's ID.
 * 2. Based on Issue 1, change the stored fields to functionId, functionName, testCaseId, testCaseInput, testCaseOutput, result (true/false), timestamp, and message (error message).
 * 3. The functionCode and testCasesFile handling in handleRunTestsString can be optimized by using async/await.
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
  functionName: string;
  testCaseId: string;
  testCaseInput: string;
  testCaseOutput: string;
  result: boolean;
  message: string;
}

// Create a logger
const logger: Logger = winston.createLogger({
      // 输出的日志格式 [时间] [日志级别] [日志内容]
      // 不同的日志级别使用不同的颜色
      // 日志级别设置为:debug
      // 注意对齐
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] [${info.level}] ${info.message}`
        )
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] [${info.level}] ${info.message}` 
            )
          ),
        }),
        new winston.transports.File({
          filename: 'logs/server.log',
          level: 'debug',
        }),
      ],
});

// Create an Express application instance
const app: Express = express();
const upload: Multer = multer({ dest: 'uploads/' });

// Connect to the MongoDB database
async function connectToDatabase() {
  try {
    const host = '119.3.154.46';
    const port = '27017';
    const database = 'testtool';
    const uri = `mongodb://${host}:${port}/${database}`;
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }); // Connect to MongoDB
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Create the test result data model
const TestResultSchema: Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  functionId: String,
  functionName: String,
  testCaseId: String,
  testCaseInput: String,
  testCaseOutput: String,
  result: Boolean,
  message: String,
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
  console.debug(`Calling function ${functionInfo.name} with parameters ${JSON.stringify(inputParams)}`);
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
async function runTests(functionInfo: FunctionInfo, testCases: any[]): Promise<any> {
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
          const { testcaseId, ...input } = testCase; // Extract testcaseId from the testCase object
          Object.keys(input).forEach((column) => {
            if (functionInfo.params.includes(column)) {
              inputParams[column] = JSON.parse(input[column]);
            }
          });

          const output = callFunction(functionInfo, inputParams);

          const expectedOutput = testCase.expectedOutput;
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
          const { title, status, failureMessages } = testResult;
          const match = title.match(/Test case (\d+): ({[^}]+})/); // Match the test case number and input parameters
          if (!match) {
            logger.error(`Error parsing test case: ${title}`);
            return null;
          }
          const testCaseId = testCases[Number(match[1])].testcaseId; // Get the testcaseId from the corresponding test case object
          return {
            /*
             * Update the test result data structure
             * - Remove the functionId field
             * - Use the testcaseId from the test case object
             * - Use the input and expectedOutput fields from the test case object
             */
            functionName: functionInfo.name,
            testCaseId: testCaseId,
            testCaseInput: JSON.stringify(testCases[Number(match[1])]),
            testCaseOutput: '',
            result: status === 'passed',
            message: failureMessages.join('\n'),
          };
        });

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

  fs.createReadStream(testCasesFile.path, { encoding: 'utf8' })
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
app.post(
  '/run-tests',
  upload.fields([{ name: 'function', maxCount: 1 }, { name: 'testcases', maxCount: 1 }]),
  handleRunTests
);

/**
 * Request handler for running tests from string
 * @param req The request object
 * @param res The response object
 * @returns Promise of the test results
 * @throws Error if the test cases file is empty
 * @throws Error if the function code is empty
 * @throws Error if the function code is invalid
 * @throws Error if the test cases file is invalid
 * @throws Error if there is an error running the tests
 */
/**
 * Request handler for running tests from string
 * @param req The request object
 * @param res The response object
 * @returns Promise of the test results
 * @throws Error if the test cases file is empty
 * @throws Error if the function code is empty
 * @throws Error if the function code is invalid
 * @throws Error if the test cases file is invalid
 * @throws Error if there is an error running the tests
 */
app.post('/run-tests-string', upload.single('testcases'), async (req: Request, res: Response) => {
  logger.info('Running tests from string...');
  // logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  const functionCode = req.body.functionCode ? req.body.functionCode : null;
  // If functionCode doesn't exist, throw an exception
  if (!functionCode) {
    logger.warn('Empty function code.');
    return res.status(400).send('Empty function code.');
  }
  const testCasesFile = req.file ? req.file : null;
  // If testCasesFile doesn't exist, throw an exception
  if (!testCasesFile) {
    logger.warn('Empty test cases file.');
    return res.status(400).send('Empty test cases file.');
  }

  logger.debug(`Function code: ${functionCode}`);
  logger.debug(`Test cases file: ${testCasesFile}`);

  if (!functionCode) {
    logger.warn('Empty function code.');
    return res.status(400).send('Empty function code.');
  }

  const testCases: any[] = [];

  const functionInfo = parseFunctionCode(functionCode);
  if (!functionInfo) {
    logger.warn('Invalid function code.');
    return res.status(400).send('Invalid function code.');
  }

  const stream = fs.createReadStream(testCasesFile.path);
  stream
    .pipe(csv())
    .on('data', (data) => {
      testCases.push(data);
    })
    .on('end', async () => {
      logger.debug(`Test cases: ${JSON.stringify(testCases)}`);
      try {
        const results = await runTests(functionInfo, testCases);
        const savePromises = results.map((result: any) => {
          const testResult = new TestResult(result);
          return testResult.save();
        });

        await Promise.all(savePromises);
        res.json(results);  // 返回200 ERROR 如何处理
      } catch (error) {
        logger.error('Error running tests.', error);
        res.status(500).send('Error running tests.');
      }
    });
});

// 配置跨域
import cors from 'cors';


// Start the server
connectToDatabase()
  .then(() => {
    app.use(cors());
    app.listen(3000, () => {
      logger.info('Server is running on port 3000');
    });
  })
  .catch((error) => {
    logger.error('Error starting server:', error);
  });
