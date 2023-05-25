<template>
    <div class="testing">
      <h3>Step 1:上传测试用例</h3>
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :before-upload="beforeUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip" >
              csv files with a size less than 500kb
            </div>
          </template>
        </el-upload>
        
      </div>
      <h3>Step 2:开始运行程序</h3>
      <div class="button-area">
        <el-button type="primary" style="margin-top:20px" @click="startTesting">
          开始测试<el-icon class="el-icon--right"><Upload /></el-icon>
        </el-button>
      </div>
    </div>
  </template>
  
<script>
import { ElMessage } from 'element-plus'
// import axios from 'axios';
export default {
  props: {
    code: {
      type: String,
    }
  },
  data() {
      return {
          file: null,  // 用于存储上传的文件
      }
  },
  methods: {
    beforeUpload(file) {
      this.file = file;//将文件保存到本地后，在上传到官方的服务器上，但是我们只管本地就好了

      // 创建一个FileReader对象
      const reader = new FileReader();

      // 定义一个回调函数，它将在文件读取完成后执行
      reader.onload = (event) => {
        // event.target.result 包含了文件的文本内容
        console.log("文件内容："+event.target.result);
      };

      // 读取文件的文本内容
      reader.readAsText(file);

      return true;  //上不上传官方服务器改这里
    },
    startTesting() {
      if (!this.file || !this.code) {
        // 文件或代码未提供
        ElMessage({
          message: '未编写代码或者上传文件',
          type: 'warning',
        })
        return;
      }

      ElMessage({
          message: '上传成功，请耐心等待',
          type: 'success',
        })
      console.log(this.file);
      console.log(this.code);

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('code', this.code);
      
      // axios.post('url', formData, {
      //     headers: {
      //         'Content-Type': 'multipart/form-data',
      //     },
      // }).then(response => {
      //     // 请求成功后的处理逻辑
      //     console.log(response.data);
      // }).catch(error => {
      //     // 请求失败后的处理逻辑
      //     console.log(error);
      // });
      
    },
  },
  mounted(){
    //alert(this.code)
  }
};
</script>
  
<style scoped>
.testing{
  height: 100%;
}

.upload{
  width: 50%;
  margin: 0 auto; /* 水平居中 */
  text-align: center;
}
.button-area{
  margin: 0 auto; /* 水平居中 */
  text-align: center;
}
</style>