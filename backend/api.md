## API 文档

该 API 允许您运行函数测试并将结果存储在 MongoDB 中。它提供了上传函数代码和测试用例文件的端点，以及从字符串运行测试的端点。

### 基本 URL

```
http://localhost:3000
```

### 端点

#### 1. 上传函数代码和测试用例

上传函数代码和测试用例文件。

- **URL**: `/upload-files`
- **方法**: `POST`
- **参数**:
  - `function` (文件): 函数代码文件 (JavaScript 文件)
  - `testcases` (文件): 测试用例文件 (CSV 文件)
- **示例**:

  ```
  curl -X POST -F "function=@function.js" -F "testcases=@testcases.csv" http://localhost:3000/upload-files
  ```

#### 2. 运行函数测试

根据上传的函数代码和测试用例运行函数测试。测试结果将存储在 MongoDB 数据库中。

- **URL**: `/run-tests`
- **方法**: `POST`
- **参数**:
  - `function` (文件): 函数代码文件 (JavaScript 文件)
  - `testcases` (文件): 测试用例文件 (CSV 文件)
- **示例**:

  ```
  curl -X POST -F "function=@function.js" -F "testcases=@testcases.csv" http://localhost:3000/run-tests
  ```

#### 3. 从字符串运行函数测试

根据提供的函数代码 (字符串形式) 和上传的测试用例文件运行函数测试。测试结果将存储在 MongoDB 数据库中。

- **URL**: `/run-tests-string`
- **方法**: `POST`
- **参数**:
  - `functionCode` (字符串): 函数代码 (JavaScript 代码)
  - `testcases` (文件): 测试用例文件 (CSV 文件)
- **示例**:

  ```
  curl -X POST -F "functionCode=function add(a, b) { return a + b; }" -F "testcases=@testcases.csv" http://localhost:3000/run-tests-string
  ```

### 示例

1. 上传函数代码和测试用例:

   ```
   curl -X POST -F "function=@function.js" -F "testcases=@testcases.csv" http://localhost:3000/upload-files
   ```

2. 运行函数测试:

   ```
   curl -X POST -F "function=@function.js" -F "testcases=@testcases.csv" http://localhost:3000/run-tests
   ```

3. 从字符串运行函数测试:

   ```
   curl -X POST -F "functionCode=function add(a, b) { return a + b; }" -F "testcases=@testcases.csv" http://localhost:3000/run-tests-string
   ```

### 使用方法

1. 确保已在计算机上安装了 Node.js 和 MongoDB。
2. 克隆仓库并进入项目目录。
3. 运行 `npm install` 安装依赖项。
4. 运行 `npm start` 启动服务器。
5. 使用类似 cURL 或 Postman 的工具向 API 端点发送请求。

### 响应格式

API 的响应以 JSON 格式返回，包含测试结果或错误