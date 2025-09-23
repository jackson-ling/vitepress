---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 35</h1>

---

股票问题是一个动态规划的系列问题，前两题并不难，第三题有难度。

## 121. 买卖股票的最佳时机

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock

文章讲解：https://programmercarl.com/0121.%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BA.html

视频讲解：https://www.bilibili.com/video/BV1Xe4y1u77q

### 思路分析

#### （1）理解题意

> #### <span style="color:red">只能买一次，卖一次</span>
>
> #### 买要在卖之前
>
> #### 要计算最大利润

#### （2）思考方向

> #### 为了刻画清楚 “ 当天的最大利润取决于昨天的情况 ” ，就需要明确区分你昨天到底是<span style="color:red">手上有股票还是没股票</span>，因为只有<span style="color:red">买和卖</span>两种情况，需要选择恰当的时机买入然后卖出得到最大利润

> #### dp[i][<span style="color:red">0</span>] 表示第 i 天<span style="color:red">持有</span>股票所得最多现金 ；dp[i][<span style="color:red">1</span>] 表示第 i 天<span style="color:red">不持有</span>股票所得最多现金

#### 如果<span style="color:red">第 i 天持有</span>股票即 dp[i][0]， 那么可以由两个状态推出来

> #### <span style="color:red">第 i-1 天就持有</span>股票，那么就保持现状，所得现金就是昨天持有股票的所得现金 即：dp[i - 1][0]
>
> #### <span style="color:red">第 i 天买入</span>股票，所得现金就是买入今天的股票后所得现金即：-prices[i]
>
> #### 那么 dp[i][0]应该选所得现金最大的，所以 dp[i][0] = max(dp[i - 1][0], -prices[i]);

#### 如果<span style="color:red">第 i 天不持有</span>股票即 dp[i][1]， 也可以由两个状态推出来

> #### <span style="color:red">第 i-1 天就不持有</span>股票，那么就保持现状，所得现金就是昨天不持有股票的所得现金 即：dp[i - 1][1]
>
> #### <span style="color:red">第 i 天卖出</span>股票，所得现金就是按照今天股票价格卖出后所得现金即：prices[i] + dp[i - 1][0]
>
> #### 同样 dp[i][1]取最大的，dp[i][1] = max(dp[i - 1][1], prices[i] + dp[i - 1][0]);

### 二维 dp

