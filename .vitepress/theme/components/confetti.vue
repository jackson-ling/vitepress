<!--
 * Confetti — 暗色模式雪花效果
 *
 * 仅在暗色模式（.dark 类存在）下运行，持续 15 秒。
 * 使用 canvas-confetti 库生成白色圆形粒子，模拟飘雪效果。
 * 通过 requestAnimationFrame 逐帧生成，粒子密度随时间递减。
 *
 * 使用方式：在 index.js 中全局注册为 <confetti> 组件
-->
<script setup>
import confetti from "canvas-confetti";
import { inBrowser } from "vitepress";

if (inBrowser) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    const duration = 15 * 1000;        // 动画持续 15 秒
    const animationEnd = Date.now() + duration;
    let skew = 1;                      // 垂直分布偏移系数（逐渐收窄）

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    /** 逐帧生成雪花粒子 */
    (function frame() {
      const timeLeft = animationEnd - Date.now();
      // ticks 控制粒子存活帧数：时间越少，粒子消失越快
      const ticks = Math.max(200, 500 * (timeLeft / duration));
      // skew 从 1 递减到 0.8，使后期粒子集中在顶部
      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,              // 初速为 0，靠重力下落
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: (Math.random() * skew) - 0.2
        },
        colors: ['#ffffff'],           // 白色粒子
        shapes: ['circle'],            // 圆形（雪花）
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1), // 粒子大小随机
        drift: randomInRange(-0.4, 0.4) // 水平漂移
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })();
  }
}
</script>
