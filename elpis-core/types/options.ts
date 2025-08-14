export interface ElpisStartOptions {
  /**
   * 基础路径
   *
   * @default process.cwd()
   */
  baseDir?: string
  /**
   * 业务文件路径
   *
   * @default './app'
   */
  businessDir?: string

  /**
   * render 页面的根路径
   *
   * @default './app/public/output'
   */
  pagesDir?: string

  /**
   * 主页
   *
   * 发生 404 时，重定向到主页
   */
  homePage?: string
}
