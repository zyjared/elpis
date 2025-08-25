<script setup lang="ts">
import { computed } from 'vue'
import { useMenuStore } from '@/store/menu'
import { useProjectStore } from '@/store/project'
import HeaderContainer from '@/widgets/header-container/header-container.vue'

const {
  projectName,
} = defineProps<{
  projectName: string
}>()
// const route = useRoute()
const menuStore = useMenuStore()
const projectStore = useProjectStore()
const showMoreProject = computed(() => projectStore.projectList.length > 1)

function handleProjectCommand(command: string) {

}
</script>

<template>
  <HeaderContainer :title="projectName">
    <template #menu>
      <slot name="menu" />
    </template>
    <template #setting>
      <el-dropdown @command="handleProjectCommand">
        <span class="project-name">
          {{ projectName }}
          <el-icon v-if="showMoreProject" class="el-icon--right"><el-icon-arrow-down /></el-icon>
        </span>
        <template v-if="showMoreProject" #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="project in projectStore.projectList"
              :key="project.key"
              :command="project.key"
              :disabled="project.name === projectName"
            >
              {{ project.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <slot />
  </HeaderContainer>
</template>

<style scoped lang="scss">
.project-name {
  cursor: pointer;
  color: var(--el-color-primary);
 display: flex;
 align-items: center;
 outline: none;
}

:deep(.el-menu--horizontal.el-menu) {
  border-bottom: 0;
}
</style>
