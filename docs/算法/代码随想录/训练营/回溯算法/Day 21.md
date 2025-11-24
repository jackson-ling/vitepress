---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 21</h1>

---

## 93.复原 IP 地址

本期本来是很有难度的，不过 大家做完 分割回文串 之后，本题就容易很多了

题目链接：https://leetcode.cn/problems/restore-ip-addresses/

文章讲解：https://programmercarl.com/0093.%E5%A4%8D%E5%8E%9FIP%E5%9C%B0%E5%9D%80.html

视频讲解：https://www.bilibili.com/video/BV1XP4y1U73i/

### 思路分析

#### 思路还是回溯的框架，通过树的方式理解回溯的逻辑，这里需要注意的是

#### （1）如何插入 " . "

#### （2）下一次递归的起点在哪

#### （3）如何实现切割字串

<img src="https://file1.kamacoder.com/i/algo/20201123203735933.png"/>

### 题解

```java
public class Solution {
    // 结果集
    List<String> result = new ArrayList<>();

    public List<String> restoreIpAddresses(String s) {
        // 根据 ip 的特点，最多也就是12位，这里可以做剪枝
        if (s.length() > 12) {
            return result; // 算是剪枝了
        }
        backtracking(s,0,0);
        return result;
    }

    public void backtracking(String s, int startIndex, int pointNum) {
        // 结束条件
        if (pointNum == 3) {
            // 此时分割完成，需要判断最后一个字串是否合法
            if (isValid(s, startIndex, s.length() - 1)) {
                result.add(s);
            }
            return;
        }
        for (int i = startIndex; i < s.length(); i++) {
            if (isValid(s, startIndex, i)) {
                // 字串合法，插入 " . "，subString()方法：左闭右开
                s = s.substring(0, i + 1) + "." + s.substring(i + 1, s.length());
                pointNum++;
                // 易错：由于插入了一个 " . "，所以下一次递归的起始位置需要多加一
                backtracking(s, i + 2, pointNum);
                // 回溯
                pointNum--;
                s = s.substring(0, i + 1) + s.substring(i + 2, s.length());
            } else {
                break;
            }
        }
    }

    // 判断是否合法
    public boolean isValid(String s, int start, int end) {
        if (start > end) {
            return false;
        }
        // 非零开头（并且该字符不是最后一个数字）
        if (s.charAt(start) == '0' && start != end) {
            return false;
        }
        // 遍历，数值小于255
        int num = 0;
        for (int i = start; i <= end; i++) {
            // 判断非法字符
            if (s.charAt(i) < '0' || s.charAt(i) > '9') {
                return false;
            }
            // charAt 方法是逐个字符取的，使用如下式子转为整数
            num = num * 10 + (s.charAt(i) - '0');
            if (num > 255) {
                return false;
            }
        }
        return true;
    }
}
```

## 78.子集

子集问题，就是收集树形结构中，每一个节点的结果。 整体代码其实和 回溯模板都是差不多的。

题目链接：https://leetcode.cn/problems/subsets/

文章讲解：https://programmercarl.com/0078.%E5%AD%90%E9%9B%86.html

视频讲解：https://www.bilibili.com/video/BV1U84y1q7Ci

### 思路分析

#### 思路和之前最开始的组合问题类似，但是这里有几个注意点

#### （1）<span style="color:red">子集问题</span>需要遍历整棵树，<span style="color:red">不需要剪枝</span>

#### （2）每一层递归都需要收集结果，而不只是收集叶子节点

#### （3）在什么时候收集结果

> #### 注意：本题中给出的<span style="color:red">集合是没有重复元素的</span>

<img src="https://file1.kamacoder.com/i/algo/78.%E5%AD%90%E9%9B%86.png"/>

### 题解

```java
public class Solution {
    List<List<Integer>> result = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<Integer>();

    public List<List<Integer>> subsets(int[] nums) {
        subsetHelper(nums, 0);
        return result;
    }

    public void subsetHelper(int[] nums, int startIndex) {
        // 收获结果放在终止条件的上方，不会忽略最后一个元素，即先收集结果，再终止
        // 进入一层递归，就收集结果，即实现了每个节点都要收集结果
        result.add(new ArrayList<>(path));
        // 如下的剪枝可以省略不写，没有影响
        if (startIndex >= nums.length) {
            return;
        }
        for (int i = startIndex; i < nums.length; i++) {
            // 这里是每一次取得元素
            path.add(nums[i]);
            subsetHelper(nums, i + 1);
            // 回溯
            path.removeLast();
        }
    }
}
```

## 90.子集 II

大家之前做了 40.组合总和 II 和 78.子集 ，本题就是这两道题目的结合，建议自己独立做一做，本题涉及的知识，之前都讲过，没有新内容。

题目链接：https://leetcode.cn/problems/subsets-ii/

文章讲解：https://programmercarl.com/0090.%E5%AD%90%E9%9B%86II.html

视频讲解：https://www.bilibili.com/video/BV1vm4y1F71J

### 思路分析

#### 和上一题区别，本题给出的集合是有重复元素的，这里<span style="color:red">需要去重（树层去重）</span>

### 题解（剪枝）

```java
class Solution {
    List<List<Integer>> res = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        // 首先对数组排序，方便判断在树层上是否选取重复元素
        Arrays.sort(nums);
        subsetWithDupHelper(nums, 0);
        return res;
    }

    public void subsetWithDupHelper(int[] nums, int startIndex) {
        res.add(new ArrayList<>(path));
        for (int i = startIndex; i < nums.length; i++) {
            // 树层去重
            if (i > startIndex && nums[i - 1] == nums[i]) {
                continue;
            }
            path.add(nums[i]);
            subsetWithDupHelper(nums, i + 1);
            // 回溯
            path.removeLast();
        }
    }
}
```

### 题解（标记数组）

```java
class Solution {
   List<List<Integer>> result = new ArrayList<>();// 存放符合条件结果的集合
   LinkedList<Integer> path = new LinkedList<>();// 用来存放符合条件结果
   boolean[] used;
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        if (nums.length == 0){
            result.add(path);
            return result;
        }
        Arrays.sort(nums);
        used = new boolean[nums.length];
        subsetsWithDupHelper(nums, 0);
        return result;
    }

    private void subsetsWithDupHelper(int[] nums, int startIndex){
        result.add(new ArrayList<>(path));
        if (startIndex >= nums.length){
            return;
        }
        for (int i = startIndex; i < nums.length; i++){
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]){
                continue;
            }
            path.add(nums[i]);
            used[i] = true;
            subsetsWithDupHelper(nums, i + 1);
            path.removeLast();
            used[i] = false;
        }
    }
}
```
