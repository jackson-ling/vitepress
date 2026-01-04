---
aside: right
outline: [2, 3]
---

<h1 style="text-align: center; font-weight: bold;">Day 45</h1>

---

## 101.孤岛的总面积

基础题目 可以自己尝试做一做 。

题目链接：https://kamacoder.com/problempage.php?pid=1173

文章讲解：https://www.programmercarl.com/kamacoder/0101.%E5%AD%A4%E5%B2%9B%E7%9A%84%E6%80%BB%E9%9D%A2%E7%A7%AF.html

视频讲解：https://www.bilibili.com/video/BV1mmZJYRESc

### 思路分析

> #### 孤岛是那些位于矩阵内部、所有单元格都<span style="color:red">不接触边缘</span>的岛屿
>
> #### 本题要求找到不靠边的陆地面积，那么我们只要从四周边界找到陆地，然后通过 dfs 或者 bfs 将靠近边界的陆地且相邻的陆地都变成海洋
>
> #### 最后遍历一遍地图，统计陆地的数量，即为孤岛的数量（<span style="color:red">从四周边界往中间搜索</span>）
>
> #### 本题不需要 visited 数组，前面需要 visited 数组是为了避免节点重复访问，本题关注的点是把靠近四周边界的陆地置为海洋，不使用该数组反而节省了空间

### DFS 题解

```java
import java.util.Scanner;

public class Main {
    public static int count = 0;
    private static final int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}}; // 四个方向

    private static void dfs(int[][] grid, int x, int y) {
        grid[x][y] = 0;
        for (int i = 0; i < 4; i++) {
            int nextX = x + dir[i][0];
            int nextY = y + dir[i][1];
            // 检查是否越界
            if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
                continue;
            }
            // 如果是陆地，则继续递归
            if (grid[nextX][nextY] == 1) {
                dfs(grid, nextX, nextY);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // n 行 m 列的矩阵
        int n = scanner.nextInt();
        int m = scanner.nextInt();

        int[][] grid = new int[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                grid[i][j] = scanner.nextInt();
            }
        }

        // 遍历左右两列
        for (int i = 0; i < n; i++) {
            if (grid[i][0] == 1) {
                dfs(grid, i, 0);
            }
            if (grid[i][m - 1] == 1) {
                dfs(grid, i, m - 1);
            }
        }

        // 遍历上下两行
        for (int j = 0; j < m; j++) {
            if (grid[0][j] == 1) {
                dfs(grid, 0, j);
            }
            if (grid[n - 1][j] == 1) {
                dfs(grid, n - 1, j);
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 1) {
                    count++;
                }
            }
        }

        System.out.println(count);
    }
}
```

### BFS 题解

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
    static int count = 0;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] graph = new int[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                graph[i][j] = scanner.nextInt();
            }
        }

        // 左右两列往中间搜索，行在变化
        for (int i = 0; i < n; i++) {
            // 左边列
            if (graph[i][0] == 1) {
                bfs(graph, i, 0);
            }
            // 右边列
            if (graph[i][m - 1] == 1) {
                bfs(graph, i, m - 1);
            }
        }

        // 上下两行往中间搜索，列在变化
        for (int i = 0; i < m; i++) {
            if (graph[0][i] == 1) {
                bfs(graph, 0, i);
            }
            if (graph[n - 1][i] == 1) {
                bfs(graph, n - 1, i);
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (graph[i][j] == 1) {
                    count += 1;
                }
            }
        }

        System.out.println(count);
    }

    public static void bfs(int[][] graph, int x, int y) {
        Queue<Pair> queue = new LinkedList<>();
        queue.add(new Pair(x, y));
        // 加入队列就标记
        graph[x][y] = 0;

        while (!queue.isEmpty()) {
            int curX = queue.peek().first;
            int curY = queue.poll().second;

            for (int i = 0; i < dir.length; i++) {
                int nextX = curX + dir[i][0];
                int nextY = curY + dir[i][1];

                // 检查越界
                if (nextX < 0 || nextX >= graph.length || nextY < 0 || nextY >= graph[0].length) {
                    continue;
                }

                if (graph[nextX][nextY] == 1) {
                    queue.add(new Pair(nextX,nextY));
                    graph[nextX][nextY] = 0;
                }
            }
        }
    }

    static class Pair {
        int first;
        int second;

        public Pair(int first, int second) {
            this.first = first;
            this.second = second;
        }
    }
}
```

## 102.沉没孤岛

和上一题差不多，尝试自己做做

题目链接：https://kamacoder.com/problempage.php?pid=1174

文章讲解：https://www.programmercarl.com/kamacoder/0102.%E6%B2%89%E6%B2%A1%E5%AD%A4%E5%B2%9B.html

视频讲解：https://www.bilibili.com/video/BV1fjdWYyEGu

### 思路分析

> #### 本地的题意和上题相反，只需要做标记，最后在输出结果的时候做相应的处理即可
>
> #### ⚠️ 注意点：<span style="color:red">先沉默孤岛，再把陆地标记为 1</span>，否则结果输出全为 0

### DFS 题解

```java
import java.util.Scanner;

