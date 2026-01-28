---
outline: [2, 3]
aside: left
---

<h1 style="text-align: center;">Ollama</h1>
 
- - -

## 官方网址

> #### https://ollama.com/

## 本地访问端口

> #### `http://127.0.0.1:11434`

## Apifox 接口导入脚本

<details>

<summary
  style="font-size:18px;font-weight:bold;background-color:#D3D3D3;padding-left:20px;padding-top:10px;padding-bottom:10px;"
>
  点我查看代码
</summary>

```json
{
  "apifoxProject": "1.0.0",
  "$schema": {
    "app": "apifox",
    "type": "project",
    "version": "1.2.0"
  },
  "info": {
    "name": "星图AI-Ollama",
    "description": "",
    "mockRule": {
      "rules": [],
      "enableSystemRule": true
    }
  },
  "projectSetting": {
    "id": "7783647",
    "auth": {},
    "securityScheme": {},
    "gateway": [],
    "language": "zh-CN",
    "apiStatuses": ["developing", "testing", "released", "deprecated"],
    "mockSettings": {},
    "preProcessors": [],
    "postProcessors": [],
    "advancedSettings": {},
    "initialDisabledMockIds": [],
    "servers": [
      {
        "id": "default",
        "name": "默认服务",
        "moduleId": 7006845
      }
    ],
    "cloudMock": {
      "security": "free",
      "enable": false,
      "tokenKey": "apifoxToken"
    }
  },
  "apiCollection": [
    {
      "name": "根目录",
      "id": 76847124,
      "auth": {},
      "securityScheme": {},
      "parentId": 0,
      "serverId": "",
      "description": "",
      "identityPattern": {
        "httpApi": {
          "type": "methodAndPath",
          "bodyType": "",
          "fields": []
        }
      },
      "shareSettings": {},
      "visibility": "SHARED",
      "moduleId": 7006845,
      "preProcessors": [
        {
          "id": "inheritProcessors",
          "type": "inheritProcessors",
          "data": {}
        }
      ],
      "postProcessors": [
        {
          "id": "inheritProcessors",
          "type": "inheritProcessors",
          "data": {}
        }
      ],
      "inheritPostProcessors": {},
      "inheritPreProcessors": {},
      "items": [
        {
          "name": "内容生成接口",
          "api": {
            "id": "408718413",
            "method": "post",
            "path": "/api/generate",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "152227343",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {},
                  "x-apifox-orders": ["01J0SR9FW2X48MECSNKBG2884W"],
                  "x-apifox-refs": {
                    "01J0SR9FW2X48MECSNKBG2884W": {
                      "$ref": "#/definitions/240717057"
                    }
                  }
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {},
                "x-apifox-orders": ["01J0SR8DGRJ1VN160WA141534Q"],
                "x-apifox-refs": {
                  "01J0SR8DGRJ1VN160WA141534Q": {
                    "$ref": "#/definitions/240717054"
                  }
                }
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 6,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.152227343"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        },
        {
          "name": "聊天对话接口",
          "api": {
            "id": "408718414",
            "method": "post",
            "path": "/api/chat",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "192442310",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {},
                  "x-apifox-orders": ["01J0SVB8APH9WQ48VAY553XFH7"],
                  "x-apifox-refs": {
                    "01J0SVB8APH9WQ48VAY553XFH7": {
                      "$ref": "#/definitions/240717058"
                    }
                  }
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {},
                "x-apifox-orders": ["01J0SVAWXKXYJZDZ1E0RJ6WHV1"],
                "x-apifox-refs": {
                  "01J0SVAWXKXYJZDZ1E0RJ6WHV1": {
                    "$ref": "#/definitions/240717055"
                  }
                }
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 12,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.192442310"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        },
        {
          "name": "向量化接口",
          "api": {
            "id": "408718415",
            "method": "post",
            "path": "/api/embeddings",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "194873757",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {
                    "embedding": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "title": "向量化数组"
                    }
                  },
                  "x-apifox-orders": ["embedding"],
                  "x-apifox-refs": {},
                  "required": ["embedding"]
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {},
                "x-apifox-orders": ["01J0SVP7630ZWKZXBRM7KBZK0X"],
                "x-apifox-refs": {
                  "01J0SVP7630ZWKZXBRM7KBZK0X": {
                    "$ref": "#/definitions/240717056"
                  }
                }
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 18,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.194873757"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        },
        {
          "name": "查询运行中的模型列表",
          "api": {
            "id": "408718416",
            "method": "get",
            "path": "/api/ps",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "127226356",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {},
                  "x-apifox-orders": ["01J0T5NZMBGA5MK5MG1C1MH7PB"],
                  "x-apifox-refs": {
                    "01J0T5NZMBGA5MK5MG1C1MH7PB": {
                      "$ref": "#/definitions/240717059"
                    }
                  }
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {},
                "x-apifox-orders": [],
                "x-apifox-refs": {}
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 24,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.127226356"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        },
        {
          "name": "查询可用的模型列表",
          "api": {
            "id": "408718417",
            "method": "get",
            "path": "/api/tags",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "108012469",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {},
                  "x-apifox-orders": ["01J0T5NZMBGA5MK5MG1C1MH7PB"],
                  "x-apifox-refs": {
                    "01J0T5NZMBGA5MK5MG1C1MH7PB": {
                      "$ref": "#/definitions/240717059"
                    }
                  }
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {},
                "x-apifox-orders": [],
                "x-apifox-refs": {}
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 30,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.108012469"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        },
        {
          "name": "拉取模型",
          "api": {
            "id": "408718418",
            "method": "post",
            "path": "/api/pull",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "147872783",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "title": "状态",
                      "description": "pulling manifest，downloading digestname，verifying sha256 digest，writing manifest，removing any unused layers，success"
                    },
                    "total": {
                      "type": "integer",
                      "title": "总大小"
                    },
                    "completed": {
                      "type": "integer",
                      "title": "完成的大小"
                    },
                    "digest": {
                      "type": "string",
                      "title": "摘要算法名"
                    }
                  },
                  "x-apifox-orders": ["status", "total", "completed", "digest"],
                  "x-apifox-refs": {},
                  "required": ["status"]
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "title": "模型名称"
                  },
                  "insecure": {
                    "type": "boolean",
                    "title": "是否非安全模式"
                  },
                  "stream": {
                    "type": "boolean",
                    "title": "是否返回流信息"
                  }
                },
                "x-apifox-orders": ["name", "insecure", "stream"],
                "x-apifox-refs": {},
                "required": ["name"]
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 36,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.147872783"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        },
        {
          "name": "删除模型",
          "api": {
            "id": "408718419",
            "method": "delete",
            "path": "/api/delete",
            "parameters": {
              "path": [],
              "query": [],
              "cookie": [],
              "header": []
            },
            "auth": {},
            "securityScheme": {},
            "commonParameters": {
              "query": [],
              "body": [],
              "cookie": [],
              "header": []
            },
            "responses": [
              {
                "id": "193520742",
                "code": 200,
                "name": "成功",
                "jsonSchema": {
                  "type": "object",
                  "properties": {},
                  "x-apifox-orders": [],
                  "x-apifox-refs": {}
                },
                "itemSchema": {},
                "contentType": "json"
              }
            ],
            "responseExamples": [],
            "requestBody": {
              "type": "application/json",
              "parameters": [],
              "jsonSchema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "title": "模型名称"
                  }
                },
                "x-apifox-orders": ["name"],
                "x-apifox-refs": {},
                "required": ["name"]
              },
              "required": false,
              "additionalContentTypes": [],
              "oasExtensions": ""
            },
            "description": "",
            "tags": [],
            "status": "released",
            "serverId": "",
            "operationId": "",
            "sourceUrl": "",
            "ordering": 42,
            "cases": [],
            "mocks": [],
            "customApiFields": "{}",
            "advancedSettings": {
              "disabledSystemHeaders": {}
            },
            "mockScript": {},
            "codeSamples": [],
            "commonResponseStatus": {},
            "responseChildren": ["BLANK.193520742"],
            "visibility": "INHERITED",
            "moduleId": 7006845,
            "oasExtensions": "",
            "type": "http",
            "preProcessors": [],
            "postProcessors": [],
            "inheritPostProcessors": {},
            "inheritPreProcessors": {}
          }
        }
      ]
    }
  ],
  "socketCollection": [],
  "docCollection": [],
  "webSocketCollection": [],
  "socketIOCollection": [],
  "mcpClientCollection": [],
  "responseCollection": [
    {
      "_databaseId": 8352190,
      "updatedAt": "2026-01-21T07:56:13.000Z",
      "name": "根目录",
      "type": "root",
      "children": [],
      "moduleId": 7006845,
      "parentId": 0,
      "id": 8352190,
      "ordering": [],
      "items": []
    }
  ],
  "schemaCollection": [
    {
      "id": 18169119,
      "name": "根目录",
      "visibility": "SHARED",
      "moduleId": 7006845,
      "items": [
        {
          "name": "内容生成请求模型",
          "displayName": "",
          "id": "#/definitions/240717054",
          "description": "",
          "schema": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "model": {
                  "type": "string",
                  "title": "模型名称"
                },
                "prompt": {
                  "type": "string",
                  "title": "提示词"
                },
                "stream": {
                  "type": "boolean",
                  "title": "是否流式生成"
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "seed": {
                      "type": "integer",
                      "title": "生成种子"
                    },
                    "top_k": {
                      "type": "integer",
                      "title": "多样度",
                      "description": "越高越多样，默认40"
                    },
                    "top_p": {
                      "type": "number",
                      "title": "保守度",
                      "description": "越低越保守，默认0.9"
                    },
                    "repeat_last_n": {
                      "type": "integer",
                      "title": "防重复回顾距离",
                      "description": "默认: 64, 0 = 禁用, -1 = num_ctx"
                    },
                    "temperature": {
                      "type": "number",
                      "title": "温度值",
                      "description": "越高创造性越强，默认0.8"
                    },
                    "repeat_penalty": {
                      "type": "number",
                      "title": "重复惩罚强度",
                      "description": "越高惩罚越强，默认1.1"
                    },
                    "stop": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "title": "停止词"
                    }
                  },
                  "required": ["stop"],
                  "x-apifox-orders": [
                    "seed",
                    "top_k",
                    "top_p",
                    "repeat_last_n",
                    "temperature",
                    "repeat_penalty",
                    "stop"
                  ],
                  "title": "配置参数"
                },
                "format": {
                  "type": "string",
                  "title": "响应格式"
                },
                "keep_alive": {
                  "type": "string",
                  "title": "模型内存保持时间",
                  "description": "5m"
                },
                "context": {
                  "type": "string",
                  "title": "记忆上下文",
                  "description": "上一次对话返回的值"
                },
                "system": {
                  "type": "string",
                  "title": "角色扮演提示词",
                  "description": "覆盖模型的sytem"
                },
                "template": {
                  "type": "string",
                  "title": "提示词模版",
                  "description": "覆盖模型的模版"
                }
              },
              "required": ["model", "prompt"],
              "x-apifox-orders": [
                "model",
                "prompt",
                "format",
                "stream",
                "keep_alive",
                "context",
                "system",
                "template",
                "options"
              ]
            }
          },
          "visibility": "INHERITED",
          "moduleId": 7006845
        },
        {
          "name": "聊天对话请求模型",
          "displayName": "",
          "id": "#/definitions/240717055",
          "description": "",
          "schema": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "model": {
                  "type": "string",
                  "title": "模型名称"
                },
                "stream": {
                  "type": "boolean",
                  "title": "是否流式生成"
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "seed": {
                      "type": "integer",
                      "title": "生成种子"
                    },
                    "top_k": {
                      "type": "integer",
                      "title": "多样度",
                      "description": "越高越多样，默认40"
                    },
                    "top_p": {
                      "type": "number",
                      "title": "保守度",
                      "description": "越低越保守，默认0.9"
                    },
                    "repeat_last_n": {
                      "type": "integer",
                      "title": "防重复回顾距离",
                      "description": "默认: 64, 0 = 禁用, -1 = num_ctx"
                    },
                    "temperature": {
                      "type": "number",
                      "title": "温度值",
                      "description": "越高创造性越强，默认0.8"
                    },
                    "repeat_penalty": {
                      "type": "number",
                      "title": "重复惩罚强度",
                      "description": "越高惩罚越强，默认1.1"
                    },
                    "stop": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "title": "停止词"
                    }
                  },
                  "required": ["stop"],
                  "x-apifox-orders": [
                    "seed",
                    "top_k",
                    "top_p",
                    "repeat_last_n",
                    "temperature",
                    "repeat_penalty",
                    "stop"
                  ],
                  "title": "配置参数"
                },
                "format": {
                  "type": "string",
                  "title": "响应格式"
                },
                "keep_alive": {
                  "type": "string",
                  "title": "模型内存保持时间",
                  "description": "5m"
                },
                "messages": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "role": {
                        "type": "string",
                        "title": "角色",
                        "description": "system、user或assistant"
                      },
                      "content": {
                        "type": "string",
                        "title": "内容"
                      },
                      "images": {
                        "type": "string",
                        "title": "图像"
                      }
                    },
                    "x-apifox-orders": ["role", "content", "images"],
                    "required": ["role", "content"]
                  },
                  "title": "聊天消息"
                }
              },
              "required": ["model", "messages"],
              "x-apifox-orders": [
                "model",
                "messages",
                "format",
                "stream",
                "keep_alive",
                "options"
              ]
            }
          },
          "visibility": "INHERITED",
          "moduleId": 7006845
        },
        {
          "name": "向量化请求模型",
          "displayName": "",
          "id": "#/definitions/240717056",
          "description": "",
          "schema": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "model": {
                  "type": "string",
                  "title": "模型名称"
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "seed": {
                      "type": "integer",
                      "title": "生成种子"
                    },
                    "top_k": {
                      "type": "integer",
                      "title": "多样度",
                      "description": "越高越多样，默认40"
                    },
                    "top_p": {
                      "type": "number",
                      "title": "保守度",
                      "description": "越低越保守，默认0.9"
                    },
                    "repeat_last_n": {
                      "type": "integer",
                      "title": "防重复回顾距离",
                      "description": "默认: 64, 0 = 禁用, -1 = num_ctx"
                    },
                    "temperature": {
                      "type": "number",
                      "title": "温度值",
                      "description": "越高创造性越强，默认0.8"
                    },
                    "repeat_penalty": {
                      "type": "number",
                      "title": "重复惩罚强度",
                      "description": "越高惩罚越强，默认1.1"
                    },
                    "stop": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "title": "停止词"
                    }
                  },
                  "required": ["stop"],
                  "x-apifox-orders": [
                    "seed",
                    "top_k",
                    "top_p",
                    "repeat_last_n",
                    "temperature",
                    "repeat_penalty",
                    "stop"
                  ],
                  "title": "配置参数"
                },
                "keep_alive": {
                  "type": "string",
                  "title": "模型内存保持时间",
                  "description": "5m"
                },
                "prompt": {
                  "type": "string",
                  "title": "要向量化的文本"
                }
              },
              "required": ["model", "prompt"],
              "x-apifox-orders": ["model", "prompt", "keep_alive", "options"]
            }
          },
          "visibility": "INHERITED",
          "moduleId": 7006845
        },
        {
          "name": "内容生成响应模型",
          "displayName": "",
          "id": "#/definitions/240717057",
          "description": "",
          "schema": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "model": {
                  "type": "string",
                  "title": "模型"
                },
                "created_at": {
                  "type": "string",
                  "title": "响应时间"
                },
                "response": {
                  "type": "string",
                  "title": "响应内容"
                },
                "done": {
                  "type": "boolean"
                },
                "context": {
                  "type": "array",
                  "items": {
                    "type": "integer"
                  },
                  "title": "会话上下文编码",
                  "description": "可以在下一个请求中发送此值以保持会话记忆"
                },
                "total_duration": {
                  "type": "integer",
                  "title": "总耗时"
                },
                "load_duration": {
                  "type": "integer",
                  "title": "模型加载耗时"
                },
                "prompt_eval_count": {
                  "type": "integer",
                  "title": "提示词token消耗数"
                },
                "prompt_eval_duration": {
                  "type": "integer",
                  "title": "提示词耗时"
                },
                "eval_count": {
                  "type": "integer",
                  "title": "响应token消耗数"
                },
                "eval_duration": {
                  "type": "integer",
                  "title": "响应耗时"
                }
              },
              "required": ["model", "created_at", "response", "eval_duration"],
              "x-apifox-orders": [
                "model",
                "created_at",
                "response",
                "done",
                "context",
                "total_duration",
                "load_duration",
                "prompt_eval_count",
                "prompt_eval_duration",
                "eval_count",
                "eval_duration"
              ]
            }
          },
          "visibility": "INHERITED",
          "moduleId": 7006845
        },
        {
          "name": "聊天对话响应模型",
          "displayName": "",
          "id": "#/definitions/240717058",
          "description": "",
          "schema": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "model": {
                  "type": "string",
                  "title": "模型"
                },
                "created_at": {
                  "type": "string",
                  "title": "响应时间"
                },
                "done": {
                  "type": "boolean"
                },
                "total_duration": {
                  "type": "integer",
                  "title": "总耗时"
                },
                "load_duration": {
                  "type": "integer",
                  "title": "模型加载耗时"
                },
                "prompt_eval_count": {
                  "type": "integer",
                  "title": "提示词token消耗数"
                },
                "prompt_eval_duration": {
                  "type": "integer",
                  "title": "提示词耗时"
                },
                "eval_count": {
                  "type": "integer",
                  "title": "响应token消耗数"
                },
                "eval_duration": {
                  "type": "integer",
                  "title": "响应耗时"
                },
                "message": {
                  "type": "object",
                  "properties": {
                    "role": {
                      "type": "string",
                      "title": "角色"
                    },
                    "content": {
                      "type": "string",
                      "title": "内容"
                    }
                  },
                  "x-apifox-orders": ["role", "content"],
                  "title": "响应内容",
                  "required": ["role", "content"]
                }
              },
              "required": ["model", "created_at", "message"],
              "x-apifox-orders": [
                "model",
                "created_at",
                "message",
                "done",
                "total_duration",
                "load_duration",
                "prompt_eval_count",
                "prompt_eval_duration",
                "eval_count",
                "eval_duration"
              ]
            }
          },
          "visibility": "INHERITED",
          "moduleId": 7006845
        },
        {
          "name": "运行中的模型列表模型",
          "displayName": "",
          "id": "#/definitions/240717059",
          "description": "",
          "schema": {
            "jsonSchema": {
              "type": "object",
              "properties": {
                "models": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "title": "模型名称"
                      },
                      "model": {
                        "type": "string",
                        "title": "模型名称"
                      },
                      "size": {
                        "type": "integer",
                        "title": "模型大小"
                      },
                      "digest": {
                        "type": "string",
                        "title": "加密摘要"
                      },
                      "details": {
                        "type": "object",
                        "properties": {
                          "parent_model": {
                            "type": "string",
                            "title": "父模型"
                          },
                          "format": {
                            "type": "string",
                            "title": "格式",
                            "description": "比如guuf"
                          },
                          "family": {
                            "type": "string",
                            "title": "家族名称"
                          },
                          "families": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            },
                            "title": "家族名称"
                          },
                          "parameter_size": {
                            "type": "string",
                            "title": "规模大小"
                          },
                          "quantization_level": {
                            "type": "string",
                            "title": "量化级别"
                          }
                        },
                        "required": [
                          "parent_model",
                          "format",
                          "family",
                          "families",
                          "parameter_size",
                          "quantization_level"
                        ],
                        "x-apifox-orders": [
                          "parent_model",
                          "format",
                          "family",
                          "families",
                          "parameter_size",
                          "quantization_level"
                        ]
                      },
                      "expires_at": {
                        "type": "string",
                        "title": "运行开始时间"
                      },
                      "size_vram": {
                        "type": "integer",
                        "title": "占用大小"
                      }
                    },
                    "x-apifox-orders": [
                      "name",
                      "model",
                      "size",
                      "digest",
                      "details",
                      "expires_at",
                      "size_vram"
                    ]
                  }
                }
              },
              "required": ["models"],
              "x-apifox-orders": ["models"]
            }
          },
          "visibility": "INHERITED",
          "moduleId": 7006845
        }
      ]
    }
  ],
  "securitySchemeCollection": [
    {
      "id": 3188584,
      "moduleId": 7006845,
      "name": "根目录",
      "items": [],
      "ordering": []
    }
  ],
  "oasComponentCollection": [],
  "requestCollection": [
    {
      "name": "根目录",
      "children": [],
      "ordering": ["requestFolder.8305857"],
      "items": []
    }
  ],
  "apiTestCaseCollection": [
    {
      "name": "Root",
      "children": [],
      "items": []
    }
  ],
  "testCaseReferences": [],
  "environments": [],
  "commonScripts": [],
  "databaseConnections": [],
  "globalVariables": [],
  "commonParameters": null,
  "customFunctions": [],
  "projectTestCaseCategories": [
    {
      "id": 6351284,
      "name": "正向",
      "description": "有效的输入和正确的预期结果,代表典型的用法。"
    },
    {
      "id": 6351285,
      "name": "负向",
      "description": "消极的、无效的输入,如缺少字段、错误的类型、不支持的方法等。"
    },
    {
      "id": 6351286,
      "name": "边界值",
      "description": "极端或边缘条件,如最大字符串长度、空值、零、null等"
    },
    {
      "id": 6351287,
      "name": "安全性",
      "description": "可能暴露API安全性风险的测试用例。"
    },
    {
      "id": 6351288,
      "name": "其他",
      "description": "其他未归属的测试用例。"
    }
  ],
  "projectTestCaseTags": [
    {
      "id": 21995079,
      "name": "仅传必要字段",
      "description": "仅发送具有有效值的必填字段,省略所有可选字段,以测试最小有效请求。"
    },
    {
      "id": 21995080,
      "name": "语义合法",
      "description": "使用语法正确且在业务逻辑或域上下文中也有意义的值。"
    },
    {
      "id": 21995081,
      "name": "覆盖枚举组合",
      "description": "对所有枚举型参数,应用正交设计系统地构建参数及其枚举值的测试用例组合,专用于测试枚举覆盖率"
    },
    {
      "id": 21995082,
      "name": "其他正向",
      "description": "提供符合API规范的真实有效的输入,产生正确和预期的结果。"
    },
    {
      "id": 21995083,
      "name": "缺失必填字段",
      "description": "在请求主体或参数中省略一个或多个必需字段。"
    },
    {
      "id": 21995084,
      "name": "无效值",
      "description": "提供的值类型和格式正确,但在逻辑上对该字段无效。"
    },
    {
      "id": 21995085,
      "name": "类型错误",
      "description": "使用数据类型不正确的值,例如发送字符串而不是整数。"
    },
    {
      "id": 21995086,
      "name": "格式错误",
      "description": "以不正确的格式提供值,例如,错误的日期模式,格式错误的电子邮件地址。"
    },
    {
      "id": 21995087,
      "name": "语义非法",
      "description": "使用语法正确且格式正确的值,这些值在逻辑上不可能或违反域规则。"
    },
    {
      "id": 21995088,
      "name": "其他负向",
      "description": "提供无效或意外的输入,应触发错误处理或拒绝API。"
    },
    {
      "id": 21995089,
      "name": "Null",
      "description": "必须是 JSON 字面量 `null`(不是空的,也不是 \"null\")。"
    },
    {
      "id": 21995090,
      "name": "零值",
      "description": "必须是数字字面值0。"
    },
    {
      "id": 21995091,
      "name": "空值",
      "description": "必须是\"\"。"
    },
    {
      "id": 21995092,
      "name": "极大值",
      "description": "Max/min值 - 为数字或日期字段提供精确的最小值和最大值。"
    },
    {
      "id": 21995093,
      "name": "极小值",
      "description": "Max/min值 - 为数字或日期字段提供精确的最小值和最大值。"
    },
    {
      "id": 21995094,
      "name": "超出最大边界值",
      "description": "过长/过短字符串 - 提供超出允许的最小或最大边界的值。"
    },
    {
      "id": 21995095,
      "name": "超出最小边界值",
      "description": "过长/过短字符串 - 提供超出允许的最小或最大边界的值。"
    },
    {
      "id": 21995096,
      "name": "字符串过长",
      "description": "超出范围的值 - 提供大于允许的最大长度或小于要求的最小长度的字符串。"
    },
    {
      "id": 21995097,
      "name": "字符串过短",
      "description": "超出范围的值 - 提供大于允许的最大长度或小于要求的最小长度的字符串。"
    },
    {
      "id": 21995098,
      "name": "对象级别授权缺失",
      "description": "对象级别授权缺失 - 用户在没有适当授权的情况下访问或操作数据对象。"
    },
    {
      "id": 21995099,
      "name": "访问控制",
      "description": "基于角色、权限或属性来限制用户能访问哪些资源、能执行哪些操作"
    },
    {
      "id": 21995100,
      "name": "认证失败",
      "description": "认证失败 - 认证薄弱、配置错误或被绕过,导致未授权访问。"
    },
    {
      "id": 21995101,
      "name": "SQL注入",
      "description": "在输入字段中插入恶意SQL代码,测试是否存在SQL注入漏洞。"
    },
    {
      "id": 21995102,
      "name": "XSS注入",
      "description": "注入JavaScript或HTML标签来测试跨站点脚本漏洞。"
    },
    {
      "id": 21995103,
      "name": "模糊输入",
      "description": "发送大型或随机生成的有效载荷,以测试输入的有效性和稳定性。"
    },
    {
      "id": 21995104,
      "name": "命令行注入",
      "description": "将shell命令插入输入以测试命令执行漏洞。"
    },
    {
      "id": 21995105,
      "name": "JSON注入",
      "description": "插入恶意或意外的JSON结构来测试解析和验证。"
    },
    {
      "id": 21995106,
      "name": "NoSQL注入",
      "description": "提供NoSQL特定的恶意查询或操作符来测试注入漏洞。"
    },
    {
      "id": 21995107,
      "name": "其他",
      "description": "其他未归属的测试用例。"
    }
  ],
  "projectAssociations": [],
  "moduleSettings": [
    {
      "id": "7006845",
      "name": "默认模块",
      "description": "",
      "moduleVariables": [],
      "openApiInfo": {}
    }
  ]
}
```

</details>
