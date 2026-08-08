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
npm list -g @anthropic-ai/claude-code # 查看 ClaudeCode 安装位置
npm update -g @anthropic-ai/claude-code # 更新 ClaudeCode 到最新版本

# 内置命令更新 Claude Code，
claude update

# 安装验证
claude -v

# 启动 Claude Code
claude

# 启动 Claude Code（指定命令无需确认，只对当前会话生效）
claude --dangerously-skip-permissions

# 恢复到最近一次对话
claude -c

# 从列表中选一个历史会话恢复
claude --resume
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
    "ANTHROPIC_BASE_URL": "",
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "gpt-5.6-sol",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "gpt-5.6-sol",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "gpt-5.6-terra",
    "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME": "gpt-5.6-terra",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "gpt-5.6-luna",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME": "gpt-5.6-luna",
    "CLAUDE_CODE_SUBAGENT_MODEL": "gpt-5.6-sol",
    "ANTHROPIC_MODEL": "gpt-5.6-sol"
  },
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "skipDangerousModePermissionPrompt": true,
  "effortLevel": "medium",
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

#### （5）安装 CC-Switch

> #### Github 官网：https://github.com/farion1231/cc-switch
>
> #### 一个用于统一管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 等 AI 编程 CLI 的跨平台桌面工具

## 常用命令

> #### ClaudeCode 工程化中的核心内容：<span style="color:red">Claude.md、Skills、Subagents、MCP、Hooks、Plugins</span>

```bash
右键 # 粘贴

ctrl + shift + - # 撤销

alt + v # 粘贴图片

/powerup # ClaudeCode 官方教学，v2.1.90 版本（2026 年 4 月 1 日发布）上限新命令

/model # 切换模型

/effort # 切换思考程度， max 是「一次性」的，会话结束就自动失效

shift + tab # 切换模式：默认模式 / 自动模式 / 计划模式

/plan # 计划模式，写代码之前先出方案，省得返工，提示词要写清技术栈 + 功能 + 要求

ctrl + g # 多行输入（打开记事本 / vscode 编辑），可自定义配置打开的编辑器

@ 文件名 # 指定文件操作

/init # 依据项目创建 claude.md 文件

/memory # 编辑 claude.md 文件

/review # 代码审查

/skills # 技能管理

/plungin # 插件管理，安装内容后执行 /reload-plugin 加载生效

/mcp # MCP 工具管理

/hooks # 钩子操作

# 子代理就是 Claude 的「分身」，提前创建好，用的时候给它一个独立任务，它用全新的视角帮你干活，不受主对话干扰
/agents # 智能体管理及创建 subagent，新版移除通过终端创建，官方建议直接通过 md 方式创建

! # 执行 bash 命令

/resume # 查看历史会话

/rewind 或 双击esc # 回滚（无法回滚已执行的文件修改、删除、命令操作及环境变化，只能依靠 Git 等版本控制工具恢复）

ctrl + b # 将任务置于后台运行
& # 命令末尾加 & 就能让任务在后台跑，不用傻等
/tasks # 查看所有后台任务状态

# 养成看 /context 的习惯，占用超过 70% 就 /compact 一次。只有任务完全不相关时才用 /clear
/context # 查看上下文占用情况
/compact # 压缩上下文
/clear # 清空上下文

/status # 查看当前状态信息

/config # 查看全局配置

/remote-control # 把本地会话「暴露」给网页
/teleport # 把网页上的会话「传送」到终端
```

## ClAUDE.md

> #### 很多人喜欢在 CLAUDE.md 里堆一大堆东西，结果文件太长反而让 Claude 抓不住重点，工作效率反而下降，比如下面这些内容就不应该写进 CLAUDE.md
>
> #### （1）详细的 API 文档（太长，占上下文，应该用 @ 引用具体文件）
>
> #### （2）每次都变的临时需求（用 /compact 或 /clear 就行）
>
> #### （3）过于泛泛的描述（比如「写好代码」「好的代码」这种 Claude 本来就知道的事）
>
> #### CLAUDE.md 不是越长越好，太长则会占用太多的上下文，而是越精准越好，一份好的 CLAUDE.md 应该包含这几部分
>
> #### （1）项目简介：一句话说清楚项目是做什么的
>
> #### （2）技术栈：用了哪些框架和工具，让 Claude 不会乱选技术
>
> #### （3）代码规范：你的编码偏好，让 Claude 产出的代码风格统一
>
> #### （4）项目结构（可选）：目录的组织方式，帮助 Claude 更快地找到文件
>
> #### CLAUDE.md 是一个<span style="color: red;">活文档</span>，随着项目开发，你应该定期更新里面的内容，比如新功能完成了就加到「已完成功能」列表里，技术栈换了就修改对应的部分
>
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

