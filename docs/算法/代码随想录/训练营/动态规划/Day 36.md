---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 36</h1>

---

## 188.买卖股票的最佳时机 IV

本题是 123.买卖股票的最佳时机 III 的进阶版

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv

文章讲解：https://programmercarl.com/0188.%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BAIV.html

视频讲解：https://www.bilibili.com/video/BV16M411U7XJ

### 思路分析

> #### 本题是买卖股票两次的一般化，对递推公式进行抽象，使用 for 循环实现递推

### 二维 dp

```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        // 奇数次表示第 k 次交易持有 / 买入，偶数次表示第 k 次交易不持有 / 卖出
        if (prices.length == 0) {
            return 0;
        }

        // 下标需要到 2k，初始化为 2k + 1
        int[][] dp = new int[prices.length][2 * k + 1];

        // 初始时候金钱为 0，奇数次表示持有 / 买入
        for (int i = 1; i < 2 * k; i += 2) {
            dp[0][i] = -prices[0];
        }

        // 遍历每一天，初始化了第一天，从第二天开始遍历
        for (int i = 1; i < prices.length; i++) {
            // 处理每一天的所有状态（注意边界）
            for (int j = 0; j <= 2 * k - 2; j += 2) {
                // 持有 / 买入
                dp[i][j + 1] = Math.max(dp[i - 1][j + 1], dp[i - 1][j] - prices[i]);
                // 不持有 / 卖出
                dp[i][j + 2] = Math.max(dp[i - 1][j + 2], dp[i - 1][j + 1] + prices[i]);
            }
        }
        // 偶数次表示第 k 次交易不持有 / 卖出
        return dp[prices.length - 1][2 * k];
    }
}
```

### 一维 dp

```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        if(prices.length == 0){
            return 0;
        }
        if(k == 0){
            return 0;
        }
        // 其实就是123题的扩展，123题只用记录2次交易的状态
        // 这里记录k次交易的状态就行了
        // 每次交易都有买入，卖出两个状态，所以要乘 2
        int[] dp = new int[2 * k];
        // 按123题解题格式那样，做一个初始化
        for(int i = 0; i < dp.length / 2; i++){
            dp[i * 2] = -prices[0];
        }
        for(int i = 1; i <= prices.length; i++){
            dp[0] = Math.max(dp[0], -prices[i - 1]);
            dp[1] = Math.max(dp[1], dp[0] + prices[i - 1]);
            // 还是与123题一样，与123题对照来看
            // 就很容易啦
            for(int j = 2; j < dp.length; j += 2){
                dp[j] = Math.max(dp[j], dp[j - 1] - prices[i-1]);
                dp[j + 1] = Math.max(dp[j + 1], dp[j] + prices[i - 1]);
            }
        }
        // 返回最后一次交易卖出状态的结果就行了
        return dp[dp.length - 1];
    }
}
```

## 309.最佳买卖股票时机含冷冻期

本题加了一个冷冻期，状态就多了，有点难度，大家要把各个状态分清，思路才能清晰

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown

文章讲解：https://programmercarl.com/0309.%E6%9C%80%E4%BD%B3%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E6%97%B6%E6%9C%BA%E5%90%AB%E5%86%B7%E5%86%BB%E6%9C%9F.html

视频讲解：https://www.bilibili.com/video/BV1rP4y1D7ku

### 思路分析

> #### 由于冷冻期的出现，对于不持有股票的两种状态需要区别开来

状态一：持有股票状态（今天买入股票，或者是之前就买入了股票然后没有操作，一直持有）

不持有股票状态，这里就有两种卖出股票状态

> 状态二：保持卖出股票的状态（两天前就卖出了股票，度过一天冷冻期。或者是前一天就是卖出股票状态，一直没操作）
>
> 状态三：今天卖出股票

状态四：今天为冷冻期状态，但冷冻期状态不可持续，只有一天！

---

#### 递推公式

#### （1）达到买入股票状态（状态一）

即：dp[i][0]，有两个具体操作：

- 操作一：前一天就是持有股票状态（状态一），  
  dp[i][0] = dp[i - 1][0]

- 操作二：今天买入，有两种情况
  - 前一天是冷冻期（状态四），dp[i - 1][3] - prices[i]
  - 前一天是保持卖出股票的状态（状态二），dp[i - 1][1] - prices[i]