public class Main {
    private static final int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}}; // 四个方向

    private static void dfs(int[][] grid, int x, int y) {
        // 不是孤岛，先标记成 2，在输出时再做处理
        grid[x][y] = 2;
        for (int i = 0; i < 4; i++) {
            int nextX = x + dir[i][0];
            int nextY = y + dir[i][1];
            // 检查是否越界
            if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
                continue;
            }
            // 如果是陆地，则继续递归
            if (grid[nextX][nextY] == 1) {
                dfs(grid, nextX, nextY);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();

        int[][] grid = new int[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                grid[i][j] = scanner.nextInt();
            }
        }

        // 遍历左右两列（n 行 m 列的矩阵）
        for (int i = 0; i < n; i++) {
            if (grid[i][0] == 1) {
                dfs(grid, i, 0);
            }
            if (grid[i][m - 1] == 1) {
                dfs(grid, i, m - 1);
            }
        }

        // 遍历上下两行
        for (int j = 0; j < m; j++) {
            if (grid[0][j] == 1) {
                dfs(grid, 0, j);
            }
            if (grid[n - 1][j] == 1) {
                dfs(grid, n - 1, j);
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                // 注意点：先沉默孤岛再把陆地标记为 1，否则结果输出全为 0

                // 如果是孤岛，就标记为 0
                if (grid[i][j] == 1) {
                   grid[i][j] = 0;
                }
                // 如果不是孤岛，就标记为 1
                if (grid[i][j] == 2){
                    grid[i][j] = 1;
                }
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                System.out.print(grid[i][j] + " ");
            }
            System.out.println();
        }
    }
}
```

### BFS 题解

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] graph = new int[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                graph[i][j] = scanner.nextInt();
            }
        }

        // 左右两列往中间搜索，行在变化
        for (int i = 0; i < n; i++) {
            // 左边列
            if (graph[i][0] == 1) {
                bfs(graph, i, 0);
            }
            // 右边列
            if (graph[i][m - 1] == 1) {
                bfs(graph, i, m - 1);
            }
        }

        // 上下两行往中间搜索，列在变化
        for (int i = 0; i < m; i++) {
            if (graph[0][i] == 1) {
                bfs(graph, 0, i);
            }
            if (graph[n - 1][i] == 1) {
                bfs(graph, n - 1, i);
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                // 注意点：先沉默孤岛再把陆地标记为 1，否则结果输出全为 0

                // 如果是孤岛，就标记为 0
                if (graph[i][j] == 1) {
                    graph[i][j] = 0;
                }
                // 如果不是孤岛，就标记为 1
                if (graph[i][j] == 2) {
                    graph[i][j] = 1;
                }
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                System.out.print(graph[i][j] + " ");
            }
            System.out.println();
        }
    }

    public static void bfs(int[][] graph, int x, int y) {
        Queue<Pair> queue = new LinkedList<>();
        queue.add(new Pair(x, y));
        // 加入队列就标记
        graph[x][y] = 2;

        while (!queue.isEmpty()) {
            int curX = queue.peek().first;
            int curY = queue.poll().second;

            for (int i = 0; i < dir.length; i++) {
                int nextX = curX + dir[i][0];
                int nextY = curY + dir[i][1];

                // 检查越界
                if (nextX < 0 || nextX >= graph.length || nextY < 0 || nextY >= graph[0].length) {
                    continue;
                }

                if (graph[nextX][nextY] == 1) {
                    queue.add(new Pair(nextX, nextY));
                    graph[nextX][nextY] = 2;
                }
            }
        }
    }

    static class Pair {
        int first;
        int second;

        public Pair(int first, int second) {
            this.first = first;
            this.second = second;
        }
    }
}
```

## 103.水流问题