## Agent

> #### agency-agents：https://github.com/msitarzewski/agency-agents
>
> #### 中文版本：https://github.com/jnMetaCode/agency-agents-zh

## skill

### 基本介绍

#### （1）什么是 Skill？

> #### Skill 就像是给 AI 定制的一份 “标准作业程序 (SOP)” 。它把解决特定问题所需的 背景设定 (Prompt) 、 执行步骤 和 所需的工具 (MCP) ，打包成了一个干净利落的代码文件。

#### （2）完整的 skill 包含哪些部分？

> #### SKILL.md：Skill 的核心定义文件，描述 Skill 的用途、适用场景、执行规则、工作流程，Claude Code 会通过该文件理解什么时候调用该 Skill，以及如何执行任务
>
> #### Scripts（脚本）：用于封装可重复执行的自动化操作，可以包含 Python、Shell 等脚本，负责处理复杂计算、文件处理、数据转换等任务
>
> #### References（参考资料）：存放 Skill 执行过程中需要参考的文档、规范、示例等内容，用于补充上下文信息，帮助 Claude 更准确完成任务
>
> #### Assets（资源文件）：存放模板、图片、配置文件、示例代码等静态资源，在生成内容或执行任务时直接复用
>
> #### Templates（模板）：提供固定格式的输出模板，用于保证生成内容的一致性，例如报告、文档、代码结构等

#### （3）skill 和 prompt 有什么关系？

> #### 从关系上看：包含与被包含。 Prompt 是 Skill 的“灵魂核心”，但不是全部。一个完整的 <span style="color:red">Skill = Prompt（指令与流程） + 挂载的工具列表（MCP） + 触发条件 + 上下文状态</span>
>
> #### 从能力上看：动嘴与动手。 Prompt 只能控制大模型的“嘴”。你写一万字的 Prompt 教它怎么查数据库，它也只能给你输出一段怎么查的文本。而 Skill 给 AI 赋予了“手”。通过配置文件里绑定的 tools ，AI 在阅读 Prompt 的同时，是真的能去后台调用代码、拉取数据的
>
> #### 从工程上看：临时工与标准资产。 你在对话框里敲的 Prompt 是“临时工”，上下文一长它就忘了，下次还得重敲。而 Skill 是一份写在项目目录里的配置文件（通常是 YAML 或 Markdown），它是可以提交到 Git 仓库里的代码资产 。它把个人经验变成了整个团队都可以直接复用的<span style="color:red">标准作业程序（SOP）</span>

### 安装使用

> #### anthropics 官方 skill：https://github.com/anthropics/skills

```bash
npx skills add anthropics/skills -g # 全局安装官方 skill

npx superpowers-zh -g # 全局安装中文增强版 superpowers
```

## Prompt 编写原则

### User Prompt

> #### （1）目标明确：要做什么？分析、总结、改写、生成代码，得明说。"帮我看看这个日志"不是目标，"帮我分析这段日志里的报错原因并给出排查方向"才是
>
> #### （2）背景充足：大模型不知道你的业务、你的系统架构、你的团队惯例，它只能靠你给的信息推断。背景给得越充分，它越不需要乱猜，幻觉越少
>
> #### （3）输出要求：格式、长度、风格，不说，它随心所欲。你想要 Markdown 列表？想要 JSON？想要 3 条以内？一定要在 Prompt 里讲清楚

### System Prompt

> #### （1）身份设定：给模型一个具体的角色

```
你是一个 OnCall 助理，专门帮助工程师排查和分析系统故障。
你只处理与系统稳定性、报警分析、故障排查相关的问题。
```

> #### （2）行为规则：定义模型"能做什么、不能做什么"

