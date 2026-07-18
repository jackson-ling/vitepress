---
outline: [2, 3]
aside: left
---

<h1 style="text-align: center;">Claude Code 介绍与使用</h1>

## 官方文档

> #### https://code.claude.com/docs/zh-CN/overview

## 安装配置

#### （1）相关资料

> #### CSDN 安装教程：https://blog.csdn.net/weixin_41793160/article/details/149313024
>
> #### 马克 ClaudeCode 使用教程：https://www.bilibili.com/video/BV14rzQB9EJj/

#### （2）安装 ClaudeCode

```bash
# 电脑要求有 node 环境，没有则需要装 nodejs，首先执行环境检查
node -v
npm -v

# 安装 ClaudeCode
npm uninstall -g @anthropic-ai/claude-code # 卸载已安装的 Claude Code（未安装请跳过）

npm install -g @anthropic-ai/claude-code@latest # 安装官方原版包

# 安装验证
claude -v

# 启动 Claude Code
claude

# 启动 Claude Code（指定命令无需确认，只对当前会话生效）
claude --dangerously-skip-permissions
```

#### （3）配置 ClaudeCode

> #### ANTHROPIC_BASE_URL：调用地址
>
> #### ANTHROPIC_API_KEY：使用官方模型时配置
>
> #### ANTHROPIC_AUTH_TOKEN：使用中转站 / 第三方时配置
>
> #### ANTHROPIC_MODEL：默认使用模型
>
> #### ANTHROPIC_DEFAULT_HAIKU_MODEL: HAIKU 占位模型，低
>
> #### ANTHROPIC_DEFAULT_SONNET_MODEL: SONNET 占位模型，中
>
> #### ANTHROPIC_DEFAULT_OPUS_MODEL：OPUS 占位模型，高
>
> #### CLAUDE_CODE_EFFORT_LEVEL：模型默认思考强度

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_BASE_URL": "",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "",
    "ANTHROPIC_MODEL": "",
    "ANTHROPIC_REASONING_MODEL": ""
  },
  "effortLevel": "medium",

  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "skipDangerousModePermissionPrompt": true,

  "autoCompactEnabled": true,
  "theme": "dark"
}
```

#### （4）配置默认文本编辑器，使用 ctrl + g 可以打开编辑器编辑对话，这里配置成 vscode

```bash
# 查看 vscode 的路径（前提是配置了环境变量）
where code

# 配置打开的编辑器（vscode）
setx EDITOR "code --wait"
setx VISUAL "code --wait"

# 自定义
setx EDITOR "\"文件路径\" --wait"
setx VISUAL "\"文件路径\" --wait"

# 验证配置
echo %EDITOR%
echo %VISUAL%
```

#### （4）安装 CC-Switch

> #### Github 官网：https://github.com/farion1231/cc-switch
>
> #### 一个用于统一管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 等 AI 编程 CLI 的跨平台桌面工具

## 常用命令

```bash
shift + tab # 切换模式：默认模式 / 自动模式 / 计划模式

ctrl + g # 多行输入（打开记事本 / vscode 编辑），可自定义配置打开的编辑器

@ 文件名 # 指定文件操作

/init # 依据项目创建 claude.md 文件

/memory # 编辑 claude.md 文件

/review # 代码审查

/skills # 技能管理

/plungin # 插件管理

/mcp # MCP 工具管理

/hooks # 钩子操作

/compact # 压缩上下文

/clear # 清空上下文

/resume # 查看历史会话

! # 执行 bash 命令

/rewind 或 双击esc # 回滚（无法回滚已执行的文件修改、删除、命令操作及环境变化，只能依靠 Git 等版本控制工具恢复）

ctrl + b # 将任务置于后台
/tasks # 查看所有任务
```

## ClAUDE.md

> #### andrej-karpathy-skills：https://github.com/multica-ai/andrej-karpathy-skills

```
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
```

## skill

> #### anthropics 官方 skill：https://github.com/anthropics/skills
>
> #### 完整的 skill 包含以下几部分
>
> #### 1. SKILL.md
>
> - Skill 的核心定义文件
> - 描述 Skill 的用途、适用场景、执行规则、工作流程
> - Claude Code 会通过该文件理解什么时候调用该 Skill，以及如何执行任务
>
> #### 2. Scripts（脚本）
>
> - 用于封装可重复执行的自动化操作
> - 可以包含 Python、Shell 等脚本
> - 负责处理复杂计算、文件处理、数据转换等任务
>
> #### 3. References（参考资料）
>
> - 存放 Skill 执行过程中需要参考的文档、规范、示例等内容
> - 用于补充上下文信息，帮助 Claude 更准确完成任务
>
> #### 4. Assets（资源文件）
>
> - 存放模板、图片、配置文件、示例代码等静态资源
> - 在生成内容或执行任务时直接复用
>
> #### 5. Templates（模板）
>
> - 提供固定格式的输出模板
> - 用于保证生成内容的一致性，例如报告、文档、代码结构等
