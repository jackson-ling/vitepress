---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 24</h1>

---

## 122.买卖股票的最佳时机 II

本题解法很巧妙，本题大家可以先自己思考一下然后再看题解，会有惊喜！

题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/

文章讲解：https://programmercarl.com/0122.%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BAII.html

视频讲解：https://www.bilibili.com/video/BV1ev4y1C7na

### 思路分析

> #### 任何时候只能有一张股票，只能买或者卖，需要计算最大利润，可以从第一天开始，往后计算每一天的利润（后一天 - 前一天）
>
> #### 局部最优：只收获利润中的正利润

### 题解

```java
class Solution {
    public int maxProfit(int[] prices) {
        int result = 0;
        for (int i = 1; i < prices.length; i++) {
            // 只收获正利润
            result += Math.max(prices[i] - prices[i - 1], 0);
        }
        return result;
    }
}
```

## 55. 跳跃游戏

本题如果没接触过，很难想到，所以不要自己憋时间太久，读题思考一会，没思路立刻看题解

题目链接：https://leetcode.cn/problems/jump-game/

文章讲解：https://programmercarl.com/0055.%E8%B7%B3%E8%B7%83%E6%B8%B8%E6%88%8F.html

视频讲解：https://www.bilibili.com/video/BV1VG4y1X7kB

### 思路分析

> #### 本题不需要考虑每次条几步，目的是能否到达终点，换个角度想，每一个数组元素表示可以朓的步数，即<span style="color:red">覆盖范围</span>，只需要看<span style="color:red">覆盖范围能否覆盖到终点</span>即可

#### 局部最优解：每次<span style="color:red">取最大</span>跳跃步数（取最大覆盖范围）

#### 每次移动取最大跳跃步数（得到最大的覆盖范围），每移动一个单位，就更新最大覆盖范围

<img src="https://file1.kamacoder.com/i/algo/20230203105634.png"/>

### 题解

```java
class Solution {
    public boolean canJump(int[] nums) {
        if (nums.length == 1) {
            return true;
        }
        int cover = 0;
        // 只有在覆盖范围内移动才是有意义的，如果发现不够可以移动元素继续增加覆盖范围
        for (int i = 0; i <= cover; i++) {
            // 不断更新，取最大的覆盖范围
            cover = Math.max(cover, i + nums[i]);
            if (cover >= nums.length - 1) {
                return true;
            }
        }
        return false;
    }
}
```

## 45.跳跃游戏 II

本题同样不容易想出来。贪心就是这样，有的时候 会感觉简单到离谱，有时候，难的不行，主要是不容易想到。

题目链接：https://leetcode.cn/problems/jump-game-ii/

文章讲解：https://programmercarl.com/0045.%E8%B7%B3%E8%B7%83%E6%B8%B8%E6%88%8FII.html

视频讲解：https://www.bilibili.com/video/BV1Y24y1r7XZ

### 思路分析

> #### 本题需要求跳到终点的最小步数，有了上面一题的思路，还是不用考虑具体是怎么朓的，只需要看覆盖范围能否到达终点

#### 局部最优：当前可移动距离尽可能多走，如果还没到终点，步数再加一

> #### 这里需要统计两个覆盖范围，当前这一步的最大覆盖和下一步最大覆盖。
>
> #### 如果移动下标达到了当前这一步的最大覆盖最远距离了，还没有到终点的话，那么就必须再走一步来增加覆盖范围，直到覆盖范围覆盖了终点。

<img src="https://file1.kamacoder.com/i/algo/20201201232309103.png" style="width:600px;margin:0px auto"/>

### 题解

```java
class Solution {
    public int jump(int[] nums) {
        if (nums == null || nums.length == 0 || nums.length == 1) {
            return 0;
        }
        // 记录跳跃次数
        int count = 0;
        // 记录当前最大覆盖范围
        int curDistance = 0;
        // 记录最大覆盖区域
        int maxDistance = 0;
        for (int i = 0; i < nums.length; i++) {
            maxDistance = Math.max(maxDistance, i + nums[i]);
            // 覆盖范围覆盖了终点，即再跳一步就到达了终点
            if (maxDistance >= nums.length - 1) {
                count++;
                break;
            }
            // 遍历到当前最大范围末尾，但是没有到达终点，更新下一步可到达的最大区域
            if (i == curDistance && curDistance < nums.length - 1) {
                curDistance = maxDistance;
                count++;
            }
        }
        return count;
    }
}
```

## 1005.K 次取反后最大化的数组和

本题简单一些，估计大家不用想着贪心 ，用自己直觉也会有思路。

题目链接：https://leetcode.cn/problems/maximize-sum-of-array-after-k-negations/description

文章讲解：https://programmercarl.com/1005.K%E6%AC%A1%E5%8F%96%E5%8F%8D%E5%90%8E%E6%9C%80%E5%A4%A7%E5%8C%96%E7%9A%84%E6%95%B0%E7%BB%84%E5%92%8C.html

视频讲解：https://www.bilibili.com/video/BV138411G7LY

### 思路分析

#### 本题有两个贪心

> #### （1）K 的次数刚好用完：对绝对值大的数取反，整体和可以达到最大
>
> #### （2）K 的次数<span style="color:red">有剩余</span>且为<span style="color:red">奇数</span>，对最小的数反复取反，直到 K=0（因为当 K 有剩余说明所有数都已经是正数了，此时对最小的数取反对总和的影响是最小的）

#### 对数组按照<span style="color:red">绝对值从小到大排序</span>

### 题解

```java
class Solution {
    public int largestSumAfterKNegations(int[] nums, int k) {
        // 数组按照绝对值从大到小排序
        nums = IntStream.of(nums)
                .boxed()
                .sorted((o1, o2) -> Math.abs(o2) - Math.abs(o1))
                .mapToInt(Integer::intValue).toArray();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < 0 && k > 0){
                nums[i] = -nums[i];
                k--;
            }
        }
        // 一轮遍历之后，如果 K 还有剩余，且为奇数，对最小的数取反
        if (k % 2 == 1){
            nums[nums.length - 1] = - nums[nums.length - 1];
        }
        // 统计总和
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        return sum;
    }
}
```
