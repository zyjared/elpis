import type { DashboardModel } from 'docs/dashboard-model'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<DashboardModel['menu']>([])

  function setMenuList(menus: DashboardModel['menu']) {
    menuList.value = menus
  }

  return {
    menuList,
    setMenuList,
  }
})
