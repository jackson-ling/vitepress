---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 34</h1>

---

今天就是打家劫舍的一天，这个系列不算难，大家可以一口气拿下。

## 198.打家劫舍

题目链接：https://leetcode.cn/problems/house-robber

文章讲解：https://programmercarl.com/0198.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.html

视频讲解：https://www.bilibili.com/video/BV1Te411N7SX

### 思路分析

> #### 题目要求相邻的房子不能偷，偷 i 还是不偷 i，这会影响下一步偷谁，进而确定递推公式

### 一维 dp

```java
class Solution {
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        if (nums.length == 1) {
            return nums[0];
        }

        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        // 前两个已经初始化，从第三个数开始遍历
        for (int i = 2; i < nums.length; i++) {
            // 不偷 i：dp[i - 1]；偷 i ：dp[i - 2] + nums[i]
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        return dp[nums.length - 1];
    }
}
```

## 213.打家劫舍 II

题目链接：https://leetcode.cn/problems/house-robber-ii

文章讲解：https://programmercarl.com/0213.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8DII.html

视频讲解：https://www.bilibili.com/video/BV1oM411B7xq

### 思路分析

> #### 区别于打家劫舍 I，本题将线性数组转为<span style="color:red">环形</span>，即选了起始位置，就不能选择终止位置（相邻位置不可以偷），思路就是将环形向线性转化
>
> #### 情况一：考虑不包含首尾元素
>
> #### 情况二：考虑包含首元素，不包含尾元素
>
> #### 情况三：考虑包含尾元素，不包含首元素
>
> #### <span style="color:red">情况二和情况三</span>包含了情况一，情况二、三分别看作是线性数组，<span style="color:red">取二者的最大值</span>即为环形场景下的结果，这里的思路<span style="color:red">只是考虑元素，偷不偷由递推关系决定</span>

### 一维 dp

```java
class Solution {
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        if (nums.length == 1) {
            return nums[0];
        }
        // 情况二
        int result1 = robAction(nums, 0, nums.length - 2);
        // 情况三
        int result2 = robAction(nums, 1, nums.length - 1);
        // 情况二和情况三取最大值
        return Math.max(result1, result2);
    }

    int robAction(int[] nums, int start, int end) {
        if (start == end) {
            return nums[start];
        }
        int[] dp = new int[nums.length];
        dp[start] = nums[start];
        dp[start + 1] = Math.max(nums[start], nums[start + 1]);
        for (int i = start + 2; i <= end; i++) {
            // 不偷 i：dp[i - 1]；偷 i ：dp[i - 2] + nums[i]
            dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
        }
        return dp[end];
    }
}
```

## 337.打家劫舍 III

题目链接：https://leetcode.cn/problems/house-robber-iii

文章讲解：https://programmercarl.com/0337.%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8DIII.html

视频讲解：https://www.bilibili.com/video/BV1H24y1Q7sY

### 思路分析

> #### 区别于打家劫舍 I，本题将线性数组转为<span style="color:red">二叉树</span>，相邻的节点不可以偷，可以采用<span style="color:red">后序遍历，从叶子节点开始，逐层递推到根节点</span>
>
> #### 对于根节点，分偷与不偷两种情况进行递归遍历，每个节点记录两个状态，偷与不偷的最大值

### 一维 dp

```java
class Solution {
    public int rob(TreeNode root) {
        int[] res = robAction(root);
        return Math.max(res[0], res[1]);
    }

    int[] robAction(TreeNode root) {
        int[] res = new int[2];
        if (root == null) {
            return res;
        }

        // 后序遍历
        int[] left = robAction(root.left);
        int[] right = robAction(root.right);

        // 不偷根节点：res[0]
        res[0] = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        // 偷根节点：res[1]
        res[1] = root.val + left[0] + right[0];
        return res;
    }

}
```
