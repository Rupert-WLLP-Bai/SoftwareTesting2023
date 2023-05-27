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

      console.log(this.file);
      console.log(this.code);

      const formData = new FormData();
      formData.append('testcases', this.file);
      
      // FIXME: 这里需要把代码存储在一个临时文件中，然后再把这个文件也加入到formData中
      // 把输入的代码存储在一个临时javascript文件中
      // 输出这个文件的路径和内容
      // 把这个文件也加入到formData中(key是function)

      

      axios
        .post('http://localhost:3000/run-tests', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    },
  },
  mounted() {
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
