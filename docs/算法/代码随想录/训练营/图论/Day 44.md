---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 44</h1>

---

## 99.岛屿数量（深搜）

注意深搜的两种写法，熟练掌握这两种写法 以及 知道区别在哪里，才算掌握的深搜。

题目链接：https://kamacoder.com/problempage.php?pid=1171

文章讲解：https://www.programmercarl.com/kamacoder/0099.%E5%B2%9B%E5%B1%BF%E7%9A%84%E6%95%B0%E9%87%8F%E6%B7%B1%E6%90%9C.html

视频讲解：https://www.bilibili.com/video/BV18PRGYcEiB

### 思路分析

> #### 逐行搜索，如果发现当前遍历节点是陆地，则以当前起点为中心，判断四个方向是否是陆地

### 题解

```java
import java.util.Scanner;

public class Main {
    public static int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public static void dfs(int[][] grid, int x, int y, boolean[][] visited) {
        for (int i = 0; i < dir.length; i++) {
            int nextX = x + dir[i][0];
            int nextY = y + dir[i][1];
            // 检验是否越界
            if (nextY < 0 || nextX < 0 || nextX >= grid.length || nextY >= grid[0].length) {
                continue;
            }
            // 递归条件：下一个点是陆地且没有被访问过
            if(!visited[nextX][nextY] && grid[nextX][nextY] == 1){
                visited[nextX][nextY] = true;
                dfs(grid, nextX, nextY, visited);
            }
        }
    }

    public static void main(String[] args) {
        // 数据录入
        Scanner scanner = new Scanner(System.in);
        int m = scanner.nextInt();
        int n = scanner.nextInt();
        int[][] grid = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                grid[i][j] = scanner.nextInt();
            }
        }

        int ans = 0;
        boolean[][] visited = new boolean[m][n];

        // dfs
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // 没有被访问过并且还是陆地，就以当前遍历节点开始搜索
                if (!visited[i][j] && grid[i][j] == 1) {
                    ans++;
                    visited[i][j] = true;
                    // 处理其余节点
                    dfs(grid, i, j, visited);
                }
            }
        }
        System.out.println(ans);
    }
}
```

## 99.岛屿数量（广搜）

注意广搜的两种写法，第一种写法为什么会超时， 如果自己做的录友，题目通过了，也要仔细看第一种写法的超时版本，弄清楚为什么会超时，因为你第一次 幸运 没那么想，第二次可就不一定了

题目链接：https://kamacoder.com/problempage.php?pid=1171

文章讲解：https://www.programmercarl.com/kamacoder/0099.%E5%B2%9B%E5%B1%BF%E7%9A%84%E6%95%B0%E9%87%8F%E5%B9%BF%E6%90%9C.html

视频讲解：https://www.bilibili.com/video/BV12QQqYWE6x

### ⚠️ 注意点

> #### <span style="color:red">入队就标记为访问过</span>，如果是从队列中取出然后标记为访问过，就会造成同一个元素重复加入队列的情况，导致代码超时

### 题解

```java
import java.util.*;

public class Main {

    // 定义四个方向：上、右、下、左
    public static int[][] dir = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}}; // 上、右、下、左顺序

    // 自定义一个 Pair 类来表示坐标
    static class Pair {
        int first, second;

        Pair(int first, int second) {
            this.first = first;
            this.second = second;
        }
    }

    // BFS 函数
    public static void bfs(int[][] grid, boolean[][] visited, int x, int y) {
        Queue<Pair> queue = new LinkedList<Pair>(); // 定义坐标队列
        queue.add(new Pair(x, y));
        visited[x][y] = true; // 标记已访问
        while (!queue.isEmpty()) {
            int curX = queue.peek().first;
            int curY = queue.poll().second; // 获取当前的坐标
            for (int i = 0; i < 4; i++) {
                // 顺时针遍历新的坐标
                int nextX = curX + dir[i][0];
                int nextY = curY + dir[i][1];
                // 判断是否越界
                if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
                    continue;
                }
                // 如果没有访问过并且是陆地（值为 1）
                if (!visited[nextX][nextY] && grid[nextX][nextY] == 1) {
                    queue.add(new Pair(nextX, nextY)); // 将新坐标加入队列
                    visited[nextX][nextY] = true; // 标记已访问
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        int[][] grid = new int[m][n];
        boolean[][] visited = new boolean[m][n];
        int ans = 0;

        // 读取 grid 的内容
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                grid[i][j] = sc.nextInt();
            }
        }

        // 遍历每个位置，进行 BFS 计算岛屿数量
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (!visited[i][j] && grid[i][j] == 1) {
                    ans++; // 每次找到一个未访问的陆地，岛屿数量增加
                    bfs(grid, visited, i, j); // 对该岛屿进行 BFS 遍历
                }
            }
        }

        // 输出岛屿数量
        System.out.println(ans);
    }
}
```

## 100.岛屿的最大面积

本题就是基础题了，做过上面的题目，本题很快。

题目链接：https://kamacoder.com/problempage.php?pid=1172

文章讲解：https://www.programmercarl.com/kamacoder/0100.%E5%B2%9B%E5%B1%BF%E7%9A%84%E6%9C%80%E5%A4%A7%E9%9D%A2%E7%A7%AF.html

视频讲解：https://www.bilibili.com/video/BV1FzoyY5EXH

### 题解

```java
import java.util.Scanner;

public class Main {

    static final int[][] dir = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    static int result = 0;
    static int count = 0;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] map = new int[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                map[i][j] = scanner.nextInt();
            }
        }
        boolean[][] visited = new boolean[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (!visited[i][j] && map[i][j] == 1) {
                    count = 1;
                    visited[i][j] = true;
                    // 处理周围节点
                    dfs(map, visited, i, j);
                    result = Math.max(count, result);
                }
            }
        }
        System.out.println(result);
    }

    static void dfs(int[][] map, boolean[][] visited, int x, int y) {
        for (int i = 0; i < 4; i++) {
            int nextX = x + dir[i][0];
            int nextY = y + dir[i][1];
            // 检查越界
            if (nextX < 0 || nextY < 0 || nextX >= map.length || nextY >= map[0].length || visited[nextX][nextY] || map[nextX][nextY] == 0) {
                continue;
            }
            // 如果是陆地，且没有访问过，则进行 DFS
            if (!visited[nextX][nextY] && map[nextX][nextY] == 1) {
                visited[nextX][nextY] = true;
                count++;
                dfs(map, visited, nextX, nextY);
            }
        }
    }
}
```
