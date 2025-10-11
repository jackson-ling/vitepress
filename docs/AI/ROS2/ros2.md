---
sidebar: false
aside: left
outline: [2, 3]
---

<h1 style="text-align: center;">ROS2</h1>

---

## 相关资料

> #### 官方 ROS 培训课程（莫问大讲堂）：https://space.bilibili.com/3493143676717925?spm_id_from=333.788.upinfo.head.click

## Ubuntu 安装及配置

> #### 安装文档：https://blog.csdn.net/LYLv_/article/details/143107112?spm=1001.2014.3001.5506
>
> #### 环境配置：https://www.bilibili.com/video/BV1yCWTzzEhd?spm_id_from=333.788.videopod.sections&vd_source=822e86b53dab98632ef279a46d2536db

## Ubuntu 常用命令

#### （1）ls ：列出当前目录下的所有文件和目录（<span style="color:red">默认在主目录的路径下</span>）

#### （2）pwd ：查看当前目录的绝对路径

#### （3）cd ：进入指定目录

#### （4）cd .. ：返回上一级目录

#### （5）mkdir ：创建目录

> #### 可以使用 mkdir 1 / 2 创建多级目录，<span style="color:red">前提是 1 目录已存在</span>

#### （6）touch ：创建文件，需要指定文件后缀名（可以在指定目录创建文件）

#### （7）gedit ：创建文件的同时打开文件

#### （8）rm ：删除文件

#### （8）rm -rf ：删除目录

#### （9）rm -r ：删除目录及目录下的所有文件

#### （10）sudo chmod 777 文件名：赋予文件可执行权限

> #### 检验是否修改成功：执行命令后，使用 ls 命令查看文件，看赋予权限后的文件名是否是绿色的

#### （11）./ 文件名：执行文件

<br/>
<img src="./常用命令.png" style="width:700px"/>

## python 案例

#### （1）准备工作

> #### 默认处于主目录下

```bash
mkdir code  # 创建目录

cd code  # 进入目录

gedit hello.py  # 创建文件并打开文件

chmod 777 hello.py  # 赋予文件可执行权限
```

#### （2）编写代码

> #### 首先需要在文件头添加 python 解释器，之后再编写命令

```python
#！/usr/bin/python3
print("hello world")
```

#### （3）运行代码

```bash
./hello.py # 方式一

python3 hello.py # 方式二
```
