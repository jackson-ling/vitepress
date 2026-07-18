---
outline: [2, 3]
aside: left
---

<h1 style="text-align: center;">FastAPI 使用</h1>

## 官方文档

> #### https://fastapi.tiangolo.com/zh/

## 快速开始

### 安装依赖

```bash
pip install "fastapi[standard]"
```

### 示例代码

> #### 项目启动后，访问 `http://localhost:8000/docs` 可查看接口文档
>
> #### 常用请求方式：@app.get（）、@app.post（）、@app.put（）、@app.delete（）
>
> #### Path 函数：实现<span style="color: red;">路径参数</span>校验，主要参数包括 `...` 表示必填参数，`gt` 表示大于，`lt` 表示小于，`description` 表示参数描述，`min_length` 表示最小长度，`max_length` 表示最大长度
>
> #### Query 函数：实现<span style="color: red;">查询参数</span>校验，主要参数和 Path 函数一样

```python
from fastapi import FastAPI

app = FastAPI() # 创建实例

app.mount("/static", StaticFiles(directory="static"), name="static") # 挂载静态文件的存放目录

# 访问根路径：http://localhost:8000/
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/book/{id}") # 异步方式，可以用 Path 函数实现参数校验
async def get_book(id: int = Path(..., gt=0, lt=101, description="书籍id，取值范围1-100")):
    return {"id": id, "title": f"这是第{id}本书"}

@app.get("/news/news_list") # Query 函数，指定查询参数
async def get_news_list(
    skip: int = Query(0, description="跳过的记录数", lt=100),
    limit: int = Query(10, description="返回的记录数")
):
    return {"skip": skip, "limit": limit}

# 启动项目
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# 命令行方式启动：uvicorn main:app --reload
# main 是文件名，可替换，reload 表示修改代码后自动重启服务
```

## 请求体

> #### 继承 BaseModel 类实现请求体定义
>
> #### Field 函数：实现<span style="color: red;">请求体参数</span>校验，主要参数包括 `default` 默认值，`min_length` 最小长度，`max_length` 最大长度，`description` 参数描述，`gt` 大于，`lt` 小于

```python
# 注册： 用户名和密码 → str
class User(BaseModel):
    username: str = Field(default="张三", min_length=2, max_length=10, description="用户名，长度要求2-10个字")
    password: str = Field(min_length=3, max_length=20)


@app.post("/register")
async def register(user: User):
    return user
```

## 响应体

<img src="./1.png" style="width:800px;">

> #### 通过 response_class 参数来指定响应体的类型
>
> #### 继承 BaseModel 实现自定义响应体，通过 response_model 参数来指定自定义响应体类型

```python
# JSONResponse，默认格式
@app.get("/")
async def root():
    return {"message": "Hello World"}

# HTMLResponse
@app.get("/html", response_class=HTMLResponse)
async def get_html():
    return "<h1>这是一级标题</h1>"

# FileResponse
@app.get("/file")
async def get_file():
    path = "./files/1.jpeg"
    return FileResponse(path)

# 自定义响应体
class News(BaseModel):
    id: int
    title: str
    content: str

# 方式一：使用对象模型，通过 response_model 参数指定自定义响应体类型
@app.get("/news/{id}", response_model=News)
async def get_news(id: int):
    return News(
        id=id,
        title=f"这是第{id}本书",
        content="这是一本好书"
    )

# 方式二：通过 json 格式赋值，并通过类型注解定义类型，这里也可以采用对象模型
@app.get("/news/{id}")
async def get_news(id: int) -> News:
    return {
        "id": id,
        "title": f"这是第{id}本书",
        "content": "这是一本好书"
    }
```

## 异常处理

```python
# 方式一：抛出异常
@app.get("/news/{id}")
async def get_news(id: int):
    id_list = [1, 2, 3, 4, 5, 6]
    if id not in id_list:
        raise HTTPException(status_code=404, detail="您查找的新闻不存在")  # 这里增加缩进（4个空格）
    return {"id": id}

# 方式二：定义全局异常处理器 exception_handler
@app.exception_handler(Exception)
def handle_exception(request: Request, exc: Exception):
    return JSONResponse(content={"code": 500, "message": "服务器内部错误, 请联系管理员~", "data": None})
```

