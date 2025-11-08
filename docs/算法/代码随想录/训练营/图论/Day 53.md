---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 53</h1>

---

## Floyd 算法

Floyd 算法代码很简单，但真正理解起原理 还是需要花点功夫，大家在看代码的时候，会发现 Floyd 的代码很简单，甚至看一眼就背下来了，但我为了讲清楚原理，本篇还是花了大篇幅来讲解。

题目链接：https://kamacoder.com/problempage.php?pid=1155

文章讲解：https://www.programmercarl.com/kamacoder/0097.%E5%B0%8F%E6%98%8E%E9%80%9B%E5%85%AC%E5%9B%AD.html

视频讲解：https://www.bilibili.com/video/BV15rbzzfEWY

### 思路分析

> #### floyd 算法的时间复杂度相对较高，适合<span style="color: red;">稠密图且源点较多</span>的情况

#### （1）Dijkstra 算法处理的是<span style="color: red;">单源</span>最短路（一个起点到多个终点的最短距离）问题，而 Floyd 算法处理的是<span style="color: red;">多源</span>最短路（多个起点到多个终点的最短距离）问题

#### （2）Floyd 算法对边的<span style="color: red;">权值正负</span>没有要求，都可以处理

#### （3）Floyd 算法核心思想是<span style="color: red;">动态规划</span>

#### dp 数组的含义

> #### grid[i][j][k] = m，表示 节点 i 到 节点 j 以[1...k] 集合中的一个节点为中间节点的最短距离为 m

#### 递推公式

#### （1）经过节点 k：grid[i][j][k] = grid[i][k][k - 1] + grid[k][j][k - 1]

> #### 节点 i 到 节点 k 的最短距离 是不经过节点 k，中间节点集合为[1...k-1]，所以 表示为 grid[i][k][k - 1]
>
> #### 节点 k 到 节点 j 的最短距离 也是不经过节点 k，中间节点集合为[1...k-1]，所以表示为 grid[k][j][k - 1]

#### （2）不经过节点 k：grid[i][j][k] = grid[i][j][k - 1]

#### （3）我们是求最短路，对于这两种情况自然是<span style="color: red;">取最小值</span>

#### dp 数组初始化

> #### 从下往上递推，k 那一层的循环需要放在最外面

<br/>
<img src="https://file1.kamacoder.com/i/algo/20240425104247.png"/>

### 题解

```java
public class FloydBase {

    // public static int MAX_VAL = Integer.MAX_VALUE;
    public static int MAX_VAL = 10005; // 边的最大距离是10^4(不选用Integer.MAX_VALUE是为了避免相加导致数值溢出)

    public static void main(String[] args) {
        // 输入控制
        Scanner sc = new Scanner(System.in);
        System.out.println("1.输入N M");
        int n = sc.nextInt();
        int m = sc.nextInt();

        System.out.println("2.输入M条边");

        // ① dp定义（grid[i][j][k] 节点i到节点j 可能经过节点K（k∈[1,n]））的最短路径
        int[][][] grid = new int[n + 1][n + 1][n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                for (int k = 0; k <= n; k++) {
                    grid[i][j][k] = grid[j][i][k] = MAX_VAL; // 其余设置为最大值
                }
            }
        }

        // ② dp 推导：grid[i][j][k] = min{grid[i][k][k-1] + grid[k][j][k-1], grid[i][j][k-1]}
        while (m-- > 0) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            int weight = sc.nextInt();
            grid[u][v][0] = grid[v][u][0] = weight; // 初始化（处理k=0的情况） ③ dp初始化
        }

        // ④ dp推导：floyd 推导
        for (int k = 1; k <= n; k++) {
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= n; j++) {
                    grid[i][j][k] = Math.min(grid[i][k][k - 1] + grid[k][j][k - 1], grid[i][j][k - 1]);
                }
            }
        }

        System.out.println("3.输入[起点-终点]计划个数");
        int x = sc.nextInt();

        System.out.println("4.输入每个起点src 终点dst");

        while (x-- > 0) {
            int src = sc.nextInt();
            int dst = sc.nextInt();
            // 根据floyd推导结果输出计划路径的最小距离
            if (grid[src][dst][n] == MAX_VAL) {
                System.out.println("-1");
            } else {
                System.out.println(grid[src][dst][n]);
            }
        }
    }
}
```

## A \* 算法 （A star 算法）

