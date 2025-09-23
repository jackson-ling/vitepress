---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 31</h1>

---

## 1049. 最后一块石头的重量 II

本题就和 昨天的 416. 分割等和子集 很像了，可以尝试先自己思考做一做

题目链接：https://leetcode.cn/problems/last-stone-weight-ii

文章讲解：https://programmercarl.com/1049.%E6%9C%80%E5%90%8E%E4%B8%80%E5%9D%97%E7%9F%B3%E5%A4%B4%E7%9A%84%E9%87%8D%E9%87%8FII.html

视频讲解：https://www.bilibili.com/video/BV14M411C7oV

### 思路分析

#### 转换成 01 背包

> #### （1）本题其实是尽量让石头分成重量相同的两堆（尽可能相同），相撞之后剩下的石头就是最小的
>
> #### （2）一堆的石头重量是 sum，那么我们就尽可能拼成重量为 sum / 2 的石头堆， 这样<span style="color:red">剩下的石头堆也是尽可能接近 sum / 2 的重量</span>，那么此时问题就是有一堆石头，每个石头都有自己的重量，是否可以装满最大重量为 sum / 2 的背包

#### （1）确定 dp 数组以及下标的含义

> #### dp [ j ] 表示容量（重量）为 j 的背包，最多可以背最大重量为 dp [ j ]

#### （2）确定递推公式

> #### dp [ j ] = max ( dp [ j ]，dp [ j - stones [ i ] ] + stones [ i ] )

#### （3） dp 数组如何初始化

> #### 既然 dp [ j ] 中的 j 表示容量，那么最大容量（重量）就是所有石头的重量和
>
> #### 因为提示中给出 1 <= stones.length <= 30，1 <= stones [ i ] <= 1000，所以最大重量就是 30 \* 1000 ，而我们要求的 target 其实只是最大重量的一半，所以 dp 数组开到 15000 大小就可以了。
>
> #### dp [ j ] 都初始化为 0 就可以了，这样在递归公式 dp [ j ] 才<span style="color:red">不会被初始值所覆盖</span>

#### （4）确定遍历顺序

> #### 采用一维 dp 数组，遵循先遍历物品，后遍历背包，且背包需要倒序遍历，确保物品只被放进一次

#### （5）举例推导 dp 数组

<br/>
<img src="https://file1.kamacoder.com/i/algo/20210121115805904.jpg" style="width:600px;margin:0px auto"/>

### 一维 dp

```java
class Solution {
    public int lastStoneWeightII(int[] stones) {
        int sum = 0;
        for (int stone : stones) {
            sum += stone;
        }
        // 采用位运算，防止内存溢出
        int target = sum >> 1;
        // 初始化 dp 数组
        int[] dp = new int[target + 1];
        // 先遍历物品
        for (int i = 0; i < stones.length; i++) {
            // 后遍历背包，倒序遍历（j 是背包容量，stones[i] 是物品重量）
            for (int j = target; j >= stones[i]; j--){
                dp[j] = Math.max(dp[j],dp[j - stones[i]] + stones[i]);
            }
        }
        // sum - dp[target] 表示分成两堆的石头中一堆石头的重量
        return sum - dp[target] - dp[target];
    }
}
```

### 二维 dp

```java
class Solution {
    public int lastStoneWeightII(int[] stones) {
        int sum = 0;
        for (int s : stones) {
            sum += s;
        }

        int target = sum / 2;
        //初始化，dp[i][j]为可以放0-i物品，背包容量为j的情况下背包中的最大价值
        int[][] dp = new int[stones.length][target + 1];
        //dp[i][0]默认初始化为0
        //dp[0][j]取决于stones[0]
        for (int j = stones[0]; j <= target; j++) {
            dp[0][j] = stones[0];
        }

        for (int i = 1; i < stones.length; i++) {
            for (int j = 1; j <= target; j++) {//注意是等于
                if (j >= stones[i]) {
                    //不放:dp[i - 1][j] 放:dp[i - 1][j - stones[i]] + stones[i]
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - stones[i]] + stones[i]);
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        System.out.println(dp[stones.length - 1][target]);
        return (sum - dp[stones.length - 1][target]) - dp[stones.length - 1][target];
    }
}
```

## 494. 目标和

大家重点理解 递推公式：dp[j] += dp[j - nums[i]]，这个公式后面的提问 我们还会用到

题目链接：https://leetcode.cn/problems/target-sum/description

文章讲解：https://programmercarl.com/0494.%E7%9B%AE%E6%A0%87%E5%92%8C.html

视频讲解：https://www.bilibili.com/video/BV1o8411j73x

### 思路分析

> #### 本题只能有 “ + ” 或者 “ - ”，分成两组，正数集合和负数集合

#### 核心思想

> #### （1）前提是满足和为 target 的条件下，有多少种方法可以得到目标和
>
> #### （2）<span style="color:red">因为只能选 “ + ” 或者 “ - ”，选取了正数，剩下的就是负数，即每一种正数集合会对应负数集合</span>，使得计算后和为 target
>
> #### （3）问题就转为：在和为 target 的前提下，求有多少种<span style="color:red">正数</span>的组合

