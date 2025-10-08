<script setup lang="ts">
import type { ProjectModelConfig } from '@/types'
import { onBeforeMount, shallowRef } from 'vue'
import { curl } from '@/utils/curl'

const groups = shallowRef<ProjectModelConfig[]>([])

async function loadGroups() {
  const res = await curl<ProjectModelConfig[]>({
    url: '/api/project/models',
    method: 'get',
  })

  if (!res.success) {
    return
  }

  groups.value = res.data
}

onBeforeMount(async () => {
  await loadGroups()
})

function goProject(groupId: string, projectId: string) {
  location.assign(`/view/admin#/?model_id=${groupId}&project_id=${projectId}`)
}
</script>

<template>
  <section class="mb-12">
    <h2>所有项目</h2>
    <p>
      分组展示不同模型下的项目，相同模型下的项目间可相互跳转。
    </p>
  </section>

  <el-empty v-if="groups.length === 0" />

  <section v-for="g in groups" :key="g.id">
    <h3>{{ g.title }}</h3>
    <p class="text-gray-500">
      {{ g.description }}
    </p>
    <el-empty v-if="!g.projects?.length" />
    <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <el-card v-for="p in g.projects" :key="p.id">
        <template #header>
          <h4>{{ p.title }}</h4>
        </template>
        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ p.id }}</span>
            <el-button type="primary" @click="goProject(g.id, p.id)">
              Go
            </el-button>
          </div>
        </template>
        <p>{{ p.description }}</p>
      </el-card>
    </div>
  </section>
</template>
