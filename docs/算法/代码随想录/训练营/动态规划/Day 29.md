---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 29</h1>

---

今天开始逐渐有 dp 的感觉了，前两题不同路径，可以好好研究一下，适合进阶

## 62. 不同路径

本题大家掌握动态规划的方法就可以。 数论方法有点非主流，很难想到。

题目链接：https://leetcode.cn/problems/unique-paths/description

文章讲解：https://programmercarl.com/0062.%E4%B8%8D%E5%90%8C%E8%B7%AF%E5%BE%84.html

视频讲解：https://www.bilibili.com/video/BV1ve4y1x7Eu

### 思路分析

> #### 机器人从 (0 , 0) 位置出发，到 ( m - 1, n - 1 ) 终点，每次只能向右走或者向下走

#### （1）确定 dp 数组（dp table）以及下标的含义

> #### dp[i][j] ：表示从（0 ，0）出发，到(i, j) 有 dp[i][j]条不同的路径

#### （2）确定递推公式

> #### 想要求 dp[i][j] ，只能有两个方向来推导出来，即 dp[i - 1][j] 和 dp[i][j - 1]
>
> #### 此时在回顾一下 dp[i - 1][j] 表示啥，是从 (0, 0) 的位置到 (i - 1, j) <span style="color:red;font-weight:bold">有几条路径</span>，dp[i][j - 1]同理
>
> #### 那么很自然，<span style="color:red;font-weight:bold">dp[i][j] = dp[i - 1][j] + dp[i][j - 1]</span> ，因为 dp[i][j] 只有这两个方向过来

#### （3）dp 数组的初始化

> #### 首先 dp[i][0] 一定都是 1，因为从 (0, 0) 的位置到 (i, 0) 的路径只有一条，那么 dp[0][j]也同理

```java
for (int i = 0; i < m; i++) {
    dp[i][0] = 1;
}
for (int j = 0; j < n; j++) {
    dp[0][j] = 1;
}
```

#### （4）确定遍历顺序

> #### 递推公式 dp[i][j] = dp[i - 1][j] + dp[i][j - 1]，dp[i][j]都是从其上方和左方推导而来，那么从左到右一层一层遍历就可以了
>
> #### 这样就可以保证推导 dp[i][j]的时候，dp[i - 1][j] 和 dp[i][j - 1]一定是有数值的。

#### （5）举例推导 dp 数组

<img src="https://file1.kamacoder.com/i/algo/20201209113631392.png"/>

### 题解

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        // 初始化左边列
        for (int i = 0; i < m; i++) {
            dp[i][0] = 1;
        }
        // 初始化上边行
        for (int i = 0; i < n; i++) {
            dp[0][i] = 1;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                // dp[i - 1][j]向下走，dp[i][j - 1]向右走
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }
}
```

## 63. 不同路径 II

题目链接：https://leetcode.cn/problems/unique-paths-ii/description

文章讲解：https://programmercarl.com/0063.%E4%B8%8D%E5%90%8C%E8%B7%AF%E5%BE%84II.html

视频讲解：https://www.bilibili.com/video/BV1Ld4y1k7c6

### 思路分析

> #### 本题和上一题的区别就是多了障碍物，每次只能向右或者向下走，在初始化时，如果遇到了障碍物，则障碍物后面的路径方法为 0，因为根本无法到达

#### （1）确定 dp 数组（dp table）以及下标的含义

> #### dp[i][j] ：表示从（0 ，0）出发，到(i, j) 有 dp[i][j] 条不同的路径。

#### （2）确定递推公式

> #### 递推公式和 62.不同路径一样，dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
>
> #### 但这里需要注意一点，因为有了障碍，(i, j) 如果就是障碍的话应该就保持初始状态（初始状态为 0）

```java
if (obstacleGrid[i][j] == 0) { // 当(i, j)没有障碍的时候，再推导dp[i][j]
    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
}
```

#### （3）dp 数组如何初始化

> #### 如果(i, 0) 这条边有了障碍之后，障碍之后（包括障碍）都是走不到的位置了，所以<span style="color:red;font-weight:bold">障碍之后</span>的 dp[i][0]应该还是<span style="color:red;font-weight:bold">初始值 0</span>

#### （4）确定遍历顺序

> #### 从递归公式 dp[i][j] = dp[i - 1][j] + dp[i][j - 1] 中可以看出，一定是从左到右一层一层遍历，这样保证推导 dp[i][j]的时候，dp[i - 1][j] 和 dp[i][j - 1]一定是有数值

#### （5）举例推导 dp 数组

> #### <span style="color:red;font-weight:bold">中心点 0 是障碍</span>

<img src="https://file1.kamacoder.com/i/algo/20210104114610256.png" style="width:400px;margin:0px auto"/>

### 题解

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        int[][] dp = new int[m][n];

        // 如果在起点或者终点出现了障碍，直接返回
        if (obstacleGrid[m - 1][n - 1] == 1 || obstacleGrid[0][0] == 1) {
            return 0;
        }

        // 初始化上面行
        for (int i = 0; i < n && obstacleGrid[0][i] == 0; i++) {
            dp[0][i] = 1;
        }
        // 初始化左边列
        for (int i = 0; i < m && obstacleGrid[i][0] == 0; i++) {
            dp[i][0] = 1;
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 0) {
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
                } else {
                    dp[i][j] = 0;
                }
            }
        }
        return dp[m - 1][n - 1];
    }
}
```

## 343. 整数拆分 （可跳过）

本题思路并不容易想，一刷建议可以跳过。如果学有余力，可以看视频理解一波。

题目链接：https://leetcode.cn/problems/integer-break

文章讲解：https://programmercarl.com/0343.%E6%95%B4%E6%95%B0%E6%8B%86%E5%88%86.html

视频讲解：https://www.bilibili.com/video/BV1Mg411q7YJ

## 96. 不同的二叉搜索树 （可跳过）

本题思路并不容易想，一刷建议可以跳过。 如果学有余力，可以看视频理解一波。

题目链接：https://leetcode.cn/problems/unique-binary-search-trees

文章讲解：https://programmercarl.com/0096.%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV1eK411o7QA
