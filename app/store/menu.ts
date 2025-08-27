import type { ModelMenuItem } from '~/types/model'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<ModelMenuItem[]>([])

  function setMenuList(menus: ModelMenuItem[]) {
    menuList.value = menus
  }

  return {
    menuList,
    setMenuList,
  }
})
