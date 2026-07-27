---
outline: [2, 3]
aside: right
---

<h1 style="text-align: center;">PostgreSQL</h1>

## 基本介绍

> #### PostgreSQL（简称 PG）是一款开源的关系型数据库管理系统（RDBMS），诞生于 1996 年，至今已有近 30 年的发展历史。它以稳定性、可靠性、ACID 事务支持和强大的扩展能力著称，是目前生产环境中使用最广泛的开源关系型数据库之一
>
> #### PostgreSQL 的主要特点包括
>
> #### （1）ACID 事务：完整支持原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability），确保数据操作的可靠性
>
> #### （2）丰富的数据类型：不仅支持传统的整数、浮点数、字符串，还原生支持 JSON/JSONB、数组、范围类型等，使其可以同时承担关系型和文档型数据库的角色
>
> #### （3）可扩展性：支持自定义数据类型、函数、索引类型，拥有丰富的扩展生态
>
> #### （4）跨平台：支持 Windows、Linux、macOS 等主流操作系统
>
> #### 在 LangGraph 的上下文中，PostgreSQL 主要被用作检查点（Checkpoint）的持久化后端，同时也支持作为长期记忆存储使用

## Docker 部署

### 部署命令

```bash
docker run -d `
  --name langgraph-postgres `
  -e POSTGRES_DB=langgraph_db `
  -e POSTGRES_USER=langgraph_user `
  -e POSTGRES_PASSWORD=123456 `
  -p 5432:5432 `
  postgres:16
```

| 参数                            | 含义                                            |
| :------------------------------ | :---------------------------------------------- |
| -d                              | 后台运行（daemon 模式），终端关闭后容器不会停止 |
| --name langgraph-postgres       | 容器名称，方便后续管理                          |
| -e POSTGRES_DB=langgraph_db     | 创建容器时自动创建名为 langgraph_db 的数据库    |
| -e POSTGRES_USER=langgraph_user | 自动创建用户 langgraph_user                     |
| -e POSTGRES_PASSWORD=123456     | 设置该用户的密码为 123456                       |
| -p 5432:5432                    | 将容器的 5432 端口映射到宿主机的 5432 端口      |

### 常用命令

```bash
# 查看正在运行的容器
docker ps

# 如果看不到 langgraph-postgres，查看所有容器（包括已停止的）
docker ps -a

# 查看容器日志
docker logs langgraph-postgres

docker stop langgraph-postgres    # 停止容器
docker start langgraph-postgres   # 启动容器
docker restart langgraph-postgres # 重启容器
docker rm langgraph-postgres      # 删除容器（需要先停止）
```

### 连接 pgsql

```bash
docker exec -it langgraph-postgres psql -U langgraph_user -d langgraph_db
```

## windows 安装

### 下载链接

> #### https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

### 安装步骤

> #### （1）运行安装程序：双击下载的 .exe 文件，点击 Next
>
> #### （2）选择安装目录：建议保持默认路径 C:\Program Files\PostgreSQL\16\
>
> #### （3）选择安装组件：勾选 PostgreSQL Server、pgAdmin 4（可选）、Command Line Tools（必选，需要 psql 命令行工具）
>
> #### （4）设置超级用户密码：安装程序会要求为 postgres 超级用户设置密码（记好这个密码）
>
> #### （5）设置端口：保持默认 5432
>
> #### （6）选择区域设置：保持默认 Default locale
>
> #### （7）安装：等待进度条完成

### 安装验证

> #### 输入安装时设置的 postgres 密码，如果能进入 psql 交互界面（显示 postgres=# 提示符），说明安装成功

```bash
# 检查 psql 是否可用
psql --version

# 使用超级用户连接数据库
psql -h localhost -p 5432 -U postgres
```

### 服务管理

> #### PostgreSQL 安装后会自动注册为 Windows 服务（服务名：postgresql-x64-16），默认开机自启

```bash
# 查看服务状态（PowerShell）
Get-Service postgresql-x64-16

# 手动启动服务
net start postgresql-x64-16

# 手动停止服务
net stop postgresql-x64-16
```

### 连接 pgsql

```bash
psql -h <主机> -p <端口> -U <用户名> -d <数据库名>
```

## python 连接

### 安装依赖

| 包名                          | 作用                                                   |
| :---------------------------- | :----------------------------------------------------- |
| langgraph-checkpoint-postgres | LangGraph 的 PostgreSQL 检查点后端，提供 PostgresSaver |
| psycopg[binary]               | Python 的 PostgreSQL 驱动，负责底层数据库通信          |

