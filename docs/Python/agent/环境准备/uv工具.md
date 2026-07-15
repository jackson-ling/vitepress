---
outline: [2, 3]
aside: right
---

<h1 style="text-align: center;">uv 工具</h1>

## 文档

### 官方文档

> #### https://docs.astral.sh/uv/

### 中文文档

> #### https://uv.doczh.com/

## 快速入门

### 视频教程

> #### https://www.bilibili.com/video/BV1Stwfe1E7s

### 安装 uv

```bash
# windows 安装，默认安装位置 C:\Users\你的用户名\.local\bin
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

pip install uv # pip 安装
```

### 配置镜像源

> #### 默认镜像源：https://test.pypi.org/simple

```bash
setx UV_DEFAULT_INDEX "https://mirrors.aliyun.com/pypi/simple" # 配置阿里云镜像源
```

## 常用命令

### 查看版本

```bash
# 查看 uv 版本
uv --version
```

### python 版本管理

```bash
# 查看 uv 可管理的 Python 版本
uv python list

# 安装指定 Python 版本
uv python install 3.12

# 同时安装多个 Python 版本
uv python install 3.11 3.12

# 查找指定版本 Python 路径
uv python find 3.12

# 删除指定 Python 版本
uv python uninstall 3.12
```

### 虚拟环境管理

```bash
# 当前目录创建 .venv 环境
uv venv

# 指定 Python 版本创建环境
uv venv --python 3.12

# 指定虚拟环境目录
uv venv D:\envs\my-env

# CMD 激活
.venv\Scripts\activate

# 退出虚拟环境
deactivate
```

### 包管理

```bash
# 安装单个包
uv pip install numpy

# 安装多个包
uv pip install numpy pandas torch

# 安装指定版本
uv pip install numpy==2.0.0

# 根据 requirements.txt 安装依赖
uv pip install -r requirements.txt

# 导出当前环境依赖
uv pip freeze > requirements.txt

# 查看已安装包
uv pip list

# 查看指定包详细信息
uv pip show numpy

# 卸载指定包
uv pip uninstall numpy
```

### 项目管理

```bash
# 初始化当前目录项目
uv init

# 创建指定名称项目
uv init my-project

# 添加普通依赖
uv add numpy

# 添加多个依赖
uv add torch torchvision opencv-python

# 删除指定依赖
uv remove numpy

# 根据 pyproject.toml 和 uv.lock 同步环境
uv sync

# 更新所有依赖
uv lock --upgrade

# 更新指定依赖
uv add numpy --upgrade
```

### 运行 Python

```bash
# 运行 Python 文件
uv run main.py

# 运行 Python 模块
uv run python -m pytest
```

### 缓存管理

```bash
# 查看 uv 缓存目录
uv cache dir

# 清理 uv 缓存
uv cache clean
```
