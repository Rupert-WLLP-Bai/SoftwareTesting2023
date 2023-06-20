<template>
  <div class="console">
    <el-scrollbar height="550px">
      <div style="float:right;margin-right:20px">
        <el-button type="primary" @click="saveToFile" round><el-icon>
            <Download />
          </el-icon>下载为文件</el-button>
      </div>

      <el-table :data="outputs" style="width: 100%">
        <el-table-column prop="testCaseId" label="testCaseId" />
        <el-table-column prop="testCaseInput" label="testCaseInput" />
        <el-table-column prop="expectedOutput" label="expectedOutput" />
        <!-- <el-table-column prop="result" label="result" />  -->
        <!-- 需要给result加上排序 -->
        <el-table-column prop="result" label="result" sortable>
          <template #default="{row}">
            <el-tag v-if="row.result === false" type="danger">失败</el-tag>
            <el-tag v-else-if="row.result === true" type="success">成功</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-scrollbar>

  </div>
</template>
  
<script>
export default {
  props: {
    outputs: {
      type: Array,
      required: true
    },
  },
  methods: {
    saveToFile() {
      const currentTime = new Date().toISOString().replace(/[-:.]/g, ""); // 当前时间作为文件名
      const fileName = `output_${currentTime}.csv`;

      const csvContent = "\ufeff" + this.outputs.map(e => `${e.testCaseId},${e.testCaseInput},${e.expectedOutput},${e.result}`).join("\n");
      const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", fileName);
      document.body.appendChild(link); // 用于在 Firefox 中正常工作

      link.click(); // 触发下载操作

      document.body.removeChild(link); // 清理创建的临时链接元素

    }
  },
  mounted() {
  },
  watch: {
    outputs() {
      // console.log(this.outputs);
      this.outputs.forEach(output => {
        // eslint-disable-next-line no-unused-vars
        const { testCaseId, expectedOutput, ...rest } = JSON.parse(output.testCaseInput);
        console.log("testCaseId:", testCaseId);
        // console.log("expectedOutput:", expectedOutput);
        // console.log("rest:", rest);
        output.testCaseId = testCaseId;
        output.expectedOutput = expectedOutput;
        // 把rest转化为string
        output.testCaseInput = JSON.stringify(rest);
      });
    }
  }
}
</script>
  
<style scoped>
.console {
  height: 100%;
}

.console-item {
  font-size: 14px;
  padding: 2px;
}
</style>
  