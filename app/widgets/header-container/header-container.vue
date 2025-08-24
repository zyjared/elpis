<script setup lang="ts">
interface Props {
  title?: string
  userName?: string
}

const { title = 'Elpis', userName = '陵游' } = defineProps<Props>()

function handleUserCommand(command: string) {
  // eslint-disable-next-line no-console
  console.log('command', command)
}
</script>

<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row align="middle" justify="space-between" class="header-row">
        <!-- header 左侧标题 -->
        <el-row align="middle" class="title-panel">
          <img src="@/asserts/logo.png" alt="logo" class="logo">
          <el-row>{{ title }}</el-row>
        </el-row>
        <!-- header 菜单 -->
        <el-row align="middle" class="menu-panel">
          <slot name="menu" />
        </el-row>

        <!-- header 右侧 -->
        <el-row align="middle" class="setting-panel" :gutter="10">
          <slot name="setting" />
          <img src="@/asserts/avatar.jpg" alt="avatar" class="avatar">
          <el-dropdown @command="handleUserCommand">
            <span>
              <span class="dropdown-link">
                {{ userName }}<el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="main">
      <slot name="main" />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  overflow: hidden;
}

.header {
  border-bottom: 1px solid #88888880;

  .header-row {
    height: 100%;
    padding: 0 1rem;

    .title-panel {

      .logo {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }

    .setting-panel {
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .dropdown-link {
        cursor: pointer;
        color: var(--el-color-primary);
        display: flex;
        align-items: center;
      }
    }

  }
}

:deep(.el-header) {
  padding: 0;
}

:deep(.el-tooltip__trigger) {
  outline: none;
}
</style>
