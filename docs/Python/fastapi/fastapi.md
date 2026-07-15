---
outline: [2, 3]
aside: left
---

<h1 style="text-align: center;">FastAPI 使用</h1>

## 官网

> #### https://fastapi.tiangolo.com/zh/

## 快速开始

### 安装依赖

```bash
pip install "fastapi[standard]"
```

### 示例代码

> #### 项目启动后，访问 `http://127.0.0.1:8000/docs` 可查看接口文档

```python
from fastapi import FastAPI

app = FastAPI() # 创建实例

app.mount("/static", StaticFiles(directory="static"), name="static") # 挂载静态文件的存放目录

# 定义路径操作函数 ---> http://localhost:8000/
@app.get("/")
def root():
    return FileResponse("static/index.html")

@app.get("/") # @app.post() / @app.put() / @app.delete()
async def root():
    return {"message": "Hello World"}

# 启动项目
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 请求体

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item
```

## 响应体

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []

@app.post("/items/")
def create_item(item: Item) -> Item:
    return item

@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(name="Portal Gun", price=42.0),
        Item(name="Plumbus", price=32.0),
    ]
```

## 异常处理

```python
# 定义异常处理器, 捕获所有异常 ---> 返回的对象的类型得是 Response
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
