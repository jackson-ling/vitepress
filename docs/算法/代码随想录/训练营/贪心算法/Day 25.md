---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 25</h1>

---

## 134. 加油站

本题有点难度，不太好想，推荐大家熟悉一下方法二

题目链接：https://leetcode.cn/problems/gas-station/

文章讲解：https://programmercarl.com/0134.%E5%8A%A0%E6%B2%B9%E7%AB%99.html

视频讲解：https://www.bilibili.com/video/BV1jA411r7WX

### 思路分析

#### 理解题意：第 i 个加油站开往第 i+1 个加油站需要消耗汽油 cost[i] 升，也就是说可以从当前 i 位置计算出到下一站是有油量剩余还是亏油

#### 局部最优：当前累加 rest[i]的和 curSum 一旦小于 0，起始位置至少要是 i+1，因为从 i 之前开始一定不行

#### 核心思想

> #### （1）每个加油站的剩余量 rest[i]为 gas[i] - cost[i]。
>
> #### （2）i 从 0 开始累加 rest[i]，和记为 curSum，一旦 curSum 小于零，说明[0, i]区间都不能作为起始位置
>
> #### （3）在该段区间的起始位置开始积累油，在 i 的位置就可以消耗完，可能还不够。所以说在这个区间选择任何一个位置作为起点，到 i 这里都会断油，那么起始位置从 i+1 算起，再从 0 计算 curSum。

### 题解

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        // i从0开始累加rest[i]，和记为curSum
        int curSum = 0;
        // 记录总油耗，判断能否走一圈
        int totalSum = 0;
        // 保存起点
        int index = 0;
        for (int i = 0; i < gas.length; i++) {
            curSum += gas[i] - cost[i];
            totalSum += gas[i] - cost[i];
            // curSum < 0，说明[0, i]区间都不能作为起始位置
            // 因为这个区间选择任何一个位置作为起点，到i这里都会断油
            if (curSum < 0) {
                // 更新起点
                index = (i + 1) % gas.length;
                curSum = 0;
            }
        }
        if (totalSum < 0) {
            return -1;
        }
        return index;
    }
}
```

## 135. 分发糖果

本题涉及到一个思想，就是想处理好一边再处理另一边，**不要两边想着一起兼顾**，后面还会有题目用到这个思路

题目链接：https://leetcode.cn/problems/candy/

文章讲解：https://programmercarl.com/0135.%E5%88%86%E5%8F%91%E7%B3%96%E6%9E%9C.html

视频讲解：https://www.bilibili.com/video/BV1ev4y1r7wN

### 思路分析

#### 相邻两个孩子，分高的糖果多，需要考虑两边

> #### （1）<span style="color:red">右边</span>的孩子<span style="color:red">比左边</span>的孩子<span style="color:red">分高</span>（<span style="color:red">从左向右</span>遍历）
>
> #### （2）<span style="color:red">左边</span>的孩子<span style="color:red">比右边</span>的孩子<span style="color:red">分高</span>（<span style="color:red">从右向左</span>遍历，因为这样才不会导致结果错误，如下图）

<img src="https://file1.kamacoder.com/i/algo/20230202102044.png" style="width:700px;margin:0px auto"/>

> #### （3）本题采用分开处理的思想，无法兼顾左边的同时兼顾右边，最后取最大值，就能保证当符合两个条件的时候，都能满足题目要求

#### 两次贪心的策略

> #### （1）一次是从左到右遍历，只比较右边孩子评分比左边大的情况。
>
> #### （2）一次是从右到左遍历，只比较左边孩子评分比右边大的情况。

### 题解

```java
class Solution {
    public int candy(int[] ratings) {
        int len = ratings.length;
        int[] candyVec = new int[len];
        // 为了能够比较，初始化第一个数
        candyVec[0] = 1;
        // 处理右边比左边分高
        for (int i = 1; i < len; i++) {
            candyVec[i] = (ratings[i] > ratings[i - 1]) ? candyVec[i - 1] + 1 : 1;
        }
        // 处理左边比右边分高
        for (int i = len - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candyVec[i] = Math.max(candyVec[i], candyVec[i + 1] + 1);
            }
        }

