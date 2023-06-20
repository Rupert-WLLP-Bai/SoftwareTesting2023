# SoftwareTesting2023
软件测试-2023-春-小作业-测试工具

## 文档
后端：[backend/README.md](backend/README.md)

后端版本: v1.0.0

更新时间：2023年6月20日21:38:36

## 如何使用
1. 安装依赖
```bash
npm install
```

2. 启动后端
```bash
cd backend
npm run start
```

3. 启动前端
```bash
npm run serve
```

4. 访问前端
> http://localhost:8080


## 目录结构
```
SoftwareTesting2023
│
├── backend                 // 后端代码和相关文档
│   ├── .eslintrc.js        // ESLint 配置文件
│   ├── .gitignore          // Git 忽略规则文件
│   ├── README.md           // 后端 README 文件
│   ├── api.md              // API 文档
│   ├── package-lock.json   // NPM 锁文件，包含项目依赖版本信息
│   ├── package.json        // 包含项目依赖和配置信息的文件
│   ├── pnpm-lock.yaml      // pnpm 锁文件，包含项目依赖版本信息
│   ├── server.ts           // 服务器配置文件
│   └── tsconfig.json       // TypeScript 配置文件
│
├── public                  // 前端公共文件
│   ├── favicon.ico         // 网站图标
│   └── index.html          // 主 HTML 文件
│
├── src                     // 源代码
│   ├── assets              // 静态资源
│   ├── components          // Vue 组件
│   ├── data                // 数据文件
│   ├── App.vue             // 主 Vue 组件
│   └── main.js             // 主 JavaScript 文件
│
├── testCaseData            // 测试用例数据
│   ├── issue_001_triangle_testcase.csv
│   ├── issue_002_calendar_boundary_testcase.csv
│   ├── issue_004_computer_sell_testcase.csv
│   ├── issue_007_testcase_edge.csv
│   ├── issue_007_testcase_equal.csv
│   ├── issue_009_testcase.csv
│   ├── issue_010_calendar_ec_testcase.csv
│   ├── issue_011_calendar_decision_testcase.csv
│   ├── issue_017_1.csv
│   ├── issue_017_2.csv
│   ├── issue_017_3.csv
│   ├── issue_017_4.csv
│   └── issue_017_5.csv
│
├── .gitignore              // Git 忽略规则文件
├── LICENSE                 // 许可证文件
├── README.md               // 仓库说明文件
├── babel.config.js         // Babel 配置文件
├── jsconfig.json           // JavaScript 配置文件
├── package-lock.json       // NPM 锁文件，包含项目依赖版本信息
├── package.json            // 包含项目依赖和配置信息的文件
├── pnpm-lock.yaml          // pnpm 锁文件，包含项目依赖版本信息
├── vue.config.js           // Vue 项目配置文件
└── yarn.lock               // Yarn 锁文件，包含项目依赖版本信息

```