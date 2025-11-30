---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 50</h1>

---

## 拓扑排序

拓扑排序看上去很复杂，其实了解其原理之后，代码不难

题目链接：https://kamacoder.com/problempage.php?pid=1191

文章讲解：https://www.programmercarl.com/kamacoder/0117.%E8%BD%AF%E4%BB%B6%E6%9E%84%E5%BB%BA.html

视频讲解：https://www.bilibili.com/video/BV1czGJzkERe

### 思路分析

#### 应用场景

> #### 节点之间存在依赖关系，需要通过拓扑排序梳理依赖关系

#### 模板思路

#### （1）找到入度为 0 的节点，加入结果集

#### （2）将该节点从图中移除

> #### 本质是要将该节点作为出发点所连接的节点的入度减一就可以了，这样好能根据入度找下一个节点，不用真在图里把这个节点删掉

#### 注意点

> #### 结果集的顺序，就是我们想要的拓扑排序顺序 （结果集里顺序可能不唯一）
>
> #### 需要判断是否存在环（即循环依赖），可以通过输出的节点个数判断

### 题解

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // N 个文件
        int n = scanner.nextInt();
        // M 条依赖关系
        int m = scanner.nextInt();

        // 记录节点的依赖关系
        List<List<Integer>> umap = new ArrayList<>();
        // 记录节点的入度
        int[] inDegree = new int[n];

        for (int i = 0; i < n; i++) {
            umap.add(new ArrayList<>());
        }

        for (int i = 0; i < m; i++) {
            int s = scanner.nextInt();
            int t = scanner.nextInt();
            // 记录 s 指向哪些节点
            umap.get(s).add(t);
            // t 的入度加一
            inDegree[t]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) {
                // 入度为 0 的节点可以作为开头，先加入队列
                queue.add(i);
            }
        }

        List<Integer> result = new ArrayList<>();

        // 拓扑排序（DFS版本）
        while (!queue.isEmpty()) {
            // 取出队头元素
            int cur = queue.poll();
            // 记录结果
            result.add(cur);

            for (int file : umap.get(cur)){
                // cur 指向的节点的入度减一
                inDegree[file]--;
                if (inDegree[file] == 0){
                    queue.add(file);
                }
            }
        }

        if (result.size() == n){
            for (int i = 0; i < result.size(); i++) {
                System.out.print(result.get(i));
                if (i < result.size() - 1){
                    System.out.print(" ");
                }
            }
        }else {
            // 出现环（即循环依赖）
            System.out.println(-1);
        }
    }
}
```

## dijkstra（朴素版）

后面几天都是最短路系列了，对于最短路系列，我的建议是，如果第一次接触最短路算法的话，能看懂原理，能照着代码随想录把代码抄下来就可以了，二刷的时候再尝试自己去写出来。三刷的时候，差不多才能把最短路吃透。对于一刷的录友们，不要强行去逼迫自己去学透，很难刚接触到最短路算法就学透

题目链接：https://kamacoder.com/problempage.php?pid=1047

文章讲解：https://www.programmercarl.com/kamacoder/0047.%E5%8F%82%E4%BC%9Adijkstra%E6%9C%B4%E7%B4%A0.html

视频讲解：https://www.bilibili.com/video/BV1kXuEzAEaz

### 思路分析

#### （1）思路模板（和 Prim 算法很像）

> #### 第一步，选源点到哪个节点近且该节点未被访问过
>
> #### 第二步，该最近节点被标记访问过
>
> #### 第三步，更新非访问节点到源点的距离（即更新 minDist 数组）

#### （2）注意点

> #### <span style="color: red;">节点编号从 1 开始，数组大小初始为 n + 1 个大小，注意边界判断</span>
>
> #### dijkstra 算法可以同时求起点到所有节点的最短路径
>
> #### 权值不能为负数

### 题解

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] grid = new int[n + 1][n + 1];

        // 需要求最小值，初始化为最大值
        for (int i = 0; i <= n; i++) {
            Arrays.fill(grid[i], Integer.MAX_VALUE);
        }

        for (int i = 0; i < m; i++) {
            int p1 = scanner.nextInt();
            int p2 = scanner.nextInt();
            int val = scanner.nextInt();
            grid[p1][p2] = val;
        }

        int start = 1;
        int end = n;

        // 存储从源点到每个节点的最短距离
        int[] minDist = new int[n + 1];
        Arrays.fill(minDist, Integer.MAX_VALUE);

        // 记录顶点是否被访问过
        boolean[] visited = new boolean[n + 1];

        // 起点到自身的距离为 0
        minDist[start] = 0;

        // Dijkstra
        for (int i = 1; i <= n; i++) {
            int minVal = Integer.MAX_VALUE;
            // 用于记录节点。初始时指向源点
            int cur = 1;

            // 步骤一：找到离源点最近的节点
            for (int j = 1; j <= n; j++) {
                if (!visited[j] && minDist[j] < minVal){
                    minVal = minDist[j];
                    cur = j;
                }
            }

            // 步骤二：标记该节点被访问过
            visited[cur] = true;

            // 步骤三：更新非访问节点到源点的距离（即更新 minDist 数组）
            for (int j = 1; j <= n ; j++) {
                if (!visited[j] && grid[cur][j] != Integer.MAX_VALUE && minDist[cur] + grid[cur][j] < minDist[j]){
                    minDist[j] = minDist[cur] + grid[cur][j];
                }
            }
        }

        // 无法从源点到达终点
        if (minDist[end] == Integer.MAX_VALUE){
            System.out.println(-1);
        }else {
            System.out.println(minDist[end]);
        }
    }
}
```

