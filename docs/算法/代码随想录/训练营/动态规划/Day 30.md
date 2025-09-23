---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 30</h1>

---

正式开始背包问题，背包问题还是挺难的，虽然大家可能看了很多背包问题模板代码，感觉挺简单，但基本理解的都不够深入。

如果是直接从来没听过背包问题，可以先看文字讲解慢慢了解 这是干什么的。

如果做过背包类问题，可以先看视频，很多内容，是自己平时没有考虑到位的。

背包问题，力扣上没有原题，大家先了解理论，今天就安排一道具体题目。

<img src="https://file1.kamacoder.com/i/algo/20210117171307407.png"/>

## 01 背包问题（二维）

题目链接：https://kamacoder.com/problempage.php?pid=1046

文章讲解：https://programmercarl.com/%E8%83%8C%E5%8C%85%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%8001%E8%83%8C%E5%8C%85-1.html

视频讲解：https://www.bilibili.com/video/BV1cg411g7Y6

### 01 背包问题场景

> #### 有 n 件物品和一个最多能背重量为 w 的背包。第 i 件物品的重量是 weight[i]，得到的价值是 value[i] 。<span style="color:red">每件物品只能用一次</span>，求解背包能背的物品<span style="color:red">最大价值</span>是多少？

### 思路分析

#### （1）确定 dp 数组以及下标的含义

> #### i 来表示物品、j 表示背包容量，dp[i][j] 表示从下标为 [ 0 - i ] 的物品里<span style="color:red">任意取</span>，放进容量为 j 的背包，价值总和最大是多少

#### （2）确定递推公式

> #### 不放物品 i（ <span style="color:red">j < weight [ i ]</span> ）：背包容量为 j，里面不放物品 i 的最大价值是 <span style="color:red">dp[ i - 1 ] [ j ]</span>
>
> #### 放物品 i：背包空出物品 i 的容量后，背包容量为 j - weight[ i ]，dp[i - 1] [ j - weight [ i ] ] 为背包容量为 j - weight [ i ] 且不放物品 i 的最大价值，那么 <span style="color:red">dp [ i - 1 ] [ j - weight [ i ] ] + value [ i ]</span> （物品 i 的价值），就是背包放物品 i 得到的最大价值
>
> #### 递归公式： <span style="color:red">dp [ i ] [ j ] = max ( dp [ i - 1 ] [ j ], dp [ i - 1 ] [ j - weight [ i ] ] + value [ i ] )</span>，因为要求最大价值，所以取最大

#### （3） dp 数组如何初始化

<div style="padding-left: 250px">

| 物品   | 重量 | 价值 |
| ------ | ---- | ---- |
| 物品 0 | 1    | 15   |
| 物品 1 | 3    | 20   |
| 物品 2 | 4    | 30   |

</div>

<img src="https://file1.kamacoder.com/i/algo/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92-%E8%83%8C%E5%8C%85%E9%97%AE%E9%A2%9810.jpg" style="width:600px;margin:0px auto"/>

#### 初始化左边列（0，0，0）

> #### 首先从 dp [ i ] [ j ] 的定义出发，如果背包容量 j 为 0 的话，即 dp [ i ] [ 0 ]，无论是选取哪些物品，背包价值总和一定为 0

#### 初始化上边行（0，15，15，15，15）

> #### （1）dp [ 0 ] [ j ] ：i 为 0，存放编号 0 的物品的时候，各个容量的背包所能存放的最大价值
>
> #### （2）j < weight [ 0 ] 的时候，dp[ 0 ][ j ] 应该是 0，因为背包容量比编号 0 的物品重量还小
>
> #### （3）j >= weight [ 0 ] 时，dp [ 0 ] [ j ] 应该是 value [ 0 ]，因为背包容量放足够放编号 0 物品

#### 其余位置初始化

> #### （1）递推公式：dp [ i ] [ j ] = max ( dp [ i - 1 ] [ j ], dp [ i - 1 ] [ j - weight [ i ] ] + value [ i ] );
>
> #### （2）从递推公式可以看出，dp [ i ] [ j ] 是由左上方数值推导出来了，那么其他下标初始为什么数值都可以，因为都会被覆盖
>
> #### （3）一开始就统一把 dp 数组统一初始为 0，更方便一些

#### （4）确定遍历顺序

> #### 根据递推公式和表格可以看出，当前的值是由正上方和左上方的的值推导而来
>
> #### <span style="color:red">先遍历物品，后遍历背包</span>；先遍历背包，后遍历物品，<span style="color:red">两种方式皆可</span>

#### （5）举例推导 dp 数组

<img src="https://file1.kamacoder.com/i/algo/20210118163425129.jpg" style="width:600px;margin:0px auto"/>

