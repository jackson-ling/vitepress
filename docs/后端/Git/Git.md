---
aside: left
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Git 常用命令</h1>

---

## 软件安装

> #### 官方网址：https://git-scm.com/

## 基础配置

```bash
# 以下配置的作用只是作为用户的标识

git config --global user.name 用户名 # 配置用户名

git config --global user.email 邮箱 # 配置邮箱

git config --global --list # 查看全局配置

git config --system --list # 查看系统配置

git config --global init.defaultBranch 分支名 # 配置默认分支名（一般为 main）

git config --global core.editor "'exe文件路径' --wait" # 配置 vscode 为默认代码编辑器

# 如果 vscode 添加了系统环境变量，则可以配置为如下指令，--wait 参数表示等待编辑完成
git config --global core.editor "code --wait"
```

## 常用命令

```bash
git clone 仓库地址 # 拉取仓库代码到本地（默认拉取分支 main 分支）

git clone -b 分支名 仓库地址 # 拉取仓库中指定分支的代码

git init # 初始化仓库

git add 文件名 # 添加指定文件到暂存区

git add . # 添加所有文件到暂存区，即实施文件跟踪

git reset head 文件名 # 撤销本次提交和文件暂存状态

git rm-cache 文件名 # 取消文件跟踪且本地保留文件

git status # 查看文件状态（被跟踪的文件显示绿色，未被跟踪的文件显示红色，提交后则不显示）

git commit -m "提交信息" # 在本地提交一次版本

git commit -am "提交信息" # 连带未暂存文件一起提交（仅对已跟踪文件生效，相当于合并了 git add 操作）

git reset head~ --soft # 取消本次提交, 但是首次提交不可撤回

git log # 查看当前分支的详细提交信息

git log --graph # 以图形化方式展示当前分支的提交历史

git reflog # 查看当前分支的精简提交信息

git log --pretty=oneline # 将当前分支的详细提交信息，并将信息按行格式化输出展示

git log --all # 查看所有分支的提交

git log --all --graph # 以图形化方式展示所有分支的提交历史

git reset --hard 版本号 # 版本回退，通过 git log 查看版本号
```

## ssh 配置

> #### 使用如下命令生成 ssh 密钥，之后在C盘用户中的 .ssh 文件夹中查看，添加到 Github 使其生效，之后采用 ssh 推动代码就不会出现网络问题

```bash
ssh-kegen -t rsa -C "填写你的邮箱" # 执行后一直回车即可，指导提示密钥生成完成，带有 pub 后缀的文件是公钥，另一个是私钥
```

## 远程仓库

```bash
git remote # 查看远程仓库名

git remote rename 原仓库名 新仓库名 # 重命名仓库

git remote add 仓库名 仓库地址 # 添加远程仓库（常用 origin 作为默认仓库名）

git remote set-url 仓库名 新的仓库地址 # 修改远程仓库地址

git remote -v # 查看远程仓库地址

git push -u 仓库名 分支名 # 首次推送需要加上 -u 参数，之后直接采用 git push 仓库名 分支名 即可

git push # 不是首次推送代码，并且需要推送到上次推送的分支，采用这个命令

git push 仓库名 分支名  -force # 强制推送，覆盖远程仓库的代码

# 在首次推送代码时，会弹出界面要求输入用户名和密码

git config --global credential.helper store # 保存本地凭证

git credential-cache exit # 删除本地凭证
```

## 分支管理

> #### master （生产） 分支：线上分支，主分支，中小规模项目作为线上运行的应用对应的分支
>
> #### develop（开发）分支：是从 master 创建的分支，一般作为开发部门的主要开发分支，如果没有其他并行开发不同期上线要求，都可以在此版本进行开发，阶段开发完成后，需要是合并到 master 分支，准备上线
>
> #### feature/xxxx 分支：从 develop 创建的分支，一般是同期并行开发，但不同期上线时创建的分支，分支上的研发任务完成后合并到 develop 分支
>
> #### hotfix/xxxx 分支：从 master 派生的分支，一般作为线上 bug 修复使用，修复完成后需要合并到 master、test、develop 分支
>
> #### 还有一些其他分支，在此不再详述，例如 test 分支（用于代码测试）、pre 分支（预上线分支）等等

