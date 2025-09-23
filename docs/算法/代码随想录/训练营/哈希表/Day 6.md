---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 6</h1>

---

## 454.四数相加 II

建议：本题是使用 map 巧妙解决的问题，好好体会一下 哈希法如何提高程序执行效率，降低时间复杂度，当然使用哈希法会提高空间复杂度，但一般来说我们都是舍空间换时间

题目链接：https://leetcode.cn/problems/4sum-ii/description/

文章讲解：https://programmercarl.com/0454.%E5%9B%9B%E6%95%B0%E7%9B%B8%E5%8A%A0II.html

视频链接：https://www.bilibili.com/video/BV1Md4y1Q7Yh

### （1）思路分析

**本题是使用哈希法的经典题目**，只要找到 A[i] + B[j] + C[k] + D[l] = 0 就可以，**不用考虑有重复**的四个元素相加等于 0 的情况，返回有多少种组合数即可

- 仍然可以运用化简的思想，和**两数之和**很像
- 可以使用 **map(和，出现的次数)** 统计前两个数组的和(<span style="color:red;font-weight:bold">构造 hash</span>)，还有这个和出现的次数，在后续遍历两个数组的时候，一对和如果可以和 map 中的相加为 0，那 value 的值就是他们有多少种组合的值
- 还是运用**差值思想**，**target = 0 减去 map 中的和**，之后再 **map** 中<span style="color:red;font-weight:bold">查找</span>是否出现过

### （2）题解

```java
public class Solution {
    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        // 存放结果值
        int res = 0;

        Map<Integer, Integer> map = new HashMap<>();

        // 先对 num1 和 num2 遍历，合并为一个map
        for (int i : nums1) {
            for (int j : nums2) {
                int sum = i + j;
                // key 存放和，value 存放相同的和出现的次数，即有多少种组合方式
                map.put(sum, map.getOrDefault(sum, 0) + 1);
            }
        }

        // 后对 num3 和 num4 遍历，在 map 中查找是否出现过
        for (int i : nums3) {
            for (int j : nums4) {
                int gap = 0 - (i + j);
                // 注意：加上的是 key 对应的 value，存放的是某个和有几种组合可以实现
                res += map.getOrDefault(gap,0);
            }
        }
        return res;
    }
}
```

## 383. 赎金信

建议：本题 和 242.有效的字母异位词是一个思路 ，算是拓展题

题目链接：https://leetcode.cn/problems/ransom-note/

文章链接：https://programmercarl.com/0383.%E8%B5%8E%E9%87%91%E4%BF%A1.html

本题没有视频讲解

### （1）思路分析

本题是问**一个单词能否由另一个单词的字母构成**，和前面的**242.有效的字母异位词**是<span style="color:red;font-weight:bold">一样的思路</span>，通过数组映射<span style="color:red;font-weight:bold">构造 hash</span>，然后在 hash 中<span style="color:red;font-weight:bold">查找</span>

### （2）题解

```java
public class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        // 定义一个映射数组
        int[] res = new int[26];

        // 转成字符串数组
        char[] ransomNotes = ransomNote.toCharArray();
        char[] magazines = magazine.toCharArray();

        // 遍历
        for (char i : magazines) {
            res[i - 'a']++;
        }

        for (char i : ransomNotes) {
            res[i - 'a']--;
        }

        // 查找
        for (int i : res) {
            if (i < 0) {
                return false;
            }
        }
        return true;
    }
}
```

## ⚠️15. 三数之和

建议：本题虽然和两数之和很像，也能用哈希法，但用哈希法会很麻烦，双指针法才是正解，可以先看视频理解一下 双指针法的思路，文章中讲解的，没问题 哈希法很麻烦。

题目链接：https://leetcode.cn/problems/3sum/

文章链接：https://programmercarl.com/0015.%E4%B8%89%E6%95%B0%E4%B9%8B%E5%92%8C.html

视频讲解：https://www.bilibili.com/video/BV1GW4y127qo

### （1）思路分析

#### 本题的<span style="color:red;font-weight:bold">难点在于去重</span>，当然可以使用哈希法，但是在去重上会很复杂，这里使用<span style="color:red;font-weight:bold">双指针法</span>

1. 题目中的三个要求

   - i != j、i != k 且 j != k：表示的是取三个数作为三元组的元素，<span style="color:red;font-weight:bold">不能两次取同一个位置的元素</span>
   - 返回所有和为 0 且不重复的三元组：**三元组不能重复**，但是<span style="color:red;font-weight:bold">三元组中的元素是可以重复的</span>
   - nums[i] + nums[j] + nums[k] == 0

2. 双指针思路

   - 首先对数组<span style="color:red;font-weight:bold;font-size:25px">排序</span>
   - 通过循环遍历，i 的起始位置位于数组第一个元素
   - **运用双指针 left、right**
   - a = nums[i]
   - b = nums[left]
   - c = nums[right]
   - **如何移动**
     - 如果 nums[i] + nums[left] + nums[right] > 0 就说明 此时三数之和大了，因为数组是排序后了，所以 right 下标就应该向左移动
     - 如果 nums[i] + nums[left] + nums[right] < 0 说明 此时 三数之和小了，left 就向右移动

