export interface MenuItem {
  id: string
  title: string
  children?: MenuItem[]
  disabled?: boolean
  onClick?: (item: MenuItem) => void
}