### 打印路径

> #### 思路和 prim 算法类似，在更新最短路径的时候记录路径，最后输出即可
>
> #### 注意点：不能写成 parent[cur] = j，在 for 循环中，有多个 j 满足要求，那么 parent[cur] 就会被反复覆盖，因为 cur 是一个固定值

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] grid = new int[n + 1][n + 1];

        // 需要求最小值，初始化为最大值
        for (int i = 0; i <= n; i++) {
            Arrays.fill(grid[i], Integer.MAX_VALUE);
        }

        for (int i = 0; i < m; i++) {
            int p1 = scanner.nextInt();
            int p2 = scanner.nextInt();
            int val = scanner.nextInt();
            grid[p1][p2] = val;
        }

        int start = 1;
        int end = n;

        // 存储从源点到每个节点的最短距离
        int[] minDist = new int[n + 1];
        Arrays.fill(minDist, Integer.MAX_VALUE);

        // 记录顶点是否被访问过
        boolean[] visited = new boolean[n + 1];

        // 起点到自身的距离为 0
        minDist[start] = 0;

        // 记录最短路径
        int[] path = new int[n + 1];

        // Dijkstra
        for (int i = 1; i <= n; i++) {
            int minVal = Integer.MAX_VALUE;
            // 用于记录节点。初始时指向源点
            int cur = 1;

            // 步骤一：找到离源点最近的节点
            for (int j = 1; j <= n; j++) {
                if (!visited[j] && minDist[j] < minVal) {
                    minVal = minDist[j];
                    cur = j;
                }
            }

            // 步骤二：标记该节点被访问过
            visited[cur] = true;

            // 步骤三：更新非访问节点到源点的距离（即更新 minDist 数组）
            for (int j = 1; j <= n; j++) {
                if (!visited[j] && grid[cur][j] != Integer.MAX_VALUE && minDist[cur] + grid[cur][j] < minDist[j]) {
                    minDist[j] = minDist[cur] + grid[cur][j];
                    // 这里通过 cur 节点找到了更短的路径
                    // 即 path 数组记录的 j 节点的上一个节点是 cur
                    // 举例（1）原先是 起点 --> j 节点（2）现在是 起点 --> cur 节点 --> j 节点
                    path[j] = cur;
                }
            }
        }

        // 无法从源点到达终点
        if (minDist[end] == Integer.MAX_VALUE) {
            System.out.println(-1);
        } else {
            System.out.println(minDist[end]);
        }

        // 输出最短情况
        for (int i = 1; i <= n; i++) {
            // （1）原先是 起点 --> i 节点（2）现在是 起点 --> cur 节点 --> i 节点
            System.out.println(path[i] + " -> " + i);
        }
    }
}
```

### 封装 Dijkstra

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // n 个节点
        int n = scanner.nextInt();
        // n 条边
        int m = scanner.nextInt();
        // 节点编号从 1 开始
        int[][] graph = new int[n + 1][n + 1];

        // 初始化为最大值
        for (int i = 0; i <= n; i++) {
            Arrays.fill(graph[i], Integer.MAX_VALUE);
        }

        // m 条边
        for (int i = 0; i < m; i++) {
            int s = scanner.nextInt();
            int t = scanner.nextInt();
            int val = scanner.nextInt();
            graph[s][t] = val;
        }

        // 定义起点和终点
        int start = 1;
        int end = n;

        // 传入图、起点终点、节点个数
        int res = dijkstra(graph, start, end, n);
        System.out.println(res);
    }

    public static int dijkstra(int[][] graph, int start, int end, int n) {
        // 表示从起点到所有点的最短距离，初始为最大值
        int[] minDist = new int[n + 1];
        Arrays.fill(minDist, Integer.MAX_VALUE);

        boolean[] visited = new boolean[n + 1];

        // 起点到自身的距离为 0
        minDist[start] = 0;

        // Dijkstra

        // n 个节点，执行 n 次
        for (int i = 1; i <= n; i++) {
            // 用于更新最小值
            int minVal = Integer.MAX_VALUE;
            // 用于更新节点
            int cur = 1;

            // 第一步：找到距离源点最近的节点
            for (int j = 1; j <= n; j++) {
                if (!visited[j] && minDist[j] < minVal) {
                    minVal = minDist[j];
                    cur = j;
                }
            }

            // 第二步：设置为访问过
            visited[cur] = true;

            // 第三步：更新最短路径（通过当前节点是否会使得路径更短）
            for (int j = 1; j <= n; j++) {
                if (!visited[j] && graph[cur][j] != Integer.MAX_VALUE
                        && minDist[cur] + graph[cur][j] < minDist[j]){
                    minDist[j] = minDist[cur] + graph[cur][j];
                }
            }
        }

        if (minDist[end] == Integer.MAX_VALUE){
            return -1;
        }
        return minDist[end];
    }
}
```
