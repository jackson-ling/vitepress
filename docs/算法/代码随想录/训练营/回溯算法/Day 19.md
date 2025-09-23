---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 19</h1>

---

## ⭐ 理论基础

其实在讲解二叉树的时候，就给大家介绍过回溯，这次正式开启回溯算法，大家可以先看视频，对回溯算法有一个整体的了解。

文章讲解：https://programmercarl.com/%E5%9B%9E%E6%BA%AF%E7%AE%97%E6%B3%95%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html

视频讲解：https://www.bilibili.com/video/BV1cy4y167mM

### 什么是回溯

> #### 回溯法也可以叫做<span style="color:red;font-weight:bold">回溯搜索法</span>，它<span style="color:red;font-weight:bold">是一种搜索的方式</span>
>
> #### 回溯是<span style="color:red;font-weight:bold">递归的副产品</span>，只要<span style="color:red;font-weight:bold">有递归就会有回溯</span>
>
> #### <span style="color:red;font-weight:bold">回溯</span>函数也就是递归函数，指的都<span style="color:red;font-weight:bold">是一个函数</span>
>
> #### 回溯法并不是什么高效的算法
>
> #### 回溯的<span style="color:red;font-weight:bold">本质是穷举</span>，穷举所有可能，然后选出我们想要的答案，如果<span style="color:red;font-weight:bold">想</span>让回溯法<span style="color:red;font-weight:bold">高效</span>一些，可以加一些<span style="color:red;font-weight:bold">剪枝</span>的操作，但也改不了回溯法就是穷举的本质

### 解决的问题

> #### 排列问题：N 个数按一定规则全排列，有几种排列方式
>
> #### 组合问题：N 个数里面按一定规则找出 k 个数的集合
>
> #### 切割（分割）问题：一个字符串按一定规则有几种切割方式
>
> #### 子集问题：一个 N 个数的集合里有多少符合条件的子集
>
> #### 棋盘问题：N 皇后，解数独等等

### 如何理解回溯

> #### 回溯法解决的问题都可以<span style="color:red;font-weight:bold">抽象为树形结构</span>
>
> #### 因为回溯法解决的都是在集合中递归查找子集，<span style="color:red;font-weight:bold">集合的大小</span>就构成了<span style="color:red;font-weight:bold">树的宽度</span>，<span style="color:red;font-weight:bold">递归的深度</span>就构成了<span style="color:red;font-weight:bold">树的深度</span>
>
> #### 递归就要有终止条件，所以必然是一棵高度有限的树（N 叉树）

<img src="https://file1.kamacoder.com/i/algo/20210130173631174.png" />

### 回溯三部曲

> #### （1）递归函数的返回值以及参数
>
> #### （2）回溯函数终止条件
>
> #### （3）单层搜索的过程

### 回溯算法模板

#### <span style="color:red;font-weight:bold">for 循环可以理解是横向遍历，backtracking（递归）就是纵向遍历</span>

```java
public void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```

## 77. 组合

对着在回溯算法理论基础给出的代码模板，来做本题组合问题，大家就会发现写回溯算法套路。

在回溯算法解决实际问题的过程中，大家会有各种疑问，先看视频介绍，基本可以解决大家的疑惑。

本题关于剪枝操作是大家要理解的重点，因为后面很多回溯算法解决的题目，都是这个剪枝套路。

题目链接：https://leetcode.cn/problems/combinations

文章讲解：https://programmercarl.com/0077.%E7%BB%84%E5%90%88.html

视频讲解：https://www.bilibili.com/video/BV1ti4y1L7cv

剪枝操作：https://www.bilibili.com/video/BV1wi4y157er

### 思路分析

> #### 常规思路使用 for 循环嵌套暴力搜索，但是嵌套层数随着 K 的值变化而变化，若 K =100，则嵌套 100 层 for 循环，显然不现实

#### 采用回溯的思路，构造树结构

<img src="https://file1.kamacoder.com/i/algo/20201123195242899.png"/>

