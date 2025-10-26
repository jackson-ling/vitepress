---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 39</h1>

---

## 115.不同的子序列

但相对于刚讲过 392.判断子序列，本题 就有难度了 ，感受一下本题和 392.判断子序列 的区别

题目链接：https://leetcode.cn/problems/distinct-subsequences

文章讲解：https://programmercarl.com/0115.%E4%B8%8D%E5%90%8C%E7%9A%84%E5%AD%90%E5%BA%8F%E5%88%97.html

视频链接：https://www.bilibili.com/video/BV1fG4y1m75Q

### 思路分析

#### dp[i][j]：以 i-1 为结尾的 s 子序列中出现以 j-1 为结尾的 t 的个数为 dp[i][j]

#### s[i - 1] 与 t[j - 1]相等；s[i - 1] 与 t[j - 1] 不相等

####

#### 当 s[i - 1] 与 t[j - 1]相等时，dp[i][j]可以有两部分组成

> #### 一部分是用 s[i - 1]来匹配，那么个数为 dp[i - 1][j - 1]。即不需要考虑当前 s 子串和 t 子串的最后一位字母，所以只需要 dp[i-1][j-1]

> #### 一部分是不用 s[i - 1]来匹配，个数为 dp[i - 1][j]

### 二维 dp

```java
class Solution {
    public int numDistinct(String s, String t) {
        // dp[i][j]：以 i-1 为结尾的 s 子序列中出现以 j-1 为结尾的 t 的个数为 dp[i][j]
        // 大小加一是为了能取到 i，j
        int dp[][] = new int[s.length() + 1][t.length() + 1];

        for (int i = 0; i < s.length() + 1; i++) {
            // dp[i][0] 表示：以i-1为结尾的s可以随便删除元素，出现空字符串的个数
            dp[i][0] = 1;
        }

        for (int i = 1; i < t.length() + 1; i++) {
            dp[0][i] = 0;
        }

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 1; j <= t.length(); j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }
        return dp[s.length()][t.length()];
    }
}
```

## 583. 两个字符串的删除操作

本题和动态规划：115.不同的子序列 相比，其实就是两个字符串都可以删除了，情况虽说复杂一些，但整体思路是不变的

题目链接：https://leetcode.cn/problems/delete-operation-for-two-strings

文章讲解：https://programmercarl.com/0583.%E4%B8%A4%E4%B8%AA%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%88%A0%E9%99%A4%E6%93%8D%E4%BD%9C.html

视频链接：https://www.bilibili.com/video/BV1we4y157wB

### 思路分析

#### 当 word1[i - 1] 与 word2[j - 1]相同的时候，dp[i][j] = dp[i - 1][j - 1];

#### 当 word1[i - 1] 与 word2[j - 1]不相同的时候，有三种情况

> #### 情况一：删 word1[i - 1]，最少操作次数为 dp[i - 1][j] + 1
>
> #### 情况二：删 word2[j - 1]，最少操作次数为 dp[i][j - 1] + 1
>
> #### 情况三：同时删 word1[i - 1]和 word2[j - 1]，操作的最少次数为 dp[i - 1][j - 1] + 2

#### 那最后当然是取最小值，所以当 word1[i - 1] 与 word2[j - 1]不相同的时候，递推公式：dp[i][j] = min({dp[i - 1][j - 1] + 2, dp[i - 1][j] + 1, dp[i][j - 1] + 1});

### 二维 dp

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int dp[][] = new int[word1.length() + 1][word2.length() + 1];

        for (int i = 0; i < word1.length() + 1; i++) {
            dp[i][0] = i;
        }

        for (int i = 0; i < word2.length() + 1; i++) {
            dp[0][i] = i;
        }

        for (int i = 1; i <= word1.length(); i++) {
            for (int j = 1; j <= word2.length(); j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j - 1] + 2,
                            Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1));
                }
            }
        }
        return dp[word1.length()][word2.length()];
    }
}
```

## 72. 编辑距离

最终我们迎来了编辑距离这道题目，之前安排题目都是为了 编辑距离做铺垫

题目链接：https://leetcode.cn/problems/edit-distance

文章讲解：https://programmercarl.com/0072.%E7%BC%96%E8%BE%91%E8%B7%9D%E7%A6%BB.html

视频链接：https://www.bilibili.com/video/BV1qv4y1q78f

### 思路分析

#### 核心理解：删除和插入本质都可以达到相同的效果

> #### 举例：对 A 串删除一个元素可以和 B 串相同，与为 B 串插入一个元素可以和 A 串相同的效果是相同的，即<span style="color: red;">删除、插入操作可以合并为删除操作</span>

#### 还有一种情况是替换操作，在延续 word1[i - 1] == word2[j - 1] 的基础上进行一次替换操作，即 dp[i][j] = dp[i - 1][j - 1] + 1

### 二维 dp

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int dp[][] = new int[word1.length() + 1][word2.length() + 1];

        for (int i = 0; i < word1.length() + 1; i++) {
            dp[i][0] = i;
        }

        for (int i = 0; i < word2.length() + 1; i++) {
            dp[0][i] = i;
        }

        for (int i = 1; i <= word1.length(); i++) {
            for (int j = 1; j <= word2.length(); j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1), dp[i - 1][j] + 1);
                }
            }
        }
        return dp[word1.length()][word2.length()];
    }
}
```

## 编辑距离总结篇

文章讲解：https://programmercarl.com/%E4%B8%BA%E4%BA%86%E7%BB%9D%E6%9D%80%E7%BC%96%E8%BE%91%E8%B7%9D%E7%A6%BB%EF%BC%8C%E5%8D%A1%E5%B0%94%E5%81%9A%E4%BA%86%E4%B8%89%E6%AD%A5%E9%93%BA%E5%9E%AB.html
