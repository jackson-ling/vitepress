---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 51</h1>

---

今天的建议依然是，一刷的时候，能了解原理，照着代码随想录能抄下来代码就好，就算达标。
二刷的时候自己尝试独立去写，三刷的时候才能有一定深度理解各个最短路算法。

## dijkstra（堆优化版）

题目链接：https://kamacoder.com/problempage.php?pid=1047

文章讲解：https://www.programmercarl.com/kamacoder/0047.%E5%8F%82%E4%BC%9Adijkstra%E5%A0%86.html

视频讲解：https://www.bilibili.com/video/BV1HigNz8Emt

### 思路分析

#### 图的存储

> #### （1）邻接矩阵：使用于<span style="color: red;">稠密</span>图，点少<span style="color: red;">边多</span>
>
> #### （2）邻接表：使用于<span style="color: red;">稀疏</span>图，<span style="color: red;">点多</span>边少

#### 优化后的存储结构

<img src="https://file1.kamacoder.com/i/algo/20240223103904.png"/>

#### 优化点

> #### （1）采用<span style="color: red;">小顶堆</span>，不需要遍历所有节点以找到距离当前节点最近的节点，直接取堆顶元素即可
>
> #### （2）采用<span style="color: red;">邻接表存储</span>，不需要遍历所有节点以明确哪些节点之间是相连的

### 题解

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();

        List<List<Edge>> grid = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            grid.add(new ArrayList<>());
        }

        for (int i = 0; i < m; i++) {
            int p1 = scanner.nextInt();
            int p2 = scanner.nextInt();
            int val = scanner.nextInt();
            grid.get(p1).add(new Edge(p2, val));
        }

        int start = 1;  // 起点
        int end = n;    // 终点

        // 存储从源点到每个节点的最短距离
        int[] minDist = new int[n + 1];
        Arrays.fill(minDist, Integer.MAX_VALUE);

        // 记录顶点是否被访问过
        boolean[] visited = new boolean[n + 1];

        // 优先队列（底层默认用小顶堆实现）存放 Pair<节点，源点到该节点的权值>
        PriorityQueue<Pair<Integer, Integer>> pq = new PriorityQueue<>(new MyComparison());

        pq.add(new Pair<>(start, 0));

        minDist[start] = 0;

        while (!pq.isEmpty()) {
            // 步骤一：从未被访问的节点中选取离源点最近的节点
            Pair<Integer, Integer> cur = pq.poll();

            // 步骤二：标记该节点被访问过
            visited[cur.first] = true;

            // 步骤三：更新未被访问节点到源点的距离
            for (Edge edge : grid.get(cur.first)) {
                if (!visited[edge.to] && minDist[cur.first] + edge.val < minDist[edge.to]) {
                    minDist[edge.to] = minDist[cur.first] + edge.val;
                    pq.add(new Pair<>(edge.to, minDist[edge.to]));
                }
            }
        }

        // 源点无法到达终点
        if (minDist[end] == Integer.MAX_VALUE){
            System.out.println(-1);
        }else {
            System.out.println(minDist[end]);
        }
    }
}

class Edge {
    // 邻接顶点
    int to;
    // 边的权值
    int val;

    public Edge(int to, int val) {
        this.to = to;
        this.val = val;
    }
}

class Pair<K, V> {
    // 节点
    public final K first;
    // 源点到该节点的距离
    public final V second;

    public Pair(K first, V second) {
        this.first = first;
        this.second = second;
    }
}

class MyComparison implements Comparator<Pair<Integer, Integer>> {
    // 按照节点到到源点的距离从小到大排序
    @Override
    public int compare(Pair<Integer, Integer> o1, Pair<Integer, Integer> o2) {
        return Integer.compare(o1.second, o2.second);
    }
}
```

## Bellman_ford 算法

题目链接：https://kamacoder.com/problempage.php?pid=1152

文章讲解：https://www.programmercarl.com/kamacoder/0094.%E5%9F%8E%E5%B8%82%E9%97%B4%E8%B4%A7%E7%89%A9%E8%BF%90%E8%BE%93I.html

视频讲解：https://www.bilibili.com/video/BV1t48JzhEmi

### 思路分析

#### 应用场景

> #### 当边的权值出现负数的时候，需要使用 Bellman_ford 算法，Djikstra 算法无法解决负数问题，具体元婴参考 https://www.programmercarl.com/kamacoder/0047.%E5%8F%82%E4%BC%9Adijkstra%E6%9C%B4%E7%B4%A0.html

#### 什么是松弛？

#### （1）松弛

> #### 若有某条边的加入可以使得源点到该点的距离更短，则更新最短路距离，这个过程叫做松弛

```java
if (minDist[B] > minDist[A] + value) {
    minDist[B] = minDist[A] + value
}
```

#### （2）需要松弛 n -1 次

> #### 松弛一次可以求得与源点以一条边相连的节点的最短路径，n 个节点有 n - 1 条边，则松弛 n - 1 次可以求得所有节点与源点的最短距离（包括源点到终点的最短距离，即源点通过 n-1 条边相连的节点）

### 题解

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class Main {
    static class Edge {
        int from;
        int to;
        int val;

        public Edge(int from, int to, int val) {
            this.from = from;
            this.to = to;
            this.val = val;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        List<Edge> edges = new ArrayList<>();

        for (int i = 0; i < m; i++) {
            int from = scanner.nextInt();
            int to = scanner.nextInt();
            int val = scanner.nextInt();
            edges.add(new Edge(from, to, val));
        }

        int[] minDist = new int[n + 1];
        Arrays.fill(minDist, Integer.MAX_VALUE);
        // 源点到自身的距离为 0
        minDist[1] = 0;

        // 松弛 n - 1 次
        for (int i = 1; i < n; i++) {
            for (Edge edge : edges) {
                if (minDist[edge.from] != Integer.MAX_VALUE
                        && minDist[edge.from] + edge.val < minDist[edge.to]) {
                    minDist[edge.to] = minDist[edge.from] + edge.val;
                }
            }
        }

        if (minDist[n] == Integer.MAX_VALUE) {
            System.out.println("unconnected");
        } else {
            System.out.println(minDist[n]);
        }
    }
}
```
