# 后端测试

## v0.1.2 fix-1

**更新历史：**

- **2023年5月25日23:53:10** - v0.1.2 fix-1版本发布
  - 修复将测试结果存储到MongoDB中的错误
  - 将MongoDB连接和处理改为异步操作
  - 将文件处理和测试执行改为异步操作
  - 在问题部分添加了优化建议

**问题：**

1. 需要修改存储在MongoDB中的测试结果的结构。目前，`functionId`和`testCaseId`分别保存为函数的名称和测试用例的完整输出。应将它们改为函数的ID和测试用例的ID。
2. 根据问题1，将存储的字段改为`functionId`、`functionName`、`testCaseId`、`testCaseInput`、`testCaseOutput`、`result`（true/false）、`timestamp`和`message`（错误信息）。
3. 可以通过使用async/await来优化`handleRunTestsString`中的`functionCode`和`testCasesFile`处理。

## v0.1.2

**更新历史：**

- **2023年5月25日21:08:18** - v0.1.2版本发布
  - 添加函数调用和测试用例执行
  - 修复将测试结果存储到MongoDB中的错误

**问题：**

1. 存储在MongoDB中的测试结果的结构还需要修改。目前保存的`functionId`和`testCaseId`是函数的名称和测试用例的完整输出。需要改为函数的ID和测试用例的ID。
2. 在问题1的基础上，将存储的字段改为`functionId`、`functionName`、`testCaseId`、`testCaseInput`、`testCaseOutput`、`result`（true/false）、`timestamp`和`message`（错误信息）。

## v0.1.1

**更新历史：**

- **2023年5月25日18:09:18** - v0.1.1版本发布
  - 使用TypeScript重构了server.js

## v0.1.0

**更新历史：**

- **2023年5月25日15:08:18** - v0.1.0版本发布
  - 实现了基本的server.js（使用Express）
  - 支持传输函数文件和csv文件
  - 返回解析的结果json

示例函数文件（`__test_function__.js`）：

```javascript
function add(a, b){
    // Convert a and b to numbers
    try{
        a = Number(a);
        b = Number(b);
    }catch(e){
        return NaN;
    }
    return (a + b).toString();
}

module.exports = add;
```

示例CSV文件（`test_cases.csv`）：

```csv
a,b,expectedOutput
1,2,3
4,5,9
10,20,30
11,22,31
```

解析的结果json示例：

```json
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
        "failureMessages": ["Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m\n\nExpected: [32m\"3[7m1[27m\"[39m\nReceived: [31m\"3[7m3[27m\"[39m\n    at toEqual (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\__temp_test__.js:42:26)\n    at Object.<anonymous> (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-each@29.5.0\\node_modules\\jest-each\\build\\bind.js:79:13)\n    at Promise.then.completed (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\utils.js:293:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\utils.js:226:10)\n    at _callCircusTest (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:297:40)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at _runTest (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:233:3)\n    at _runTestsForDescribeBlock (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:135:9)\n    at _runTestsForDescribeBlock (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:130:9)\n    at run (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\run.js:68:3)\n

    at runAndTransformResultsToJestFormat (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\legacy-code-todo-rewrite\\jestAdapterInit.js:122:21)\n    at jestAdapter (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-circus@29.5.0\\node_modules\\jest-circus\\build\\legacy-code-todo-rewrite\\jestAdapter.js:79:19)\n    at runTestInternal (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-runner@29.5.0\\node_modules\\jest-runner\\build\\runTest.js:367:16)\n    at runTest (C:\\Users\\17621\\Desktop\\SE-Testing-2023\\node_modules\\.pnpm\\jest-runner@29.5.0\\node_modules\\jest-runner\\build\\runTest.js:444:34)"
        ]
    }
]
```

### 问题

1. 建议迁移到TypeScript，以便进行类型检查。
2. 返回的JSON应该简明地显示哪个用例出现问题，以及实际结果和期望结果的比对（参考jest命令行的比对输出）。
3. 存储在MongoDB中的数据存在一些问题。
