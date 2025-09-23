---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 16</h1>

---

## 530.二叉搜索树的最小绝对差

需要领悟一下二叉树遍历上双指针操作，优先掌握递归

题目链接：https://leetcode.cn/problems/minimum-absolute-difference-in-bst/description

文章讲解：https://programmercarl.com/0530.%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%9D%E5%AF%B9%E5%B7%AE.html

视频讲解：https://www.bilibili.com/video/BV1DD4y11779

### 思路分析

本题的核心是使用**双指针遍历**，实现对最小差值的更新，其次是**二叉搜索树**，通过**中序遍历**得到的结果是**有序序列**

### 题解

```java
class Solution {
    TreeNode pre; // 记录上一个遍历的结点（前驱指针）
    int result = Integer.MAX_VALUE;

    public int getMinimumDifference(TreeNode root) {
        if (root == null){
            return 0;
        }
        traversal(root);
        return result;
    }

    public void traversal(TreeNode root) {
        if (root == null){
            return;
        }
        // 左
        traversal(root.left);
        // 中
        if (pre != null) {
            result = Math.min(result, root.val - pre.val);
        }
        pre = root;
        // 右
        traversal(root.right);
    }
}
```

## 501.二叉搜索树中的众数

和 530 差不多双指针思路，不过这里涉及到一个很巧妙的代码技巧。

可以先自己做做看，然后看我的视频讲解。

题目链接：https://leetcode.cn/problems/find-mode-in-binary-search-tree

文章讲解：https://programmercarl.com/0501.%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E4%B8%AD%E7%9A%84%E4%BC%97%E6%95%B0.html

视频讲解：https://www.bilibili.com/video/BV1fD4y117gp

### 思路分析

本题还是双指针思路，**核心点在于动态的更新最大频率**

### 题解

```java
class Solution {
    ArrayList<Integer> resList;
    int maxCount;
    int count;
    TreeNode pre;

    public int[] findMode(TreeNode root) {
        resList = new ArrayList<>();
        maxCount = 0;
        count = 0;
        pre = null;
        findMode1(root);
        int[] res = new int[resList.size()];
        for (int i = 0; i < resList.size(); i++) {
            res[i] = resList.get(i);
        }
        return res;
    }

    public void findMode1(TreeNode root) {
        if (root == null) {
            return;
        }
        findMode1(root.left);

        int rootValue = root.val;
        // 计数
        if (pre == null || rootValue != pre.val) {
            count = 1;
        } else {
            count++;
        }
        // 更新结果以及maxCount
        if (count > maxCount) {
            resList.clear();
            resList.add(rootValue);
            maxCount = count;
        } else if (count == maxCount) {
            resList.add(rootValue);
        }
        pre = root;

        findMode1(root.right);
    }
}
```

## ❓236. 二叉树的最近公共祖先

本题其实是比较难的，可以先看视频讲解

题目链接：https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree

文章讲解：https://programmercarl.com/0236.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88.html

视频讲解：https://www.bilibili.com/video/BV1jd4y1B7E2

### 思路分析

#### 利用后序遍历实现向上返回的操作，即回溯的过程，本题的两种情况如下

<image src="https://file1.kamacoder.com/i/algo/20220922173502.png" style="width:600px;margin:0px auto"/>
<br/>
<image src="https://file1.kamacoder.com/i/algo/20220922173530.png" style="width:600px;margin:0px auto"/>

### 题解

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // 因为节点 p 或 q 可能是最低公共祖先的一部分。我们通过递归来逐步确认最低公共祖先
        if (root == null || root == p || root == q) { // 递归结束条件
            return root;
        }

        // 后序遍历
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if(left == null && right == null) { // 若未找到节点 p 或 q
            return null;
        }else if(left == null && right != null) { // 若找到一个节点
            return right;
        }else if(left != null && right == null) { // 若找到一个节点
            return left;
        }else { // 若找到两个节点
            return root;
        }
    }
}
```

## ⭐ 二叉树第四周小结

https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20201017%E4%BA%8C%E5%8F%89%E6%A0%91%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html
