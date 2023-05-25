<template>
    <div class="testing">
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple

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

        <el-button type="primary">
          Upload<el-icon class="el-icon--right"><Upload /></el-icon>
        </el-button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const contents = e.target.result;
            // 这里是处理文件内容的逻辑
            console.log(contents);
          };
          reader.readAsText(file);
        }
      },
    },
  };
  </script>
  
<style scoped>
.testing{
  height: 100%;
}

.upload{
  width: 50%;
  margin: 0 auto; /* 水平居中 */
}

</style>