```bash
git branch --list # 查看所有分支

git branch # 查看当前所处分支

git branch 分支名 # 创建新分支

git checkout -b 分支名 # 创建并切换到新分支

git checkout 分支名 # 切换分支

git branch -d 分支名 # 删除本地分支

git branch -m 旧分支名 新分支名 # 重命名分支

git merge 分支名 # 合并分支（将指定分支的代码合并到当前分支）

git branch -r # 查看远程仓库所分支

git branch -vv # 查看本地分支与远程仓库分支的关联关系

git branch -u 仓库名/远程分支名 本地分支名 # 将本地分支与远程分支关联

git fetch 仓库名 分支名 # 拉取远程仓库的分支代码到本地暂存，不会修改当前分支的内容

# 如果需要应用拉取的分支代码，可以创建新分支并于远程分支关联，例如如下代码，又或者可以在新分支采用 pull 命令拉取
git checkout -b Dev origin/Dev

git fetch origin -p # 同步远程仓库分支和本地远程分支的信息（如果某些远程分支已经被删除，Git 会将这些远程分支的本地引用删除）

git push 仓库名 --delete 分支名 # 删除远程仓库的指定分支
```

## 解决冲突

```bash
# 当同一处出现不同的修改，在提交时就会出现冲突，需要手动解决冲突

git status # 查看冲突文件

git pull 仓库名 分支名 # 将远程仓库对应分支的最新内容拉下来后与当前本地分支直接合并

git pull 仓库名 分支名 --allow-unrelated-histories # 允许不相关的历史
```

#### 修改冲突文件示例

```bash
<<<<<<< HEAD
hello git! hello atguigu! master test
hello git! hello atguigu!
=======
hello git! hello atguigu!
hello git! hello atguigu! hot-fix test
>>>>>>> hot-fix


# <<<<<<< HEAD 表示当前所处分支的代码，======= 下方表示需要合并分支的代码

# 选择需要保留的代码，其余内容删除即可，保存后再次 add、commit 推送即可
```

## 贮藏功能

```bash
# 贮藏功能应用场景：临时保存当前分支未完成代码，切换到其他分支工作，再次切回分支时恢复未完成代码继续开发
# 注意事项：当文件修改后未提交，切换到其他分支时会报错，这时可以选择提交或者贮藏后再切换分支

git stash # 贮藏当前未完成代码

git stash apply # 恢复当前分支贮藏的代码

git stash list # 查看贮藏列表（最后的贮藏显示在最顶端，即 @{0} 这一项）

git stash apply stash@{记录号} # 恢复指定贮藏的代码

git stash pop # 恢复并删除最近一次记录

git stash drop @stash{记录号} # 删除指定贮藏记录
```

## 重置与变基

```bash
git reset head 文件名 # 撤销本次提交和文件暂存状态

# head：当前的提交

# head~: 上次的提交

# head~2: 倒数第二次的提交

# --soft 选项：仅取消 commit 操作，保留修改文件的暂存状态，如果不加 --soft 则表示恢复到暂存前，即需要重新 add、commit

# --hard 选项：取消暂存，取消修改内容，相当于彻底回到上次提交的状态，不推荐使用，会丢失数据

# 变基操作的本质是重写提交历史，注意事项如下
# （1）变基前务必确保工作区干净，否则会报错，可以通过 git status 查看工作区状态
# （2）不要对已推送到远程的提交做变基，变基会导致他人的仓库和你的冲突

git rebase 分支名 # 将当前分支的代码合并到指定的分支上（相当于搬家），区别于 merge 分支合并，rebase 可以让提交记录变得好看些

git rebase -i head选项 # 交互式界面，选择指定的提交记录进行编辑

git rebase -i --root # 对所有提交记录进行变基
# rebase 界面相关命令
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
#         create a merge commit using the original merge commit's
#         message (or the oneline, if no original merge commit was
#         specified); use -c <commit> to reword the commit message
# u, update-ref <ref> = track a placeholder for the <ref> to be updated
#                       to this position in the new commits. The <ref> is
#                       updated at the end of the rebase
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
```

## IDEA 使用 Git

> #### 教程视频：https://www.bilibili.com/video/BV1na411v7gS

## ignore文件参考

```
# ##########项目默认生成##########
# Project exclude paths
/target/


# ##########个人##########
HELP.md
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr
.flattened-pom.xml

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/
/mvnw.cmd
/mvnw
/.mvn/


# ##########GitHub官方(https://github.com/github/gitignore/blob/main/Java.gitignore)##########
# Compiled class file
*.class

# Log file
*.log

# BlueJ files
*.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files #
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml
hs_err_pid*
replay_pid*
```