```
不允许回答与系统故障无关的话题。
如果你不确定某个判断，必须说明"我不确定，建议进一步验证"。
不要自行假设任何背景信息，只根据用户提供的内容作答。
```

> #### （3）输出格式约束：让模型每次都按固定格式输出

```
你的回答必须是 JSON 格式，包含以下字段：
summary：对问题的一句话概括
root_cause：可能的根本原因列表
action_items：建议的排查步骤列表
```

### 6 大原则

#### 原则 1：给模型"角色"，效果立刻不同

> #### ❌ 「分析一下这个系统报错」
>
> #### ✅ 「你是一个资深 SRE 工程师，专门排查分布式系统故障，请分析以下报错」
>
> #### 加了角色之后，效果为什么会更好？不是玄学
>
> #### 大模型在训练时见过海量各行各业的文字，"资深 SRE 工程师写的内容"和"普通人随便聊的内容"，在语言风格、专业度、思考方式上差别很大。你指定了角色，就相当于告诉模型"往那个方向走"，缩小了 next-token 预测的搜索空间，输出自然更专业、更贴合你的期望

#### 原则 2：正向约束 > 负向禁止

> #### ❌ 「不要太啰嗦」→ "啰嗦"是主观的，模型不知道你的标准在哪
>
> #### ✅ 「回答控制在 3 句话以内」→ 明确，模型知道怎么执行
>
> #### 告诉模型"要做什么"，比告诉它"不要做什么"更有效。原因很直接：模型是在"生成"内容，知道要生成什么比知道不要生成什么更容易执行。负向的禁止在某些场景有用，但大多数情况下，直接说你想要的结果，效果更稳定

#### 原则 3：喂给它足够的背景信息（上下文）

> #### 大模型不知道你的业务逻辑，不知道你的系统架构，不知道这条报警对你的团队意味着什么。它只能靠你在 Prompt 里提供的信息来推断
>
> #### ❌ 「帮我分析问题」→ 什么问题？
>
> #### ✅ 「以下是系统日志，背景是我们的 MySQL 集群在高峰期（每天 12:00-14:00）出现连接超时，集群规模是 3 主 6 从，请分析可能原因：[日志内容]」
>
> #### 信息给得越充分，答案越靠谱，幻觉越少。大模型的"幻觉"有很大一部分来自"信息不足时的强行推断"，你给够了信息，它就不需要猜了

#### 原则 4：指定输出格式（Agent 开发的重中之重）

> #### 这一条在 Agent 开发中尤其关键，单独强调
>
> #### Agent 需要程序来解析大模型的输出，然后决定下一步做什么。如果输出格式每次不一样，解析代码就会频繁出错。所以你必须明确告诉模型"以什么格式输出"：JSON、Markdown 列表、固定字段……
>
> #### 光说"输出 JSON"还不够稳定。最可靠的方式是 在 Prompt 里直接给一个 JSON 示例：
>
> #### 请按以下 JSON 格式输出，不要输出其他内容

```json
{
  "severity": "high/medium/low",
  "summary": "一句话概括",
  "actions": ["步骤1", "步骤2"]
}
```

> #### 有了示例，模型的格式几乎不会跑偏
>
> #### 另外，这一条直接铺垫了我们后面要学的 Function Calling ：让大模型按照指定格式输出"要调用哪个工具、传什么参数"，本质上就是在做精确的格式约束，先理解这一条，Function Calling 的原理你就秒懂了

#### 原则 5：Few-shot，给几个例子，胜过写一堆规则

> #### Few-shot 是指：在 Prompt 里直接给几组"输入→输出"的示范样本，让模型照着这个模式来做
>
> #### ❌ 写一大段规则描述："回答时要简洁、专业、聚焦根因、避免技术术语过多……"
>
> #### ✅ 直接给 3 个样本，每个样本是一条报警 + 对应的分析结论，然后让模型对第 4 条做同样的分析
>
> #### 与其写一本厚厚的"员工行为手册"，不如直接给他看 3 份"合格工作成果的样本"，哪个更直接，一目了然
>
> #### 什么时候用 Few-shot：当你要模型输出特定风格、特定格式、特定思维方式的时候，用样本比用文字规则更直接、更有效。尤其是当你发现光靠描述说不清楚"我想要什么"时，直接给例子

#### 原则 6：让模型"先思考，再回答"（思维链 Chain of Thought）

