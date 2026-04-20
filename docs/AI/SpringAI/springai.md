---
outline: [2, 3]
aside: left
---

<h1 style="text-align: center;">SpringAI</h1>
 
- - -

## 官方网址

> #### https://spring.io/projects/spring-ai

## OpenAI 初体验

### 导入项目

> #### 项目地址：https://gitee.com/zhijun.zhang/openai-java-demo.git
>
> #### 环境要求
>
> #### （1）jdk 的版本要求是 17
>
> #### （2）Kotlin 版本要 2.1.0 以上，建议将 idea 升级到 2024 版本以上
>
> #### 基础配置
>
> #### （1）项目导入后，设置 -> 语言和框架 -> Kotlin -> 启用 K2 模式 -> 重启 IDEA
>
> #### （2）申请 OpenAI 的 ApiKey，并配置到环境变量中

### 申请 ApiKey

> #### 免费申请 OpenAI 密钥：https://github.com/chatanywhere/GPT_API_free

### 普通聊天

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

public class CompletionsDemo {

    public static void main(String[] args) {
        // 创建客户端，指定 API Key 与 baseUrl，其中API KEY从系统环境变量中获取
        OpenAIClient client = OpenAIOkHttpClient.builder()
                .baseUrl("https://api.chatanywhere.tech/v1")
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .build();

        // 构造聊天参数
        ChatCompletionCreateParams createParams = ChatCompletionCreateParams.builder()
                .model(ChatModel.GPT_3_5_TURBO) // 指定模型
                .addSystemMessage("你是一位Java程序员助理，具备扎实的Java编程基础和良好的代码理解能力。") // 添加系统消息
                .addUserMessage("你是谁？") // 添加用户消息
                .build();

        // 调用接口，获取结果并打印
        client.chat().completions()
                .create(createParams)
                .choices()
                .stream()
                .flatMap(choice -> choice.message().content().stream())
                .forEach(System.out::println);
    }
}
```

### 流式聊天

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

public class CompletionsStreamingDemo {

    public static void main(String[] args) {
        // 创建异步通信客户端，指定 API Key 与 baseUrl，其中API KEY从系统环境变量中获取
        var client = OpenAIOkHttpClient.builder()
                .baseUrl("https://api.chatanywhere.tech/v1")
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .build();

        // 构造聊天参数
        var createParams = ChatCompletionCreateParams.builder()
                .model(ChatModel.GPT_3_5_TURBO) // 指定模型
                .addSystemMessage("你是一位Java程序员助理，具备扎实的Java编程基础和良好的代码理解能力。") // 添加系统消息
                .addUserMessage("帮我写一个java的入门案例，有详细的描述") // 添加用户消息
                .build();

        // 调用聊天接口，获取流式响应
        try (var response = client.chat().completions().createStreaming(createParams)) {
            // 获取流式响应的数据流
            response.stream()
                    // 将每个 ChatCompletionChunk 的 choices() 转换为流进行处理
                    .flatMap(chatCompletionChunk -> chatCompletionChunk.choices().stream())
                    // 提取每个选择对象中的增量内容流（delta.content）
                    .flatMap(choice -> choice.delta().content().stream())
                    // 实时打印流式返回的文本内容
                    .forEach(System.out::println);
        }
    }
}
```

### 多轮对话（记忆）

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionAssistantMessageParam;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.ChatCompletionMessageParam;
import com.openai.models.chat.completions.ChatCompletionUserMessageParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 多轮对话示例代码
 */
public class CompletionsMultipleRoundsDemo {

    private static OpenAIClient client;

    public static void main(String[] args) {
        // 创建客户端，指定 API Key 与 baseUrl，其中API KEY从系统环境变量中获取
        client = OpenAIOkHttpClient.builder()
                .baseUrl("https://dashscope.aliyuncs.com/compatible-mode/v1")
                .apiKey(System.getenv("ALIYUN_API_KEY"))
                .build();

        // 创建消息集合，用于存储对话历史记录
        var messageParamList = new ArrayList<ChatCompletionMessageParam>();
        // 第一次对话
        chat("我叫花和尚，请记住我", messageParamList);
        System.out.println("------------------------");
        // 第二次对话
        chat("我是谁？", messageParamList);
    }

    public static void chat(String userMessage, List<ChatCompletionMessageParam> messageParamList) {
        // 手动构建 user 消息对象，并且放到消息集合中
        messageParamList.add(ChatCompletionMessageParam.ofUser(ChatCompletionUserMessageParam.builder()
                .content(userMessage)
                .build()));

        // 构造聊天参数
        var createParams = ChatCompletionCreateParams.builder()
                .model("qwen-plus") // 指定模型
                .messages(messageParamList) // 指定消息集合
                .build();

        // 调用接口，获取结果并打印
        client.chat().completions()
                .create(createParams)
                .choices()
                .stream()
                .flatMap(choice -> {
                    // 获取 assistant 消息
                    Optional<String> contentOptional = choice.message().content();
                    // 如果有 assistant 消息，则手动构建 assistant 消息对象，并且放到消息集合中
                    if (contentOptional.isPresent()) {
                        // 手动构建 assistant 消息对象，并且放到消息集合中
                        ChatCompletionAssistantMessageParam assistantMessageParam = ChatCompletionAssistantMessageParam.builder()
                                .content(contentOptional.get())
                                .build();
                        messageParamList.add(ChatCompletionMessageParam.ofAssistant(assistantMessageParam));
                    }
                    // 返回 assistant 消息流
                    return contentOptional.stream();
                })
                // 打印结果
                .forEach(System.out::println);
    }
}
```
