<script setup lang="ts">
import type { DtoModelItem, DtoProject } from '~/types/model'
import { ElMessage } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { curl } from '~/shared/client/curl'
import HeaderContainer from '../../widgets/header-container/header-container.vue'

const loading = ref(false)

const modelList = ref<DtoModelItem[]>([])

async function getModelList() {
  loading.value = true
  const res = await curl({
    url: '/api/project/model_list',
    method: 'get',
    errorMessage: '获取项目列表失败',
  })
  modelList.value = res.data
  loading.value = false

  if (!res || (!res.success) || !res.data) {
    return
  }

  modelList.value = res.data
}

function onEnter(proj: DtoProject) {
  const homePage = proj.homePage
  if (!homePage) {
    ElMessage.error('该项目没有配置首页')
    return
  }
  window.open(`dashboard.html/#/${homePage}`.replace(/^\/+/, '/'), '_blank')
}

onBeforeMount(() => {
  getModelList()
})
</script>

<template>
  <HeaderContainer title="项目列表">
    <div v-loading="loading">
      <div v-for="item in modelList" :key="item.model?.key">
        <div class="model-panel">
          <!-- model -->
          <el-row align="middle">
            <div class="title">
              {{ item.model?.name }}
            </div>
          </el-row>

          <div class="divider" />

          <!-- project -->
          <el-row class="project-list">
            <el-card v-for="proj in item.project" :key="proj.key" class="project-card">
              <template #header>
                <div class="title">
                  {{ proj.name }}
                </div>
              </template>

              <div class="content">
                {{ proj.desc || '--------' }}
              </div>

              <template #footer>
                <el-row justify="end">
                  <el-button link type="primary" @click="onEnter(proj)">
                    打开
                  </el-button>
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </div>
  </HeaderContainer>
</template>

<style lang="scss" scoped>
.model-panel {
  margin: 20px 50px;
  min-width: 500px;

  .title {
    font-size: 25px;
    font-weight: bold;
    color: #e5e5e5;
  }

  .divider {
    margin-top: 10px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #88888880;
    width: 100%;
  }
}

.project-list {

    .project-card {
         margin-right: 30px;
         margin-bottom: 20px;
         width: 300px;

         .title {
            font-size: 17px;
            font-weight: bold;
            color: #47a2ff;
         }

        .content {
            height: 70px;
            color: darkgrey;
            font-size: 15px;
            overflow: auto;
        }
    }
}
</style>