        int ans = 0;
        for (int num : candyVec) {
            ans += num;
        }
        return ans;
    }
}
```

## 860.柠檬水找零

本题看上好像挺难，其实很简单，大家先尝试自己做一做。

题目链接：https://leetcode.cn/problems/lemonade-change/

文章讲解：https://programmercarl.com/0860.%E6%9F%A0%E6%AA%AC%E6%B0%B4%E6%89%BE%E9%9B%B6.html

视频讲解：https://www.bilibili.com/video/BV12x4y1j7DD

### 思路分析

> #### 本题的关注点不是金钱的数量，能否找零，本题题意规定了只有三种面额，需要<span style="color:red">关注</span>不同面额钞票的<span style="color:red">张数</span>，是否能够有对应面额的张数可以找零

#### 三种情况

> #### 情况一：账单是 5，直接收下。
>
> #### 情况二：账单是 10，消耗一个 5，增加一个 10
>
> #### 情况三：账单是 20，优先消耗一个 10 和一个 5，如果不够，再消耗三个 5

#### 局部最优

> #### 当收下 20 的面额时，优先使用一个 10 和一个 5 找零

### 题解

```java
class Solution {
    public boolean lemonadeChange(int[] bills) {
        // 记录三种面额的张数
        int fiveNum = 0;
        int tenNum = 0;
        int twentyNum = 0;
        // 遍历
        for (int bill : bills) {
            // 情况一：收到面额为 5 的钞票
            if (bill == 5) {
                fiveNum++;
            }
            // 情况二：收到面额为 10 的钞票
            else if (bill == 10) {
                if (fiveNum <= 0) {
                    return false;
                }
                // 用一张 5 找零
                fiveNum--;
                tenNum++;
            }
            // 情况三：收到面额为 20 的钞票
            else if (bill == 20) {
                // 贪心：优先使用 10 + 5 找零
                if (fiveNum > 0 && tenNum > 0) {
                    tenNum--;
                    fiveNum--;
                }
                // 下策：使用 3 张 5 找零
                else if (fiveNum >= 3) {
                    fiveNum -= 3;
                } else {
                    return false;
                }
            }
        }
        return true;
    }
}
```

## 406.根据身高重建队列

本题有点难度，和分发糖果类似，不要两头兼顾，处理好一边再处理另一边。

题目链接：https://leetcode.cn/problems/queue-reconstruction-by-height/

文章讲解：https://programmercarl.com/0406.%E6%A0%B9%E6%8D%AE%E8%BA%AB%E9%AB%98%E9%87%8D%E5%BB%BA%E9%98%9F%E5%88%97.html

视频讲解：https://www.bilibili.com/video/BV1EA411675Y

### 思路分析

> #### 本题和分糖果类似，都是<span style="color:red">处理两个维度</span>的问题，本题两个维度：身高（h）、人数（k）
>
> #### 处理方法：<span style="color:red">先确定一个维度，再处理另一个维度</span>

#### 两个思路

> #### （1）先处理人数 k，按 k 从小到大排序，发现无法满足题目要求
>
> #### （2）<span style="color:red">身高按照从高到低排序</span>，身高确定后，处理人数 k（因为一定可以保证前面的比后面高，满足题意），那么只需要按照 k 为下标重新插入队列就可以了
>
> #### （3）如果<span style="color:red">身高相同，k 从小到大</span>排序

<img src="https://file1.kamacoder.com/i/algo/20201216201851982.png" style="width:700px;margin:0px auto"/>

> #### 按照身高排序后，前面的一定比后面高，即后面矮的的插入到前面并不会影响 k 的个数 （k 是前面身高 ≥ 后面身高的人数）

### 题解

```java
class Solution {
    public int[][] reconstructQueue(int[][] people) {
        // 使用 lambda 表达式实现接口的抽象方法
        Arrays.sort(people, (a, b) -> {
            // 身高相同，k从小到大排序
            if (a[0] == b[0]) {
                return a[1] - b[1];
            }
            // 身高按照从大到小排序
            return b[0] - a[0];
        });

        LinkedList<int[]> queue = new LinkedList<>();

        for (int[] p : people) {
            // add（index, value）
            queue.add(p[1],p);
        }

        return queue.toArray(new int[people.length][]);
    }
}
```
