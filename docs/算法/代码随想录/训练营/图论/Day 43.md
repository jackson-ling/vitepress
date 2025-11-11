---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 43</h1>

---

## 图论理论基础

大家可以在看图论理论基础的时候，很多内容 看不懂，例如也不知道 看完之后 还是不知道 邻接矩阵，邻接表怎么用， 别着急。

理论基础大家先对各个概念有个印象就好，后面在刷题的过程中，每个知识点都会得到巩固。

文章讲解：https://www.programmercarl.com/kamacoder/%E5%9B%BE%E8%AE%BA%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html

视频讲解：https://www.bilibili.com/video/BV1hYNBeYEvb

## 深搜理论基础

了解一下深搜的原理和过程

文章讲解：https://www.programmercarl.com/kamacoder/%E5%9B%BE%E8%AE%BA%E6%B7%B1%E6%90%9C%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html

视频讲解：https://www.bilibili.com/video/BV1hFA8eKE6C

### 代码框架

```java
void dfs(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本节点所连接的其他节点) {
        处理节点;
        dfs(图，选择的节点); // 递归
        回溯，撤销处理结果
    }
}
```

## 98. 所有可达路径

题目链接：https://kamacoder.com/problempage.php?pid=1170

文章讲解：https://www.programmercarl.com/kamacoder/0098.%E6%89%80%E6%9C%89%E5%8F%AF%E8%BE%BE%E8%B7%AF%E5%BE%84.html

视频讲解：https://www.bilibili.com/video/BV1VePeepEpP

### 题解

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    // 收集符合条件的路径
    static List<List<Integer>> result = new ArrayList<>();
    // 收集 1 节点到终点的路径
    static List<Integer> path = new ArrayList<>();

    public static void dfs(int[][] graph, int x, int n) {
        // 终止条件
        if (x == n) {
            result.add(new ArrayList<>(path));
            return;
        }
        // 节点编号从 1 到 n
        for (int i = 1; i <= n; i++) {
            // 找到与 x 链接的节点
            if (graph[x][i] == 1){
                // 遍历到的节点胶乳到路径中来
                path.add(i);
                // 进入下一层递归
                dfs(graph, i, n);
                // 回溯，撤销本节点
                path.remove(path.size() - 1);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();

        // 邻接矩阵表示无向图（下标从 1 开始）
        int [][] graph = new int[n + 1][n + 1];

        for (int i = 0; i < m; i++) {
            int s = scanner.nextInt();
            int t = scanner.nextInt();
            // 1 代表 s 和 t 之间是相连的
            graph[s][t] = 1;
        }

        /*
           先把节点 1 加入路径，dfs 搜索的是从节点 1 出发到达 n 的所有路径，
           要不然最后结果集就会漏掉节点 1
        */
        path.add(1);

        dfs(graph,1,n);

        // 输出结果
        if (result.isEmpty()){
            System.out.println(-1);
        }
        for (List<Integer> pa : result) {
            for (int i = 0; i < pa.size() - 1; i++) {
                System.out.print(pa.get(i) + " ");
            }
            System.out.println(pa.get(pa.size() - 1));
        }
    }

}
```

### 提出问题

#### 为什么不需要 vistited 数组？

> #### 在有向无环图中，如果严格按照 DAG 的性质，从节点 1 到节点 n 的路径不会重复访问节点，因为一旦访问过某个节点，它不会再次出现在后续路径中（无环）
>
> #### 在二维网格 DFS 中，通常需要 visited 数组，是因为网格中每个格子可以重复进入（如果不标记的话），导致在同一个路径中重复访问同一个位置，从而陷入无限循环

## 广搜理论基础

文章讲解：https://www.programmercarl.com/kamacoder/%E5%9B%BE%E8%AE%BA%E5%B9%BF%E6%90%9C%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html

视频讲解：https://www.bilibili.com/video/BV1M19iY4EL9
