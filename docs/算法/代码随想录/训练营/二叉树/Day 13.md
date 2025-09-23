---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 13</h1>

---

<h3>迭代法，可以直接朓过，二刷有精力的时候 再去掌握迭代法</h3>

## 222.完全二叉树的节点个数

需要了解，普通二叉树怎么求，完全二叉树又怎么求

题目链接：https://leetcode.cn/problems/count-complete-tree-nodes

文章讲解：https://programmercarl.com/0222.%E5%AE%8C%E5%85%A8%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E8%8A%82%E7%82%B9%E4%B8%AA%E6%95%B0.html

视频讲解：https://www.bilibili.com/video/BV1eW4y1B7pD

### 思路分析

采用**完全二叉树**的方式来计算，可以提高效率，因为如果子树是满二叉树，则<span style="color:red;font-weight:bold">节点个数 = 2<sup>(深度)</sup> - 1</span>

#### 1. 完全二叉树的定义：强调顺序，具体如下图

<image src="https://file1.kamacoder.com/i/algo/20200920221638903-20230310123444151.png"/>

#### 2. 满二叉树

<br/>

<image src="https://file1.kamacoder.com/i/algo/20201124092543662.png" style="width: 600px; margin: 0 auto;"/>

#### 3. 判定是满二叉树的思路：<span style="color:red;font-weight:bold">只在最外层遍历左右子树</span>，计算深度，如果<span style="color:red;font-weight:bold">左子树深度 = 右子树深度</span>，则说明是满二叉树

> #### 注意点：考虑到左右子树子树可能不是满二叉树，还是采用<span style="color:red;font-weight:bold">后序遍历</span>的思路，依次遍历
>
> - <h4>如果左右子树<span style="color:red;font-weight:bold">是</span>满二叉树：直接采用公式计算，提高效率</h4>
> - <h4>如果左右子树<span style="color:red;font-weight:bold">不是</span>满二叉树：则利用后序遍历分别递归左孩子，和右孩子，递归到某一深度一定会有左孩子或者右孩子为满二叉树</h4>

<image src="https://file1.kamacoder.com/i/algo/20220829163709.png" style="width: 600px; margin: 0 auto;"/>

### 普通二叉树

#### 采用后序遍历

```java
class Solution {
    // 当作普通二叉树，采用后序遍历，下面简化了代码
    public int countNodes(TreeNode root) {
        if(root == null) {
            return 0;
        }
        return countNodes(root.left) + countNodes(root.right) + 1;
    }
}
```

### 完全二叉树

```java
class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }

        // 这里初始为0是有目的的，为了下面求指数方便
        int leftDepth = 0;
        int rightDepth = 0;

        // 初始化两个指针，用于计算深度
        TreeNode left = root.left;
        TreeNode right = root.right;

        // 计算左子树深度
        while (left != null) {
            left = left.left;
            leftDepth++;
        }

        // 计算右子树深度
        while (right != null) {
            right = right.right;
            rightDepth++;
        }

        // 左右子树深度相同，说明子树是满二叉树，利用公式计算节点数
        if (leftDepth == rightDepth) {
            // 注意(2<<1) 相当于2^2，所以leftDepth初始为0
            return (2 << leftDepth) - 1;
        }

        // 左子树节点个数 + 右子树节点个数 + 根节点
        return countNodes(root.left) + countNodes(root.right) + 1;
    }
}
```

## 110.平衡二叉树

再一次涉及到，什么是高度，什么是深度，可以巩固一下。

题目链接：https://leetcode.cn/problems/balanced-binary-tree/

文章讲解：https://programmercarl.com/0110.%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV1Ug411S7my

### 思路分析

平衡二叉树的定义就是<span style = "color:red;font-weight:bold">左右子树的高度差小于等于 1</span>，仍然是求高度，采用后序遍历

### 题解

