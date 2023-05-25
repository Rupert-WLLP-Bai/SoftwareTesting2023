<template>
    <div class="console">
        <el-scrollbar height="550px">
            <div style="float:right;margin-right:20px">
                <el-button type="primary" @click="saveToFile" round ><el-icon><Download /></el-icon>下载为文件</el-button>
            </div>
            <div class="console-item" v-for="output in outputs" :key="output.id">
                {{ output.text }}
            </div>
        </el-scrollbar>
      
    </div>
  </template>
  
  <script>
  export default {
    props: {
      outputs: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .console {
    height: 100%;
  }
  .console-item{
    font-size: 14px;
    padding: 2px;
  }
  </style>
  