> #### 1. 每次从集合中选取元素，可选择的范围随着选择的进行而收缩，调整可选择的范围
>
> #### 2. 图中可以发现 n 相当于树的宽度，k 相当于树的深度
>
> #### 3. 图中每次搜索到了叶子节点，我们就找到了一个结果

### 题解一

```java
class Solution {
    List<List<Integer>> result = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();

    public List<List<Integer>> combine(int n, int k) {
        backtracking(n,k,1);
        return result;
    }

    // 回溯逻辑
    public void backtracking(int n,int k,int starIndex){
        // 终止条件
        if (path.size() == k){
            result.add(new ArrayList<>(path)); // 把路径加入结果集中
            return;
        }
        // 从 1 开始，这里取等
        for (int i = starIndex; i <= n; i++) {
            path.add(i);
            // 递归搜索，从下一个位置开始（因为是组合，不能重复使用同一个数字）
            backtracking(n,k,i + 1);
            // 回溯过程：弹出最后一个元素，和其他元素继续组合，寻找符合条件的结果
            path.removeLast();
        }
    }
}
```

### 剪枝优化

#### 来举一个例子，n = 4，k = 4 的话，那么第一层 for 循环的时候，从元素 2 开始的遍历都没有意义了。 在第二层 for 循环，从元素 3 开始的遍历都没有意义了。

<img src="https://file1.kamacoder.com/i/algo/20210130194335207.png"/>

> #### 1. 图中每一个节点（图中为矩形），就代表本层的一个 for 循环，那么每一层的 for 循环从第二个数开始遍历的话，都没有意义，都是无效遍历。
>
> #### 2. 所以，可以剪枝的地方就在递归中每一层的 for 循环所选择的起始位置。
>
> #### 3. 如果 for 循环选择的起始位置之后的元素个数 已经不足 我们需要的元素个数了，那么就没有必要搜索了。
>
> #### 总结：为了<span style="color:red;font-weight:bold">满足题目要求的 k 个元素</span>，在循环遍历的边界条件上可以做剪枝操作，剪掉不符合要求的情况

#### 剪枝操作

```java
for (int i = startIndex; i <= n - (k - path.size()) + 1; i++) // i为本次搜索的起始位置
```

> #### 1. 已经选择的元素个数：path.size();
>
> #### 2. 所需需要的元素个数为: k - path.size();
>
> #### 3. 列表中剩余元素（n-i） >= 所需需要的元素个数（k - path.size()）
>
> #### 3. 在集合 n 中<span style="color:red;font-weight:bold">至多</span>要从该起始位置 : i <= n - (k - path.size()) + 1，开始遍历

#### 举例说明为什么要 + 1

> #### n = 4，k = 3， 目前已经选取的元素为 0（path.size 为 0），n - (k - 0) + 1 即 4 - ( 3 - 0) + 1 = 2，从 2 开始搜索都是合理的，可以是组合[2, 3, 4]。

### 题解二

```java
class Solution {
    List<List<Integer>> result = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();

    public List<List<Integer>> combine(int n, int k) {
        backtracking(n, k, 1);
        return result;
    }

    // 回溯逻辑
    public void backtracking(int n, int k, int starIndex) {
        // 终止条件
        if (path.size() == k) {
            result.add(new ArrayList<>(path)); // 把路径加入结果集中
            return;
        }
        // 这里做剪枝操作：i <= n - (k - path.size()) + 1
        for (int i = starIndex; i <= n - (k - path.size()) + 1; i++) {
            path.add(i);
            // 递归搜索，从下一个位置开始（因为是组合，不能重复使用同一个数字）
            backtracking(n, k, i + 1);
            // 回溯过程：弹出最后一个元素，和其他元素继续组合，寻找符合条件的结果
            path.removeLast();
        }
    }
}
```

## 216.组合总和 III

如果把组合问题理解了，本题就容易一些了。

题目链接：https://leetcode.cn/problems/combination-sum-iii

文章讲解：https://programmercarl.com/0216.%E7%BB%84%E5%90%88%E6%80%BB%E5%92%8CIII.html

