---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 11</h1>

---

## 1. 二叉树理论基础

需要了解 二叉树的种类，存储方式，遍历方式 以及二叉树的定义

文章链接：https://programmercarl.com/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html

视频讲解：https://www.bilibili.com/video/BV1Hy4y1t7ij

## 2. ⭐ 递归遍历

题目连接

- 前序遍历：https://leetcode.cn/problems/binary-tree-preorder-traversal
- 中序遍历：https://leetcode.cn/problems/binary-tree-inorder-traversal/
- 后序遍历：https://leetcode.cn/problems/binary-tree-postorder-traversal

文章讲解：https://programmercarl.com/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E9%80%92%E5%BD%92%E9%81%8D%E5%8E%86.html

视频讲解：https://www.bilibili.com/video/BV1Wh411S7xt

### 二叉树定义

```java
class TreeNode {
    int val; // 根节点值
    TreeNode left; // 左孩子
    TreeNode right; // 右孩子

    TreeNode() {
    }

    TreeNode(int val) {
        this.val = val;
    }

    TreeNode(int val,TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

### 前序遍历

```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<Integer>();
        preorder(root, result);
        return result;
    }

    // 前序遍历
    public void preorder(TreeNode root, List<Integer> result){
        if(root == null){
            return;
        }
        // 根
        result.add(root.val);
        // 左
        preorder(root.left,result);
        // 右
        preorder(root.right,result);
    }
}
```

### 中序遍历

```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<Integer>();
        preorder(root, result);
        return result;
    }
    // 中序遍历
    public void inorder(TreeNode root, List<Integer> result){
        if(root == null){
            return;
        }
        // 左
        inorder(root.left,result);
        // 根
        result.add(root.val);
        // 右
        inorder(root.right,result);
    }
}
```

### 后序遍历

```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<Integer>();
        postorder(root, result);
        return result;
    }

    // 后序遍历
    public void postorder(TreeNode root, List<Integer> result){
        if(root == null){
            return;
        }
        // 左
        postorder(root.left,result);
        // 右
        postorder(root.right,result);
        // 根
        result.add(root.val);
    }
}
```

## 3. 迭代遍历（非递归遍历）

基础不好的话，迭代法可以放过

题目链接

- 前序遍历：https://leetcode.cn/problems/binary-tree-preorder-traversal
- 中序遍历：https://leetcode.cn/problems/binary-tree-inorder-traversal/
- 后序遍历：https://leetcode.cn/problems/binary-tree-postorder-traversal

文章讲解：https://programmercarl.com/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E8%BF%AD%E4%BB%A3%E9%81%8D%E5%8E%86.html

视频讲解

- 非递归遍历（前序、后序）：https://www.bilibili.com/video/BV15f4y1W7i2
- 非递归遍历（中序）：https://www.bilibili.com/video/BV1Zf4y1a77g

### 二叉树定义

```java
class TreeNode {
    int val; // 根节点值
    TreeNode left; // 左孩子
    TreeNode right; // 右孩子

    TreeNode() {
    }

    TreeNode(int val) {
        this.val = val;
    }

