---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 8</h1>

---

## 151.翻转字符串里的单词

建议：这道题目基本把 刚刚做过的字符串操作 都覆盖了，不过就算知道解题思路，本题代码并不容易写，要多练一练。

题目链接：https://leetcode.cn/problems/reverse-words-in-a-string/

文章链接：https://programmercarl.com/0151.%E7%BF%BB%E8%BD%AC%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%87%8C%E7%9A%84%E5%8D%95%E8%AF%8D.html

视频讲解：https://www.bilibili.com/video/BV1uT41177fX

### （1）思路分析

本题的<span style = "color:red;font-weight:bold">难点在于如何去除空格</span>，整体思路不难，去除**多余的空格**后，翻转整个字符串，再翻转每个单词

### （2）题解

```java
public class Solution {
    /*
        1. 先去除多余的空格，保持每个单词之间有一个空格
        2. 翻转整个字符串
        3. 翻转每个单词
     */
    public String reverseWords(String s) {
        // 转成数组
        char[] chars = s.toCharArray();
        // 去除多余的空格
        chars = removeExtraSpaces(chars);
        // 翻转整个字符串
        reverse(chars,0, chars.length -1);
        // 翻转每个单词
        reverseEachWord(chars);
        // 返回字符串
        return new String(chars);
    }

    // 删除元素（空格），可以用双指针
    public char[] removeExtraSpaces(char[] s) {
        int slow = 0;
        for (int fast = 0; fast < s.length; fast++) {
            // fast 去除多余的空格
            if (s[fast] != ' ') {
                // 为每个单词之间添加一个空格（第一个单词不用）
                if (slow != 0) {
                    s[slow] = ' ';
                    slow++;
                }
                // 调整每个单词的位置，每个单词的末尾都会有一个空格
                while (fast < s.length && s[fast] != ' ') {
                    s[slow] = s[fast];
                    slow++;
                    fast++;
                }
            }
        }
        // 位置调整完成，但是多余的空格会占位置，返回一个新的字符串
        char[] newChars = new char[slow];
        System.arraycopy(s, 0, newChars, 0, slow);
        return newChars;
    }

    // 翻转字符串
    public void reverse(char[] s, int left, int right) {
        // 边界判断
        if (right >= s.length) {
            return;
        }
        // 相撞指针，开始移动并翻转元素
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }

    // 翻转单词
    public void reverseEachWord(char[] s) {
        int start = 0;
        // 让 end 始终指向单词的末尾，这样可以根据空格来判断是否遍历了一个单词
        for (int end = 0; end <= s.length; end++) {
            if (end == s.length || s[end] == ' ') {
                reverse(s, start, end - 1);
                start = end + 1; // end 指向的是空格，下一个位置就是新单词的首字母
            }
        }
    }
}
```

### （3）总结

#### 单词反转的套路：<span style = "color:red;font-weight:bold;font-size:25px">整体反转 + 局部反转</span>

## 卡码网：55.右旋转字符串

建议：题解中的解法如果没接触过的话，应该会想不到

题目链接：https://kamacoder.com/problempage.php?pid=1065

文章链接：https://programmercarl.com/kamacoder/0055.%E5%8F%B3%E6%97%8B%E5%AD%97%E7%AC%A6%E4%B8%B2.html

本题没有视频讲解

### （1）思路分析

本题可以利用单词反转的套路，<span style = "color:red;font-weight:bold;font-size:25px">整体反转 + 局部反转</span>

