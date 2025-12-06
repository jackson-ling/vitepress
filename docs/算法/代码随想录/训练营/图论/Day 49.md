---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 49</h1>

---

## prim 算法

题目链接：https://kamacoder.com/problempage.php?pid=1053

文章讲解：https://www.programmercarl.com/kamacoder/0053.%E5%AF%BB%E5%AE%9D-prim.html

视频讲解：https://www.bilibili.com/video/BV1gFKVzpExq

### 思路分析

#### （1）什么是最小生成树？

> #### 用边把所有节点连接起来（无向图），要求边数最少，边的权值和最小

#### （2）Prim 算法模板思路（从点的角度出发去找边）

> #### 第一步：选距离生成树最近节点
>
> #### 第二步：最近节点加入生成树
>
> #### 第三步：更新非生成树节点到生成树（刚加入的最近节点）的距离（即更新 minDist 数组），minDist 数组用来记录每一个非生成树节点距离最小生成树的最近距离，其实也是最小生成树的<span style="color:red">边的权值</span>

#### （3）适用场景

> #### 稠密图，点少边多，遍历点的次数少，效率高

### 题解

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 顶点数
        int v = scanner.nextInt();
        // 边数
        int e = scanner.nextInt();

        /*
            1. 初始化邻接矩阵（顶点编号从 1 开始）
            2. 初始默认顶点间都没有连接，顶点间距离设为一个较大值
         */
        int[][] grid = new int[v + 1][v + 1];
        for (int i = 0; i <= v; i++) {
            Arrays.fill(grid[i], 10001);
        }

        // 读取边的信息并填充邻接矩阵
        for (int i = 0; i < e; i++) {
            int x = scanner.nextInt();
            int y = scanner.nextInt();
            int k = scanner.nextInt();
            grid[x][y] = k;
            grid[y][x] = k;
        }

        // 记录所有节点到最小生成树的距离
        int[] minDist = new int[v + 1];
        Arrays.fill(minDist, 10001);

        // 记录节点是否在生成树中
        boolean[] isInTree = new boolean[v + 1];

        // Prim 算法主循环，n 个节点至少有 n - 1 条边
        for (int i = 1; i < v; i++) {
            int cur = -1;
            int minVal = Integer.MAX_VALUE;

            // 步骤一：寻找距离生成树最近的节点
            for (int j = 1; j <= v; j++) {
                if (!isInTree[j] && minDist[j] < minVal) {
                    // 更新最短距离，并记录该节点
                    minVal = minDist[j];
                    cur = j;
                }
            }

            // 步骤二：将当前节点加入生成树
            isInTree[cur] = true;

            // 步骤三：更新非生成树节点到生成树的距离（新加入生成树的节点）
            for (int j = 1; j <= v; j++) {
                if (!isInTree[j] && grid[cur][j] < minDist[j]){
                    minDist[j] = grid[cur][j];
                }
            }
        }

        // 统计结果
        int result = 0;
        // 0 号位置的节点忽略，1 号位置的节点默认加入生成树
        for (int i = 2; i <= v; i++){
            result += minDist[i];
        }
        System.out.println(result);
    }
}
```

### ⭐ 拓展

#### 输出最小生成树中的每一条边

> #### 定义一个一维数组，parent[节点编号] = 节点编号，以这样的形式来记录一条边
>
> #### 什么时候记录边？既然 minDist 数组记录了最小生成树的边，是不是就是在更新 minDist 数组的时候，去更新 parent 数组来记录一下对应的边呢

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // 顶点数
        int v = scanner.nextInt();
        // 边数
        int e = scanner.nextInt();

        /*
            1. 初始化邻接矩阵（顶点编号从 1 开始）
            2. 初始默认顶点间都没有连接，顶点间距离设为一个较大值
         */
        int[][] grid = new int[v + 1][v + 1];
        for (int i = 0; i <= v; i++) {
            Arrays.fill(grid[i], 10001);
        }

        // 读取边的信息并填充邻接矩阵
        for (int i = 0; i < e; i++) {
            int x = scanner.nextInt();
            int y = scanner.nextInt();
            int k = scanner.nextInt();
            grid[x][y] = k;
            grid[y][x] = k;
        }

        // 记录所有节点到最小生成树的距离
        int[] minDist = new int[v + 1];
        Arrays.fill(minDist, 10001);

        // 记录节点是否在生成树中
        boolean[] isInTree = new boolean[v + 1];

        // 记录生成树中的边
        int[] parent = new int[v + 1];

        // Prim 算法主循环，n 个节点至少有 n - 1 条边
        for (int i = 1; i < v; i++) {
            int cur = -1;
            int minVal = Integer.MAX_VALUE;

            // 步骤一：寻找距离生成树最近的节点
            for (int j = 1; j <= v; j++) {
                if (!isInTree[j] && minDist[j] < minVal) {
                    // 更新最短距离，并记录该节点
                    minVal = minDist[j];
                    cur = j;
                }
            }

            // 步骤二：将当前节点加入生成树
            isInTree[cur] = true;

            // 步骤三：更新非生成树节点到生成树的距离（新加入生成树的节点）
            for (int j = 1; j <= v; j++) {
                if (!isInTree[j] && grid[cur][j] < minDist[j]){
                    minDist[j] = grid[cur][j];

                    // 记录生成树中的每条边
                    parent[j] = cur;
                }
            }
        }

        // 统计结果
        int result = 0;
        // 0 号位置的节点忽略，1 号位置的节点默认加入生成树
        for (int i = 2; i <= v; i++){
            result += minDist[i];
        }
        System.out.println(result);

        for (int i = 2; i <= v; i++) {
            System.out.println(i + " - " + parent[i] + " : " + minDist[i]);
        }
    }
}
```