    TreeNode(int val,TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

### 前序遍历

#### 思路分析

非递归遍历就是使**用栈模拟递归**的过程，首先明确栈的特点：**后进先出**，也就是有**逆序的特点**

**举例**

> 假设需要得到前序遍历顺序：1（根）2（左）3（右）
>
> - 首先让**1（根）** 入栈，之后**出栈**，记录遍历顺序
> - 然后让**3（右）** 入栈、**2（左）**入栈，此时栈顶元素就是**2（左）**，依次出栈，就可以得到 **1（根）2（左）3（右）**

<h4>结论：使用迭代法模拟<span style="color:red;font-weight:bold">前序</span>的递归遍历时，<span style="color:red;font-weight:bold">左右孩子</span>在栈操作中的遍历和处理<span style="color:red;font-weight:bold">顺序</span>应该<span style="color:red;font-weight:bold">颠倒</span></h4>

**栈处理顺序如下**

- 首先将根节点入栈
- 先让<span style="color:red;font-weight:bold">右孩子</span>入栈
- 后让<span style="color:red;font-weight:bold">左孩子</span>入栈

解释：因为栈的特点是后进先出，入栈元素顺序和出栈元素顺序相反

**特点**

- 入栈：体现元素的遍历
- 出栈：体现元素的处理
- 对象：都是栈

```java
class Solution{
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root); // 根节点入栈
        while (!stack.isEmpty()) {
            // 处理根节点，同时把遍历顺序记录在数组中
            TreeNode node = stack.pop();
            result.add(node.val);
            // 先处理右孩子
            if (node.right != null) {
                stack.push(node.right);
            }
            // 后处理左孩子
            if (node.left != null) {
                stack.push(node.left);
            }
        }
        return result;
    }
}
```

### 后序遍历

后序遍历和前序遍历在顺序上有一定关系

- 前序遍历：根左右
- 后序遍历：左右根

我们只需要调整前序遍历中非迭代法代码中**处理左右孩子的顺序**，利用栈的特点进而改变元素遍历的顺序，变化过程如下

<image src="https://file1.kamacoder.com/i/algo/20200808200338924.png"/>

- 第一步：调整前序遍历中非迭代法代码中处理左右孩子的顺序，即**先处理左孩子，后处理右孩子**，这样得到元素的**遍历顺序**就是<span style="color:red;font-weight:bold">根右左</span>
- 第二步：此时遍历顺序就是**根右左**存储在数组中，我们只需要让**数组逆序输出**，得到元素的遍历顺序就可以由**根右左**--><span style="color:red;font-weight:bold">左右根</span>

**特点**

- 入栈：体现元素的遍历
- 出栈：体现元素的处理
- 对象：都是栈

```java
class Solution{
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root); // 根节点入栈
        while (!stack.isEmpty()) {
            // 处理根节点，同时把遍历顺序记录在数组中
            TreeNode node = stack.pop();
            result.add(node.val);
            // 先处理左孩子
            if (node.left != null) {
                stack.push(node.left);
            }
            // 后处理右孩子
            if (node.right != null) {
                stack.push(node.right);
            }
        }
        // 翻转数组
        Collections.reverse(result);
        return result;
    }
}
```

### 中序遍历

**中序遍历的代码和前序、后续遍历的迭代法不同，因为<span style="color:red;font-weight:bold">遍历顺序和操作顺序不同</span>，然而<span style="color:red;font-weight:bold">访问起点</span>总是从<span style="color:red;font-weight:bold">根节点</span>开始，这里需要做相应的处理**

> **前序遍历**
>
> - 遍历顺序：根左右
> - 首先访问节点：根节点
> - 分析：遍历顺序和处理顺序**一致**，<span style="color:red;font-weight:bold">不冲突</span>
>
> **后续遍历**：只需要在**前序遍历的基础上**在代码中修改栈对左右孩子的处理顺序，之后翻转遍历结果的数组就可以得到，这里不冲突
>
> **中序遍历**
>
> - 遍历顺序：左根右
> - 首先访问节点：根节点
> - 分析：遍历顺序和处理顺序**不一致**，<span style="color:red;font-weight:bold">冲突</span>

#### 中序遍历冲突的原因分析

> 中序遍历是左中右，先访问的是二叉树顶部的节点，然后一层一层向下访问，**直到到达树左面的最底部，再开始处理节点**（也就是在把节点的数值放进 result 数组中），这就造成了处理顺序和访问顺序是不一致的。

#### 思路分析

- 指针遍历节点
- 栈中记录遍历过的节点
- 栈中弹出的元素即为处理元素

**特点**

- 指针：体现元素的遍历
- 出栈：体现元素的处理
- 对象：一个对象是指针，一个对象是栈，二者不相同

```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null){
            return result;
        }
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()){
           if (cur != null){
               stack.push(cur);
               cur = cur.left; // 处理左孩子
           }else{
               cur = stack.pop(); // 指针记录弹出的栈顶元素，用于取值
               result.add(cur.val); // 处理根节点
               cur = cur.right; // 处理右孩子
           }
        }
        return result;
    }
}
```

## 4. 统一迭代

这是统一迭代法的写法， 如果学有余力，可以掌握一下

文章讲解：https://programmercarl.com/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%BB%9F%E4%B8%80%E8%BF%AD%E4%BB%A3%E6%B3%95.html

### 思路分析

1. 由于迭代法中的三种遍历顺序不能像递归遍历中一样，只需要修改代码的顺序就可以实现不同的遍历方法

2. 在迭代法中，<span style="color:red;font-weight:bold">无法同时解决访问节点（遍历节点）和处理节点（将元素放进结果集）不一致的情况</span>，并且他们的**对象不同**

   - 前序、后序
     - 遍历实现：入栈
     - 处理实现：出栈
   - 中序
     - 遍历实现：指针
     - 处理实现：出栈

3. 引出统一迭代法，通过修改顺序就可以实现不同的遍历顺序

#### 处理思路

- **那我们就将访问的节点放入栈中，把要处理的节点也放入栈中但是要做<span style="color:red;font-weight:bold">标记</span>**

> **关于标记：是为了标记节点<span style="color:red;font-weight:bold">是否被访问过</span>，可以帮助确认已经遍历过一个节点并需要将其加入结果。**

- **标记方法**

  - 方法一：就是要处理的节点放入栈之后，紧接着放入一个空指针作为标记。 这种方法可以叫做<span style="color:red;font-weight:bold">空指针标记法</span>

  - 方法二：加一个 boolean 值跟随每个节点，false (默认值) 表示需要为该节点和它的左右儿子安排在栈中的位次，true 表示该节点的位次之前已经安排过了，可以收割节点了。 这种方法可以叫做 <span style="color:red;font-weight:bold">boolean 标记法</span>

#### 代码说明

- 统一对象：每个树节点
- 统一处理顺序：使用栈处理，**处理顺序为遍历顺序的逆序**
- 根节点：在**根节点后添加 null 指针标记**

### 前序遍历

```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new LinkedList<>();
        Stack<TreeNode> st = new Stack<>();
        if (root != null) st.push(root);
        while (!st.empty()) {
            TreeNode node = st.peek();
            if (node != null) {
                st.pop(); // 将该节点弹出，避免重复操作，下面再将右左中节点添加到栈中（前序遍历-中左右，入栈顺序右左中）
                if (node.right!=null) st.push(node.right);  // 添加右节点（空节点不入栈）
                if (node.left!=null) st.push(node.left);    // 添加左节点（空节点不入栈）
                st.push(node);                          // 添加中节点
                st.push(null); // 中节点访问过，但是还没有处理，加入空节点做为标记。

            } else { // 只有遇到空节点的时候，才将下一个节点放进结果集
                st.pop();           // 将空节点弹出
                node = st.peek();    // 重新取出栈中元素
                st.pop();
                result.add(node.val); // 加入到结果集
            }
        }
        return result;
    }
}
```

### 中序遍历

```java
class Solution {
public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new LinkedList<>();
        Stack<TreeNode> st = new Stack<>();
        if (root != null) st.push(root);
        while (!st.empty()) {
            TreeNode node = st.peek();
            if (node != null) {
                st.pop(); // 将该节点弹出，避免重复操作，下面再将右中左节点添加到栈中（中序遍历-左中右，入栈顺序右中左）
                if (node.right!=null) st.push(node.right);  // 添加右节点（空节点不入栈）
                st.push(node);                          // 添加中节点
                st.push(null); // 中节点访问过，但是还没有处理，加入空节点做为标记。
                if (node.left!=null) st.push(node.left);    // 添加左节点（空节点不入栈）
            } else { // 只有遇到空节点的时候，才将下一个节点放进结果集
                st.pop();           // 将空节点弹出
                node = st.peek();    // 重新取出栈中元素
                st.pop();
                result.add(node.val); // 加入到结果集
            }
        }
        return result;
    }
}
```

### 后序遍历

```java
class Solution {
   public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new LinkedList<>();
        Stack<TreeNode> st = new Stack<>();
        if (root != null) st.push(root);
        while (!st.empty()) {
            TreeNode node = st.peek();
            if (node != null) {
                st.pop(); // 将该节点弹出，避免重复操作，下面再将中右左节点添加到栈中（后序遍历-左右中，入栈顺序中右左）
                st.push(node);                          // 添加中节点
                st.push(null); // 中节点访问过，但是还没有处理，加入空节点做为标记。
                if (node.right!=null) st.push(node.right);  // 添加右节点（空节点不入栈）
                if (node.left!=null) st.push(node.left);    // 添加左节点（空节点不入栈）

            } else { // 只有遇到空节点的时候，才将下一个节点放进结果集
                st.pop();           // 将空节点弹出
                node = st.peek();    // 重新取出栈中元素
                st.pop();
                result.add(node.val); // 加入到结果集
            }
        }
        return result;
   }
}
```

## 5. 层序遍历

看完本篇可以一口气刷十道题，试一试， 层序遍历并不难，大家可以很快刷了十道题。

题目链接

- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
- [107. 二叉树的层次遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)
- [199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)
- [637. 二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)
- [429. N 叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)
- [515. 在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)
- [116. 填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)
- [117. 填充每个节点的下一个右侧节点指针 II](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)
- [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)
- [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

文章讲解/题解：https://programmercarl.com/0102.%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%B1%82%E5%BA%8F%E9%81%8D%E5%8E%86.html

视频讲解：https://www.bilibili.com/video/BV1GY4y1u7b2

#### 思路分析

层序遍历，本质是**广度优先搜索**，这里借助队列来实现

- 用 size **记录每一层遍历的节点个数**，明确出队的元素
- 层序遍历的特点是逐层遍历的，<span style="color:red;font-weight:bold">在根节点出队后，把其左右孩子入队 </span>，实现层序遍历

### 第一题

```java
public class Solution {

    public List<List<Integer>> resList = new ArrayList<List<Integer>>();

    // 层序遍历
    public List<List<Integer>> levelOrder(TreeNode root) {
        checkFun02(root);
        return resList;
    }

    public void checkFun02(TreeNode node) {
        if (node == null) return;
        Queue<TreeNode> que = new LinkedList<TreeNode>();
        que.offer(node); // 入队
        // 遍历每一层的元素
        while (!que.isEmpty()) {
            List<Integer> itemList = new ArrayList<Integer>(); // 存储每一层的遍历结果
            int len = que.size();  // 记录当前层遍历的个数，明确出队个数
            while (len > 0) {
                TreeNode tmpNode = que.poll(); // 出队，返回队头元素
                itemList.add(tmpNode.val); // 添加遍历结果
                // 处理左孩子
                if (tmpNode.left != null) {
                    que.offer(tmpNode.left); // 左孩子入队
                }
                // 处理右孩子
                if (tmpNode.right != null) {
                    que.offer(tmpNode.right); // 右孩子入队
                }
                len--;
            }
            // 返回结果集
            resList.add(itemList);
        }
    }
}
```

### 第二题

#### 思路分析

### 第三题

#### 思路分析

### 第四题

#### 思路分析

### 第五题

#### 思路分析

### 第六题

#### 思路分析

### 第七题

#### 思路分析

### 第八题

#### 思路分析

### 第九题

#### 思路分析

### 第十题

#### 思路分析