那么：  
dp[i][0] = max(dp[i - 1][0], dp[i - 1][3] - prices[i], dp[i - 1][1] - prices[i]);

#### （2）达到保持卖出股票状态（状态二）

即：dp[i][1]，有两个具体操作：

- 操作一：前一天就是状态二
- 操作二：前一天是冷冻期（状态四）

dp[i][1] = max(dp[i - 1][1], dp[i - 1][3]);

#### （3）达到今天就卖出股票状态（状态三）

即：dp[i][2]，只有一个操作：

昨天一定是持有股票状态（状态一），今天卖出：

dp[i][2] = dp[i - 1][0] + prices[i];

#### （4）达到冷冻期状态（状态四）

即：dp[i][3]，只有一个操作：

昨天卖出了股票（状态三）：

dp[i][3] = dp[i - 1][2];

### 二维 dp

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length < 2) {
            return 0;
        }
        int[][] dp = new int[prices.length][4];

        // 状态一：持有股票状态（今天买入或者保持前一天持有的状态）
        dp[0][0] = -prices[0];
        // 状态二；保持卖出股票的状态（第 0 天没有前一天，用递推公式推导得出初始化为0）
        dp[0][1] = 0;
        // 状态三：今天卖出股票（同状态二推导）
        dp[0][2] = 0;
        // 状态四：冷冻期（同状态二推导）
        dp[0][3] = 0;

        for (int i = 1; i < prices.length; i++) {
            /*
                状态一：持有股票
                （1）保持前一天持有股票的状态（状态一）
                今天买入
                （2）前一天是冷冻期（状态四）
                （3）前一天是保持卖出股票的状态（状态二）
             */
            dp[i][0] = Math.max(dp[i - 1][0], Math.max(dp[i - 1][3], dp[i - 1][1]) - prices[i]);
            /*
                状态二：保持卖出的状态
                （1）保持前一天卖出的状态
                （2）前一天是冷冻期
             */
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][3]);
            /*
                状态三：今天卖出，前一天必须持有
             */
            dp[i][2] = dp[i - 1][0] + prices[i];
            /*
                状态四：冷冻期，根据题目要求的状态，前一天为卖出的状态
             */
            dp[i][3] = dp[i - 1][2];

        }
        // 冷冻期（状态四）和卖出的状态（状态二、三）取最大
        return Math.max(dp[prices.length - 1][3], Math.max(dp[prices.length - 1][1], dp[prices.length - 1][2]));
    }
}
```

## 714.买卖股票的最佳时机含手续费

相对 122.买卖股票的最佳时机 II ，本题只需要在计算卖出操作的时候减去手续费就可以了，代码几乎是一样的，可以尝试自己做一做。

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee

文章讲解：https://programmercarl.com/0714.%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BA%E5%90%AB%E6%89%8B%E7%BB%AD%E8%B4%B9%EF%BC%88%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%EF%BC%89.html

视频讲解：https://www.bilibili.com/video/BV1z44y1Z7UR

### 思路分析

> #### 本题属于股票可以买卖多次，买卖的真个过程中会产生手续费，可以选择在买入时产生也可以选择在卖出时产生，减去即可，这里方便理解，选择卖出时产生手续费

### 二维 dp

```java
class Solution {
    public int maxProfit(int[] prices, int fee) {
        int[][] dp = new int[prices.length][2];
        // 0：持有（买入）  1：不持有（卖出）
        dp[0][0] = -prices[0];
        for (int i = 1; i < prices.length; i++) {
            dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] - prices[i]);
            // 卖出，则前一天必须持有
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i] - fee);
        }
        return Math.max(dp[prices.length - 1][0], dp[prices.length - 1][1]);
    }
}
```

### 一维 dp

> #### 二维 dp 的空间优化

```java
class Solution {
    public int maxProfit(int[] prices, int fee) {
    int[] dp = new int[2];
    dp[0] = -prices[0];
    dp[1] = 0;
    for (int i = 1; i <= prices.length; i++) {
      dp[0] = Math.max(dp[0], dp[1] - prices[i - 1]);
      dp[1] = Math.max(dp[1], dp[0] + prices[i - 1] - fee);
    }
    return dp[1];
    }
}
```

## 股票总结

文章讲解：https://programmercarl.com/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92-%E8%82%A1%E7%A5%A8%E9%97%AE%E9%A2%98%E6%80%BB%E7%BB%93%E7%AF%87.html
