---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 37</h1>

---

## 300.最长递增子序列

今天开始正式子序列系列，本题是比较简单的，感受感受一下子序列题目的思路。

题目链接：https://leetcode.cn/problems/longest-increasing-subsequence

文章讲解：https://programmercarl.com/0300.%E6%9C%80%E9%95%BF%E4%B8%8A%E5%8D%87%E5%AD%90%E5%BA%8F%E5%88%97.html

视频讲解：https://www.bilibili.com/video/BV1ng411J7xP

### 思路分析

> #### 子序列问题是动态规划解决的经典问题，当前下标 i 的递增子序列长度，其实和 i 之前的下标 j 的子序列长度有关系
>
> #### 用 i 指定当前长度，用 j 遍历当前长度的每个数，不断更新 i 指定当前长度的最长子序列

#### （1）dp 数组的定义

> #### dp[i]表示 i 之前包括 i 的以 nums[i]结尾的最长递增子序列的长度

#### （2）递推公式

> #### dp[i] = max(dp[i], dp[j] + 1)
>
> #### dp[j] + 1 表示包含到了 nums[i]的长度，取最大的目的是不断更新，直到找到最长递增子序列

#### （3）初始化

> ##### 每一个 i，对应的 dp[i]（即最长递增子序列）起始大小至少都是 1，就是其本身

### 一维 dp

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        if (nums.length <= 1) {
            return nums.length;
        }
        int[] dp = new int[nums.length];
        // 递增子序列的长度至少为 1，即本身
        int res = 1;
        Arrays.fill(dp, 1);

        for (int i = 1; i < dp.length; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]){
                    // 不断更新 dp[i]，直到找到最大值
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            // 更新res为 dp[i] 的最大值
            res = Math.max(res, dp[i]);
        }
        return res;
    }
}
```

## 674. 最长连续递增序列

本题相对于昨天的动态规划：300.最长递增子序列 最大的区别在于“连续”。 先尝试自己做做，感受一下区别

题目链接：https://leetcode.cn/problems/longest-continuous-increasing-subsequence

文章讲解：https://programmercarl.com/0674.%E6%9C%80%E9%95%BF%E8%BF%9E%E7%BB%AD%E9%80%92%E5%A2%9E%E5%BA%8F%E5%88%97.html

视频讲解：https://www.bilibili.com/video/BV1bD4y1778v

### 思路分析

> #### 区别于上一题，本题要求<span style="color:red">连续</span>递增子序列，所以就只要比较 nums[i]与 nums[i - 1]，而不用去比较 nums[j]与 nums[i] （j 是在 0 到 i 之间遍历）

### 一维 dp

```java
class Solution {
    public int findLengthOfLCIS(int[] nums) {
        int[] dp = new int[nums.length];
        // 递增子序列的长度至少为 1，即本身
        int res = 1;
        Arrays.fill(dp, 1);;
        // 防止下标越界，从 1 开始遍历
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i - 1]){
                dp[i] = dp[i-1] + 1;
            }
            res = Math.max(res,dp[i]);
        }
        return res;
    }
}
```

## 718. 最长重复子数组

稍有难度，要使用二维 dp 数组了

题目链接：https://leetcode.cn/problems/maximum-length-of-repeated-subarray

文章讲解：https://programmercarl.com/0718.%E6%9C%80%E9%95%BF%E9%87%8D%E5%A4%8D%E5%AD%90%E6%95%B0%E7%BB%84.html

视频讲解：https://www.bilibili.com/video/BV178411H7hV

### 思路分析

#### （1）dp 数组的定义

> #### dp[i][j] ：以下标 <span style="color:red">i - 1</span> 为结尾的 A，和以下标 <span style="color:red">j - 1</span> 为结尾的 B，最长重复子数组长度为 dp[i][j]（特别注意： “以下标 i - 1 为结尾的 A” 标明一定是 以 A[i-1]为结尾的字符串 ）

#### ⚠️ 这里是在子序列问题中常见的处理技巧，<span style="color:red">i-1 和 j-1 的目的是为了不需要初始化第一行第一列</span>，因为没有意义（例如 dp[i][0]，当 i 为 0 时，i - 1 越界了没有意义），可以初始化为 0

#### （2）初始化

> #### 如果以 i，j 结尾，则需要对第一行第一列初始化，dp[0][j] 含义为 A 数组中的第一个元素和 B 数组中的所有元素比较一次，如果相同，初值赋为 1

```java
// 要对第一行，第一列经行初始化
for (int i = 0; i < nums1.size(); i++) if (nums1[i] == nums2[0]) dp[i][0] = 1;
for (int j = 0; j < nums2.size(); j++) if (nums1[0] == nums2[j]) dp[0][j] = 1;
```

### 二维 dp

```java
class Solution {
    public int findLength(int[] nums1, int[] nums2) {
        int result = 0;
        // dp[i][j] 代表的是以 nums1[i-1] 和 nums2[j-1] 为结尾的公共子数组的长度
        // 下标 i - 1 对应最后一个元素，则 i 需要为 num.length，初始大小需要加一
        int[][] dp = new int[nums1.length + 1][nums2.length + 1];
        // 第一行第一列没有意义
        for (int i = 1; i <= nums1.length; i++) {
            for (int j = 1; j <= nums2.length; j++) {
                if (nums1[i - 1] == nums2[j - 1]){
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    // 更新长度为最大值
                    result = Math.max(result,dp[i][j]);
                }
            }
        }
        return result;
    }
}
```
