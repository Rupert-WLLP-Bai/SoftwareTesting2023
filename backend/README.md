# 后端测试


## v0.1.2

2023年5月25日15:08:18
```js
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
 ```

## v0.1.0

2023年5月25日15:08:18

### Feature

1. 实现了基本的server.js(使用Express)
2. 可以传函数文件和csv文件

```JavaScript
// file: __test_function__.js

function add(a, b){
    // 把a,b转换成数字
    try{
        a = Number(a);
        b = Number(b);
    }catch(e){
        return NaN;
    }
    return (a + b).toString();
}

module.exports = add;
a,b,expectedOutput
1,2,3
4,5,9
10,20,30
11,22,31
```

1. 可以返回解析的结果json

```JSON
[
    {
        "title": "Test case 0: {\"a\": \"1\", \"b\": \"2\", \"expectedOutput\": \"3\"}",
        "status": "passed",
        "failureMessages": []
    },
    {
        "title": "Test case 1: {\"a\": \"4\", \"b\": \"5\", \"expectedOutput\": \"9\"}",
        "status": "passed",
        "failureMessages": []
    },
    {
        "title": "Test case 2: {\"a\": \"10\", \"b\": \"20\", \"expectedOutput\": \"30\"}",
        "status": "passed",
        "failureMessages": []
    },
    {
        "title": "Test case 3: {\"a\": \"11\", \"b\": \"22\", \"expectedOutput\": \"31\"}",
        "status": "failed",
        "failureMessages": ["Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m\n\nExpected: [32m\"3[7m1[27m\"[39m\nReceived: [31m\"3[7m3[27m\"[39m\n    at toEqual (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\__temp_test__.js:42:26)\n    at Object.<anonymous> (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-each@29.5.0\\node_modules\\jest-each\\build\\bind.js:79:13)\n    at Promise.then.completed (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\utils.js:293:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\utils.js:226:10)\n    at _callCircusTest (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:297:40)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at _runTest (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:233:3)\n    at _runTestsForDescribeBlock (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:135:9)\n    at _runTestsForDescribeBlock (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:130:9)\n    at run (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:68:3)\n    at runAndTransformResultsToJestFormat (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\legacy-code-todo-rewrite\\jestAdapterInit.js:122:21)\n    at jestAdapter (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\legacy-code-todo-rewrite\\jestAdapter.js:79:19)\n    at runTestInternal (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-runner@29.5.0\\node_modules\\jest-runner\\build\\runTest.js:367:16)\n    at runTest (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-runner@29.5.0\\node_modules\\jest-runner\\build\\runTest.js:444:34)"
        ]
    }
]
```

### Issue

1. 最好迁移到TypeScript，方便类型检查
2. 返回的JSON要简要的展示出哪个用例出的问题，actual和expectd的比对（参考jest命令行的比对）
3. MongoDB里面存的东西还有点问题