> #### 处理复杂问题时，直接让模型给出答案，容易出错。在 Prompt 里加一句「请先逐步分析，再给出最终结论」，准确率会明显提升
>
> #### 这不是神秘技巧，背后有清晰的道理：大模型是 next-token 逐步生成的。当它把推理过程写出来，后续生成的每个 token 都能"参考"前面已经写出来的推理内容，逻辑更连贯，不容易发生逻辑跳跃
>
> #### 类比：让学生解数学题，"直接写答案"和"写出解题步骤再得出答案"，后者出错率低得多。不是步骤本身有魔力，而是写步骤的过程迫使模型在每一步都做出更谨慎的判断

## Harness 工程

### 六层核心

#### 第一层，上下文的精细化管理

> #### 第一层（上下文的精细化）管的是「空间」 ：这一轮发给模型的那一坨上下文，长啥样、装了些啥、怎么排布
>
> #### 第四层（记忆与状态）管的是「时间」 ：上一轮发生过的事情，怎么流动到下一轮
>
> #### 你塞给它越多无关信息，它的注意力就越散 。这个现象 Anthropic 在他们的博客里专门命名了，叫「context rot」（上下文腐化）。他们给的解法是「just-in-time retrieval」，也就是让 Agent 边干活边按需抓信息，而不是一上来就把所有可能有用的东西一股脑塞进去
>
> #### 所以这一层的核心工作可以浓缩成三件事：
>
> #### （1）<span style="color: red;">把角色和目标钉死</span>。模型得知道自己是一个「PR 审查助手」，当前任务是「挑出值得关注的 PR 并生成摘要」，成功标准是「我挑出来的真的都是该被关注的」。大部分 Agent 跑偏，根源就是这一步没说清楚
>
> #### （2）<span style="color: red;">动态筛选而不是一次塞满</span>。只把当前这个 PR 相关的那几块信息拉进来，其余的留在文件系统里，等需要了再取
>
> #### （3）<span style="color: red;">结构化组织</span>。固定规则（code review 惯例）放一处，动态证据（当前 PR 的内容）放一处，中间结论（我对这个 PR 的初步打分）放一处，三者要分开。否则模型会「自我污染」，也就是用前面错的中间结论去影响后面的判断

#### 第二层，工具系统的可控调用

> #### 什么时候用哪个工具？ 该查的时候要查，不该查的时候别瞎查。比如 Agent 判断「这个 PR 改的函数是不是核心逻辑」的时候应该去代码搜索，而不是凭感觉猜。反过来，明明 diff 已经在上下文里了，再去重新拉一次 PR 纯属浪费
>
> #### 工具结果怎么喂回模型？ 这条最容易被忽略。比如 Agent 调用代码搜索，拿到 30 条匹配。你是不是要把 30 条原文原样塞回去？不是。你要先做一层提炼，比如只留核心模块的那几条，再喂回去。否则这 30 条原文一进来，上下文又被污染了
>
> #### 你最近听得很多的 MCP（Model Context Protocol） ，本质上就是在做工具层的标准化，让任何工具都能用同一种方式接到任何 Agent 上，大家不用再各自重复造轮子

#### 第三层，任务执行的全局编排

> #### Agent 经常翻车的场景是：每一步它都会做，但把所有步骤串起来之后就不会了。它会拉 PR 列表，会读 diff，会写摘要，但它不知道应该先拉全列表再逐个分析，还是应该边拉边评，最后交付给你经常就是一堆半成品
>
> #### 这就是第三层的职责：给模型一条明确的工作轨道有了这条轨道，Agent 就知道「我现在在哪一步，下一步该干啥」，它不会再瞎跑
>
> #### 除了 <span style="color:red">ReAct</span> 之外，还有几个业界常见的编排模式你可以记一下名字： <span style="color:red">Plan-and-Execute</span>（先规划完整计划再执行，适合长链路任务）、 <span style="color:red">Reflexion</span>（每次失败都让 Agent 反思一下再重试）、 <span style="color:red">Tree of Thoughts</span>（同时探索多条思路再选最好的），不同场景会用不同的编排策略

#### 第四层，记忆与状态的分层管理

