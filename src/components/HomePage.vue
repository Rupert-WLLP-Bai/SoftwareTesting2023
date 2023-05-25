<template>
  <div class="home">
    <el-row style="height: 97%;">
      <el-col :span="14">
        <div class="left-main">
          <div class="title">
            <p>题目：{{selectedQestion.title}}</p>
            <el-dropdown >
              <el-button type="link">
                题目选择<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu :key="qestion.id" v-for="qestion in questionList">
                  <el-dropdown-item>{{qestion.title}}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="description">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ selectedQestion.description }}
          </div>
          <div class="code">

          </div>
        </div>
      </el-col>

      <!-- 右侧栏 -->
      <el-col :span="10">
        <div class="right-main">

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionList:[
        {
          id: 1,
          title: "三角形问题",
          description: 1
        },
        {
          id: 2,
          title: "万年历问题",
          description: 1
        },
      ],
      selectedQestion:{
        id: null,
        title: null,
        description: "描述一下"
      },
    }
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home{
  background-color: rgb(241, 241, 241);
  height: 93%;
}

.left-main{
  margin: 10px;
  padding: 10px;
  height: 97%;
  background-color: white;
}


.right-main{
  height: 97%;
  padding: 10px;
  margin: 10px;
  margin-left: 0px;
  background-color: white;
}

.title{
  color: rgba(var(--grey-8-rgb), 1);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  font-size: larger;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.description{
  padding: 10px;
}
</style>