## 日志打印

```python
import logging

# 配置日志的基本信息
# %(asctime)s :  时间 ;  %(levelname)s: 日志级别； %(filename)s: 文件名; %(lineno)d: 行数;  %(message)s: 日志信息
logging.basicConfig(
    level=logging.ERROR,  # 日志级别
    format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s" # 日志格式
)

# 定义异常处理器, 捕获所有异常 ---> 返回的对象的类型得是 Response
@app.exception_handler(Exception)
def handle_exception(request: Request, exc: Exception):
    logging.error(f"处理异常, 请求路径: {request.url},  捕获到异常: {exc}")
    return JSONResponse(content={"code": 500, "message": "服务器内部错误, 请联系管理员~", "data": None})
```

## 中间件

<img src="./2.png" style="width:1000px;">

> #### 中间件可以为每个请求添加同意的处理逻辑，如记录日志，身份认证，跨域，设置响应头，性能监控等，执行顺序为<span style="color: red;">自下而上</span>
>
> #### 定义方式：在函数的顶部使用装饰器 @app.middleware("http")

```python
@app.middleware("http")
async def middleware2(request, call_next):
    print("中间件2 start")
    response = await call_next(request)
    print("中间件2 end")
    return response


@app.middleware("http")
async def middleware1(request, call_next):
    print("中间件1 start")
    response = await call_next(request)
    print("中间件1 end")
    return response

"""
执行顺序自下而上，即执行结果如下

中间件1 start
中间件2 start
中间件2 end
中间件1 end
"""
```

## 依赖注入

> #### 依赖项：可重用的组件（函数/类），负责提供某种功能或数据
>
> #### 依赖注入可以实现抽取可复用的组件，实现代码复用、解耦且可轻松替换依赖项进行测试
>
> #### 使用场景：处理请求参数，共享业务逻辑，共享数据库连接，安全和验证
>
> #### 使用步骤：创建依赖项 -> 导入 Depends -> 声明依赖项

```python
from fastapi import FastAPI, Query, Depends  # 2. 导入 Depends

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

# 分页参数逻辑共用： 新闻列表和用户列表
# 定义依赖项
async def common_parameters(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=60)
):
    return {"skip": skip, "limit": limit}

# 依赖注入
@app.get("/news/news_list")
async def get_news_list(commons=Depends(common_parameters)):
    return commons
```

## ORM 操作

### 基本介绍

> #### ORM（Object-RelationalMapping，对象关系映射）是一种编程技术，用于在面向对象编程语言和关系型数据库之间建立映射。它允许开发者通过操作对象的方式与数据库进行交互，而无需直接编写复杂的 SQL 语句
>
> #### 使用 ORM 可以实现减少重复的 SQL 代码、代码更简洁易读、自动处理数据库连接和事务、自动防止 SQL 注入攻击

<img src="./3.png" style="width:1000px;">

### 安装依赖

```bash
pip install "sqlalchemy[asyncio]" aiomysql
```

### 建表操作

> #### FastAPI 应用启动时实现创建数据库表
>
> #### 通过继承 DeclarativeBase 实现创建表模型，Mapped 字段声明数据库字段类型，mapped_column 函数声明数据库字段的属性