> #### 这里要回扣我们开头讲的 Mitchell Hashimoto 和 Anthropic 的一个核心洞察： Agent 的状态不应该放在上下文窗口里，而应该外化到文件系统
>
> #### 放到 PR Review Agent 上，你可以做同样的事。它需要管的状态至少有三类， 必须分层存
>
> #### （1）任务状态 ：今天已经处理到哪个 PR 了？还剩几个？每个的打分是多少？这类信息写在一个 today-progress.json 里，当天任务跑完就归档
>
> #### （2）会话中间结果 ：当前这一轮里 Agent 对某个 PR 做出的初步判断。这类信息随会话结束就可以丢，不用持久化
>
> #### （3）长期记忆和用户偏好 ：你喜欢关注什么类型的 PR？你特别看重哪些模块？这类信息写在常驻的 user-preferences.md 里，每次调用都注入
>
> #### 你发现没有？这三类记忆的生命周期完全不同：任务状态活到任务结束，会话中间结果活到当轮结束，长期记忆跨所有任务存在。混在一起就乱了， 分清楚才能用好

#### 第五层，独立的评估与观测体系

> #### 那第五层到底要做什么？我把它拆成两件事：一件是有个尺子 ，另一件是能看到每一次的量
>
> #### 尺子：Eval 集（这一层真正的核心），Eval 集（evaluation set）是做 Agent 开发的业界标准做法，也是这一层的灵魂
>
> #### 简单说就是： 你手写一批典型任务，每一个都标注好「正确答案长啥样」 ，然后每次你对 Harness 做了任何改动（比如改了 CLAUDE.md、加了一个新工具、调整了编排流程），都让 Agent 把这批任务再跑一遍，对比成功率
>
> #### 对 PR Review Agent 来说，一个最小可用的 Eval 集可能是这样：
>
> #### （1）从过去三个月挑 20 个真实 PR
>
> #### （2）每一个都标注「是不是重要」「摘要应该怎么写」
>
> #### （3）每次改完 Agent 就跑一遍这 20 个，看它挑对了几个、写对了几个
>
> #### 没有这个 Eval 集，你对 Agent 好不好的判断永远停留在「我感觉这次变好了」的玄学阶段

#### 第六层，约束校验与失败恢复机制

> #### （1）约束：定义「什么事 Agent 不能做」
>
> #### 对 PR Review Agent 来说，约束可以包括：「一次最多分析 20 个 PR」「不能对已 closed 的 PR 再评论」「不能直接修改 PR 本身」「token 用量超过 10 万就立刻停下」。这些约束最好 硬编码到代码或 linter 规则里 ，而不是写在提示词里靠 Agent 自己遵守。OpenAI 在 Codex 项目里把资深工程师的经验固化成他们叫做「Golden Principles」的机制（我们在下一章会专门展开讲），就是这种思路的极致版
>
> #### （2）校验：在每一步输出前后都做自动检查
>
> #### 比如 Agent 给出摘要后先跑一道格式校验（是不是 Markdown？几个段落都在？），发送到 Slack 前先检查频道名是不是在白名单里。 校验不是审美品味，是硬规则
>
> #### （3）恢复：失败之后有预案
>
> #### GitHub 限流 → 等一段时间后重试；Slack 发送失败 → 先落到本地队列，下次重试；token 快耗光 → 立即停下并保存进度，下一轮继续。 每一种典型失败都应该有一条明确的恢复路径 ，而不是一股脑全挂掉
>
> #### 这三件事加起来，才能让 Agent 从「能跑」升级到「能在生产环境跑」

### 五大难题

> #### （1）Agent 跑久了为啥会越走越偏？重启胜过修补，状态沉到文件里，Agent 随时可以在一个干净的上下文窗口里接力继续
>
> #### （2）让 Agent 自己给自己打分，为啥总偏乐观？生产和验收必须分离，而且验收方必须能摸到真实世界
>
> #### （3）Agent 总是失败，工程师到底该干啥？Agent 反复失败的时候，别问模型能不能更努力，要问环境还缺什么
>
> #### （4）规范文件越写越长，为啥 Agent 反而更糊涂？规则文件宁缺毋滥，给模型看的东西少即是多
>
> #### （5）Agent 写的代码越堆越烂，技术债怎么还？技术债不是攒一堆集中还，而是每天让后台 Agent 自动偿还一点