```java
class Solution {
    public boolean isBalanced(TreeNode root) {
        return getHeight(root) != -1;
    }

    public int getHeight(TreeNode root){
        if (root == null){
            return 0;
        }
        // 计算左子树高度
        int leftHeight = getHeight(root.left);
        if(leftHeight == -1){
            return -1;
        }
        // 计算右子树高度
        int rightHeight = getHeight(root.right);
        if (rightHeight == -1){
            return -1;
        }
        // 计算高度差
        if (Math.abs(leftHeight - rightHeight) > 1){
            return -1;
        }else{
            return Math.max(leftHeight,rightHeight) + 1;
        }
    }
}
```

## 257. 二叉树的所有路径

这是第一次接触到回溯的过程， 在视频里重点讲解了本题为什么要有回溯，以及回溯的过程。

如果对回溯似懂非懂，没关系， 可以先有个印象。

题目链接：https://leetcode.cn/problems/binary-tree-paths

文章讲解：https://programmercarl.com/0257.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%89%80%E6%9C%89%E8%B7%AF%E5%BE%84.html

视频讲解：https://www.bilibili.com/video/BV1ZG411G7Dh

### 思路分析

本题显然是从上往下遍历，即采用<span style = "color:red;font-weight:bold">前序遍历</span>（每遍历一个元素就添加到结果集），注意点：递归过程中需要<span style = "color:red;font-weight:bold">体现回溯</span>（删除结果集最后的元素，类似栈的结构）的过程

### 回溯图解

<image src="https://file1.kamacoder.com/i/algo/20210204151702443.png" style="width: 600px; margin: 0 auto;"/>

### 题解

```java
public class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> res = new ArrayList<>();
        if (root == null) {
            return null;
        }
        List<Integer> paths = new ArrayList<>();
        traversal(root, paths, res);
        return res;
    }

    public void traversal(TreeNode root, List<Integer> paths, List<String> res) {
        // 采用前序遍历

        // 根节点
        paths.add(root.val);

        // 处理叶子节点
        if (root.left == null && root.right == null) {
            StringBuilder sb = new StringBuilder();
            // 最后一个节点不处理
            for (int i = 0; i < paths.size() - 1; i++) {
                // 拿到遍历结果后做字符串的拼接
                sb.append(paths.get(i)).append("->");
            }
            // 添加最后一个节点
            sb.append(paths.get(paths.size() - 1));
            // 转为字符串添加到结果集中
            res.add(sb.toString());
            return;
        }

        // 递归处理左子树
        if (root.left != null) {
            traversal(root.left, paths, res);
            // 回溯体现
            paths.remove(paths.size() - 1);
        }

        // 递归处理右子树
        if (root.right != null) {
            traversal(root.right, paths, res);
            // 回溯体现
            paths.remove(paths.size() - 1);
        }
    }
}
```

## ⭐ 二叉树第二周小结

https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20201003%E4%BA%8C%E5%8F%89%E6%A0%91%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html

## 404.左叶子之和

其实本题有点文字游戏，搞清楚什么是左叶子，剩下的就是二叉树的基本操作。

题目链接：https://leetcode.cn/problems/sum-of-left-leaves

文章讲解：https://programmercarl.com/0404.%E5%B7%A6%E5%8F%B6%E5%AD%90%E4%B9%8B%E5%92%8C.html

视频讲解：https://www.bilibili.com/video/BV1GY4y1K7z8

### 思路分析

首先需要认真审题，**明确题目左叶子的含义**

左叶子

- 首先是**左孩子**
- 其次是**叶子节点**

判断左孩子的思路：**利用该节点的父节点判断**

本题采用**后序遍历**：**最后处理根节点**，即在判断是左叶子的情况下把结果返回给父节点，一层层返回，最后根节点的的值就代表整颗树的左叶子之和

### 题解

```java
class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        if (root == null) {
            return 0;
        }
        // 计算左子树中的左孩子值（后序遍历：左）
        int leftValue = sumOfLeftLeaves(root.left);
        // 计算右子树中的左孩子值（后序遍历：右）
        int rightValue = sumOfLeftLeaves(root.right);

        int midValue = 0;
        // 处理做左叶子节点：（1）是左孩子（2）是叶子节点（后序遍历：根）
        if (root.left != null && root.left.left == null && root.left.right == null) {
            midValue = root.left.val;
        }
        // 计算和
        int sum = midValue + leftValue + rightValue;
        return sum;
    }
}
```
