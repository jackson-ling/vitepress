---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 33</h1>

---

## 322. 零钱兑换

如果求组合数就是外层 for 循环遍历物品，内层 for 遍历背包。

如果求排列数就是外层 for 遍历背包，内层 for 循环遍历物品。

这句话结合本题 大家要好好理解。

题目链接：https://leetcode.cn/problems/coin-change

文章讲解：https://programmercarl.com/0322.%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.html

视频讲解：https://www.bilibili.com/video/BV14K411R7yv

### 思路分析

> #### 本题为完全背包的基本应用场景，求解的是个数，即物品、背包的遍历顺序可以颠倒

### 一维 dp

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        // 要求最小，初始化为最大，用于更新
        int max = Integer.MAX_VALUE;
        int[] dp = new int[amount + 1];
        for (int i = 0; i < dp.length; i++) {
            dp[i] = max;
        }
        // 金额为 0，需要的硬币数目为 0
        dp[0] = 0;
        // 求的是个数，遍历顺序无影响（如下是先遍历物品后遍历背包）
        for (int i = 0; i < coins.length; i++) {
            for (int j = coins[i]; j <= amount; j++) {
                // 更新最小值
                if (dp[j - coins[i]] != max) {
                    dp[j] = Math.min(dp[j], dp[j - coins[i]] + 1);
                }
            }
        }
        return dp[amount] == max ? -1 : dp[amount];
    }
}
```

## 279.完全平方数

本题 和 322. 零钱兑换 基本是一样的，大家先自己尝试做一做

题目链接：https://leetcode.cn/problems/perfect-squares

文章讲解：https://programmercarl.com/0279.%E5%AE%8C%E5%85%A8%E5%B9%B3%E6%96%B9%E6%95%B0.html

视频讲解：https://www.bilibili.com/video/BV12P411T7Br

### 思路分析

> #### 本题上一题的变种，套了个应用场景，每个物品就是完全平方数，背包就是 target 值

### 一维 dp

```java
class Solution {
    public int numSquares(int n) {
        // 求最小，初始化为最大
        int max = Integer.MAX_VALUE;
        int[] dp = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            dp[i] = max;
        }
        // 和为 0，组合数为 0
        dp[0] = 0;
        // 先遍历物品，后遍历背包，每个物品都是完全平方数
        for (int i = 1; i * i <= n; i++) {
            for (int j = i * i; j <= n; j++) {
                dp[j] = Math.min(dp[j], dp[j - i * i] + 1);
            }
        }
        return dp[n];
    }
}
```

## 139.单词拆分

题目链接：https://leetcode.cn/problems/word-break

文章讲解：https://programmercarl.com/0139.%E5%8D%95%E8%AF%8D%E6%8B%86%E5%88%86.html

视频讲解：https://www.bilibili.com/video/BV1pd4y147Rh

### 思路分析

> #### 单词就是物品，字符串 s 就是背包，单词能否组成字符串 s，就是问物品能不能把背包装满,拆分时可以重复使用字典中的单词，说明就是一个完全背包
>
> #### 拆分后的字串组合后要求为给定的字符串，<span style="color:red">强调顺序</span>，先遍历背包后遍历物品

### 一维 dp

```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // 物品
        HashSet<String> set = new HashSet<>(wordDict);
        // 背包
        boolean[] valid = new boolean[s.length() + 1];
        valid[0] = true;
        // 强调顺序，先遍历背包，后遍历物品
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i && !valid[i]; j++) {
                if (set.contains(s.substring(j, i)) && valid[j]) {
                    valid[i] = true;
                }
            }
        }
        return valid[s.length()];
    }
}
```

## 多重背包理论基础

文章讲解：https://programmercarl.com/%E8%83%8C%E5%8C%85%E9%97%AE%E9%A2%98%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80%E5%A4%9A%E9%87%8D%E8%83%8C%E5%8C%85.html

## 背包问题总结篇

文章讲解：https://programmercarl.com/%E8%83%8C%E5%8C%85%E6%80%BB%E7%BB%93%E7%AF%87.html
