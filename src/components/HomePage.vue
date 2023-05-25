<template>
  <div class="home">
    <el-row style="height: 97%;">
      <el-col :span="14">
        <div class="left-main">
          <div class="title">
            <div style="display: flex;align-items: center;"><h3 style="margin: 0;">题目：</h3>{{selectedQuestion.title}}</div>
            <el-dropdown >
              <el-button type="link">
                题目选择<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu :key="question.id"  v-for="question in questionList">
                  <el-dropdown-item  @click="selectQuestion(question)">{{question.title}}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="description">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ selectedQuestion.description }}
          </div>
          <div>
            <h3 style="margin: 0;margin-left:10px">代码实现</h3>
          </div>
          
          <div class="codeBox">
            <el-scrollbar >
              <codemirror
                v-model="code"
                placeholder="Code goes here..."
                style="min-height: 480px"
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
              <TestingView />
            </el-tab-pane>

            <el-tab-pane label="控制台">
              <ConsoleOutput :outputs="consoleOutput" />
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
import ConsoleOutput from './ConsoleOutput.vue';
import TestingView from './TestingView.vue';
import questionListData from '../data/question.js';

export default {
  components:{
    Codemirror,
    ConsoleOutput,
    TestingView,
  },
  setup(){
      const code = ref("//coding here")
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
      questionList: questionListData,
      selectedQuestion:{
        id: null,
        title: null,
        description: "描述一下描述一下描述一下描述一下"
      },
      consoleOutput: [
        { id: 1, text: 'Running test case 1...' },
        { id: 2, text: 'Initializing system components...' },
        { id: 3, text: 'Component A initialized.' },
        { id: 4, text: 'Component B initialized.' },
        { id: 5, text: 'System initialization complete.' },
        { id: 6, text: 'Executing test steps...' },
        { id: 7, text: 'Test step 1 completed successfully.' },
        { id: 8, text: 'Test step 2 completed successfully.' },
        { id: 9, text: 'Test step 3 completed successfully.' },
        { id: 10, text: 'All test steps executed.' },
        { id: 11, text: 'Test case 1 encountered a non-critical issue.' },
        { id: 12, text: 'Test case 1 failed. Reason: Assertion failed in test step 4.' },
        { id: 13, text: 'Running test case 2...' },
        { id: 14, text: 'Initializing system components...' },
        { id: 15, text: 'Component A initialized.' },
        { id: 16, text: 'Component B initialized.' },
        { id: 17, text: 'System initialization complete.' },
        { id: 18, text: 'Executing test steps...' },
        { id: 19, text: 'Test step 1 completed successfully.' },
        { id: 20, text: 'Test step 2 completed successfully.' },
        { id: 21, text: 'Test step 3 completed successfully.' },
        { id: 22, text: 'All test steps executed.' },
        { id: 23, text: 'Test case 2 passed successfully.' },
      ],

    }
  },
  methods: {
    selectQuestion(question) {
      this.selectedQuestion  = question;
    }
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