#### 推导过程

> #### 计算结果为 target，则 left （加 “ + ” 的和） - right （加 “ - ” 的和） = target，并且 left + right = sum
>
> #### sum 是固定的，进而退出 right = sum - left，带入上述表达式有
>
> #### left - (sum - left) = target，推导出 <span style="color:red">left = ( target + sum ) / 2</span>

#### 动规五部曲

> #### 结合视频和文章讲解理解，内容太多，不做赘述

### 一维 dp

```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int i = 0; i < nums.length; i++)
            sum += nums[i];

        //如果target的绝对值大于sum，那么是没有方案的
        if (Math.abs(target) > sum) {
            return 0;
        }
        //如果(target+sum)除以2的余数不为0，也是没有方案的
        if ((target + sum) % 2 == 1) {
            return 0;
        }

        int bagSize = (target + sum) / 2;
        int[] dp = new int[bagSize + 1];
        dp[0] = 1;

        for (int i = 0; i < nums.length; i++) {
            for (int j = bagSize; j >= nums[i]; j--) {
                dp[j] += dp[j - nums[i]];
            }
        }

        return dp[bagSize];
    }
}
```

### 二维 dp

```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {

        // 01背包应用之“有多少种不同的填满背包最大容量的方法“
        // 易于理解的二维数组解法及详细注释

        int sum = 0;
        for(int i = 0; i < nums.length; i++) {
            sum += nums[i];
        }

        // 注意nums[i] >= 0的题目条件，意味着sum也是所有nums[i]的绝对值之和
        // 这里保证了sum + target一定是大于等于零的，也就是left大于等于零（毕竟我们定义left大于right）
        if(sum < Math.abs(target)){
            return 0;
        }

        // 利用二元一次方程组将left用target和sum表示出来（替换掉right组合），详见代码随想录对此题的分析
        // 如果所求的left数组和为小数，则作为整数数组的nums里的任何元素自然是没有办法凑出这个小数的
        if((sum + target) % 2 != 0) {
            return 0;
        }

        int left = (sum + target) / 2;

        // dp[i][j]：遍历到数组第i个数时， left为j时的能装满背包的方法总数
        int[][] dp = new int[nums.length][left + 1];

        // 初始化最上行（dp[0][j])，当nums[0] == j时（注意nums[0]和j都一定是大于等于零的，因此不需要判断等于-j时的情况），有唯一一种取法可取到j，dp[0][j]此时等于1
        // 其他情况dp[0][j] = 0
        // java整数数组默认初始值为0
        if (nums[0] <= left) {
            dp[0][nums[0]] = 1;
        }

        // 初始化最左列（dp[i][0])
        // 当从nums数组的索引0到i的部分有n个0时（n > 0)，每个0可以取+/-，因此有2的n次方中可以取到j = 0的方案
        // n = 0说明当前遍历到的数组部分没有0全为正数，因此只有一种方案可以取到j = 0（就是所有数都不取）
        int numZeros = 0;
        for(int i = 0; i < nums.length; i++) {
            if(nums[i] == 0) {
                numZeros++;
            }
            dp[i][0] = (int) Math.pow(2, numZeros);

        }

        // 递推公式分析：
        // 当nums[i] > j时，这时候nums[i]一定不能取，所以是dp[i - 1][j]种方案数
        // nums[i] <= j时，num[i]可取可不取，因此方案数是dp[i - 1][j] + dp[i - 1][j - nums[i]]
        // 由递推公式可知，先遍历i或j都可
        for(int i = 1; i < nums.length; i++) {
            for(int j = 1; j <= left; j++) {
                if(nums[i] > j) {
                    dp[i][j] = dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j] + dp[i - 1][j - nums[i]];
                }
            }
        }


        return dp[nums.length - 1][left];

    }
}
```

## 474. 一和零

通过这道题目，大家先粗略了解， 01 背包，完全背包，多重背包的区别，不过不用细扣，因为后面 对于 完全背包，多重背包 还有单独讲解

题目链接：https://leetcode.cn/problems/ones-and-zeroes

文章讲解：https://programmercarl.com/0474.%E4%B8%80%E5%92%8C%E9%9B%B6.html

视频讲解：https://www.bilibili.com/video/BV1rW4y1x7ZQ

### 思路分析

#### 01 背包场景

> #### 这个背包有两个维度，一个是 m 一个是 n，而不同长度的字符串就是不同大小的待装物品

### 二维 dp

```java
class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        //dp[i][j]表示i个0和j个1时的最大子集
        int[][] dp = new int[m + 1][n + 1];
        int oneNum, zeroNum;
        for (String str : strs) {
            oneNum = 0;
            zeroNum = 0;
            for (char ch : str.toCharArray()) {
                if (ch == '0') {
                    zeroNum++;
                } else {
                    oneNum++;
                }
            }
            //倒序遍历
            for (int i = m; i >= zeroNum; i--) {
                for (int j = n; j >= oneNum; j--) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - zeroNum][j - oneNum] + 1);
                }
            }
        }
        return dp[m][n];
    }
}
```
