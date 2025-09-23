---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 38</h1>

---

## 1143.最长公共子序列

体会一下本题和 718. 最长重复子数组的区别

题目链接：https://leetcode.cn/problems/longest-common-subsequence/

文章讲解：https://programmercarl.com/1143.%E6%9C%80%E9%95%BF%E5%85%AC%E5%85%B1%E5%AD%90%E5%BA%8F%E5%88%97.html

视频讲解：https://www.bilibili.com/video/BV1ye4y1L7CQ

### 思路分析

> #### 最长<span style="color:red">重复子数组</span>要求元素间是<span style="color:red">连续</span>的，然而最长<span style="color:red">公共子序列</span>元素间是<span style="color:red">不连续</span>的，所以在递推公式中需要考虑以下情况

#### （1）如果 text1[i - 1] 与 text2[j - 1]相同，那么找到了一个公共元素，所以 dp[i][j] = dp[i - 1][j - 1] + 1;

#### （2）如果 text1[i - 1] 与 text2[j - 1]不相同，那就看看 text1[0, i - 2]与 text2[0, j - 1]的最长公共子序列 和 text1[0, i - 1]与 text2[0, j - 2]的最长公共子序列，取最大的

> #### 即：dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

### 二维 dp

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
              // 延续最长重复子数组的思路，为了简化初始化的过程，空间初始化时多一个
        int[][] dp = new int[text1.length() + 1][text2.length() + 1];
        for (int i = 1; i <= text1.length(); i++) {
            // 取末尾字符，比较是否相同
            char char1 = text1.charAt(i - 1);
            for (int j = 1; j <= text2.length(); j++) {
                char char2 = text2.charAt(j - 1);
                if (char1 == char2) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[text1.length()][text2.length()];
    }
}
```

## 1035.不相交的线

其实本题和 1143.最长公共子序列是一模一样的，大家尝试自己做一做。

题目链接：https://leetcode.cn/problems/uncrossed-lines/

文章讲解：https://programmercarl.com/1035.%E4%B8%8D%E7%9B%B8%E4%BA%A4%E7%9A%84%E7%BA%BF.html

视频讲解：https://www.bilibili.com/video/BV1h84y1x7MP

### 思路分析

> #### 本题的本质就是求最长公共子序列

#### 如何分析线不能相交

> #### 根据题意，是要保证顺序的，也就是说只要公共子序列保证在数组中的相对顺序不变，线就不会相交

### 二维 dp

```java
class Solution {
    public int maxUncrossedLines(int[] nums1, int[] nums2) {
        // 本题代码核心逻辑和上题一致，本质就是求最长公共子序列
        int[][] dp = new int[nums1.length + 1][nums2.length + 1];
        for (int i = 1; i <= nums1.length; i++) {
            for (int j = 1; j <= nums2.length; j++) {
                if (nums1[i - 1] == nums2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[nums1.length][nums2.length];
    }
}
```

## 53. 最大子序和

这道题我们用贪心做过，这次 再用 dp 来做一遍

题目链接：https://leetcode.cn/problems/maximum-subarray/

文章讲解：https://programmercarl.com/0053.%E6%9C%80%E5%A4%A7%E5%AD%90%E5%BA%8F%E5%92%8C%EF%BC%88%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%EF%BC%89.html

视频讲解：https://www.bilibili.com/video/BV19V4y1F7b5

### 思路分析

> #### 本题就两种情况，要么延续之前的累加，要么以当前遍历元素为新的起点重新开始累加

### 一维 dp

```java
class Solution {
    public int maxSubArray(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }
        int res = nums[0];
        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        for (int i = 1; i < nums.length; i++) {
            // 要么延续之前的状态，要么以当前作为新起点重新累加
            dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
            res = Math.max(dp[i], res);
        }
        return res;
    }
}
```

## 392.判断子序列

这道题目算是<span style="color:red;font-weight:bold">编辑距离</span>问题 的入门题目（毕竟这里只是涉及到减法），慢慢的，后面就要来解决真正的 编辑距离问题了

题目链接：https://leetcode.cn/problems/is-subsequence/

文章讲解：https://programmercarl.com/0392.%E5%88%A4%E6%96%AD%E5%AD%90%E5%BA%8F%E5%88%97.html

视频讲解：https://www.bilibili.com/video/BV1tv4y1B7ym

### 思路分析

> #### 本题对于给定字符串无需做删除操作，只需要对匹配串做删除操作即可，即无需考虑 dp[i - 1][j]的情况，本质就是求最长公共子序列，如果长度和匹配串长度相等，说明是子序列

### 二维 dp

```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        int[][] dp = new int[s.length() + 1][t.length() + 1];
        // 延续求最长公共子序列的思路
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 1; j <= t.length(); j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // 给定字符串无需做删减操作，只需要对匹配串操作，无需考虑 dp[i - 1][j]
                    dp[i][j] = dp[i][j - 1];
                }
            }
        }
        // 最长公共子序列的长度和模式串的长度相同，说明是子序列
        if (dp[s.length()][t.length()] == s.length()) {
            return true;
        } else {
            return false;
        }
    }
}
```

### 双指针法（简单）

```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        int n = s.length(), m = t.length();
        int i = 0, j = 0;
        while (i < n && j < m) {
            if (s.charAt(i) == t.charAt(j)) {
                i++;
            }
            j++;
        }
        return i == n;
    }
}
```