```python
from datetime import datetime
from fastapi import FastAPI, Depends
from sqlalchemy import DateTime, func, String, Float, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

app = FastAPI()

# 1. 创建异步引擎
ASYNC_DATABASE_URL = "mysql+aiomysql://root:123456@localhost:3306/FastAPI_first?charset=utf8"
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,  # 可选，输出 SQL 日志
    pool_size=10,  # 设置连接池活跃的连接数
    max_overflow=20  # 允许额外的连接数
)

# 2. 定义模型类： 基类 + 表对应的模型类
# 基类：创建时间、更新时间；书籍表：id、书名、作者、价格、出版社
class Base(DeclarativeBase):
    create_time: Mapped[datetime] = mapped_column(DateTime, insert_default=func.now(), default=func.now, comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, insert_default=func.now(), default=func.now, onupdate=func.now(), comment="修改时间")

class Book(Base):
    __tablename__ = "book"

    id: Mapped[int] = mapped_column(primary_key=True, comment="书籍id")
    bookname: Mapped[str] = mapped_column(String(255), comment="书名")
    author: Mapped[str] = mapped_column(String(255), comment="作者")
    price: Mapped[float] = mapped_column(Float, comment="价格")
    publisher: Mapped[str] = mapped_column(String(255), comment="出版社")

# 3. 建表：定义函数建表 → FastAPI 启动的时候调用建表的函数
async def create_tables():
    # 获取异步引擎，创建事务 - 建表
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)  # Base 模型类的元数据创建

@app.on_event("startup")
async def startup_event():
    await create_tables()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### 示例代码

```python
from datetime import datetime
from fastapi import FastAPI, Depends
from sqlalchemy import DateTime, func, String, Float, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

app = FastAPI()

# 1. 创建异步引擎
ASYNC_DATABASE_URL = "mysql+aiomysql://root:123456@localhost:3306/FastAPI_first?charset=utf8"
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,  # 可选，输出 SQL 日志
    pool_size=10,  # 设置连接池活跃的连接数
    max_overflow=20  # 允许额外的连接数
)

# 2. 定义模型类： 基类 + 表对应的模型类
# 基类：创建时间、更新时间；书籍表：id、书名、作者、价格、出版社
class Base(DeclarativeBase):
    create_time: Mapped[datetime] = mapped_column(DateTime, insert_default=func.now(), default=func.now, comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, insert_default=func.now(), default=func.now, onupdate=func.now(), comment="修改时间")


class Book(Base):
    __tablename__ = "book"

    id: Mapped[int] = mapped_column(primary_key=True, comment="书籍id")
    bookname: Mapped[str] = mapped_column(String(255), comment="书名")
    author: Mapped[str] = mapped_column(String(255), comment="作者")
    price: Mapped[float] = mapped_column(Float, comment="价格")
    publisher: Mapped[str] = mapped_column(String(255), comment="出版社")

# 3. 建表：定义函数建表 → FastAPI 启动的时候调用建表的函数
async def create_tables():
    # 获取异步引擎，创建事务 - 建表
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)  # Base 模型类的元数据创建

@app.on_event("startup")
async def startup_event():
    await create_tables()

@app.get("/")
async def root():
    return {"message": "Hello World"}

# 需求：查询功能的接口，查询图书 → 依赖注入：创建依赖项获取数据库会话 + Depends 注入路由处理函数
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,  # 绑定数据库引擎
    class_=AsyncSession,  # 指定会话类
    expire_on_commit=False  # 提交后会话不过期，不会重新查询数据库
)

# 依赖项
async def get_database():
    async with AsyncSessionLocal() as session:
        try:
            yield session  # 返回数据库会话给路由处理函数
            await session.commit()  # 提交事务
        except Exception:
            await session.rollback()  # 有异常，回滚
            raise
        finally:
            await session.close()  # 关闭会话

@app.get("/book/books")
async def get_book_list(db: AsyncSession = Depends(get_database)):
    # 查询
    result = await db.execute(select(Book))
    book = result.scalars().all()
    return book
```

## CRUD 操作

### 普通查询

```python
@app.get("/book/books")
async def get_book_list(db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(Book))  # 查询 → 返回一个 ORM 对象
    book = result.scalars().all()  # 获取所有数据
    book = result.scalars().first()  # 获取第一个数据
    book = await db.get(Book, 5)  # 根据主键 id 获取单条数据
    return book