一般 笔试或者 面试的时候，不会考察 A*， 都是会结合具体业务场景问 A*算法，例如：地图导航，游戏开发 等等。

其实基础版的 A\* 并不难，所以大家不要畏惧，理解本篇内容，甚至独立写出代码，大家可以做到，加油

题目链接：https://kamacoder.com/problempage.php?pid=1203

文章讲解：https://www.programmercarl.com/kamacoder/0126.%E9%AA%91%E5%A3%AB%E7%9A%84%E6%94%BB%E5%87%BBastar.html

视频讲解：https://www.bilibili.com/video/BV15RY4zTEdh

### 思路分析

#### （1）A \* 算法就是改进版的 BFS，通过启发式函数尽可能选取距离源点近的方向进行搜索

> #### 使用优先队列实现，对当前节点距离源点的距离进行排序，选取距离源点近的节点出队，同时将其周围方向的节点入队

#### （2）A \* 只擅长给出<span style="color: red;">明确的目标</span>然后找到最短路径

#### （3）A \* 算法的时间复杂度是主要依赖于启发式函数的实现

#### 本题的图是无权网格状，在计算两点距离通常有如下三种计算方式：

#### （1）曼哈顿距离，计算方式： d = abs(x1-x2)+abs(y1-y2)

#### （2）欧氏距离（欧拉距离） ，计算方式：d = sqrt( (x1-x2)^2 + (y1-y2)^2 )

#### （3）切比雪夫距离，计算方式：d = max(abs(x1 - x2), abs(y1 - y2))

> #### x1, x2 为起点坐标，y1, y2 为终点坐标 ，abs 为求绝对值，sqrt 为求开根号，

### 题解

```java
import java.util.*;

class Main {
    static int[][] moved = {{-2, -1}, {-2, 1}, {-1, -2}, {-1, 2}, {1, -2}, {1, 2}, {2, -1}, {2, 1}};
    static int endX, endY;
    static PriorityQueue<Knight> que = new PriorityQueue<>(new MyCompare());
    static int[][] steps = new int[1001][1001];

    static class MyCompare implements Comparator<Knight> {
        @Override
        public int compare(Knight o1, Knight o2) {
            return o1.f - o2.f;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        while (n-- != 0) {
            for (int[] step : steps) Arrays.fill(step, 0);
            Knight start = new Knight();
            start.x = sc.nextInt();
            start.y = sc.nextInt();
            endX = sc.nextInt();
            endY = sc.nextInt();
            start.g = 0;
            start.h = distance(start);
            start.f = start.g + start.h;
            aStar(start);
            que.clear();
            System.out.println(steps[endX][endY]);
        }
    }

    private static int distance(Knight knight) {
        return (knight.x - endX) * (knight.x - endX) + (knight.y - endY) *  (knight.y - endY);
    }

    private static void aStar(Knight knight) {
        que.add(knight);
        while (!que.isEmpty()) {
            Knight cur = que.poll();
            if (cur.x == endX && cur.y == endY) return;
            for (int[] move : moved) {
                int nextX = cur.x + move[0];
                int nextY = cur.y + move[1];
                if (nextX < 1 || nextX > 1000 || nextY < 1 || nextY > 1000) continue;
                if (steps[nextX][nextY] == 0) {
                    steps[nextX][nextY] = steps[cur.x][cur.y] + 1;
                    Knight next = new Knight();
                    next.x = nextX;
                    next.y = nextY;
                    next.g = cur.g + 5;
                    next.h = distance(next);
                    next.f = next.g + next.h;
                    que.add(next);
                }
            }
        }
    }
}

class Knight {
    // 坐标
    public int x, y;
    // g = 起点到该节点的距离
    // h = 该节点到终点的估计距离（因为要按规则，而欧氏距离是直接两点之间）
    // f = g + h
    public int f, g, h;
}
```

## 最短路算法总结篇

最各个最短路算法有个全面的了解

文章讲解：https://www.programmercarl.com/kamacoder/%E6%9C%80%E7%9F%AD%E8%B7%AF%E9%97%AE%E9%A2%98%E6%80%BB%E7%BB%93%E7%AF%87.html

## 图论总结

文章讲解：https://www.programmercarl.com/kamacoder/%E5%9B%BE%E8%AE%BA%E6%80%BB%E7%BB%93%E7%AF%87.html