需要点优化思路，建议先自己读题，相处一个解题方法，有时间就自己写代码，没时间就直接看题解，优化方式 会让你 耳目一新。

题目链接：https://kamacoder.com/problempage.php?pid=1175

文章讲解：https://www.programmercarl.com/kamacoder/0103.%E6%B0%B4%E6%B5%81%E9%97%AE%E9%A2%98.html

视频讲解：https://www.bilibili.com/video/BV1WNoEYrEio

### 思路分析

> #### 本题采用逆向思维，从边界出发向中间遍历，水流的体现就是从低到高，分别用两个数组标记（有两个边界），如果某条路径可以使得从两个边界出发都满足水流的条件，则这条路径就是符合的
>
> #### 水流条件：下一个节点的值 <span style="color: red;">>=</span> 当前节点的值

### DFS 题解

```java
import java.util.Scanner;

public class Main {

    private static final int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public static void dfs(int[][] grid, int x, int y, boolean[][] visited) {
        visited[x][y] = true;
        for (int i = 0; i < 4; i++) {
            int nextX = x + dir[i][0];
            int nextY = y + dir[i][1];
            // 判断是否越界
            if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
                continue;
            }
            // 从低到高反向遍历
            if (!visited[nextX][nextY] && grid[nextX][nextY] >= grid[x][y]) {
                dfs(grid, nextX, nextY, visited);
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); // 行数
        int m = sc.nextInt(); // 列数

        int[][] grid = new int[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                grid[i][j] = sc.nextInt();
            }
        }

        boolean[][] firstBorder = new boolean[n][m];
        boolean[][] secondBorder = new boolean[n][m];

        // 左右两条边
        for (int i = 0; i < n; i++) {
            dfs(grid, i, 0, firstBorder);       // 左边
            dfs(grid, i, m - 1, secondBorder);  // 右边
        }

        // 上下两条边
        for (int j = 0; j < m; j++) {
            dfs(grid, 0, j, firstBorder);       // 上边
            dfs(grid, n - 1, j, secondBorder);  // 下边
        }

        // 遍历输出交集
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (firstBorder[i][j] && secondBorder[i][j]) {
                    System.out.println(i + " " + j);
                }
            }
        }
    }
}
```

### BFS 题解

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] graph = new int[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                graph[i][j] = scanner.nextInt();
            }
        }

        boolean[][] firstBorder = new boolean[n][m];
        boolean[][] secondBorder = new boolean[n][m];

        // 左右两条边
        for (int i = 0; i < n; i++) {
            bfs(graph, i, 0, firstBorder);       // 左边
            bfs(graph, i, m - 1, secondBorder);  // 右边
        }

        // 上下两条边
        for (int j = 0; j < m; j++) {
            bfs(graph, 0, j, firstBorder);       // 上边
            bfs(graph, n - 1, j, secondBorder);  // 下边
        }

        // 遍历输出交集
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (firstBorder[i][j] && secondBorder[i][j]) {
                    System.out.println(i + " " + j);
                }
            }
        }
    }

    public static void bfs(int[][] graph, int x, int y,boolean[][] visited) {
        Queue<Pair> queue = new LinkedList<>();
        queue.add(new Pair(x, y));
        // 加入队列就标记
        visited[x][y] = true;

        while (!queue.isEmpty()) {
            int curX = queue.peek().first;
            int curY = queue.poll().second;

            for (int i = 0; i < dir.length; i++) {
                int nextX = curX + dir[i][0];
                int nextY = curY + dir[i][1];

                // 检查越界
                if (nextX < 0 || nextX >= graph.length || nextY < 0 || nextY >= graph[0].length) {
                    continue;
                }

                if (!visited[nextX][nextY] && graph[nextX][nextY] >= graph[curX][curY]) {
                    queue.add(new Pair(nextX, nextY));
                    visited[nextX][nextY] = true;
                }
            }
        }
    }

    static class Pair {
        int first;
        int second;

        public Pair(int first, int second) {
            this.first = first;
            this.second = second;
        }
    }
}
```

## ⚠️ 104.建造最大岛屿

同样优化思路也会让你耳目一新，自己想比较难想出来。

题目链接：https://kamacoder.com/problempage.php?pid=1176

文章讲解：https://www.programmercarl.com/kamacoder/0104.%E5%BB%BA%E9%80%A0%E6%9C%80%E5%A4%A7%E5%B2%9B%E5%B1%BF.html

视频讲解：https://www.bilibili.com/video/BV1Dn5CzZEw1

### 思路分析

#### 时间复杂度优化

> #### 可以<span style="color: red;">先统计每个岛屿的面积</span>，而不用在每遍历一个节点时都去统计岛屿的面积，这样会使得有些节点被重复计算，提高了时间复杂度
>
> #### 在之后的遍历中，只需要<span style="color: red;">找遍历的当前节点周围是否有岛屿</span>，基于之前统计好的岛屿面积，直接相加即可，而不是重新遍历计算遍历当前节点周围岛屿的面积

### 题解

```java
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;

