/**
 * 首页首帧主题与背景占位。
 *
 * 这段代码必须同步注入 dev HTML 和 production head，避免 VitePress hydration 前出现亮色白闪。
 * `welcome-overlay-shown` 是 HomeMotion 当前仍在使用的会话契约，历史命名暂不改动。
 */
export const firstPaintScript = `(function(){try{var d=document.documentElement,s=localStorage.getItem("vitepress-theme-appearance")||"auto",m=window.matchMedia("(prefers-color-scheme:dark)").matches;if(!s||s==="auto"?m:s==="dark")d.classList.add("dark");var p=location.pathname;if((p==="/"||p==="/index.html"||p.endsWith("/index"))&&!sessionStorage.getItem("welcome-overlay-shown"))d.classList.add("welcome-blocking")}catch(e){}})()`

export const firstPaintCSS = `html.welcome-blocking,html.welcome-blocking body{background:rgb(242,244,247)!important}html.dark.welcome-blocking,html.dark.welcome-blocking body{background:rgb(13,18,32)!important}`

/** VitePress dev 不读取 config.head，通过 Vite transform 单独注入同一份首屏资源。 */
export function createDevFirstPaintPlugin() {
  return {
    name: 'vitepress:dev-critical-css',
    transformIndexHtml(_html, { server }) {
      if (!server) return
      return [
        { tag: 'script', children: firstPaintScript, injectTo: 'head-prepend' },
        { tag: 'style', children: firstPaintCSS, injectTo: 'head-prepend' },
      ]
    },
  }
}
