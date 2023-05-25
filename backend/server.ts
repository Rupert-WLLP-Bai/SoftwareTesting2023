import express, { Express, Request, Response } from 'express';
import multer, { Multer } from 'multer';
import csv from 'csv-parser';
import mongoose, { Document, Schema, Model, Mongoose } from 'mongoose';
import fs from 'fs';
import winston, { Logger } from 'winston';
import { runCLI } from 'jest';
import { Config } from '@jest/types';
import ts from 'typescript';

// 定义测试结果的接口
interface ITestResult extends Document {
  timestamp: Date;
  functionId: string;
  testCaseId: string;
  result: boolean;
}

// 创建日志记录器
const logger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// 创建 Express 应用程序实例
const app: Express = express();
const upload: Multer = multer({ dest: 'uploads/' });

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost/testtool');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// 创建测试结果数据模型
const TestResultSchema: Schema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  functionId: String,
  testCaseId: String,
  result: Boolean,
});

const TestResult: any = mongoose.model('TestResult', TestResultSchema);

// 定义函数的信息结构
interface FunctionInfo {
  name: string;
  params: string[];
  body: string;
}

/**
 * 处理函数代码，解析函数信息
 * @param code 函数代码
 * @returns 函数信息对象或 null
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
 * 在语法树中查找函数声明
 * @param node 当前节点
 * @returns 函数声明或 undefined
 */
function findFunctionDeclaration(node: ts.Node): ts.FunctionDeclaration | undefined {
  if (ts.isFunctionDeclaration(node)) {
    return node;
  }

  return node.forEachChild(findFunctionDeclaration);
}

/**
 * 调用函数并返回结果
 * @param functionInfo 函数信息
 * @param inputParams 输入参数
 * @returns 函数执行结果
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
 * 运行函数测试
 * @param functionInfo 函数信息
 * @param testCases 测试用例
 * @returns 测试结果的 Promise
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
        const result = results.testResults[0].testResults.map((testResult) => {
          const { title, status, failureMessages } = testResult;
          return {
            title,
            status,
            failureMessages,
          };
        });

        logger.debug(`Test result: ${JSON.stringify(result)}`);

        fs.unlinkSync(tempTestFile);

        resolve(result);
      })
      .catch(reject);
  });
}

/**
 * 运行测试的 HTTP POST 路由处理函数
 * @param req 请求对象
 * @param res 响应对象
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

// 设置运行测试的 HTTP POST 路由
app.post('/run-tests', upload.fields([{ name: 'function', maxCount: 1 }, { name: 'testcases', maxCount: 1 }]), handleRunTests);

// 启动服务器
app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