public class Main {
    // 记录每个岛屿的面积
    public static int count;
    // 对每个岛屿进行标记
    public static int mark;
    // 方向数组
    public static final int[][] dir = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public static void dfs(int[][] grid, int x, int y, boolean[][] visited) {
        for (int i = 0; i < 4; i++) {
            int nextX = x + dir[i][0];
            int nextY = y + dir[i][1];
            // 检查是否越界
            if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
                continue;
            }
            // 如果是岛屿，且没有访问过
            if (grid[nextX][nextY] == 1 && !visited[nextX][nextY]) {
                visited[nextX][nextY] = true;
                count++;
                grid[nextX][nextY] = mark;
                dfs(grid, nextX, nextY, visited);
            }
        }
    }

    public static void main(String[] args) {
        // 接收输入
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();

        int[][] grid = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                grid[i][j] = sc.nextInt();
            }
        }

        // 定义二维 boolean 数组记录该位置是否被访问
        boolean[][] visited = new boolean[m][n];

        // 初始化 mark 变量，从2开始（区别于0水，1岛屿）
        mark = 2;

        // 定义一个 HashMap，记录某片岛屿的标记号和面积
        HashMap<Integer, Integer> getSize = new HashMap<>();

        // 定义一个 HashSet，用来判断某一位置水四周是否存在不同标记编号的岛屿
        HashSet<Integer> set = new HashSet<>();

        /*
         * 为什么会定义这个变量？
         * 因为题目要求是最大岛屿面积，需要考虑 DFS 之后，是否全是岛屿（即 m * n）
         */
        boolean isAllIsland = true; // 初始时假设为 true

        // （1）遍历二维数组进行DFS搜索，标记每片岛屿的编号，记录对应的面积
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // 只要发现有海水，就说明不全都是岛屿，执行如下的计算逻辑
                if (grid[i][j] == 0) {
                    isAllIsland = false;
                }
                // 不全是是岛屿的情况，当前节点是岛屿，并且没有访问过
                if (grid[i][j] == 1 && !visited[i][j]) {
                    // 处理当前节点
                    count = 1;
                    grid[i][j] = mark;
                    visited[i][j] = true;
                    // 处理其余节点
                    dfs(grid, i, j, visited);

                    // 记录当前岛屿的编号和对应的面积
                    getSize.put(mark, count);
                    // 计算下一个岛屿的编号
                    mark++;
                }
            }
        }

        int result = 0;
        // 经过一轮 DFS 之后，判断是否全是岛屿，如果不是，则执行下面的计算逻辑
        if (isAllIsland) {
            result = m * n;
        }

        // （2）遍历二维数组，判断每个水位置周围是否有岛屿，并记录下岛屿面积之和
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // 如果当前位置是水，则搜索周围是否有岛屿
                if (grid[i][j] == 0) {
                    // 每一轮计算都清空记录的周围岛屿编号（因为要求最大的面积，需要不断更新）
                    set.clear();
                    // 当前位置变为岛屿，初始为 1
                    int curSize = 1;

                    // 遍历四周
                    for (int k = 0; k < 4; k++) {
                        int nextX = i + dir[k][0];
                        int nextY = j + dir[k][1];
                        // 检查是否越界
                        if (nextX < 0 || nextX >= m || nextY < 0 || nextY >= n) {
                            continue;
                        }
                        // 获取周围岛屿的编号
                        int curMark = grid[nextX][nextY];
                        /*
                         如果当前相邻的岛屿已经遍历过或者 HashMap 中不存在这个编号，
                         说明当前遍历节点就不是岛屿，同时需要避免空指针异常（后续需要取值），
                         则继续搜索
                        */
                        if (set.contains(curMark) || !getSize.containsKey(curMark)) {
                            continue;
                        }
                        set.add(curMark);
                        curSize += getSize.get(curMark);
                    }
                    result = Math.max(result, curSize);
                }
            }

        }
        System.out.println(result);
    }
}
```
