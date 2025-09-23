---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 5</h1>

---

## ⭐ 哈希表理论基础

建议：了解哈希表的内部实现原理，哈希函数，哈希碰撞，以及常见哈希表的区别，数组，set 和 map

文章链接：https://programmercarl.com/%E5%93%88%E5%B8%8C%E8%A1%A8%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html

#### 说明：哈希算法思想比较的新颖也比较巧，可以重点看看文章链接的讲解，理解该思想的运用

### （1）应用场景

**遇到需要<span style="color:red;font-weight:bold">判断一个元素是否出现过</span>的场景也应该第一时间想到哈希法！**

### （2）哈希结构

- **数组**
- **set**
- **map**

### （3）哈希碰撞

- **拉链法**
- **线性探测法**

### （4）常见思路

- 有对象 A 和对象 B，先对对象 A <span style="color:red;font-weight:bold">构造</span> hash，之后在 hash 中<span style="color:red;font-weight:bold">查找</span>是否有对象 B 的元素，这就是 hash 的妙用

- 当然本质还是查找的过程，也可能是两个对象都构造 hash，然后对 hash 遍历查找
- **经典应用场景**：题目中出现了<span style="color:red;font-weight:bold">不能重复</span>类似的字眼，常见的作法就是<span style="color:red;font-weight:bold">把元素丢到集合里，查找是否重复出现过</span>

## 242.有效的字母异位词

题目链接：https://leetcode.cn/problems/valid-anagram/description/

文章链接：https://programmercarl.com/0242.%E6%9C%89%E6%95%88%E7%9A%84%E5%AD%97%E6%AF%8D%E5%BC%82%E4%BD%8D%E8%AF%8D.html

视频讲解：https://www.bilibili.com/video/BV1YG411p7BA

### （1）思路分析

1. 题意理解：本题就是判断两个字符串是否由相同的字母组成，即需要统计字符出现的频率，换个角度看，即**判断一个字符在另一个字符串中是否出现过，立即想到哈希法**
2. 本题的两个**核心**
   - 通过 ASCLL 码值的差值来确定字符对应的下标索引
   - 对第一个字符串的字符频率在 hash 表中对应的字符位置自增，对另一个字符串的字符频率在 hash 表中对应的字符位置自减，<span style="color:red;font-weight:bold">通过差值是否为 0 判断字符出现的频率是否相同</span>，即两个字串是否是**有效的字母异位词**

### （2）题解一

```java
public class Solution {
    public boolean isAnagram(String s, String t) {
        // 为了遍历字符串的内容，先转为数组
        char[] s_ = s.toCharArray();
        char[] t_ = t.toCharArray();

        // 使用哈希表映射，通过映射关系计算频率
        int[] hash = new int[26];

        // 统计 s 字母的频率
        for (int i = 0; i < s_.length; i++) {
            hash[s_[i] - 'a']++;
        }

        // 遍历 t 串，如果由相同的字符组成，则 hash 值不会出现负数
        for (int i = 0; i < t_.length; i++) {
            hash[t_[i] - 'a']--;
        }

        // 遍历 hash 表，看是否存在负数
        for (int i = 0; i < hash.length; i++) {
            if (hash[i] != 0) {
                return false;
            }
        }
        return true;
    }
}
```

提示：当然也可以用字符串的方法 charAt()来获取字符（**目的是为了计算 ASCLL 码值的差值来确定字符在 hash 表中对应的下标索引**），下面给出另一种题解

### （3）题解二

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        int[] record = new int[26];

        for (int i = 0; i < s.length(); i++) {
             // 并不需要记住字符a的ASCII，只要求出一个相对数值就可以了
            record[s.charAt(i) - 'a']++;
        }

        for (int i = 0; i < t.length(); i++) {
            record[t.charAt(i) - 'a']--;
        }

        for (int count: record) {
            // record数组如果有的元素不为零0，说明字符串s和t 一定是谁多了字符或者谁少了字符。
            if (count != 0) {
                return false;
            }
        }
        // record数组所有元素都为零0，说明字符串s和t是字母异位词
        return true;
    }
}
```

## 349. 两个数组的交集

题目链接：https://leetcode.cn/problems/intersection-of-two-arrays/

文章链接：https://programmercarl.com/0349.%E4%B8%A4%E4%B8%AA%E6%95%B0%E7%BB%84%E7%9A%84%E4%BA%A4%E9%9B%86.html

视频讲解：https://www.bilibili.com/video/BV1ba411S7wu

### （1）思路分析

- 求交集，本质就是在另一个数组中查找一个元素是否出现过，仍然可以用哈希
- 值得注意的是：最终结果的集合应该是**去重**的，可以考虑使用 **set**，根据力扣提供的测试数据来看，**数据量不是很大**，使用**数组**也是可以实现的

### （2）题解：set

```java
import java.util.HashSet;
import java.util.Set;

public class Solution2 {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        Set<Integer> res = new HashSet<>();
        // 遍历数组一，添加到集合中
        for (int i : nums1) {
            set1.add(i);
        }
        // 遍历数组二，查找，把交集添加到 res 中
        for (int i : nums2) {
            if (set1.contains(i)) {
                res.add(i);
            }
        }

