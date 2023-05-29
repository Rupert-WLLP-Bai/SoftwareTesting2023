<template>
  <div class="testing">
    <h3>Step 1: 上传测试用例</h3>
    <div class="upload">
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        :before-upload="beforeUpload"
        @change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            csv files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </div>
    <div v-if="tableData">
      <h3>上传的表格内容：</h3>
      <el-table :data="tableData" :style="{ height: tableHeight + 'px', overflowY: tableOverflow }">
        <el-table-column v-for="(header, index) in tableData[0]" :key="index" :label="header">
          <template v-slot="scope">
            {{ scope.row[index] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <h3>Step 2: 开始运行程序</h3>
    <div class="button-area">
      <el-button type="primary" style="margin-top:20px" @click="startTesting">
        开始测试<el-icon class="el-icon--right"><Upload /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import axios from 'axios';
export default {
  props: {
    code: {
      type: String,
    }
  },
  data() {
    return {
      file: null, // 用于存储上传的文件
      csvData: null, // 用于存储解析后的CSV数据
      tableData: null, // 用于存储表格的一部分内容
      tableHeight: 0, // 表格高度
      tableOverflow: 'auto', // 表格溢出样式
    }
  },
  methods: {
    beforeUpload(file) {
      this.file = file;
      return true;
    },
    handleFileChange() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.parseCSVData(event.target.result);
        };
        reader.readAsText(this.file);
      }
    },
    parseCSVData(csvText) {
      const rows = csvText.split('\n');
      const data = rows.map(row => row.split(','));
      this.csvData = data;
      this.tableData = data;

      // 自动调整表格高度
      this.adjustTableHeight();
    },
    adjustTableHeight() {
      const windowHeight = window.innerHeight;
      const tableOffsetTop = this.$el.offsetTop;
      const tableHeaderHeight = 40; // 假设表头高度为40px
      const tableRowCount = this.tableData.length;
      const maxTableHeight = windowHeight - tableOffsetTop - tableHeaderHeight;
      const rowHeight = 40; // 假设每行高度为40px
      const tableHeight = tableRowCount * rowHeight;

      if (tableHeight > maxTableHeight) {
        this.tableHeight = maxTableHeight;
        this.tableOverflow = 'scroll';
      } else {
        this.tableHeight = tableHeight;
        this.tableOverflow = 'auto';
      }
    },
    startTesting() {
      if (!this.file || !this.code) {
        ElMessage({
          message: '未编写代码或者上传文件',
          type: 'warning',
        });
        return;
      }

      ElMessage({
        message: '上传成功，请耐心等待',
        type: 'success',
      });

      // console.log(this.file);
      // console.log(this.code);

      const formData = new FormData();
      formData.append('testcases', this.file);
      formData.append('functionCode', this.code);

      // console.log(formData.get('testcases'));
      // console.log(formData.get('fucntionCode'));


      // axios配置跨域
      axios.defaults.withCredentials = false;
      axios.post('http://localhost:3000/run-tests-string', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        console.log(response);
        ElMessage({
          message: '测试结束',
          type: 'success',
        });
        // 在前端弹窗展示测试结果
        // response.data是一个数组
        // 最多展示前5个测试用例的结果
        const testResults = response.data.slice(0, 5);
        testResults.forEach((testResult) => {
          ElMessage({
            message: testResult,
            type: 'success',
          });
        });
      }).catch((error) => {
        console.log(error);
      })
    },

      // 测试跨域的函数
      testCors(){
        axios.defaults.withCredentials = false;
        axios.get('http://localhost:3000/cors').then((response) => {
          console.log(response);
          // 弹出提示
          ElMessage({
            message: response.data.message,
            type: 'success',
          });
        }).catch((error) => {
          console.log(error);
          // 弹出提示
          ElMessage({
            message: error.message,
            type: 'error',
          });
        })
      }
  },
  mounted() {
    // 调用一次parseCSVData，防止tableData为空
    this.parseCSVData('');
    // 测试跨域
    this.testCors();
    // 监听窗口大小变化
    window.addEventListener('resize', this.adjustTableHeight);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustTableHeight);
  },
};
</script>

<style scoped>
.testing {
  height: 100%;
}

.upload {
  width: 50%;
  margin: 0 auto; /* 水平居中 */
  text-align: center;
}

.button-area {
  margin: 0 auto; /* 水平居中 */
  text-align: center;
}

.el-table {
  width: 100%;
}

.el-table__body-wrapper {
  overflow-x: hidden;
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #888;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
