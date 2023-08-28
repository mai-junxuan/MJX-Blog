## 问题描述

`windows`上运行某些进程时出现端口冲突，由于笔者对`Linux`命令比较熟悉，对于`windows`查看端口以及管道符字符串匹配的指令不太熟悉。

所以记录一篇关于`windows`查端口的办法记录，方便后续查看解决。

## 解决办法

### 使用命令查看结果

首先键入以下命令查看端口号对应的进程的pid

`netstat -ano | findstr ":80 "`

每行数据自左向右依次为:协议 、本地地址 、 外部地址、 状态 、`PID`,以笔者为例可以看到80端口号的进程为`10076`

![image-20230315144837518](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202304021052456.png)

### 调出任务管理器，找到pid进程将其结束

右键下方调出`任务管理器`\->`详细信息` 将pid排序找到 刚刚的pid 将其结束

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202304021052239.png)

点击pid升序排序，找到上面命令找到的进程pid将其右键关闭即可。

![image-20230315144849243](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202304021052784.png)