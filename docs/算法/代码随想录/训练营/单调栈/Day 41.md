---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 41</h1>

---

## 739. 每日温度

今天正式开始单调栈，这是单调栈一篇扫盲题目，也是经典题。

大家可以读题，思考暴力的解法，然后在看单调栈的解法。 就能感受出单调栈的巧妙

题目链接：https://leetcode.cn/problems/daily-temperatures

文章讲解：https://programmercarl.com/0739.%E6%AF%8F%E6%97%A5%E6%B8%A9%E5%BA%A6.html

视频讲解：https://www.bilibili.com/video/BV1my4y1Z7jj

### 思路分析

> #### 单调栈的本质是空间换时间，因为在遍历的过程中需要用一个栈来记录右边第一个比当前元素高的元素，优点是整个数组只需要遍历一次
>
> #### 更直白来说，就是用一个栈来记录我们遍历过的元素，因为我们遍历数组的时候，我们不知道之前都遍历了哪些元素，以至于遍历一个元素找不到是不是之前遍历过一个更小的，所以我们需要用一个容器（这里用单调栈）来记录我们遍历过的元素
>
> #### 单调栈里只需要存放元素的下标 i 就可以了，如果需要使用对应的元素，直接 T[i] 就可以获取

#### 三种情况

> #### 当前遍历的元素 T[i]小于栈顶元素 T[st.top()]的情况
>
> #### 当前遍历的元素 T[i]等于栈顶元素 T[st.top()]的情况
>
> #### 当前遍历的元素 T[i]大于栈顶元素 T[st.top()]的情况

### 题解

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int lens = temperatures.length;
        int[] res = new int[lens];
        // 单调栈钟存储数组的下标
        Deque<Integer> stack = new LinkedList<>();
        stack.push(0);

        for (int i = 1; i < lens; i ++){
            if (temperatures[i] <= temperatures[stack.peek()]){
                stack.push(i);
            }else {
                while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]){
                    res[stack.peek()] = i - stack.peek();
                    stack.pop();
                }
                stack.push(i);
            }
        }
        return res;
    }
}
```

## 496.下一个更大元素 I

本题和 739. 每日温度 看似差不多，其实 有加了点难度。

题目链接：https://leetcode.cn/problems/next-greater-element-i

文章讲解：https://programmercarl.com/0496.%E4%B8%8B%E4%B8%80%E4%B8%AA%E6%9B%B4%E5%A4%A7%E5%85%83%E7%B4%A0I.html

视频讲解：https://www.bilibili.com/video/BV1jA411m7dX

### 思路分析

> #### 还是利用单调栈的思路，唯一的区别就是在 nums2 中找 nums1 的元素，可以用 map 来存储

### 题解

```java
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Stack<Integer> temp = new Stack<>();
        int[] res = new int[nums1.length];
        Arrays.fill(res, -1);
        HashMap<Integer, Integer> hashMap = new HashMap<>();
        for (int i = 0; i < nums1.length; i++) {
            hashMap.put(nums1[i], i);
        }
        temp.push(0);
        for (int i = 1; i < nums2.length; i++) {
            if (nums2[i] <= nums2[temp.peek()]) {
                temp.add(i);
            } else {
                while (!temp.isEmpty() && nums2[i] > nums2[temp.peek()]) {
                    if (hashMap.containsKey(nums2[temp.peek()])) {
                        Integer index = hashMap.get(nums2[temp.peek()]);
                        res[index] = nums2[i];
                    }
                    temp.pop();
                }
                temp.push(i);
            }
        }
        return res;
    }
}
```

## 503.下一个更大元素 II

这道题和 739. 每日温度 几乎如出一辙，可以自己尝试做一做

题目链接：https://leetcode.cn/problems/next-greater-element-ii

文章讲解：https://programmercarl.com/0503.%E4%B8%8B%E4%B8%80%E4%B8%AA%E6%9B%B4%E5%A4%A7%E5%85%83%E7%B4%A0II.html

视频讲解：https://www.bilibili.com/video/BV15y4y1o7Dw

### 思路分析

> #### 本题转为环状的场景，可以通过<span style="color:red">取模</span>的操作<span style="color:red">模拟转圈</span>的过程

### 题解

```java
class Solution {
    public int[] nextGreaterElements(int[] nums) {
        if (nums == null || nums.length <= 1) {
            return new int[] { -1 };
        }
        int size = nums.length;
        int[] result = new int[size];
        Arrays.fill(result, -1);
        Stack<Integer> st = new Stack<>();
        st.push(0);
        for (int i = 1; i < nums.length * 2; i++) {
            if (nums[i % nums.length] <= nums[st.peek()]) {
                st.push(i % nums.length);
            } else {
                while (!st.isEmpty() && nums[i % nums.length] > nums[st.peek()]) {
                    result[st.peek()] = nums[i % nums.length];
                    st.pop();
                }
                st.push(i % nums.length);
            }
        }
        return result;
    }
}
```
