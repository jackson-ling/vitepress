---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 15</h1>

---

## 654.最大二叉树

题目链接：https://leetcode.cn/problems/maximum-binary-tree/description

文章讲解：https://programmercarl.com/0654.%E6%9C%80%E5%A4%A7%E4%BA%8C%E5%8F%89%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV1MG411G7ox

### 思路分析

**构造二叉树**的题目，遍历顺序采用前序遍历，**优先处理根节点**，然后递归的处理左右子树

**题意分析**

- 找到**最大**的值，作为**树的根节点**
- 以最大值为枢纽，**左区间**为左子树部分，同样是找到最大值再次分割
- 以最大值为枢纽，**右区间**为右子树部分，同样是找打最大值再次分割

### 题解

```java
class Solution {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        // 区间：左闭右开
        return constructMaximumBinaryTree1(nums, 0, nums.length);
    }

    public TreeNode constructMaximumBinaryTree1(int[] nums, int leftIndex, int rightIndex) {
        // 没有元素了
        if (rightIndex - leftIndex < 1) {
            return null;
        }
        // 只有一个元素
        if (rightIndex - leftIndex == 1) {
            return new TreeNode(nums[leftIndex]);
        }
        // 最大值所在位置
        int maxIndex = leftIndex;
        // 最大值
        int maxVal = nums[maxIndex];
        // 循环遍历找到最大值，更新最大值和其下标索引
        for (int i = leftIndex + 1; i < rightIndex; i++) {
            if (nums[i] > maxVal){
                maxVal = nums[i];
                maxIndex = i;
            }
        }
        TreeNode root = new TreeNode(maxVal);
        // 根据maxIndex划分左右子树（区间：左闭右开）
        root.left = constructMaximumBinaryTree1(nums, leftIndex, maxIndex);
        root.right = constructMaximumBinaryTree1(nums, maxIndex + 1, rightIndex);
        return root;
    }
}
```

## ⭐ 二叉树第三周小结

https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20201010%E4%BA%8C%E5%8F%89%E6%A0%91%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html

## 617.合并二叉树

这次是一起操作两个二叉树了，可以看视频先理解一下。 优先掌握递归。

题目链接：https://leetcode.cn/problems/merge-two-binary-trees

文章讲解：https://programmercarl.com/0617.%E5%90%88%E5%B9%B6%E4%BA%8C%E5%8F%89%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV1m14y1Y7JK

### 思路分析

两个二叉树是**同步遍历**的

- 如果在同一个位置一棵树为空另一颗树不为空，则把该节点补充到空的位置
- 如果在同一个位置两棵树都不为空，则两个节点值相加

### 题解

```java
class Solution {
    // 递归
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if (root1 == null) return root2;
        if (root2 == null) return root1;

        root1.val += root2.val;
        root1.left = mergeTrees(root1.left,root2.left);
        root1.right = mergeTrees(root1.right,root2.right);
        return root1;
    }
}
```

## 700.二叉搜索树中的搜索

递归和迭代 都可以掌握以下，因为本题比较简单， 了解一下二叉搜索树的特性

题目链接：https://leetcode.cn/problems/search-in-a-binary-search-tree

文章讲解: https://programmercarl.com/0700.%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E4%B8%AD%E7%9A%84%E6%90%9C%E7%B4%A2.html

视频讲解：https://www.bilibili.com/video/BV1wG411g7sF

### 思路分析

本题是**二叉搜索树**，**比根节点值小的都在左子树，比根节点值大的都在右子树，子树也是符合这个条件**，有了这个特性，就可以提高搜索的效率，根据搜索值判断搜索方向

### 题解

```java
class Solution {
    // 递归，利用二叉搜索树特点，优化
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) {
            return root;
        }
        if (val < root.val) {
            return searchBST(root.left, val);
        } else {
            return searchBST(root.right, val);
        }
    }
}
```

## 98.验证二叉搜索树

遇到搜索树，一定想着中序遍历，这样才能利用上特性。

但本题是有陷阱的，可以自己先做一做，然后在看题解，看看自己是不是掉陷阱里了。这样理解的更深刻。

题目链接：https://leetcode.cn/problems/validate-binary-search-tree

文章讲解：https://programmercarl.com/0098.%E9%AA%8C%E8%AF%81%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV18P411n7Q4

### 思路分析

根据二叉搜索树的特性，中序遍历正好是有序的，然而有一个误区（忽略考虑了子树），**不是左孩子比根节点小右孩子比根节点大的就是二叉搜索树**，如下图

<image src="https://file1.kamacoder.com/i/algo/20230310000824.png" style="margin: 0px auto"/>

### 题解

```java
class Solution {
    // 用 max 指针来记录前驱节点
    TreeNode max;

    public boolean isValidBST(TreeNode root) {
        // 终止条件
        if (root == null) {
            return true;
        }
        // 左
        boolean left = isValidBST(root.left);

        // 根
        if (max != null && root.val <= max.val) {
            return false;
        }

        // 移动前驱指针
        max = root;

        // 右
        boolean right = isValidBST(root.right);

        // 左右子树都是二叉搜索树
        return left && right;
    }
}
```
