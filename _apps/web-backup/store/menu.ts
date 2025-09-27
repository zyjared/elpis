import type { ModelMenuItem } from '~/types/model'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface FindMenuItemOptions {
  key?: string
  sider?: boolean
}

function _findProjectMenuItem(menuList: ModelMenuItem[], key: string): ModelMenuItem | null {
  for (const item of menuList) {
    if (item.key === key) {
      return item
    }
    if (item.menuType === 'group' && item.subMenu) {
      const menu = _findProjectMenuItem(item.subMenu, key)
      if (menu) {
        return menu
      }
    }
  }
  return null
}

function _findSiderMenuItems(menuList: ModelMenuItem[], key: string): ModelMenuItem[] | null {
  for (const item of menuList) {
    if (item.key === key) {
      if (item.menuType === 'group') {
        ElMessage.error('该菜单是 group 类型，无 sider 配置')
        return null
      }

      if (item.moduleType !== 'sider') {
        ElMessage.error('该菜单不是 sider 类型')
        return null
      }

      const { siderConfig } = item

      if (!siderConfig?.menu) {
        ElMessage.error('缺少 sider 配置')
        return null
      }

      return siderConfig?.menu
    }

    if (
      item.menuType === 'module'
      && item.moduleType === 'sider'
      && item.siderConfig?.menu
    ) {
      const result = _findSiderMenuItems(item.siderConfig?.menu, key)
      if (result) {
        return result
      }
    }
  }

  return null
}

function _findIframeMenuItem(menuList: ModelMenuItem[], key: string) {
  for (const item of menuList) {
    if (item.key === key && item.menuType === 'module' && item.moduleType === 'iframe') {
      return item
    }
  }
  return null
}

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<ModelMenuItem[]>([])

  function setMenuList(menus: ModelMenuItem[]) {
    menuList.value = menus
  }

  function findProjectMenuItem(key: string): ModelMenuItem | null {
    return _findProjectMenuItem(menuList.value, key)
  }

  function findSiderMenuItems(key: string): ModelMenuItem[] | null {
    return _findSiderMenuItems(menuList.value, key)
  }

  function findIframeMenuItem(key: string) {
    return _findIframeMenuItem(menuList.value, key)
  }

  return {
    menuList,
    setMenuList,
    findProjectMenuItem,
    findSiderMenuItems,
    findIframeMenuItem,
  }
})