视频讲解：https://www.bilibili.com/video/BV1wg411873x

### 思路分析

#### 和上题的思路差不多，但是在剪枝的条件有些变化

> #### 循环遍历范围剪枝：需要满足题目要求的元素个数
>
> #### 和剪枝：需要满足题目要求的 sum 值

<img src="https://file1.kamacoder.com/i/algo/2020112319580476.png"/>

### 题解（剪枝）

```java
class Solution {
    List<List<Integer>> result = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();

    public List<List<Integer>> combinationSum3(int k, int n) {
        backtracking(n, k, 1, 0);
        return result;
    }

    // 回溯逻辑
    public void backtracking(int targetSum, int k, int startIndex, int sum) {
        // 剪枝
        if (sum > targetSum) {
            return;
        }
        // 递归终止条件（满足了要求的元素个数、和也是符合要求的）
        if (path.size() == k) {
            if (sum == targetSum) {
                result.add(new ArrayList<>(path));
            }
            return;
        }
        // 剪枝 + 递归搜索（需要取等，startIndex 从 1 开始）
        for (int i = startIndex; i <= 9 - (k - path.size()) + 1; i++) {
            path.add(i);
            sum += i;
            // 递归
            backtracking(targetSum, k, i + 1, sum);
            // 回溯
            sum -= i;
            path.removeLast();
        }
    }
}
```

## 17.电话号码的字母组合

本题大家刚开始做会有点难度，先自己思考 20min，没思路就直接看题解。

题目链接：https://leetcode.cn/problems/letter-combinations-of-a-phone-number/

文章讲解：https://programmercarl.com/0017.%E7%94%B5%E8%AF%9D%E5%8F%B7%E7%A0%81%E7%9A%84%E5%AD%97%E6%AF%8D%E7%BB%84%E5%90%88.html

视频讲解：https://www.bilibili.com/video/BV1yV4y1V7Ug

### 思路分析

> #### 区别于上面的组合问题，<span style="color:red;font-weight:bold">本题是在两个数组中组合</span>，然而上面的两题是针对一个数组（需要考虑是否重复选择的问题，需要设置 startIndex，本题不需要设置）
>
> #### 本题用 <span style="color:red;font-weight:bold">num 来记录遍历到第几个元素</span>，方便拿到元素映射的字符串数组，然后通过遍历数组、递归的方式来实现字母组合

<img src="https://file1.kamacoder.com/i/algo/20201123200304469.png"/>

### 题解

```java
class Solution {
    // 存放结果
    List<String> list = new ArrayList<>();
    public List<String> letterCombinations(String digits) {
        if (digits == null || digits.length() == 0){
            return list;
        }
        // 映射字符串数组，为了对应 2 - 9，增添两个无用的空串
        String[] numString = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        backtracking(digits, numString, 0);
        return list;
    }

    // 涉及大量字符串拼接，采用效率更高的 StringBuider
    StringBuilder temp = new StringBuilder();
    // 回溯逻辑（num：记录遍历到第几个字符）
    public void backtracking(String digits,String[] numString,int num){
        // 结束条件（当遍历到最后一个元素的时候，还会有处理过程，不应该直接结束，而是遍历到末尾才结束）
        if (num == digits.length()){
            list.add(temp.toString());
            return;
        }

        // 数字映射字符串
        /*
            （1）字符串映射
            （2）- '0' 转为整数（利用unicode码的差值）
         */
        String str = numString[digits.charAt(num) - '0'];

        // 遍历映射字符串的每一个字母，和下一个数字映射字符串中的字母进行组合
        for (int i = 0; i < str.length(); i++) {
            temp.append(str.charAt(i));
            // 递归：此时指向下一个数组，和其映射的字符串中的每个字符进行组合
            backtracking(digits,numString,num + 1);
            // 回溯（删除最后一个元素，模拟 pop 操作）
            temp.deleteCharAt(temp.length() - 1);
        }
    }
}
```
