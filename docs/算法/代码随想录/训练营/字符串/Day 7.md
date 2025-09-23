---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 7</h1>

---

## 344.反转字符串

建议： 本题是字符串基础题目，就是考察 reverse 函数的实现，同时也明确一下 平时刷题什么时候用 库函数，什么时候 不用库函数

题目链接：https://leetcode.cn/problems/reverse-string/

文章链接：https://programmercarl.com/0344.%E5%8F%8D%E8%BD%AC%E5%AD%97%E7%AC%A6%E4%B8%B2.html

视频讲解：https://www.bilibili.com/video/BV1fV4y17748/

### （1）思路分析

使用相撞指针，由于两个指针是同时移动的，控制一个即可，当指针走到中间的时候退出

### （2）题解一：双指针

```java
public class Solution1 {
    public void reverseString(char[] s) {
        int len = s.length / 2;
        int i = 0;
        int j = s.length - 1;
        while (i < j) {
            char temp = s[i];
            s[i] = s[j];
            s[j] = temp;
            i++;
            j--;
        }
    }
}
```

### （3）题解二：库函数

**注意：时间复杂度高**

```java
class Solution2 {
    public void reverseString(char[] s) {
        String str = new String(s);
        StringBuffer stringBuffer = new StringBuffer(str);
        StringBuffer reverse = stringBuffer.reverse();
        String reverse_str = reverse.toString();
        // 将反转后的字符串再转成字符数组写回原数组
        for (int i = 0; i < s.length; i++) {
            s[i] = reverse_str.charAt(i);
        }
    }
}
```

## 541. 反转字符串 II

建议：本题又进阶了，自己先去独立做一做，然后在看题解，对代码技巧会有很深的体会。

题目链接：https://leetcode.cn/problems/reverse-string-ii/

文章链接：https://programmercarl.com/0541.%E5%8F%8D%E8%BD%AC%E5%AD%97%E7%AC%A6%E4%B8%B2II.html

视频讲解：https://www.bilibili.com/video/BV1dT411j7NN

### （1）思路分析

本题和上一题思路类似，**主要是循环条件的变化和边界判断**

### （2）题解一

```java
class Solution1 {
    public String reverseStr(String s, int k) {
        char[] ch = s.toCharArray();
        // 1. 每隔 2k 个字符的前 k 个字符进行反转
        for (int i = 0; i< ch.length; i += 2 * k) {
            // 2. 剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符
            if (i + k <= ch.length) {
                reverse(ch, i, i + k -1);
                continue;
            }
            // 3. 剩余字符少于 k 个，则将剩余字符全部反转
            reverse(ch, i, ch.length - 1);
        }
        return  new String(ch);

    }
    // 定义翻转函数
    public void reverse(char[] ch, int i, int j) {
        for (; i < j; i++, j--) {
            char temp  = ch[i];
            ch[i] = ch[j];
            ch[j] = temp;
        }
    }
}
```

### （2）题解二

```java
class Solution2 {
    public String reverseStr(String s, int k) {
        int n = s.length();
        char[] ans = s.toCharArray();
        for (int i = 0; i < n; i += 2 * k){
            int start = i;
            /*
                1. 剩余的不够 k 个，i + k - 1 会越界，取字符串长度
                2. 剩余的够 k 个，此时字符串长度更长，取 i + k - 1
             */
            int end = Math.min(n - 1, i + k - 1);
            while (start < end){
                char temp = ans[start];
                ans[start] = ans[end];
                ans[end] = temp;
                start++;
                end--;
            }
        }
        return new String(ans);
    }
}
```

## 卡码网：54.替换数字

建议：对于线性数据结构，填充或者删除，后序处理会高效的多。好好体会一下。

题目链接：https://kamacoder.com/problempage.php?pid=1064

文章链接：https://programmercarl.com/kamacoder/0054.%E6%9B%BF%E6%8D%A2%E6%95%B0%E5%AD%97.html

本题没有视频讲解

### （1）思路分析

**Java**中<span style = "color:red;font-weight:bold">String 的内容是不可变的</span>，所以本题使用<span style = "color:red;font-weight:bold">双指针</span>法，还需要使用**辅助空间**

- 首先统计字符串中的数字（**可以使用字符的 ASCll 码值比较**），进行扩容
- <span style = "color:red;font-weight:bold">从后往前</span>遍历新数组，添加元素

#### 为什么不从前往后？

这样会提高时间复杂度，因为需要移动元素腾出空间给 number

### （2）题解

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int len = s.length();
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) >= 0 && s.charAt(i) <= '9') {
                len += 5;
            }
        }

        char[] ret = new char[len];
        for (int i = 0; i < s.length(); i++) {
            ret[i] = s.charAt(i);
        }
        for (int i = s.length() - 1, j = len - 1; i >= 0; i--) {
            if ('0' <= ret[i] && ret[i] <= '9') {
                ret[j--] = 'r';
                ret[j--] = 'e';
                ret[j--] = 'b';
                ret[j--] = 'm';
                ret[j--] = 'u';
                ret[j--] = 'n';
            } else {
                ret[j--] = ret[i];
            }
        }
        System.out.println(ret);
    }
}
```