> #### 利用二维数组记录每天持有和不持有股票这两种情况下拥有的最大金额

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) {
            return 0;
        }
        int[][] dp = new int[prices.length][2];
        // dp[i][0]代表第i天  持有  股票的最大收益
        // dp[i][1]代表第i天  不持有  股票的最大收益
        dp[0][0] = -prices[0];
        dp[0][1] = 0;
        // 初始化了第一天，从第二天开始遍历
        for (int i = 1; i < prices.length; i++) {
            // 持有：保持昨天持有的状态  或者  今天买入
            dp[i][0] = Math.max(dp[i - 1][0], -prices[i]);
            // 不持有：保持昨天不持有的状态 或者 今天卖出
            // 注意：只能买一次卖一次，今天卖出说明昨天持有
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
        }
        return dp[prices.length - 1][1];
    }
}
```

### 二维优化

> #### 从递推公式中可以看出，今天的数据只依赖昨天，前天的数据已经没有用了，可以做成滚动数组进行更新
>
> #### i % 2 代表 今天 的位置（0 或 1），(i - 1) % 2 代表 昨天 的位置，这样就能在 2 行数组里交替覆盖，而不用开 len 行

```java
class Solution {
    public int maxProfit(int[] prices) {
        int len = prices.length;
        int dp[][] = new int[2][2];

        dp[0][0] = - prices[0];
        dp[0][1] = 0;

        for (int i = 1; i < len; i++){
            dp[i % 2][0] = Math.max(dp[(i - 1) % 2][0], - prices[i]);
            dp[i % 2][1] = Math.max(dp[(i - 1) % 2][1], prices[i] + dp[(i - 1) % 2][0]);
        }
        return dp[(len - 1) % 2][1];
    }
}
```

### 一维 dp

> #### 递推公式中可以看出，每一天的状态更新<span style="color:red">只依赖昨天</span> → <span style="color:red">覆盖更新</span>即可，那就不需要保存整个二维数组，我们只要两个变量来表示当前<span style="color:red">持有和不持有的状态</span>就行

```java
class Solution {
  public int maxProfit(int[] prices) {
    int[] dp = new int[2];
    // 记录一次交易，一次交易有买入卖出两种状态
    // 0代表持有，1代表卖出
    dp[0] = -prices[0];
    dp[1] = 0;
    // 可以参考斐波那契问题的优化方式
    // 我们从 i=1 开始遍历数组，一共有 prices.length 天，
    // 所以是 i<=prices.length
    for (int i = 1; i <= prices.length; i++) {
      // 前一天持有；或当天买入
      dp[0] = Math.max(dp[0], -prices[i - 1]);
      // 如果 dp[0] 被更新，那么 dp[1] 肯定会被更新为正数的 dp[1]
      // 而不是 dp[0]+prices[i-1]==0 的0，
      // 所以这里使用会改变的dp[0]也是可以的
      // 当然 dp[1] 初始值为 0 ，被更新成 0 也没影响
      // 前一天卖出；或当天卖出, 当天要卖出，得前一天持有才行
      dp[1] = Math.max(dp[1], dp[0] + prices[i - 1]);
    }
    return dp[1];
  }
}
```

## 122.买卖股票的最佳时机 II

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii

文章讲解：https://programmercarl.com/0122.%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BAII%EF%BC%88%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%EF%BC%89.html

视频讲解：https://www.bilibili.com/video/BV1D24y1Q7Ls

### 思路分析

> #### 区别于上一题，本题的股票可以<span style="color:red">买卖多次</span>，对于不持有股票的状态没有变化，但是第 i 天买入股票的状态有所变化，因为一只股票可以买卖多次，所以当第 i 天买入股票的时候，所持有的现金可能有之前买卖过的利润
>
> #### 如果是第 i 天买入股票，所得现金就是昨天不持有股票的所得现金减去今天的股票价格 即：dp[i - 1][1] - prices[i]

### 二维 dp

```java
class Solution {
    public int maxProfit(int[] prices) {
        int[][] dp = new int[prices.length][2];
        // 持有股票
        dp[0][0] = -prices[0];
        // 不持有股票
        dp[0][1] = 0;
        // 从第二天开始遍历
        for (int i = 1; i < prices.length; i++){
            // 持有股票，保持昨天持有的状态或者今天买入（用前一天的利润购入）
            dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] - prices[i]);
            // 不持有股票，保持昨天不持有的状态或者今天卖出（今天可以卖出的前提是昨天持有）
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
        }
        return dp[prices.length - 1][1];
    }
}
```

### 一维 dp

```java
class Solution {
    // 一维 dp
    public int maxProfit(int[] prices) {
        int[] dp = new int[2];
        // 持有股票
        dp[0] = -prices[0];
        // 不持有股票
        dp[1] = 0;
        // 第二天开始遍历
        // 区别与二维dp，这里需要取等，充当计数器的作用，表示一共有 prices.length 天
        for (int i = 1; i <= prices.length; i++) {
            // 注意：这里 price 取 i - 1 的目的是将第几天与price中的股票对应
            // 持有股票，保持昨天持有的状态或者今天买入（用前一天的利润购入）
            dp[0] = Math.max(dp[0],dp[1] - prices[i - 1]);
            // 不持有股票，保持昨天不持有的状态或者今天卖出（今天可以卖出的前提是昨天持有）
            dp[1] = Math.max(dp[1],dp[0] + prices[i - 1]);
        }
        return dp[1];
    }
}
```

## 123.买卖股票的最佳时机 III

这道题一下子就难度上来了，关键在于至多买卖两次，这意味着可以买卖一次，可以买卖两次，也可以不买卖。

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii

文章讲解：https://programmercarl.com/0123.%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BAIII.html

视频讲解：https://www.bilibili.com/video/BV1WG411K7AR

### 思路分析

> #### 本题就是上面两题的综合应用，根据题意，<span style="color:red">允许当天买入当天卖出</span>，可以分成以下五种情况
>
> #### （1）没有操作 （其实我们也可以不设置这个状态）
>
> #### （2）第一次持有股票
>
> #### （3）第一次不持有股票
>
> #### （4）第二次持有股票
>
> #### （5）第二次不持有股票
>
> #### 第一次买入就是股票 I 的场景，第二次买入就是股票 II 的场景（用买卖股票赚取的利润再次买入股票）

### 二维 dp

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) {
            return 0;
        }
        int[][] dp = new int[prices.length][5];
        // 没有操作，不买不卖
        dp[0][0] = 0;
        // 第一次持有
        dp[0][1] = -prices[0];
        // 第一次不持有（买了又卖）
        dp[0][2] = 0;

        // 初始化第二次买入的状态是确保最后结果是最多两次买卖的最大利润

        // 第二次持有（依赖于第一次，第一次买了又卖，初值还是0，第二次买入）
        dp[0][3] = -prices[0];
        // 第二次不持有（买了又卖）
        dp[0][4] = 0;
        // 从第二天开始遍历
        for (int i = 1; i < prices.length; i++) {
            // 没有操作
            dp[i][0] = dp[i - 1][0];
            // 第一次持有：维持前一天持有的状态 或者 今天买入
            dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
            // 第一次不持有：维持前一天不持有的状态 或者 今天卖出（前提是前一天买入）
            dp[i][2] = Math.max(dp[i - 1][2], dp[i - 1][1] + prices[i]);
            // 第二次持有：维持前一天持有的状态 或者 今天买入（在第一次（前一天）不持有的状态下第二次买入）
            dp[i][3] = Math.max(dp[i - 1][3], dp[i - 1][2] - prices[i]);
            // 第二次不持有：维持前一天不持有的状态 或者 今天卖出（在第一次（前一天）持有的状态下第二次卖出）
            dp[i][4] = Math.max(dp[i - 1][4], dp[i - 1][3] + prices[i]);
        }
        // 两次买卖结束后，求取最大利润
        return dp[prices.length - 1][4];
    }
}
```

### 一维 dp

```java
class Solution {
    public int maxProfit(int[] prices) {
        int[] dp = new int[4];
        // 存储两次交易的状态就行了
        // dp[0]代表第一次交易的买入
        dp[0] = -prices[0];
        // dp[1]代表第一次交易的卖出
        dp[1] = 0;
        // dp[2]代表第二次交易的买入
        dp[2] = -prices[0];
        // dp[3]代表第二次交易的卖出
        dp[3] = 0;
        for (int i = 1; i <= prices.length; i++) {
            // 要么保持不变，要么没有就买，有了就卖
            dp[0] = Math.max(dp[0], -prices[i - 1]);
            dp[1] = Math.max(dp[1], dp[0] + prices[i - 1]);
            // 这已经是第二次交易了，所以得加上前一次交易卖出去的收获
            dp[2] = Math.max(dp[2], dp[1] - prices[i - 1]);
            dp[3] = Math.max(dp[3], dp[2] + prices[i - 1]);
        }
        return dp[3];
    }
}
```
