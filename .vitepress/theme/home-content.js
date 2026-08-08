/**
 * 首页可维护内容。
 *
 * 修改 TIP、技术栈、友情链接或章节导航时只改这里；动画时序与交互控制保留在 HomeMotion.vue。
 */
export const HOME_INTRO_STORAGE_KEY = 'homepage-motion-intro-played-v3'

export const homeTips = [
  { icon: '⏳', tone: 'blue', title: 'TIP 1', text: '明确目标目的，逐步积累，循序渐进，及时反馈，切忌急于求成' },
  { icon: '💪', tone: 'purple', title: 'TIP 2', text: '少空想，多实践，降低预期，重视基础，大量重复，构建体系' },
  { icon: '🚀', tone: 'amber', title: 'TIP 3', text: '保持独立思考，总结复盘，对比过去看进步，学会主动探索，敢于尝试，别设限' },
]

export const homeTechCategories = [
  {
    name: '后端基础',
    desc: 'Backend',
    accent: '#6DB33B',
    items: [
      { name: 'Spring', icon: '/spring.png', link: 'https://spring.io' },
      { name: 'SpringBoot', icon: '/springboot.png', link: 'https://spring.io/projects/spring-boot' },
      { name: 'MyBatis', icon: '/mybatis.png', link: 'https://mybatis.org/mybatis-3/' },
      { name: 'MyBatis Plus', icon: '/mybatisplus.png', link: 'https://baomidou.com' },
    ],
  },
  {
    name: '数据存储',
    desc: 'Database',
    accent: '#4479A1',
    items: [
      { name: 'MySQL', icon: '/mysql.png', link: 'https://www.mysql.com' },
      { name: 'Redis', icon: '/redis.png', link: 'https://redis.io' },
    ],
  },
  {
    name: '微服务',
    desc: 'Microservices',
    accent: '#6DB33B',
    items: [
      { name: 'SpringCloud', icon: '/springcloud.png', link: 'https://spring.io/projects/spring-cloud' },
      { name: 'RabbitMQ', icon: '/rabbitmq.png', link: 'https://www.rabbitmq.com' },
      { name: 'Elasticsearch', icon: '/elasticsearch.png', link: 'https://www.elastic.co/elasticsearch' },
    ],
  },
  {
    name: 'AI 应用',
    desc: 'AI & LLM',
    accent: '#3478d9',
    items: [
      { name: 'SpringAI', icon: '/spring.png', link: 'https://spring.io/projects/spring-ai' },
      { name: 'LangChain4j', fallback: 'L', link: 'https://docs.langchain4j.dev' },
      { name: 'Ollama', fallback: 'O', link: 'https://ollama.com' },
      { name: 'Claude Code', fallback: 'C', link: 'https://docs.anthropic.com/en/docs/claude-code' },
    ],
  },
  {
    name: 'DevOps',
    desc: 'DevOps',
    accent: '#2496ED',
    items: [
      { name: 'Docker', icon: '/docker.png', link: 'https://www.docker.com' },
      { name: 'Linux', icon: '/linux.png', link: 'https://www.linux.org' },
      { name: 'Nginx', icon: '/ngnix.png', link: 'https://nginx.org' },
      { name: 'Git', icon: '/git.png', link: 'https://git-scm.com' },
    ],
  },
]

export const homeFriendLinks = [
  { name: 'VitePress', desc: 'Vue & Vite 驱动的静态站点生成器', icon: '⚡', color: '#eab308', link: 'https://vitepress.dev' },
  { name: 'Irai', desc: '技术探索者，记录学习与生活', icon: '🌐', color: '#0d9488', link: 'http://iraionly.cn/' },
  { name: '代码随想录', desc: '程序员卡尔的算法与编程教程', icon: '📘', color: '#2563eb', link: 'https://programmercarl.com' },
  { name: 'LeetCode', desc: '全球领先的在线编程练习平台', icon: '🎯', color: '#ea580c', link: 'https://leetcode.cn' },
]

export const homeChapters = [
  { label: '首页', progress: 0 },
  { label: '学习提示', progress: 0.18 },
  { label: '技术栈', progress: 0.54 },
  { label: '友情链接', progress: 1 },
]