### 题解

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 材料的种类
        int n = scanner.nextInt();
        // 背包的空间
        int bageweight = scanner.nextInt();
        // 存储材料的重量
        int[] weight = new int[n];
        // 存储材料的价值
        int[] value = new int[n];

        for (int i = 0; i < n; i++) {
            weight[i] = scanner.nextInt();
        }
        for (int i = 0; i < n; i++) {
            value[i] = scanner.nextInt();
        }

        // 初始化 dp 数组
        int[][] dp = new int[n][bageweight + 1];

        // 左边列（可以省略，因为二维数组的默认初始化是0）
        // for (int i = 0; i < n; i++) {
        //     dp[i][0] = 0;
        // }

        // 上边行
        // 把物品 0 放入不同容量的背包，只有当背包容量大于等于 weight[0] 才能放入
        for (int i = weight[0]; i <= bageweight; i++) {
            // dp[0][i] 表示存放编号0的物品的时候，各个容量的背包所能存放的最大价值
            dp[0][i] = value[0];
        }

        // 遍历物品（从第二行开始遍历，递归公式需要由正上方和左上方的数值推导而来）
        for (int i = 1; i < n; i++) {
            // 遍历背包容量
            for (int j = 0; j <= bageweight; j++) {
                // 不放物品 i（背包容量不够）
                if (j < weight[i]) {
                    dp[i][j] = dp[i - 1][j];
                }
                // 放物品 i（i 是索引下标）
                else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
                }
            }

        }
        System.out.println(dp[n-1][bageweight]);
    }
}
```

## 01 背包问题（一维）

题目链接：https://kamacoder.com/problempage.php?pid=1046

文章讲解：https://programmercarl.com/%E8%83%8C%E5%8C%85%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%8001%E8%83%8C%E5%8C%85-2.html

视频讲解：https://www.bilibili.com/video/BV1BU4y177kY

### 思路分析

> #### 对于背包问题其实<span style="color:red">状态</span>都是可以<span style="color:red">压缩</span>的（<span style="color:red">状压 DP</span>），使用一维数组（<span style="color:red">滚动数组</span>）

#### 一维数组实现思想

> #### dp [ i ] [ j ] 表示从下标为 [ 0 - i ] 的物品里任意取，放进容量为 j 的背包，价值总和最大是多少
>
> #### （1）二维 dp 数组递推公式：dp [ i ] [ j ] = max ( dp [ i - 1 ] [ j ], dp [ i - 1 ] [ j - weight [ i ] ] + value [ i ] );
>
> #### （2）当前层的结果就是由上一层推出来的，那不如直接把<span style="color:red">上一层</span>（ dp [ i - 1 ]那一层 ）<span style="color:red">的结果拷贝到当前层</span>（ dp [ i ] ），表达式完全可以是：dp [ i ] [ j ] = max ( dp [ i ] [ j ], dp [ i ] [ j - weight [ i ] ] + value [ i ] );
>
> #### （3）与其把 dp[i - 1]这一层拷贝到 dp [ i ] 上，不如只用一个一维数组了，只用 dp [ j ] （一维数组，也可以理解是一个滚动数组）。
>
> #### （4）这就是滚动数组的由来，需要<span style="color:red">满足的条件</span>是<span style="color:red">上一层可以重复利用</span>，直接拷贝到当前层

#### （1）确定 dp 数组的定义

> #### 在一维 dp 数组中，dp [ j ] 表示：容量为 j 的背包，所背的物品价值可以最大为 dp [ j ]

#### （2）一维 dp 数组的递推公式

> #### 一维 dp 数组的思想由来就是把上一层（ dp [ i - 1 ] ）的结果拷贝到当前层（ dp [ i ] ），所以在 上面递推公式的基础上，<span style="color:red">去掉 i 这个维度</span>就好
>
> #### 递推公式为：<span style="color:red">dp [ j ] = max( dp [ j ], dp [ j - weight [ i ] ] + value [ i ] )</span>
>
> #### （1）dp [ j - weight [ i ] ] + value [ i ] 表示 容量为 [ j - 物品 i 重量 ] 的背包 加上 物品 i 的价值（也就是容量为 j 的背包，放入物品 i 了之后的价值即：dp [ j ] ）
>
> #### （2）此时 dp [ j ] 有两个选择，一个是取自己 dp [ j ] 相当于 二维 dp 数组中的 dp [ i - 1 ] [ j ]，即不放物品 i，一个是取 dp [ j - weight [ i ] ] + value [ i ]，即放物品 i，指定是取最大的，毕竟是求最大价值

#### （3）一维 dp 数组如何初始化

> #### dp 数组在推导的时候一定是<span style="color:red">取最大值</span>，如果题目给的价值都是正整数，那么非 0 下标都初始化为 0，因为这样才能让 dp 数组在递归公式的过程中取的最大的价值，<span style="color:red">而不是被初始值覆盖了</span>

#### （4）一维 dp 数组遍历顺序

> #### 倒序遍历背包；先遍历物品，后遍历背包

<div style="padding-left: 250px">

| 物品   | 重量 | 价值 |
| ------ | ---- | ---- |
| 物品 0 | 1    | 15   |
| 物品 1 | 3    | 20   |
| 物品 2 | 4    | 30   |

</div>

#### ① <span style="color:red">倒序遍历</span>背包是为了保证物品 i <span style="color:red">只被放入一次</span>

#### 正序遍历

> #### dp[1] = dp[1 - weight[0]] + value[0] = <span style="color:red">15</span>
>
> #### dp[2] = dp[2 - weight[0]] + value[0] = <span style="color:red">30</span>
>
> #### 此时 dp[2]就已经是 30 了，意味着物品 0，被放入了两次，所以不能正序遍历

#### 倒序遍历（先算 dp[2]）

> #### dp[2] = dp[2 - weight[0]] + value[0] = <span style="color:red">15</span> （dp 数组已经都初始化为 0）
>
> #### dp[1] = dp[1 - weight[0]] + value[0] = <span style="color:red">15</span>
>
> #### 从后往前循环，每次取得状态不会和之前取得状态重合，这样每种物品就只取一次了

#### ② 先遍历物品，后遍历背包

> #### 如果<span style="color:red">先遍历背包</span>，上面提到了背包必须是倒序遍历，这样才能保证物品只会被添加一次，正因为这个原因，就会导致<span style="color:red">所有背包只会有一个物品</span>，无法达到背包价值最大

#### （5）举例推导 dp 数组

<img src="https://file1.kamacoder.com/i/algo/20210110103614769.png" style="width:700px;margin:0px auto"/>

### 题解

```java
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 材料的数量
        int M = scanner.nextInt();
        // 材料的大小
        int N = scanner.nextInt();

        // 材料占用的空间
        int[] costs = new int[M];
        // 材料的价值
        int[] values = new int[M];

        for (int i = 0; i < M; i++) {
            costs[i] = scanner.nextInt();
        }

        for (int i = 0; i < M; i++) {
            values[i] = scanner.nextInt();
        }

        int[] dp = new int[N + 1];

        // 先遍历物品
        for (int i = 0; i < M; i++) {
            // 后遍历背包
            for (int j = N; j >= costs[i]; j--) {
                // 包含了选 物品 i 和不选 物品 i 的情况，取最大值
                dp[j] = Math.max(dp[j], dp[j - costs[i]] + values[i]);
            }
        }
        System.out.println(dp[N]);
    }
}
```

## 416. 分割等和子集

本题是 **01 背包的应用**类题目

题目链接：https://leetcode.cn/problems/partition-equal-subset-sum

文章讲解：https://programmercarl.com/0416.%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.html

视频讲解：https://www.bilibili.com/video/BV1rt4y1N7jE

### 思路分析

> #### 本题要求集合里能否出现总和为 sum / 2 的子集。

#### 01 背包场景迁移

> #### （1）既有一个只能装重量为 sum / 2 的背包，商品为数字，这些数字能不能把这个背包装满
>
> #### （2）一个数字只有一个维度，即表示重量，也表示价值，且<span style="color:red">重量等于价值</span>
>
> #### （3）商品是数字，重量和对应的价值是相同的，如果最大价值是 sum / 2，说明正好被商品装满了

#### ⚠️ 具体的动规五部曲分析可以参考上面两题，这里只是 01 背包场景迁移的应用，不再赘述

### 一维 DP

```java
class Solution {
    public boolean canPartition(int[] nums) {
        if (nums == null || nums.length == 0) {
            return false;
        }
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        // 总和应该平均分
        if (sum % 2 != 0) {
            return false;
        }
        int target = sum / 2;
        int[] dp = new int[target + 1];
        // 先遍历物品（此题场景中，物品就是数字）
        for (int i = 0; i < nums.length; i++) {
            // 后遍历背包（必须倒叙遍历），此题场景中，总和就是背包
            for (int j = target; j >= nums[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i]);
            }
        }
        // 剪枝优化
        if (dp[target] == target) {
            return true;
        }
        return dp[target] == target;
    }
}
```

### 二维 DP

```java
class Solution {
    public boolean canPartition(int[] nums) {
        if (nums == null || nums.length == 0) {
            return false;
        }
        int n = nums.length;
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        // 总和应该平均分
        if (sum % 2 != 0) {
            return false;
        }
        int target = sum / 2;
        int[][] dp = new int[nums.length][target + 1];
        // 初始化上边行
        for (int j = nums[0]; j <= target; j++) {
            dp[0][j] = nums[0];
        }

        for (int i = 1; i < n; i++) {
            for (int j = 0; j <= target; j++) {
                if (j < nums[i]) {
                    dp[i][j] = dp[i - 1][j];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - nums[i]] + nums[i]);
                }
            }
        }

        // for(int x : dp){
        //     System.out.print(x + ",");
        // }
        // System.out.print("    "+i+" row"+"\n");
        return dp[n - 1][target] == target;

        /*
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 1, 1, 1, 1, 5, 6, 6, 6, 6, 6, 6,
            0, 1, 1, 1, 1, 5, 6, 6, 6, 6, 6, 11,
            0, 1, 1, 1, 1, 5, 6, 6, 6, 6, 10, 11
        */
    }
}
```
