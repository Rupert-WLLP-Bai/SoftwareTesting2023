<template>
  <div class="home">
    <el-row style="height: 97%;">
      <el-col :span="14">
        <div class="left-main">
          <div class="title">
            <h3 style="margin: 0;">题目：{{selectedQestion.title}}</h3>
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
          <div>
            <h3 style="margin: 0;margin-left:10px">代码实现</h3>
          </div>
          
          <div class="codeBox">
            <el-scrollbar >
              <codemirror
                v-model="code"
                placeholder="Code goes here..."
                :style="{ height: '100%' }"
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="extensions"
                @ready="handleReady"
                @change="log('change', $event)"
                @focus="log('focus', $event)"
                @blur="log('blur', $event)"
              />
            </el-scrollbar>
            
          </div>
        </div>
      </el-col>

      <!-- 右侧栏 -->
      <el-col :span="10">
        <div class="right-main">
          <el-tabs type="border-card" style="height:100%">
            <el-tab-pane label="测试">
              测试
            </el-tab-pane>

            <el-tab-pane label="控制台">
              控制台
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Codemirror   } from 'vue-codemirror'
import { ref, shallowRef } from 'vue';
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default {
  components:{
    Codemirror 
  },
  setup(){
    const code = ref("console.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\nconsole.log('Hello, world!')\n")
      const extensions = [javascript(), oneDark]

      // Codemirror EditorView instance ref
      const view = shallowRef()
      const handleReady = (payload) => {
        view.value = payload.view
      }

      return {
        code,
        extensions,
        handleReady,
        log: console.log,
      }
  },
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
        description: "描述一下描述一下描述一下描述一下"
      },

    }
  },
  methods: {
  },
  computed: {
    
  },
  mounted() {
  }

  
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

.codeBox {
  height: 480px;
  padding: 20px;
  font-family: Arial, monospace;
  font-size: 16px;
  letter-spacing: 1.5px;
  overflow-y: auto;
}
 
</style>
