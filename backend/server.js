// server.js

const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const fs = require('fs');
const jest = require('jest');
const winston = require('winston');  // 日志模块

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const app = express();
const upload = multer({ dest: 'uploads/' });

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost/testtool', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// 创建测试结果数据模型
const TestResultSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  functionId: String,
  testCaseId: String,
  result: Boolean,
});
const TestResult = mongoose.model('TestResult', TestResultSchema);

/**
 * 上传测试函数代码和测试用例文件
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
app.post('/run-tests', upload.fields([
  { name: 'function', maxCount: 1 },
  { name: 'testcases', maxCount: 1 },
]), (req, res) => {
  logger.info('Running tests...');
  const functionFile = req.files['function'][0];
  const testCasesFile = req.files['testcases'][0];
    logger.debug(`Function file: ${functionFile.originalname}`);
    logger.debug(`Test cases file: ${testCasesFile.originalname}`);
    
    // 读取测试函数代码文件, 如果为空则返回错误
    const functionCode = fs.readFileSync(functionFile.path, 'utf8');
    if (!functionCode) {
        logger.warn('Empty function code.');
        return res.status(400).send('Empty function code.');
    }
    logger.debug(`Function code: ${functionCode}`);
    
  const testCases = [];
  
  // 解析函数代码，提取输入和输出参数的信息
  const functionInfo = parseFunctionCode(functionCode);
  if (!functionInfo) {
    logger.warn('Invalid function code.');
    return res.status(400).send('Invalid function code.');
  }
  
  // 解析测试用例文件，如CSV
  fs.createReadStream(testCasesFile.path)
    .pipe(csv())
    .on('data', (data) => {
      // 处理每行测试用例数据
      testCases.push(data);
    })
    .on('end', () => {
    logger.debug(`Test cases: ${JSON.stringify(testCases)}`);
      // 执行测试
      runTests(functionInfo, testCases)
        .then((results) => {
          // 保存测试结果
          const savePromises = results.map((result) => {
            const testResult = new TestResult(result);
            return testResult.save();
          });
          
          Promise.all(savePromises)
            .then(() => {
              res.json(results);
            })
            .catch((err) => {
              logger.error('Error saving test results.');
              console.error(err);
              res.status(500).send('Error saving test results.');
            });
        })
        .catch((err) => {
          logger.error('Error running tests.');
          console.error(err);
          res.status(500).send('Error running tests.');
        });
    });
});

/**
 * 解析函数代码，提取输入和输出参数的信息
 * @param {string} code - Function code to parse
 * @returns {object|null} Parsed function info, or null if parsing fails
 */
function parseFunctionCode(code) {
  const functionRegex = /function\s*(\w*)\s*\(([\w\s,]*)\)\s*{([\s\S]*)}/;
  let matches;
  try {
    matches = code.match(functionRegex);
  } catch (e) {
    logger.error('Error parsing function code.');
    return null;
  }

  if (!matches) {
    return null;
  }

  const [, functionName, params, body] = matches;
  const inputParams = params.split(',').map((param) => param.trim());

  return {
    name: functionName,
    params: inputParams,
    body: body,
  };
}

/**
 * 调用测试函数，传入输入参数的值，并获取输出结果
 * @param {object} functionInfo - Function information
 * @param {object} inputParams - Input parameters
 * @returns {any} Function result
 */
function callFunction(functionInfo, inputParams) {
  logger.debug(`Calling function ${functionInfo.name} with parameters ${JSON.stringify(inputParams)}`);
  const { name, params, body } = functionInfo;

  const functionCall = `${name}(${params.map((param) => inputParams[param]).join(', ')})`;

  try {
    const fn = new Function(...params, body);
    return fn(...Object.values(inputParams));
  } catch (error) {
    logger.error('Error calling function.');
    console.error(error);
    return null;
  }
}

/**
 * 执行测试
 * @param {object} functionInfo - Function information
 * @param {array} testCases - Array of test cases
 * @returns {Promise} Promise object represents the test results
 */
function runTests(functionInfo, testCases) {
    return new Promise((resolve, reject) => {
        // 创建 Jest 配置
        const jestConfig = {
            roots: [process.cwd()],  // 将当前工作目录作为根目录
            testMatch: ['**/__temp_test__.js'], // 更改这里
            testEnvironment: 'node',
        };

        // 创建 Jest 测试脚本
        let jestScript = `
            const winston = require('winston');  // 日志模块

            const logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({ format: winston.format.simple() }),
            ],
            });
            ${callFunction.toString()}
        `
        // 添加测试函数代码
         jestScript += `
      const functionInfo = ${JSON.stringify(functionInfo)};
      const testCases = ${JSON.stringify(testCases)};
      
      describe('Function Tests', () => {
        test.each(testCases)('Test case %#: %p', (testCase) => {
          const inputParams = {};
          Object.keys(testCase).forEach((column) => {
            if (functionInfo.params.includes(column)) {
              inputParams[column] = testCase[column];
            }
          });
          
          const output = callFunction(functionInfo, inputParams);
          
          const expectedOutput = testCase.expectedOutput;
          expect(output).toEqual(expectedOutput);
        });
      });
    `;
        // 创建临时测试文件
        const tempTestFile = `__temp_test__.js`;
        fs.writeFileSync(tempTestFile, jestScript, 'utf8');

        // 执行 Jest 测试
        jest.runCLI(
            jestConfig, // 修改为传递 jestConfig 对象
            [process.cwd()] // 修改为传递一个包含当前项目目录的数组
        ).then(({results}) => {  // 修改为 Promise 形式
            // 读取测试结果
            const result = results.testResults[0].testResults.map((testResult) => {
                const { title, status, failureMessages } = testResult;
                return {
                    title,
                    status,
                    failureMessages,
                };
            });
            

            logger.debug(`Test result: ${JSON.stringify(result)}`);

            // 删除临时测试文件
            fs.unlinkSync(tempTestFile);

            resolve(result);
        }).catch(reject);
    });
}


app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
