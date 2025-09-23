---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 12</h1>

---

## 226.翻转二叉树

这道题目理解的不够深入，建议大家先看视频讲解，无论做过没做过，都会有很大收获。

题目链接：https://leetcode.cn/problems/invert-binary-tree

文章讲解：https://programmercarl.com/0226.%E7%BF%BB%E8%BD%AC%E4%BA%8C%E5%8F%89%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV1sP4y1f7q7

### 思路分析

本题是经典题目，**务必掌握**，**翻转的本质就是<span style = "color:red;font-weight:bold">交换每个节点的左右孩子</span>**，可以通过遍历的方式，遍历节点当作处理对象，交换其左右孩子

### 前序遍历

```java
class Solution1 {
    public TreeNode invertTree(TreeNode root) {
        if (root == null){
            return null;
        }

        // 前序遍历
        swapChildren(root); // 根
        invertTree(root.left); // 左
        invertTree(root.right); // 右

        return root;
    }

    // 交换节点左右孩子
    public void swapChildren(TreeNode root){
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
    }
}
```

### 层序遍历

```java
class Solution2 {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        // 层序遍历
        ArrayDeque<TreeNode> deque = new ArrayDeque<>();
        deque.offer(root);
        while (!deque.isEmpty()) {
            // 记录当前层的节点个数，明确出队元素
            int size = deque.size();
            // 出队
            while (size-- > 0) {
                TreeNode node = deque.poll();
                swapChildren(node);
                if (node.left != null) {
                    deque.offer(node.left);
                }
                if (node.right != null) {
                    deque.offer(node.right);
                }
            }
        }
        return root;
    }

    // 交换节点左右孩子
    public void swapChildren(TreeNode root) {
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
    }
}
```

## ⭐ 二叉树第一周小结

https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20200927%E4%BA%8C%E5%8F%89%E6%A0%91%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html#%E5%91%A8%E4%B8%80

## 101. 对称二叉树

先看视频讲解，会更容易一些。

题目链接：https://leetcode.cn/problems/symmetric-tree/

文章讲解：https://programmercarl.com/0101.%E5%AF%B9%E7%A7%B0%E4%BA%8C%E5%8F%89%E6%A0%91.html

视频讲解：https://www.bilibili.com/video/BV1ue4y1Y7Mf

### 思路分析

翻转的本质就是<span style = "color:red;font-weight:bold">比较根节点的左右子树能否相互翻转</span>，根据对称的特点，分别比较左右子树的各个节点，分类讨论即可

- 外侧节点需要相同：左子树的左孩子 = 右子树的右孩子
- 内侧节点需要相同：左子树的右孩子 = 右子树的左孩子

<image src="https://file1.kamacoder.com/i/algo/20210203144624414.png"/>

### 题解

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return compare(root.left, root.right);
    }

    private boolean compare(TreeNode left, TreeNode right) {

        if (left == null && right != null) {
            return false;
        }
        if (left != null && right == null) {
            return false;
        }

        if (left == null && right == null) {
            return true;
        }
        if (left.val != right.val) {
            return false;
        }
        // 比较外侧
        boolean compareOutside = compare(left.left, right.right);
        // 比较内侧
        boolean compareInside = compare(left.right, right.left);
        return compareOutside && compareInside;
    }
}

```

### 补充题目

- 100 相同的树：https://leetcode.cn/problems/same-tree
- 572 另一颗树的子树：https://leetcode.cn/problems/subtree-of-another-tree

## 104.二叉树的最大深度

什么是深度，什么是高度，如何求深度，如何求高度，这里有关系到二叉树的遍历方式。

大家 要先看视频讲解，就知道以上我说的内容了，很多录友刷过这道题，但理解的还不够。

题目链接：https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/

文章讲解： https://programmercarl.com/0104.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%9C%80%E5%A4%A7%E6%B7%B1%E5%BA%A6.html

视频讲解：https://www.bilibili.com/video/BV1Gd4y1V75u

### 思路分析

<span style = "color:red;font-weight:bold">前序（根左右）</span>求的就是<span style = "color:red;font-weight:bold">深度</span>

- 二叉树节点的<span style = "color:red;font-weight:bold">深度</span>：指从<span style = "color:red;font-weight:bold">根节点到该节点</span>的<span style = "color:red;font-weight:bold">最长</span>简单路径边的条数或者节点数（取决于深度从 0 开始还是从 1 开始）

<span style = "color:red;font-weight:bold">后序（左右根）</span>求的是<span style = "color:red;font-weight:bold">高度</span>

- 二叉树节点的<span style = "color:red;font-weight:bold">高度</span>：指从<span style = "color:red;font-weight:bold">该节点到叶子节点</span>的<span style = "color:red;font-weight:bold">最长</span>简单路径边的条数或者节点数（取决于高度从 0 开始还是从 1 开始）

> #### 关键点：<span style = "color:red;font-weight:bold">根节点的高度就是二叉树的最大深度</span>

#### 理解

- 深度：通过前序遍历，优先处理根节点，从上往下走，逐层计算高度
- 高度：通过后序遍历，最后处理根节点，实现把高度返回给上一层

### 后序遍历

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return Math.max(leftDepth, rightDepth) + 1; // 取最大高度
    }
}
```

### 层序遍历

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if(root == null) {
            return 0;
        }
        Deque<TreeNode> deque = new LinkedList<>();
        deque.offer(root);
        int depth = 0;
        while (!deque.isEmpty()) {
            int size = deque.size();
            depth++; // 计算深度
            while(size-- > 0) {
                TreeNode node = deque.poll();
                if (node.left != null) {
                    deque.offer(node.left);
                }
                if (node.right != null) {
                    deque.offer(node.right);
                }
            }
        }
        return depth;
    }
}
```

## 111.二叉树的最小深度

先看视频讲解，和最大深度 看似差不多，其实 差距还挺大，有坑。

题目链接：https://leetcode.cn/problems/minimum-depth-of-binary-tree

文章讲解：https://programmercarl.com/0111.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%9C%80%E5%B0%8F%E6%B7%B1%E5%BA%A6.html

视频讲解：https://www.bilibili.com/video/BV1QD4y1B7e2

### 思路分析

#### 最小深度：是从根节点到最近<span style = "color:red;font-weight:bold">叶子节点（不为空）</span>的最短路径上的节点数量

#### 本题依然可以采用上题的思路，采用后序遍历，但是<span style = "color:red;font-weight:bold">需要判断空节点</span>

<image src="https://file1.kamacoder.com/i/algo/111.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%9C%80%E5%B0%8F%E6%B7%B1%E5%BA%A6.png"/>

### 后序遍历

```java
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = minDepth(root.left);
        int rightDepth = minDepth(root.right);
        if (root.left == null) {
            return rightDepth + 1;
        }
        if (root.right == null) {
            return leftDepth + 1;
        }
        // 左右结点都不为null
        return Math.min(leftDepth, rightDepth) + 1;
    }
}
```

### 层序遍历

```java
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Deque<TreeNode> deque = new LinkedList<>();
        deque.offer(root);
        int depth = 0;
        while (!deque.isEmpty()) {
            int size = deque.size();
            depth++;
            while(size-- > 0) {
                TreeNode poll = deque.poll();
                if (poll.left == null && poll.right == null) {
                    // 是叶子结点，直接返回depth，因为从上往下遍历，所以该值就是最小值
                    return depth;
                }
                if (poll.left != null) {
                    deque.offer(poll.left);
                }
                if (poll.right != null) {
                    deque.offer(poll.right);
                }
            }
        }
        return depth;
    }
}
```