> #### langgraph-checkpoint-postgres 内部依赖 psycopg，但建议显式安装以确保版本正确
>
> #### [binary] 后缀表示安装包含预编译二进制文件的版本，避免从源码编译的麻烦

```bash
pip install langgraph-checkpoint-postgres==3.0.5
pip install psycopg[binary]
```

### 连接 pgsql

| 配置项   | 值                                                                             |
| :------- | :----------------------------------------------------------------------------- |
| Host     | localhost                                                                      |
| Port     | 5432（PostgreSQL 默认端口）                                                    |
| Database | langgraph_db                                                                   |
| User     | langgraph_user                                                                 |
| Password | 123456                                                                         |
| SSL Mode | disable（本地开发环境关闭 SSL）                                                |
| 连接 URL | postgresql://langgraph_user:123456@localhost:5432/langgraph_db?sslmode=disable |

> #### 注意：这里的 sslmode=disable 表示关闭 SSL 连接，仅适用于本地开发和测试环境，生产环境中建议启用 SSL 并修改为强密码

```python
import psycopg

DB_URL = “postgresql://langgraph_user:123456@localhost:5432/langgraph_db?sslmode=disable”

conn = psycopg.connect(DB_URL)
cur = conn.cursor()

# 查看 PostgreSQL 版本信息
cur.execute(“SELECT version();”)
result = cur.fetchone()
print(f”PostgreSQL 版本：{result[0]}”)

cur.close()
conn.close()
```

## 基本操作

### 常用元命令

| 命令          | 说明                   |
| :------------ | :--------------------- |
| \l            | 列出所有数据库         |
| \dt           | 列出当前数据库的所有表 |
| \d table_name | 查看表结构             |
| \q            | 退出 psql              |

### 创建数据库

```bash
# 连接数据库
psql -h localhost -p 5432 -U postgres

# 创建数据库
CREATE DATABASE langgraph_db;

# 检查是否成功
\l
```

### 创建用户并授权

```sql
-- 创建用户
CREATE USER langgraph_user WITH PASSWORD '123456';

-- 赋予该用户对 langgraph_db 的所有权限
GRANT ALL PRIVILEGES ON DATABASE langgraph_db TO langgraph_user;
```

> #### PostgreSQL 15+ 版本默认收紧了对 public 模式的权限管理，如果后续 PostgresSaver 在创建表时报权限错误，需要额外执行

```bash
\c langgraph_db

GRANT ALL ON SCHEMA public TO langgraph_user;
```

> #### 连接测试验证

```bash
psql -h localhost -p 5432 -U langgraph_user -d langgraph_db
# 输入密码: 123456
```

### 创建表

> #### SERIAL PRIMARY KEY：自增主键，PostgreSQL 会自动为新插入的行分配唯一的 id
>
> #### TEXT：变长文本类型，适合存储聊天消息内容
>
> #### TIMESTAMP DEFAULT CURRENT_TIMESTAMP：时间戳类型，默认为插入时的当前时间

```sql
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    thread_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### insert

```sql
INSERT INTO messages (thread_id, role, content)
VALUES ('chapter_6_6.2.4', 'user', '你好，我是老王');

INSERT INTO messages (thread_id, role, content)
VALUES ('chapter_6_6.2.4', 'assistant', '老王你好！有什么可以帮你的？');
```

### select

```sql
-- 查询所有记录
SELECT * FROM messages;

-- 按 thread_id 筛选（最常用，对应 LangGraph 中的 thread）
SELECT * FROM messages WHERE thread_id = 'chapter_6_6.2.4';

-- 按时间排序
SELECT * FROM messages WHERE thread_id = 'chapter_6_6.2.4' ORDER BY created_at;
```

### update

```sql
-- 更新某条记录的内容
UPDATE messages SET content = '你好，我是老王，今年30岁。'
WHERE id = 1;
```

### delete

```sql
-- 删除某条记录
DELETE FROM messages WHERE id = 2;

-- 删除整个表（注意：操作不可逆）
DROP TABLE IF EXISTS messages;
```

### 终端编码切换

> #### <span style="color:red">终端查询</span>过程中可能会因为字符编码报错，例： 编码 "UTF8" 的字符 0x0xf0 0x9f 0xa4 0x94 在编码 "GBK" 没有相对应值
>
> #### PowerShell 中先执行 chcp 65001 切换到 UTF-8 编码，再启动 psql
>
> #### Windows 终端默认编码为 GBK，无法处理 4 字节 UTF-8 字符，执行如下命令切换

```bash
SET client_encoding = 'UTF8'; # cmd
```
