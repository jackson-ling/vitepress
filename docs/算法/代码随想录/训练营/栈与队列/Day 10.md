---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 10</h1>

---

## 150. 逆波兰表达式求值

本题不难，但第一次做的话，会很难想到，所以先看视频，了解思路再去做题

题目链接：https://leetcode.cn/problems/evaluate-reverse-polish-notation/description/

文章讲解：https://programmercarl.com/0150.%E9%80%86%E6%B3%A2%E5%85%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%B1%82%E5%80%BC.html

视频讲解：https://www.bilibili.com/video/BV1kd4y1o7on

### （1）思路分析

> **内容补充：波兰表达式介绍**
>
> - **波兰表达式**（**前缀**表达式）：二叉树的<span style = "color:red;font-weight:bold">先序遍历</span>
> - **逆波兰表达式**（**后缀**表达式）：二叉树的<span style = "color:red;font-weight:bold">后序遍历</span>

> **波兰表达式的优点**
>
> - <span style = "color:red;font-weight:bold">去掉括号后表达式无歧义</span>**，平常使用的算式则是一种中缀表达式，如 ( 1 + 2 ) \* ( 3 + 4 ) ，即便写成 1 2 + 3 4 + \* 也可以依据次序计算出正确结果**
> - **适合用<span style = "color:red;font-weight:bold">栈操作运算</span>：遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中**

#### 波兰表达式和栈的结合运用

> **遍历波兰表达式，遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中**

<image src="https://file1.kamacoder.com/i/algo/150.%E9%80%86%E6%B3%A2%E5%85%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%B1%82%E5%80%BC.gif" style="margin-left: 20s0px;"/>

#### ⚠️ 计算注意点

- **<span style = "color:red;font-weight:bold">加法、乘法</span>：满足交换律，<span style = "color:red;font-weight:bold">不关心顺序</span>，顺序不会影响表达式的结果**
- **<span style = "color:red;font-weight:bold">减法、除法</span>：不满足交换律，<span style = "color:red;font-weight:bold">关心顺序</span>，然而元素在栈中的顺序是和表达式相反的，这里需要做处理**

#### 1. 减法：例如计算 a - b，但实际上在栈中出栈顺序应该是 b、a，为了实现 a - b，需要对第一个出栈元素做取反处理，即有如下代码

```java
stack.push(-stack.pop() + stack.pop());
```

#### 2. 除法：还是顺序问题，栈中的顺序和表达式顺序是相反的，也要做相应的处理，即有如下代码

```java
int temp1 = stack.pop();
int temp2 = stack.pop();
stack.push(temp2 / temp1);
```

### （2）题解

```java
class Solution {
    public int evalRPN(String[] tokens) {
        // 模拟栈结构
        Deque<Integer> stack = new LinkedList();
        for (String s : tokens) {
            // 注意 - 和 / 需要特殊处理，因为不符合交换律并且要求保持顺序
            if ("+".equals(s)) {
                stack.push(stack.pop() + stack.pop());
            } else if ("-".equals(s)) {
                stack.push(-stack.pop() + stack.pop());
            } else if ("*".equals(s)) {
                stack.push(stack.pop() * stack.pop());
            } else if ("/".equals(s)) {
                int temp1 = stack.pop();
                int temp2 = stack.pop();
                stack.push(temp2 / temp1);
            } else {
                stack.push(Integer.valueOf(s)); // 字符串转 Integer
            }
        }
        return stack.pop();
    }
}
```

## ❓239. 滑动窗口最大值

（有点难度，可能代码写不出来，但一刷至少需要理解思路）

本题算比较有难度的，需要自己去构造单调队列，建议先看视频来理解。

题目链接：https://leetcode.cn/problems/sliding-window-maximum/

文章讲解：https://programmercarl.com/0239.%E6%BB%91%E5%8A%A8%E7%AA%97%E5%8F%A3%E6%9C%80%E5%A4%A7%E5%80%BC.html

视频讲解：https://www.bilibili.com/video/BV1XS4y1p7qj

## ❓347.前 K 个高频元素

有点难度，可能代码写不出来，一刷至少需要理解思路，本题是 大数据中取前 k 值 的经典思路，了解想法之后，不算难。

题目链接：https://leetcode.cn/problems/top-k-frequent-elements/description/

文章讲解：https://programmercarl.com/0347.%E5%89%8DK%E4%B8%AA%E9%AB%98%E9%A2%91%E5%85%83%E7%B4%A0.html

视频讲解：https://www.bilibili.com/video/BV1Xg41167Lz

## 阶段五结束：栈与队列总结

文章链接：https://programmercarl.com/%E6%A0%88%E4%B8%8E%E9%98%9F%E5%88%97%E6%80%BB%E7%BB%93.html
