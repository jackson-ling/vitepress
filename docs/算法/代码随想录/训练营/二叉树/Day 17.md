---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 17</h1>

---

## ❓235. 二叉搜索树的最近公共祖先

相对于 二叉树的最近公共祖先 本题就简单一些了，因为 可以利用二叉搜索树的特性。

题目链接：https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/description/

文章讲解：https://programmercarl.com/0235.%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E7%9A%84%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88.html

视频讲解：https://www.bilibili.com/video/BV1Zt4y1F7ww

### 思路分析

利用二叉搜索树的特性，左子树的值都是比根节点小的，右子树都是比根节点大的，利用这个特性来搜索 p、q 的值

此时还需要考虑是否是**最近公共祖先**，如下图

<image src="https://file1.kamacoder.com/i/algo/20220926164214.png" style="width:500px;margin:0px auto"/>

如果向左遍历错失 q，向右遍历错失了 p，整理后可以得到以下思路

- 首先向左右搜索遍历，依据二叉搜索树节点值的大小关系，找到符合条件的节点返回
- 然后剩余的情况就是中间节点的情况，直接返回即可

<image src="https://file1.kamacoder.com/i/algo/20220926165141.png" style="width:500px;margin:0px auto"/>

### 题解

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // p，q 在左子树
        if (root.val > p.val && root.val > q.val) {
            return lowestCommonAncestor(root.left, p, q);
        }
        // p，q 在右子树
        if (root.val < p.val && root.val < q.val) {
            return lowestCommonAncestor(root.right, p, q);
        }
        return root;
    }
}
```

## 701.二叉搜索树中的插入操作

题目链接：https://leetcode.cn/problems/insert-into-a-binary-search-tree/

文章讲解：https://programmercarl.com/0701.%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E4%B8%AD%E7%9A%84%E6%8F%92%E5%85%A5%E6%93%8D%E4%BD%9C.html

视频讲解：https://www.bilibili.com/video/BV1Et4y1c78Y

### 思路分析

审题可以发现，虽然插入结果可以有多种，但是目的是只要成功插入节点即可，**即在叶子节点中插入节点**，利用二叉搜索树的节点值大小关系递归查找叶子节点，插入节点即可

### 题解

```java
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        // 在叶子节点插入节点
        if (root == null) {
            TreeNode node = new TreeNode(val);
            return node; // 返回给父节点
        }

        // 利用二叉搜索树的特性
        if (root.val < val){
            root.right = insertIntoBST(root.right, val); // 递归创建右子树
        }else if (root.val > val){
            root.left = insertIntoBST(root.left, val); // 递归创建左子树
        }
        return root;
    }
}
```

## ⭐450.删除二叉搜索树中的节点

相对于 插入操作，本题就有难度了，涉及到改树的结构

题目链接：https://leetcode.cn/problems/delete-node-in-a-bst/

文章讲解：https://programmercarl.com/0450.%E5%88%A0%E9%99%A4%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E4%B8%AD%E7%9A%84%E8%8A%82%E7%82%B9.html

视频讲解：https://www.bilibili.com/video/BV1tP41177us

### 思路分析

- 第一种情况：没找到删除的节点，遍历到空节点直接返回了
- 找到删除的节点
  - 第二种情况：左右孩子都为空（叶子节点），直接删除节点， 返回 NULL 为根节点
  - 第三种情况：删除节点的左孩子为空，右孩子不为空，删除节点，右孩子补位，返回右孩子为根节点
  - 第四种情况：删除节点的右孩子为空，左孩子不为空，删除节点，左孩子补位，返回左孩子为根节点
  - 第五种情况：左右孩子节点都不为空，则将删除节点的左子树头结点（左孩子）放到删除节点的右子树的最左面节点的左孩子上，返回删除节点右孩子为新的根节点。

<image src="./二叉搜索树删除.png" style="width:500px;margin:0px auto"/>

<image src="https://file1.kamacoder.com/i/algo/450.%E5%88%A0%E9%99%A4%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E4%B8%AD%E7%9A%84%E8%8A%82%E7%82%B9.gif" style="margin:0px auto"/>

### 题解

```java
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        // 没有找到删除节点
        if (root == null) {
            return root;
        }
        // 找到了删除节点，分以下五种情况
        if (root.val == key) {
            // 叶子节点
            if (root.left == null && root.right == null) {
                return null;
            }
            // 左子树为空
            else if (root.left == null) {
                return root.right;
            }
            // 右子树为空
            else if (root.right == null) {
                return root.left;
            }
            // 左右子树不为空
            TreeNode cur = root.right; // 指向被删节点右子树的根节点
            while (cur.left != null) {
                cur = cur.left; // 找到被删节点右子树的根节点的左孩子
            }
            cur.left = root.left; // 重新链接被删节点的左子树
            root = root.right; // 改变指向，删除节点
            return root;
        }
        // 在递归中调用，实现删除的逻辑
        if (root.val > key) {
            root.left = deleteNode(root.left, key);
        }
        if (root.val < key) {
            root.right = deleteNode(root.right, key);
        }

        return root;
    }
}
```