        // 转为数组返回
        int[] result = new int[res.size()];
        int index = 0;
        for (int i : res) {
            result[index] = i;
            index++;
        }
        // 返回结果数组
        return result;
    }
}
```

### （3）题解：数组

```java
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        // 默认初值为 0
        int[] hash1 = new int[1002];
        int[] hash2 = new int[1002];

        // 限制了数据范围是 0 ~ 1000，直接把数值作为hash的下标

        // hash1
        for (int i = 0; i < nums1.length; i++) {
            hash1[nums1[i]]++;
        }

        // hash2
        for (int i = 0; i < nums1.length; i++) {
            hash2[nums2[i]]++;
        }

        List<Integer> relist = new ArrayList<>();
        for (int i = 0; i < 1002; i++) {
            if (hash1[i] > 0 && hash2[i] > 0) {
                relist.add(i); // 题目限制了数据范围，添加的就是数组中的值
            }
        }

        // 把结果转为数组返回
        int[] res = new int[relist.size()];
        int index = 0;

        // 这里只关心集合中的元素，可以使用增强for
        for (int i : relist) { // 表示从 relist 中取出一个元素，直到没有元素可取为止
            res[index] = i;
            index++;
        }
        return res;
    }
}
```

## ⚠️202. 快乐数

题目链接：https://leetcode.cn/problems/happy-number/

文章链接：https://programmercarl.com/0202.%E5%BF%AB%E4%B9%90%E6%95%B0.html

本题没有视频讲解

### （1）思路分析

**本题的<span style="color:red;font-weight:bold">难点在于理解题意</span>，然后和 hash 思想关联起来，这是不好想到的**

- 首先审题，题目说可能出现**无限循环**：意思就是说计算结果中<span style="color:red;font-weight:bold">会出现重复元素</span>
- 既然是重复元素，<span style="color:red;font-weight:bold">那就可以理解为判断一个元素是否出现过</span>，那这正是 hash 思想，由于是**重复**这一条件。可以想到用 **set** 来处理
- 前面介绍了 hash 思想，总的来说就是<span style="color:red;font-weight:bold">构造</span>和<span style="color:red;font-weight:bold">查找</span>的过程
  - **构造**：就循环中的操作
  - **查找**：就是循环的条件
- 关于循环条件的理解
  - **如果说出现了重复元素，循环退出，此时就<span style="color:red;font-weight:bold">不是</span>快乐数了**
  - **如果说是 n == 1 导致了循环退出，此时<span style="color:red;font-weight:bold">是</span>快乐数**

### （2）题解

```java
import java.util.HashSet;
import java.util.Set;

public class Solution {
    public boolean isHappy(int n) {
        Set<Integer> res = new HashSet<>();
        /*
            1. 如果它等于一了，循环退出，是快乐数
            2. 如果出现了重复元素，循环退出了，此时就不是快乐数
         */
        while(n!=1 && !res.contains(n)){
            res.add(n);
            n = getNextNumber(n);
        }
        return n == 1;
    }

    public int getNextNumber(int n) {
        int sum = 0;
        while (n > 0) {
            int temp = n % 10;
            sum += temp * temp;
            n /= 10;
        }
        return sum;
    }

}
```

## ⚠️1. 两数之和

题目链接：https://leetcode.cn/problems/two-sum/

文章链接：https://programmercarl.com/0001.%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C.html#%E7%AE%97%E6%B3%95%E5%85%AC%E5%BC%80%E8%AF%BE

视频讲解：https://www.bilibili.com/video/BV1aT41177mK

### （1）思路分析

本题采用**哈希**处理，首先明确什么时候用哈希：当我们需要<span style="color:red;font-weight:bold">查询一个元素是否出现过，或者一个元素是否在集合里</span>的时候，就要第一时间想到哈希法

#### 本题的四个重点

- 为什么会想到用哈希表
- 哈希表为什么用 map
- 本题 map 是用来存什么的
- map 中的 key 和 value 用来存什么的

#### 为什么可以用哈希？

1. 首先**审题**，注意到题目中的两个点

   - 你可以假设每种输入**只会对应一个答案**，并且你<span style="color:red;font-weight:bold">不能使用两次相同的元素</span>
   - **只会存在一个有效答案**

2. **既然是<span style="color:red;font-weight:bold">不能使用两次相同的元素</span>，变相理解，就是不能重复出现**，<span style="color:red;font-weight:bold">把元素丢到集合里，查找是否重复出现过</span>，**这正是 hash 思想的经典应用场景**

#### 如何找到 target 呢？

1. 首先通过遍历每一个数字，遍历后就记录在集合中，表示已经遍历过了（**这就满足了题目要求：每个元素只能使用一次**），之后在集合中找`target - 当前遍历数` 是否在集合中出现过，如果有就返回它对应的下标，这里就引出了<span style="color:red;font-weight:bold">需要使用 map 集合</span>

   - **key：元素值 value**
   - **value：元素的下标索引 index**

2. 在遍历数组的时候，只需要向 map 去查询是否有和目前遍历元素匹配的数值，如果有，就找到的匹配对，如果没有，就把目前遍历的元素放进 map 中，因为 map 存放的就是我们访问过的元素。

### （2）题解：map

```java
import java.util.HashMap;
import java.util.Map;

public class Solution1 {
    // 使用 hash
    public int[] twoSum(int[] nums, int target) {
        int[] res = new int[2]; // 存放结果下标
        Map<Integer, Integer> map = new HashMap<>();

        // 遍历数组
        for (int i = 0; i < nums.length; i++) {
            int temp = target - nums[i];
            // 判断是否出现过
            if(map.containsKey(temp)){
                res[0] = i;
                res[1] = map.get(temp); // 通过指定键值返回对应的值
                break; // 因为题目说了只会有一个结果
            }
            // 如果没有出现过就放到集合中
            map.put(nums[i],i);
        }
        return res;
    }
}
```

### （3）题解：暴力 for 循环

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[0];
    }
}
```