```

### 条件查询

```python
# 需求：路径参数 书籍id
@app.get("/book/get_book/{book_id}")
async def get_book_list(book_id: int, db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    return book

# 需求：条件 价格大于等于200
@app.get("/book/search_book")
async def get_search_book(db: AsyncSession = Depends(get_database)):
    result = await db.execute(select(Book).where(Book.price >= 200))
    books = result.scalars().all()
    return books

@app.get("/book/search_book")
async def get_search_book(db: AsyncSession = Depends(get_database)):
    # 需求： 作者以 曹 开头  % _
    # like() 模糊查询： % 任意个字符；_ 一个单个字符
    result = await db.execute(select(Book).where(Book.author.like("曹_")))

    # & | ~ 与非
    result = await db.execute(select(Book).where((Book.author.like("曹%")) | (Book.price > 100)))

    # in_() 包含
    # 需求：书籍id列表，数据库里面的 id 如果在 书籍id列表里面 就返回
    id_list = [1, 3, 5, 7]
    result = await db.execute(select(Book).where(Book.id.in_(id_list)))
    book = result.scalars().all()
    return book
```

### 聚合查询

```python
@app.get("/book/count")
async def get_count(db: AsyncSession = Depends(get_database)):
    # 聚合查询 select( func.方法名(模型类.属性) )
    result = await db.execute(select(func.count(Book.id)))
    result = await db.execute(select(func.max(Book.price)))
    result = await db.execute(select(func.sum(Book.price)))
    result = await db.execute(select(func.avg(Book.price)))
    num = result.scalar()  # 用来提取一个数值 → 标量值
    return num
```

### 分页查询

```python
@app.get("/book/get_book_list")
async def get_book_list(
    page: int = 1,
    page_size: int = 3,
    db: AsyncSession = Depends(get_database)
):
    # （页码 - 1） * 每页数量
    skip = (page - 1) * page_size

    # offset 跳过的记录数  ； limit 每页的记录数
    stmt = select(Book).offset(skip).limit(page_size)
    result = await db.execute(stmt)
    books = result.scalars().all()
    return books
```

### 新增操作

```python
# 需求：用户输入图书信息（id、书名、作者、价格、出版社） → 新增
# 用户输入 → 参数 → 请求体
class BookBase(BaseModel):
    id: int
    bookname: str
    author: str
    price: float
    publisher: str

@app.post("/book/add_book")
async def add_book(book: BookBase, db: AsyncSession = Depends(get_database)):
    # ORM对象 → add → commit
    # 获取 book 对象的所有属性，返回一个字典，把字典拆开，变成 key=value 的形式
    # 相当于：Book(id=1, bookname="三体", author="刘慈欣", price=68.0, publisher="重庆出版社")
    book_obj = Book(**book.__dict__)
    db.add(book_obj)
    await db.commit()
    return book
```

### 更新操作

```python
# 需求：修改图书信息：先查再改
# 设计思路：路径参数书籍id：作用是查找；请求体参数：作用是新数据（书名、作者、价格、出版社）
class BookUpdate(BaseModel):
    bookname: str
    author: str
    price: float
    publisher: str


@app.put("/book/update_book/{book_id}")
async def update_book(book_id: int, data: BookUpdate, db: AsyncSession = Depends(get_database)):
    # 1. 查找图书
    db_book = await db.get(Book, book_id)

    # 如果未找到 抛出异常
    if db_book is None:
        raise HTTPException(
            status_code=404,
            detail="查无此书"
        )

    # 2. 找到了则修改：重新赋值
    db_book.bookname = data.bookname
    db_book.author = data.author
    db_book.price = data.price
    db_book.publisher = data.publisher

    # 3. 提交到数据库
    await db.commit()
    return db_book
```

### 删除操作

```python
@app.delete("/book/delete_book/{book_id}")
async def delete_book(book_id: int, db: AsyncSession = Depends(get_database)):
    # 先查再删 提交
    db_book = await db.get(Book, book_id)

    if db_book is None:
        raise HTTPException(
            status_code=404,
            detail="查无此书"
        )

    await db.delete(db_book)
    await db.commit()
    return {"msg": "删除图书成功"}
```