## kruskal 算法

题目链接：https://kamacoder.com/problempage.php?pid=1053

文章讲解：https://www.programmercarl.com/kamacoder/0053.%E5%AF%BB%E5%AE%9D-Kruskal.html

视频讲解：https://www.bilibili.com/video/BV1GD3uz8EY4

### 思路分析

#### （1）kruskal 算法模板思路（从边的角度出发去找点）

> #### 第一步：对所有边按照权值从小到大排序，因为要优先选最小的边加入到生成树里（贪心思想）
>
> #### 第二步：遍历排序后的边（并查集思路处理）
>
> #### 1. 如果边首尾的两个节点在同一个集合，说明如果连上这条边图中会出现环，不做处理
>
> #### 2. 如果边首尾的两个节点不在同一个集合，加入到最小生成树，并把两个节点加入同一个集合

#### （2）适用场景

> #### 稀疏图，点多边少，遍历边的次数少，效率高

### 题解

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    private static int n = 10001;
    private static int[] father = new int[n];

    // 并查集初始化
    public static void init() {
        for (int i = 0; i < n; i++) {
            father[i] = i;
        }
    }

    // 并查集的查找操作
    public static int find(int u) {
        if (u == father[u]) {
            return u;
        }
        return father[u] = find(father[u]);
    }

    // 并查集的加入集合
    public static void join(int u, int v) {
        u = find(u);
        v = find(v);
        if (u == v) {
            return;
        }
        father[v] = u;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int v = scanner.nextInt();
        int e = scanner.nextInt();
        List<Edge> edges = new ArrayList<>();
        int result_val = 0;

        for (int i = 0; i < e; i++) {
            int v1 = scanner.nextInt();
            int v2 = scanner.nextInt();
            int val = scanner.nextInt();
            edges.add(new Edge(v1, v2, val));
        }

        // 步骤一：所有边按权值从小到大排序
        edges.sort((edge1, edge2) -> edge1.val - edge2.val);

        // 步骤二：初始化并查集，遍历所有边，检查两个节点是否在同一个集合中
        init();

        for (Edge edge : edges) {
            int x = find(edge.l);
            int y = find(edge.r);

            if (x != y) {
                result_val += edge.val;
                join(x, y);
            }
        }
        System.out.println(result_val);
    }
}

class Edge {
    int l, r, val;

    Edge(int l, int r, int val) {
        this.l = l;
        this.r = r;
        this.val = val;
    }
}
```

### ⭐ 拓展

#### 输出最小生成树中的每一条边

> #### 定义一个集合用于存储生成树中的边，如果符合条件，就把这条边加入到集合中

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class kamacoder_53_2 {
    private static int n = 10001;
    private static int[] father = new int[n];

    // 并查集初始化
    public static void init() {
        for (int i = 0; i < n; i++) {
            father[i] = i;
        }
    }

    // 并查集的查找操作
    public static int find(int u) {
        if (u == father[u]) {
            return u;
        }
        return father[u] = find(father[u]);
    }

    // 并查集的加入集合
    public static void join(int u, int v) {
        u = find(u);
        v = find(v);
        if (u == v) {
            return;
        }
        father[v] = u;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int v = scanner.nextInt();
        int e = scanner.nextInt();
        List<Edge> edges = new ArrayList<>();
        int result_val = 0;

        for (int i = 0; i < e; i++) {
            int v1 = scanner.nextInt();
            int v2 = scanner.nextInt();
            int val = scanner.nextInt();
            edges.add(new Edge(v1, v2, val));
        }

        // 记录最小生成树中的边
        List<Edge> result = new ArrayList<>();

        // 步骤一：所有边按权值从小到大排序
        edges.sort((edge1, edge2) -> edge1.val - edge2.val);

        // 步骤二：初始化并查集，遍历所有边，检查两个节点是否在同一个集合中
        init();

        for (Edge edge : edges) {
            int x = find(edge.l);
            int y = find(edge.r);

            if (x != y) {
                // 记录边
                result.add(edge);
                result_val += edge.val;
                join(x, y);
            }
        }
        System.out.println(result_val);

        for (Edge edge : result) {
            System.out.println(edge.l + " - " + edge.r + " : " + edge.val);
        }
    }
}

class Edge {
    int l, r, val;

    Edge(int l, int r, int val) {
        this.l = l;
        this.r = r;
        this.val = val;
    }
}
```