### （2）代码示例

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine());
        String str = scanner.nextLine();

        int len = str.length();  //获取字符串长度
        char[] s = str.toCharArray();

        // 翻转整个字符串
        reverseString(s,0,len -1);
        // 翻转前半部分
        reverseString(s,0,n - 1);
        // 翻转后半部分
        reverseString(s,n,len - 1);

        System.out.println(s);
    }

    public static void reverseString(char[] s, int left, int right) {
        // 边界判断
        if (right >= s.length) {
            return;
        }
        // 相撞指针，开始移动并翻转元素
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}
```

## 28. 实现 strStr() （本题可以跳过）

因为 KMP 算法很难，大家别奢求 一次就把 kmp 全理解了，大家刚学 KMP 一定会有各种各样的疑问，先留着，别期望立刻啃明白，第一遍了解大概思路，二刷的时候，再看 KMP 会 好懂很多。

或者说大家可以放弃一刷可以不看 KMP，今天来回顾一下之前的算法题目就可以。

因为大家 算法能力还没到，细扣 很难的算法，会把自己绕进去，就算别人给解释，只会激发出更多的问题和疑惑。所以大家先了解大体过程，知道这么回事， 等自己有 算法基础和思维了，在看多看几遍视频，慢慢就理解了。

题目链接：https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/

文章链接：https://programmercarl.com/0028.%E5%AE%9E%E7%8E%B0strStr.html

视频链接（KMP 理论篇）：https://www.bilibili.com/video/BV1PD4y1o7nd

视频讲解（KMP 代码篇）：https://www.bilibili.com/video/BV1M5411j7Xx

### （1）思路分析

本题就是 KMP 算法的经典题目，**具体详解可以查看看本站：算法-->算法集锦中的 KMP 部分的笔记配合着理解，绝对是醍醐灌顶的存在**

### （2）题解

```java
public class Solution {
    // KMP 算法，返回模式串在文本串中匹配的其实位置下标
    public int strStr(String haystack, String needle) {
        /*
            1. haystack：文本串，指针：i
            2. needle：模式串，指针：j // 表示的是已经匹配字符的个数
         */

        // 处理模式串长度为 0 的特殊情况
        if (needle.length() == 0) {
            return 0;
        }

        // 计算最长公共前后缀的对象应该是模式串，首先计算模式串的next数组
        int[] next = new int[needle.length()];
        getNext(next, needle);

        // 现在就可以根据next数组进行回退了。开始 KMP 算法的匹配
        /*
            KMP 算法中的 j 的含义
            1. 本质含义：表示的是已经匹配字符的个数
            2. 下标的角色：因为起始是 0，正好是下标的作用场景
         */
        int j = 0;
        for (int i = 0; i < haystack.length(); i++) {
            // 失配情况（因为是 j - 1，为了方式数组下标越界，需要用 j > 0 这个条件约束）
            while (j > 0 && needle.charAt(j) != haystack.charAt(i)) {
                j = next[j - 1];
            }
            // 匹配，j 指针和 i 指针同时后移，继续往后匹配
            if(needle.charAt(j) == haystack.charAt(i)){
                j++;
            }
            // 如果模式串指着 j 走到了末尾，说明匹配成功，返回匹配的起始位置下标索引
            /*
                needle.length() - 1：模式串的末尾元素的下标索引
                start_index = i - (needle.length() - 1)
                            = i - needle.length() + 1
             */
            if(j == needle.length()){
                return i - needle.length() + 1;
            }
        }

        // 模式串不是文本串的一部分
        return -1;
    }


    // next 数组
    public void getNext(int[] next, String s) {
        int j = 0;
        next[0] = 0;
        for (int i = 1; i < s.length(); i++) {
            // 失配，指针回溯
            while (j > 0 && s.charAt(j) != s.charAt(i)) {
                j = next[j - 1]; // 使用前缀表作为next数组，需要找前一位
            }
            // 匹配，更新最长公共前后缀的长度
            if (s.charAt(j) == s.charAt(i)) {
                /*
                    1. j 代表 i 之前（包括 i）的最长公共前后缀
                    2. 因为 j 是 next 数组指针，指向next数组下标对应的值就是最长公共前后缀长度
                 */
                j++;
            }
            // 更新 next 数组
            next[i] = j;
        }
    }
}
```

## 459.重复的子字符串 （本题可以跳过）

本题算是 KMP 算法的一个应用，不过 对 KMP 了解不够熟练的话，理解本题就难很多。
我的建议是 KMP 和本题，一刷的时候 ，可以适当放过，了解怎么回事就行，二刷的时候再来硬啃

题目链接：https://leetcode.cn/problems/repeated-substring-pattern/description/

文章链接：https://programmercarl.com/0459.%E9%87%8D%E5%A4%8D%E7%9A%84%E5%AD%90%E5%AD%97%E7%AC%A6%E4%B8%B2.html

视频讲解：https://www.bilibili.com/video/BV1cg41127fw

### （1）思路分析

本题是 KMP 短发的拓展，同时也引出了<span style = "color:red;font-weight:bold;font-size:25px">最小重复子串</span>

**具体详解可以查看看本站：算法-->算法集锦中的笔记**

### （2）题解

```java
class Solution {
    public boolean repeatedSubstringPattern(String s) {
        // 获取字符串的长度
        int n = s.length();

        // Step 1.构建 next 数组（直接使用前缀表）
        int[] next = new int[n]; // 前缀表的值表示以该位置结尾的字符串的最长相等前后缀的长度
        int j = 0;
        next[0] = 0;
        for (int i = 1; i < n; i++) {
            while (j > 0 && s.charAt(i) != s.charAt(j)) // 只要前缀后缀还不一致，就根据前缀表回退j直到起点为止
                j = next[j - 1];
            if (s.charAt(i) == s.charAt(j))
                j++;
            next[i] = j;
        }

        // Step 2.判断重复子字符串

        /* 判断条件
            1. 有公共前后缀
            2. 字符串s的长度可以被其最长相等前后缀不包含的子串的长度整除时
            3. next[n - 1] 就是最长公共前后缀
        */
        if (next[n - 1] > 0 && n % (n - next[n - 1]) == 0) {
            return true; // 不包含的子串就是s的最小重复子串
        } else {
            return false;
        }
    }
}
```

## 阶段四结束：字符串总结

题目链接/文章讲解：https://programmercarl.com/%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%80%BB%E7%BB%93.html

双指针回顾

此时我们已经做过 10 道双指针的题目了，来一起回顾一下，大家自己也总结一下双指针的心得

文章讲解：https://programmercarl.com/%E5%8F%8C%E6%8C%87%E9%92%88%E6%80%BB%E7%BB%93.html

<h3>字符串章节中主要是以下两种问题</h3>

> #### 类型一：双指针操作
>
> #### 类型二：KMP
>
> - 字符串匹配问题
> - KMP 的拓展应用：最小重复字串问题