3. <span style="color:red;font-weight:bold">去重分析</span>
   - **a 的去重**
     - 问题引出：**是判断 nums[i] 与 nums[i + 1]是否相同，还是判断 nums[i] 与 nums[i-1] 是否相同**
     - 问题分析
       - 应该是分析**nums[i] 与 nums[i-1]**，这是判断**不能有重复的三元组**
       - 如果判断是**前者**，这样就会就把**三元组中出现重复元素**的情况**遗漏**了
         - **a = nums[i]**
         - **b = nums[left] = nums[i+1]**
   - **b、c 的去重**：<span style="color:red;font-weight:bold">去重逻辑应该放在找到一个三元组之后，对 b 和 c 去重</span>

### （2）题解

```java
public class Solution {
    public List<List<Integer>> threeSum(int[] nums) {

        List<List<Integer>> result = new ArrayList<>();

        // 首先对数组排序
        Arrays.sort(nums);

        for (int i = 0; i < nums.length; i++) {
            // 数组已经排序了，如果前面的数大于零，则后面的数肯定比前面大，不可能出现结果为0的三元组
            if(nums[i] > 0){
                return result;
            }

            // 去重 a（i > 0是为了保证 i-1 不会数组越界）
            if(i > 0 && nums[i-1] == nums[i]){
                continue; // 暂停一次循环，利用下一次循环让指针 i 后移
            }

            int left = i + 1;
            int right = nums.length - 1;

            // 这里不能取等，题目要求的是一个三元组，取等后 b、c 就变成一个元素了
            while (left < right) {
                // 判断和，移动指针
                if(nums[i] + nums[left] + nums[right] < 0){
                    left++;
                }else if (nums[i] + nums[left] + nums[right] > 0){
                    right--;
                }else{
                    // 运用 asList 方法将一维数转成-->集合
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    // 此时三元组的和为0，找到了一个符合条件的三元组，现在需要对 b、c 去重
                    while (right > left && nums[right] == nums[right - 1]) right--;
                    while (right > left && nums[left] == nums[left + 1]) left++;

                    // 继续移动指针，找到下一个符合条件的三元组
                    right--;
                    left++;
                }
            }
        }
        return result;
    }
}
```

### （3）小结

#### 哈希：不会对数组排序，适合需要<span style="color:red;font-weight:bold">返回下标</span>

#### 双指针：<span style="color:red;font-weight:bold">需要对数组排序</span>，适合需要<span style="color:red;font-weight:bold">返回值</span>

## ⚠️18. 四数之和

建议： 要比较一下，本题和 454.四数相加 II 的区别，为什么 454.四数相加 II 会简单很多，这个想明白了，对本题理解就深刻了。 本题 思路整体和 三数之和一样的，都是双指针，但写的时候 有很多小细节，需要注意，建议先看视频。

题目链接：https://leetcode.cn/problems/4sum/

文章链接：https://programmercarl.com/0018.%E5%9B%9B%E6%95%B0%E4%B9%8B%E5%92%8C.html

视频讲解：https://www.bilibili.com/video/BV1DS4y147US

### （1）思路分析

#### 本题的思路是延续三数之和的，由于是四数之和，需要使用两层 for 循环，这里为了减少不必要的操作，<span style="color:red;font-weight:bold">难点就在于剪枝 + 去重</span>

**剪枝**的分析

- **第一层**循环
  - **固定了 k**，需要对 k <span style="color:red;font-weight:bold">后面</span>的数分析
  - 如果 nums[k] 本身的值都大于了 target，<span style="color:red;font-weight:bold">并且 nums[k] >= 0</span>（<span style="color:red;font-weight:bold">需要考虑负数</span>的情况，负数相加只会更小），说明后面的数相加后的结果不可能为 0
- **第二层**循环
  - **固定了 k 和 i**，需要 k 和 j 后面的数分析，即双指针控制的两个数字
  - 同理需要**考虑负数**，即 <span style="color:red;font-weight:bold">nums[k] + nums[i] > target && nums[k] + nums[i] >= 0</span>

### （2）题解

```java
public class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {

        List<List<Integer>> result = new ArrayList<>();  // 结果集

        // 首先对数组排序
        Arrays.sort(nums);

        // 第一重循环，控制 k
        for (int k = 0; k < nums.length; k++) {
            // 剪枝：去掉不必要的计算
            if (nums[k] > target && nums[k] >= 0) {
                break;
            }
            // 对 k 去重
            if (k > 0 && nums[k] == nums[k - 1]) {
                continue;
            }

            // 第二种循环，控制 i
            for (int i = k + 1; i < nums.length; i++) {
                // 剪枝：去掉不必要的计算
                if (nums[k] + nums[i] > target && nums[k] + nums[i] >= 0) {
                    break;
                }
                // 去重
                if (i > k + 1 && nums[i] == nums[i - 1]) {
                    continue;
                }

                // 双指针操作
                int left = i + 1;
                int right = nums.length - 1;

                while (left < right) {
                    int sum = nums[k] + nums[i] + nums[left] + nums[right];
                    if (sum > target) {
                        right--;
                    } else if (sum < target) {
                        left++;
                    } else {
                        result.add(Arrays.asList(nums[k], nums[i], nums[left], nums[right]));
                        // c、d 去重
                        while (left < right && nums[left] == nums[left + 1]) {
                            left++;
                        }
                        while (left < right && nums[right] == nums[right - 1]) {
                            right--;
                        }

                        // 移动指针，寻找下一个符合条件的四元组
                        left++;
                        right--;
                    }
                }
            }
        }
        return result;
    }
}
```

## 阶段三结束：哈希表总结

文章链接：https://programmercarl.com/%E5%93%88%E5%B8%8C%E8%A1%A8%E6%80%BB%E7%BB%93.html

#### > 内容较多，直接看文章即可，总结的很到位
