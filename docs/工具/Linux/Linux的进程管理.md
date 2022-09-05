# Linux的进程管理

## 进程与程序

### 进程与pid的关系

在程序被执行前，他们不过是硬盘或者其他存储介质中的一个文件。当这些文件被加载到内存中时，系统就会根据执行者的权限属性生成程序执行参数(如下图执行者为root所以程序到内存中时权限属性都是以root为准)，并生成一个唯一标识，即PID。之后基于该程序基于运行的子进程的权限属性也是一句当前这个进程的相关权限。

### 子进程

由上文我们知道，子进程即由父进程操作中儿诞生的进程，如下所示所示，我们在终端键入bash，再用ps -l查看，可以看到这样一个二维表格，其中pid代表进程唯一标识，而ppid即当前进程的父进程号，可以看到pid为5445的进程ppid为4844，即第一个进程的pid，说明第二个bash就是我们键入bash命令后所加载的新进程

```bash
[root@localhost ~]# bash

[root@localhost ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
4 S     0   4844   4833  0  80   0 - 29192 do_wai pts/0    00:00:00 bash
4 S     0   5445   4844  0  80   0 - 29213 do_wai pts/0    00:00:00 bash
0 R     0   5480   5445  0  80   0 - 38331 -      pts/0    00:00:00 ps

```

### 父进程是如何执行子进程的

父进程会fork出一个进程，ppid为自己的pid，然后基于fork出来的进程执行exec命令从磁盘中将文件加载到内存中成为当前进程的子进程，而子进程的就是以暂存进程的ppid、pid作为自己的ppid、pid作为程序运行。

![image-20220905201417116](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052014841.png)

### 后台进程

crond每分钟都会区`/etc/crontab`扫描相关进程,而crond就是我们常说的后台进程，也是常年停留在内存中的进程，这种进程我们也可以称他们为damon(服务)

## Linux的多人多任务环境

### 多人环境

Linux支持多人操作，即使不同用户使用root账号也能运行，原因很简单，每个用户使用即使使用相同用户账号登录，Linux也为为其分配PID来区分两者。

### 多任务行为

因为CPU的速度可达Ghz，即每秒钟都能执行`10^9`个指令，所以即使你在运行多个任务，也几乎不会感觉到阻塞，正是因为CPU的强大，Linux系统才能支持多人多任务

### 后台进程

我们希望某些指令可以在系统后台运行，然后我们在此期间能够做别的事情，Linux已经给我们提供了这样一个操作，做法也很简单，如下所示，我们希望复制命令可以在后台运行

```bash
# 创建一个文件
[root@localhost tmp]# touch file1
# 加个& 该指令就会在后台运行
[root@localhost tmp]# cp file1 file2 &
[1] 6006


```

## 工作管理

### 前台进程和后台进程

前台进程：我们在终端与操作系统交互的命令就叫做前台进程 后台进程:那些无需和我们进行任何交互且不能使用ctrl+c停止的进程就是后台进程

### job control的管理

#### 进程后台执行示例

我们希望打包命令可以在后台运行，如下所示，我们使用tar命令进行压缩的时候加了个&，可以看到在打包过程中我们还可以运行别的命令。而且系统还会为这个进程分配pid为6137，当进程运行结束就会自动弹出一个Done

```bash
[root@localhost tmp]# tar -zpcf /tmp/etc.tar.gz /etc/ &
[1] 6137
[root@localhost tmp]# tar: Removing leading `/' from member names
ls
etc.tar.gz  swap
[root@localhost tmp]# ll
total 143728
-rw-r--r--. 1 root root  12958457 Jul  1 23:30 etc.tar.gz
-rw-------. 1 root root 134217728 Jun 30 19:32 swap
[1]+  Done                    tar -zpcf /tmp/etc.tar.gz /etc/
[root@localhost tmp]#

```

有时候我们的命令虽然可以在后台运行，但是会时不时的输出一堆字符串影响我们别的操作如下命令，tar命令的-v选项会将压缩过程中的文件名输出到控制台

```bash
tar -zpcvf /tmp/etc.tar.gz /etc/ &

```

所以我们可以使用数据流重定向将输出结果存到一个文本文件中

```bash
# 使用管道流将压缩过程存到日志文件中
[root@localhost tmp]# tar -zpcvf /tmp/etc.tar.gz /etc/ >/tmp/tar.log 2>&1 &
[1] 6214
[root@localhost tmp]# ls
etc.tar.gz  swap  tar.log
[1]+  Done                    tar -zpcvf /tmp/etc.tar.gz /etc/ > /tmp/tar.log 2>&1
[root@localhost tmp]#
```

#### 将进程暂停

如下所示，笔者键入两条命令并且都用ctrl+z将其暂停

```bash
[root@localhost tmp]# vim ~/.bashrc

[1]+  Stopped                 vim ~/.bashrc

[root@localhost tmp]# find / print
[2]+  Stopped                 find / print


```

然后我们就可以使用jobs命令查看被暂停的进程，如下所示-表示倒二暂停的进程，+号表示倒一个被暂停的进程

```bash
[root@localhost tmp]# jobs -l
[1]-  6456 Stopped                 vim ~/.bashrc
[2]+  6458 Stopped                 find / print

```

更多指令查阅

```bash
[root@study ~]#  jobs [- - lrs]
选项与参数：
-l ：除了列出 job number 与指令串之外，同时列出 PID 的号码；
-r ：仅列出正在背景 run 的工作；
-s ：仅列出正在背景当中暂停 (stop) 的工作。
```

#### 将工作调回前台

键入fg，即可将倒数第一个进程调入前台

```bash
fg
```

我们使用jobs命令查看当前暂停进程，看到1为vim命令，所以我们使用`fg %1`，即可回到vim操作

```bash
[root@localhost tmp]# jobs -l
[1]-  6456 Stopped                 vim ~/.bashrc
[2]+  6458 Stopped                 find / print

# 此时就会回到vim操作
[root@localhost tmp]# fg %1
vim ~/.bashrc


```

#### 让进程在后台运行

如下所示，我们希望搜寻权限为7000的文件，我们按ctrl z使其暂停，又希望他能够继续在后台运行，我们就可以通过bg +暂停时控制台输出的id值，如下命令所示为4，所以我们使用`bg %4`使其在后台运行。

```bash
# 键入查询命令并暂停
[root@localhost tmp]# find / -perm /7000 > /tmp/1.txt
^Z
[4]+  Stopped                 find / -perm /7000 > /tmp/1.txt
# 使其调入后台继续running
[root@localhost tmp]# jobs;bg %4;jobs
[2]-  Stopped                 find / print
[3]   Running                 find / -perm /7000 > /tmp/1.txt &
[4]+  Stopped                 find / -perm /7000 > /tmp/1.txt
[4]+ find / -perm /7000 > /tmp/1.txt &
[2]+  Stopped                 find / print
[3]   Running                 find / -perm /7000 > /tmp/1.txt &
[4]-  Running                 find / -perm /7000 > /tmp/1.txt &

```

#### 杀死进程

我们希望将jobs中某些暂停的进程杀死，就可以使用kill命令，如下所示

```bash
# 查看jobs
[root@localhost tmp]# jobs
[2]+  Stopped                 find / print
# 上面显示id为2，我们就用 -9强制将2进程杀死
[root@localhost tmp]# kill -9 %2;jobs
[2]+  Stopped                 find / print

# 查看是否杀死
[root@localhost tmp]# jobs;
[2]+  Killed                  find / print
[root@localhost tmp]# jobs;
[root@localhost tmp]#


```

更多命令参阅

```bash
[root@study ~]#  kill - - signal %jobnumber
[root@study ~]#  kill - -l l
选项与参数：
-l ：这个是 L 的小写，列出目前 kill 能够使用的讯号 (signal) 有哪些？
signal ：代表给予后面接的那个工作什么样的指示啰！用 man 7 signal 可知：
-1 ：重新读取一次参数的配置文件 (类似 reload)；
-2 ：代表与由键盘输入 [ctrl]-c 同样的动作；
-9 ：立刻强制删除一个工作；
-15：以正常的进程方式终止一项工作。与 -9 是不一样的
```

### 脱机管理问题

上文介绍的命令虽然可以在后台执行，但这些进程都是基于我们的bash父进程，一旦我们退出终端，这些命令都结束，所以我们可以使用nohup的脱机命令完成进程始终在后台执行

```bash
# 编写一个睡眠脚本内容为
#!/bin/bash
/bin/sleep 500s
/bin/echo "I have slept 500 seconds."

[root@localhost tmp]# vim sleep.sh
# 赋权
[root@localhost tmp]# chmod a+x sleep.sh
[root@localhost tmp]# vim sleep.sh
# 使用nohup &后台运行
[root@localhost tmp]# nohup ./sleep.sh &
[1] 7860
[root@localhost tmp]# nohup: ignoring input and appending output to ‘nohup.out’

```

使用其他终端查看，发现仍然运行，说明我们的操作成功了

```bash
[root@localhost ~]# ps -ef|grep sleep
root       7860   5445  0 00:11 pts/0    00:00:00 /bin/bash ./sleep.sh
root       7861   7860  0 00:11 pts/0    00:00:00 /bin/sleep 500s
root       7949    783  0 00:11 ?        00:00:00 sleep 60
root       7993   7878  0 00:12 pts/1    00:00:00 grep --color=auto sleep

```

## 进程管理

### 进程的观察

#### ps指令

```bash
选项与参数：
-A ：所有的 process 均显示出来，与 -e 具有同样的效用；
-a ：不与 terminal 有关的所有 process ；
-u ：有效使用者 (effective user) 相关的 process ；
x ：通常与 a 这个参数一起使用，可列出较完整信息。
输出格式规划：
l ：较长、较详细的将该 PID 的的信息列出；
j ：工作的格式 (jobs format)
-f ：做一个更为完整的输出。
```

仅观察自己登录的账号所使用的进程

```bash
[root@localhost zhangshiyu]# ps -l
# 输出结果介绍
# F 若为4则说明的以root权限开启的，若为1则说明是仅进行fork没有进行实际的exec
# S 则是进程状态的描述 T说明进程停止 S说明进程在休眠 R说明进程在运行 D说明不可被唤醒 Z则是僵尸进程
# UID    PID   PPID 分别是用户id 进程id 进程的父进程id
# C 则是cpu的使用率的说明，单位是百分比
# PRI  NI则是进程优先级的值 具体后文会展开描述
# ADDR表示进程在系统内存的哪个位置，若为-则说明是running，sz表示用掉多少内存，WCHAN 表示进程是否在运作中，-则说明在运作中
# TTY  用户使用的终端位置
# TIME 表示此进程耗费CPU的时间
# cmd 该进程是通过什么指令运行的
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 T     0  41946  41864  0  80   0 - 55370 do_sig pts/1    00:00:00 passwd
4 S     0  42718  41864  0  80   0 - 58087 do_wai pts/1    00:00:00 su
4 S     0  42730  42718  0  80   0 - 29238 do_wai pts/1    00:00:00 bash
4 S     0  42926  42730  0  80   0 - 57988 do_wai pts/1    00:00:00 su
4 S     0  43478  42927  0  80   0 - 58087 do_wai pts/1    00:00:00 su
4 S     0  43489  43478  0  80   0 - 29246 do_wai pts/1    00:00:00 bash
0 R     0  62668  43489  0  80   0 - 38331 -      pts/1    00:00:00 ps



```

列出当前在内存中运行的所有进程

```bash
[root@localhost zhangshiyu]# ps aux
# USER 该进程属于哪个使用者  
# PID 当前进程的唯一标识
# %CPU 当前进程消耗CPU所占用的百分比
# %MEM 当前进程所消耗内存的百分比
# VSZ  使用掉的虚拟内存量 
# RSS 进程固定占用内存的量
# TTY  为0则说明是网络登录的连接者，1-6则是本机使用者
# STAT 当前进程状态 标识与上描述的D T R Z S一致
# START  进程被启动的时间
# TIME 进程实际使用的CPU运作时间
# COMMAND 该进程实际使用的命令是什么
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.4 210328  4524 ?        Ss   Jul02   0:09 /usr/lib/systemd/systemd --switched-root --system --deserialize 22
root          2  0.0  0.0      0     0 ?        S    Jul02   0:00 [kthreadd]
root          4  0.0  0.0      0     0 ?        S<   Jul02   0:00 [kworker/0:0H]
root          6  0.0  0.0      0     0 ?        S    Jul02   0:00 [ksoftirqd/0]
root          7  0.0  0.0      0     0 ?        S    Jul02   0:00 [migration/0]
root          8  0.0  0.0      0     0 ?        S    Jul02   0:00 [rcu_bh]
root          9  0.0  0.0      0     0 ?        R    Jul02   0:00 [rcu_sched]
root         10  0.0  0.0      0     0 ?        S<   Jul02   0:00 [lru-add-drain]
root         11  0.0  0.0      0     0 ?        S    Jul02   0:00 [watchdog/0]
root         13  0.0  0.0      0     0 ?        S    Jul02   0:00 [kdevtmpfs]
root         14  0.0  0.0      0     0 ?        S<   Jul02   0:00 [netns]
root         15  0.0  0.0      0     0 ?        S    Jul02   0:00 [khungtaskd]
root         16  0.0  0.0      0     0 ?        S<   Jul02   0:00 [writeback]
root         17  0.0  0.0      0     0 ?        S<   Jul02   0:00 [kintegrityd]
root         18  0.0  0.0      0     0 ?        S<   Jul02   0:00 [bioset]
root         19  0.0  0.0      0     0 ?        S<   Jul02   0:00 [bioset]
root         20  0.0  0.0      0     0 ?        S<   Jul02   0:00 [bioset]
root         21  0.0  0.0      0     0 ?        S<   Jul02   0:00 [kblockd]
root         22  0.0  0.0      0     0 ?        S<   Jul02   0:00 [md]

```

列出系统运行的所有进程

```bash
[root@localhost zhangshiyu]# ps -lA
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
4 S     0      1      0  0  80   0 - 52582 ep_pol ?        00:00:09 systemd
1 S     0      2      0  0  80   0 -     0 kthrea ?        00:00:00 kthreadd
1 S     0      4      2  0  60 -20 -     0 worker ?        00:00:00 kworker/0:0H
1 S     0      6      2  0  80   0 -     0 smpboo ?        00:00:00 ksoftirqd/0
1 S     0      7      2  0 -40   - -     0 smpboo ?        00:00:00 migration/0


```

以进程树的格式 输出进程

```bash
[root@localhost zhangshiyu]# ps axjf
  PPID    PID   PGID    SID TTY       TPGID STAT   UID   TIME COMMAND
     0      2      0      0 ?            -1 S        0   0:00 [kthreadd]
     2      4      0      0 ?            -1 S<       0   0:00  \_ [kworker/0:0H]
     2      6      0      0 ?            -1 S        0   0:00  \_ [ksoftirqd/0]
     2      7      0      0 ?            -1 S        0   0:00  \_ [migration/0]
     2      8      0      0 ?            -1 S        0   0:00  \_ [rcu_bh]
     2      9      0      0 ?            -1 R        0   0:00  \_ [rcu_sched]
     2     10      0      0 ?            -1 S<       0   0:00  \_ [lru-add-drain]
     2     11      0      0 ?            -1 S        0   0:00  \_ [watchdog/0]
     2     13      0      0 ?            -1 S        0   0:00  \_ [kdevtmpfs]
     2     14      0      0 ?            -1 S<       0   0:00  \_ [netns]
     2     15      0      0 ?            -1 S        0   0:00  \_ [khungtaskd]
     2     16      0      0 ?            -1 S<       0   0:00  \_ [writeback]
     2     17      0      0 ?            -1 S<       0   0:00  \_ [kintegrityd]
     2     18      0      0 ?            -1 S<       0   0:00  \_ [bioset]

```

找出与 cron 与 rsyslog 这两个服务有关的 PID 号码

```bash
[root@localhost zhangshiyu]# ps aux | egrep '(cron|rsyslogd)'
root       1324  0.0  0.2 214432  2860 ?        Ssl  Jul02   0:02 /usr/sbin/rsyslogd -n
root       1356  0.0  0.0 126388   496 ?        Ss   Jul02   0:00 /usr/sbin/crond -n

```

#### top指令(动态观察进程的变化)

```bash
[root@study ~]#  top [- - d  数 字 ] | top [- - bnp]
选项与参数：
-d ：后面可以接秒数，就是整个进程画面更新的秒数。预设是 5 秒；
-b ：以批次的方式执行 top ，还有更多的参数可以使用喔！
通常会搭配数据流重导向来将批次的结果输出成为文件。
-n ：与 -b 搭配，意义是，需要进行几次 top 的输出结果。
-p ：指定某些个 PID 来进行观察监测而已。
在 top 执行过程当中可以使用的按键指令：
? ：显示在 top 当中可以输入的按键指令；
P ：以 CPU 的使用资源排序显示；
M ：以 Memory 的使用资源排序显示；
N ：以 PID 来排序喔！
T ：由该 Process 使用的 CPU 时间累积 (TIME+) 排序。
k ：给予某个 PID 一个讯号 (signal)
r ：给予某个 PID 重新制订一个 nice 值。
q ：离开 top 软件的按键。
```

每个2s输出一次系统资源使用情况

```bash
[root@localhost zhangshiyu]# top -d 2
# 第一行 代表系统开机时间为17:26:49，运行了20min，有两个用户在用，5 10 15分钟的负载，可以看到笔者的系统都是大于1，说明负载有点严重了
# 第2行 有220个任务，2个运行，2217个休眠，1个停止，0个僵尸进程
# 第三行之后就代表系统资源使用情况了，分别是cpu使用情况(us代表系统用户进程所占百分比，sy代表系统进程所占百分比，id空闲cpu所占的百分比。wa代表等待输入输出的进程所占百分比) 内存使用情况和 swap分区使用情况
# 后续的行输出结果和ps指令差不多不多赘述了 
top - 17:26:49 up 20:01,  2 users,  load average: 1.10, 1.08, 1.14
Tasks: 220 total,   2 running, 217 sleeping,   1 stopped,   0 zombie
%Cpu(s): 71.0 us, 29.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :   995672 total,   147376 free,   594708 used,   253588 buff/cache
KiB Swap:  2279412 total,  1980604 free,   298808 used.   213080 avail Mem

   PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
  2526 root      20   0  608804   4068   1180 R 99.5  0.4   1115:11 vmtoolsd
     1 root      20   0  210328   4524   2212 S  0.0  0.5   0:09.77 systemd
     2 root      20   0       0      0      0 S  0.0  0.0   0:00.03 kthreadd
     4 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 kworker/0:0H
     6 root      20   0       0      0      0 S  0.0  0.0   0:00.34 ksoftirqd/0
     7 root      rt   0       0      0      0 S  0.0  0.0   0:00.00 migration/0
     8 root      20   0       0      0      0 S  0.0  0.0   0:00.00 rcu_bh
     9 root      20   0       0      0      0 S  0.0  0.0   0:00.89 rcu_sched
    10 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 lru-add-drain
    11 root      rt   0       0      0      0 S  0.0  0.0   0:00.22 watchdog/0
    13 root      20   0       0      0      0 S  0.0  0.0   0:00.00 kdevtmpfs
    14 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 netns
    15 root      20   0       0      0      0 S  0.0  0.0   0:00.03 khungtaskd
    16 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 writeback
    17 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 kintegrityd
    18 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 bioset
    19 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 bioset
    20 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 bioset
    21 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 kblockd

```

将 top 的信息进行 2 次，然后将结果输出到 /tmp/top.txt

```bash
[root@localhost tmp]# top -n -b 2>/tmp/top.log
[root@localhost tmp]# ll
total 131076
-rw-------. 1 root root 134217728 Jun 30 19:32 swap
-rw-r--r--. 1 root root        34 Jul  3 17:32 top.log
[root@localhost tmp]#

```

我们自己的 bash PID 可由 $$ 变量取得，请使用 top 持续观察该 PID

```bash
[root@localhost tmp]# top -d 2 -p 43489
# 注意 此时我们在输出界面下按r ，在输入一个数字会修改ni的值，这个值会决定进程的优先级，ni值越大优先级越低
top - 17:34:24 up 20:09,  2 users,  load average: 1.14, 1.14, 1.14
Tasks:   1 total,   0 running,   1 sleeping,   0 stopped,   0 zombie
%Cpu(s): 69.7 us, 30.3 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :   995672 total,   147228 free,   594628 used,   253816 buff/cache
KiB Swap:  2279412 total,  1980604 free,   298808 used.   213144 avail Mem

   PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
 43489 root      20   0  116984   3044   1204 S  0.0  0.3   0:00.10 bash

```

#### pstree指令

```bash
[root@study ~]#  pstree [- - A|U] [- - up]
选项与参数：
-A ：各进程树之间的连接以 ASCII 字符来连接；
-U ：各进程树之间的连接以万国码的字符来连接。在某些终端接口下可能会有错误；
-p ：并同时列出每个 process 的 PID；
-u ：并同时列出每个 process 的所属账号名称。
```

以ASCII字符输出当前进程树

```bash
[root@localhost tmp]# pstree -A
systemd-+-ModemManager---2*[{ModemManager}]
        |-NetworkManager---2*[{NetworkManager}]
        |-VGAuthService
        |-2*[abrt-watch-log]
        |-abrtd
        |-accounts-daemon---2*[{accounts-daemon}]
        |-alsactl
        |-at-spi-bus-laun-+-dbus-daemon---{dbus-daemon}
        |                 `-3*[{at-spi-bus-laun}]
        |-at-spi2-registr---2*[{at-spi2-registr}]
        |-atd
        |-auditd-+-audispd-+-sedispatch
        |        |         `-{audispd}
        |        `-{auditd}
        |-avahi-daemon---avahi-daemon
        |-bluetoothd
        |-boltd---2*[{boltd}]
        |-chronyd
        |-colord---2*[{colord}]
        |-crond
        |-cupsd
        |-2*[dbus-daemon---{dbus-daemon}]
        |-dbus-launch
        |-dconf-service---2*[{dconf-service}]
        |-dnsmasq---dnsmasq
        |-escd---{escd}
        |-evolution-addre-+-evolution-addre---5*[{evolution-addre}]
        |                 `-4*[{evolution-addre}]
        |-evolution-calen-+-evolution-calen---9*[{evolution-calen}]
        |                 `-4*[{evolution-calen}]
        |-evolution-sourc---3*[{evolution-sourc}]

```

以ASCII字符输出当前进程树，并显示user和pid，可以看到pstree可以帮我们看到某些进程的父进程，这样我们就可以顺着这棵树找到父进程，并将某些杀不死的进程连着父进程一起消灭

```bash
[root@localhost tmp]# pstree -Aup
systemd(1)-+-ModemManager(712)-+-{ModemManager}(730)
           |                   `-{ModemManager}(738)
           |-NetworkManager(854)-+-{NetworkManager}(858)
           |                     `-{NetworkManager}(862)
           |-VGAuthService(744)
           |-abrt-watch-log(710)
           |-abrt-watch-log(720)
           |-abrtd(709)
           |-accounts-daemon(690)-+-{accounts-daemon}(696)
           |                      `-{accounts-daemon}(707)
           |-alsactl(733)
           |-at-spi-bus-laun(2201)-+-dbus-daemon(2206)---{dbus-daemon}(2207)
           |                       |-{at-spi-bus-laun}(2202)
           |                       |-{at-spi-bus-laun}(2203)
           |                       `-{at-spi-bus-laun}(2205)
           |-at-spi2-registr(2211)-+-{at-spi2-registr}(2214)
           |                       `-{at-spi2-registr}(2215)
           |-atd(1357)
           |-auditd(661)-+-audispd(663)-+-sedispatch(665)
           |             |              `-{audispd}(666)

```

### 进程的管理

#### kill

格式

```bash
kill -数字 进程id


 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL
 5) SIGTRAP      6) SIGABRT      7) SIGBUS       8) SIGFPE
 9) SIGKILL     10) SIGUSR1     11) SIGSEGV     12) SIGUSR2
13) SIGPIPE     14) SIGALRM     15) SIGTERM     16) SIGSTKFLT
17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU
25) SIGXFSZ     26) SIGVTALRM   27) SIGPROF     28) SIGWINCH
29) SIGIO       30) SIGPWR      31) SIGSYS      34) SIGRTMIN
35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3  38) SIGRTMIN+4
39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12
47) SIGRTMIN+13 48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14
51) SIGRTMAX-13 52) SIGRTMAX-12 53) SIGRTMAX-11 54) SIGRTMAX-10
55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7  58) SIGRTMAX-6
59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX

# 下面是常用的信号。
# 只有第9种信号(SIGKILL)才可以无条件终止进程，其他信号进程都有权利忽略。

HUP     1    终端挂断
INT     2    中断（同 Ctrl + C）
QUIT    3    退出（同 Ctrl + \）
KILL    9    强制终止
TERM   15    终止
CONT   18    继续（与STOP相反，fg/bg命令）
STOP   19    暂停（同 Ctrl + Z）
```

以 ps 找出 rsyslogd 这个进程的 PID 后，再使用 kill 传送讯息，使得 rsyslogd 可以重新读取配置文件

```bash
[root@localhost tmp]# ps aux |grep 'rsyslogd' | grep -v 'grep'
root       1324  0.0  0.2 214432  2872 ?        Ssl  Jul02   0:02 /usr/sbin/rsyslogd -n
[root@localhost tmp]# kill -1 1324
[root@localhost tmp]#

```

#### killall

相比于kill，killall无需关注pid也能将某些进程关闭

```bash
[root@study ~]#  killall [- - iIe] [command name]
选项与参数：
-i ：interactive 的意思，交互式的，若需要删除时，会出现提示字符给用户；
-e ：exact 的意思，表示『后面接的 command name 要一致』，但整个完整的指令
不能超过 15 个字符。
-I ：指令名称(可能含参数)忽略大小写。
```

给予 rsyslogd 这个指令启动的 PID 一个 SIGHUP 的讯

```bash
[root@localhost tmp]# killall -1 rsyslogd
[root@localhost tmp]#


```

范例二：强制终止所有以 httpd 启动的进程 (其实并没有此进程在系统内)

```bash
killall -9 httpd

```

范例三：依次询问每个 bash 程序是否需要被终止运作！

```bash
[root@localhost tmp]# killall -i bash
Kill bash(41864) ? (y/N)==>按y则把当前命令终端关闭了，所以笔者不继续演示了

```

### 关于进程的执行顺序

上文用ps -l命令看到两个进程属性pri和ni，这个就是决定进程优先级的值，这两个值越小优先级越高

```bash
PRI(new) = PRI(old) + nice
```

CPU在执行队列中不同的进程时会根据优先级确定进程在执行的频率，优先级越高执行次数越多

由于pri这个值是系统计算的，所以若需要改变进程优先级，我们只能修改ni这个值

```
    root用户nice可以将nice值 -20~19，普通用户只能0~19(避免抢占系统资源进程优先级)
```

#### nice(修改一个新创建的进程的nice)

```bash
[root@study ~]#  nice [- n  数 字 ] command
选项与参数：
-n ：后面接一个数值，数值的范围 -20 ~ 19。
```

将后续vim的nice值-5

```bash
[root@localhost tmp]# nice -n -5 vim &
[2] 65834
[root@localhost tmp]# ps -l -p 65834
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
4 T     0  65834  43489  0  85   5 - 36807 do_sig pts/1    00:00:00 vim

[2]+  Stopped                 nice -n -5 vim

```

#### renice(修改当前进程的nice值)

```bash
[root@localhost tmp]# ps -l |grep bash
4 S     0  42730  42718  0  80   0 - 29238 do_wai pts/1    00:00:00 bash
4 S     0  43489  43478  0  90  10 - 29246 do_wai pts/1    00:00:00 bash
# 如下所示将nice改为-10，pri最终变为80-10即70
[root@localhost tmp]# renice -10   43489
43489 (process ID) old priority 10, new priority -10
[root@localhost tmp]# ps -l |grep bash
4 S     0  42730  42718  0  80   0 - 29238 do_wai pts/1    00:00:00 bash
4 S     0  43489  43478  0  70 -10 - 29246 do_wai pts/1    00:00:00 bash

```

### 系统资源的观察

#### free(查看系统资源使用情况)

```
[root@study ~]#  free [ [- - b|- - k|- - m|- - g|- - h] [- - t] [- - s N - - c N]
选项与参数：
-b ：直接输入 free 时，显示的单位是 Kbytes，我们可以使用 b(bytes), m(Mbytes)
k(Kbytes), 及 g(Gbytes) 来显示单位喔！也可以直接让系统自己指定单位 (-h)
-t ：在输出的最终结果，显示物理内存与 swap 的总量。
-s ：可以让系统每几秒钟输出一次，不间断的一直输出的意思！对于系统观察挺有效！
-c ：与 -s 同时处理～让 free 列出几次的意思～
[zhangshiyu@localhost ~]$ free -m

# 如下便是内存和交换分区的资源使用情况，需要了解的是swap分区使用量最好不要超过20%，一旦超过20%，你最好要考虑增加一张内存条了
              total        used        free      shared  buff/cache   available
Mem:            972         655         113          21         203         155
Swap:          2047         157        1890

```

#### uname查看系统核心相关

```
[root@study ~]#  uname [- - asrmpi]
选项与参数：
-a ：所有系统相关的信息，包括底下的数据都会被列出来；
-s ：系统核心名称
-r ：核心的版本
-m ：本系统的硬件名称，例如 i686 或 x86_64 等；
-p ：CPU 的类型，与 -m 类似，只是显示的是 CPU 的类型！
-i ：硬件的平台 (ix86)
```

输出系统的基本信息

```
[zhangshiyu@localhost ~]$ uname -a
# 主机名 localhost.localdomain
# 核心版本3.10.0-1160.el7.x86_64
# 建立日期 2020 
# 使用与x86系统
Linux localhost.localdomain 3.10.0-1160.el7.x86_64 #1 SMP Mon Oct 19 16:18:59 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux
[zhangshiyu@localhost ~]$

```

####  uptime查看系统运行时长

输出的内容就是top命令的第一行，这里就不多做赘述了

```
[zhangshiyu@localhost ~]$ uptime
 20:37:25 up  4:10,  3 users,  load average: 0.00, 0.04, 0.08
[zhangshiyu@localhost ~]$

```

#### netstat(网络监控命令)

```
[root@study ~]#  netstat - - [atunlp]
选项与参数：
-a ：将目前系统上所有的联机、监听、Socket 数据都列出来
-t ：列出 tcp 网络封包的数据
-u ：列出 udp 网络封包的数据
-n ：不以进程的服务名称，以埠号 (port number) 来显示；
-l ：列出目前正在网络监听 (listen) 的服务；
-p ：列出该网络服务的进程 PID
```

基础使用

```
[zhangshiyu@localhost ~]$ netstat
# 输出结果
Active Internet connections (w/o servers)
# Proto:使用协议
# Recv-Q:用户未接受的socket总数，单位为bytes
# Send-Q:远程主机未确认字节数
# Local Address:本地主机地址
# Foreign Address: 远程主机地址
# State:连接状态
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 localhost.localdoma:ssh 192.168.0.107:60960     ESTABLISHED
tcp        0     48 localhost.localdoma:ssh 192.168.0.107:60959     ESTABLISHED
tcp        0      0 localhost.localdoma:ssh 192.168.0.107:57437     ESTABLISHED
tcp        0      0 localhost.localdoma:ssh 192.168.0.107:57436     ESTABLISHED
Active UNIX domain sockets (w/o servers)
#Proto :基本是unix
# RefCnt 连接到此的socket进程总数
#Flags        联机的旗标
#  Type       :socket连接类型 ，STREAM     代表连接要进行确认，DGRAM    不需要确认联机
# State         连接状态，CONNECTED     表示已连接
# Path：连接到此程序的socket相关路径
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ]         DGRAM                    20023    /var/run/chrony/chronyd.sock
unix  3      [ ]         DGRAM                    1416     /run/systemd/notify
unix  2      [ ]         DGRAM                    1418     /run/systemd/cgroups-agent
unix  5      [ ]         DGRAM                    1436     /run/systemd/journal/socket
unix  30     [ ]         DGRAM                    1438     /dev/log
unix  2      [ ]         DGRAM                    11980    /run/systemd/shutdownd
unix  3      [ ]         STREAM     CONNECTED     40063
unix  3      [ ]         STREAM     CONNECTED     32419
unix  3      [ ]         STREAM     CONNECTED     19668    /run/systemd/journal/stdout
unix  3      [ ]         STREAM     CONNECTED     39952
unix  3      [ ]         STREAM     CONNECTED     39946
unix  3      [ ]         STREAM     CONNECTED     28931
unix  3      [ ]         STREAM     CONNECTED     19614
unix  3      [ ]         STREAM     CONNECTED     41069    /run/dbus/system_bus_socket

```

找出当前连接的socket连接进程以及pid

```
[zhangshiyu@localhost ~]$ netstat -tulp
(No info could be read for "-p": geteuid()=1000 but you should be root.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:sunrpc          0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      -
tcp        0      0 localhost:ipp           0.0.0.0:*               LISTEN      -
tcp        0      0 localhost:smtp          0.0.0.0:*               LISTEN      -
tcp        0      0 localhos:x11-ssh-offset 0.0.0.0:*               LISTEN      -
tcp        0      0 localhost:6011          0.0.0.0:*               LISTEN      -
tcp6       0      0 [::]:sunrpc             [::]:*                  LISTEN      -
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN      -
tcp6       0      0 localhost:ipp           [::]:*                  LISTEN      -
tcp6       0      0 localhost:smtp          [::]:*                  LISTEN      -
tcp6       0      0 localhos:x11-ssh-offset [::]:*                  LISTEN      -
tcp6       0      0 localhost:6011          [::]:*                  LISTEN      -
udp        0      0 0.0.0.0:55515           0.0.0.0:*                           -
udp        0      0 0.0.0.0:mdns            0.0.0.0:*                           -
udp        0      0 localhost:323           0.0.0.0:*                           -
udp        0      0 0.0.0.0:952             0.0.0.0:*                           -
udp        0      0 0.0.0.0:bootps          0.0.0.0:*                           -
udp        0      0 0.0.0.0:sunrpc          0.0.0.0:*                           -
udp6       0      0 localhost:323           [::]:*                              -
udp6       0      0 [::]:952                [::]:*                              -
udp6       0      0 [::]:sunrpc             [::]:*                              -

```

#### dmesg (分析核心产生的讯息)

我们希望知道系统开机的时候某些硬件是否被系统加载到，但是系统开机过程中这些信息都是一闪而过，所以我们就可以使用dmesg 来查阅

```
[zhangshiyu@localhost ~]$ dmesg |more
[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
[    0.000000] Initializing cgroup subsys cpuacct
[    0.000000] Linux version 3.10.0-1160.el7.x86_64 (mockbuild@kbuilder.bsys.centos.org) (gcc version 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) ) #1 SMP Mon Oct
 19 16:18:59 UTC 2020
[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-3.10.0-1160.el7.x86_64 root=/dev/mapper/centos-root ro crashkernel=auto spectre_v2=retpoline rd.lvm.lv=centos
/root rd.lvm.lv=centos/swap rhgb quiet LANG=en_US.UTF-8
[    0.000000] Disabled fast string operations
[    0.000000] e820: BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009ebff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009ec00-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000dc000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000003fedffff] usable
[    0.000000] BIOS-e820: [mem 0x000000003fee0000-0x000000003fefefff] ACPI data
[    0.000000] BIOS-e820: [mem 0x000000003feff000-0x000000003fefffff] ACPI NVS
[    0.000000] BIOS-e820: [mem 0x000000003ff00000-0x000000003fffffff] usable
[    0.000000] BIOS-e820: [mem 0x00000000f0000000-0x00000000f7ffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fec00000-0x00000000fec0ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fee00000-0x00000000fee00fff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fffe0000-0x00000000ffffffff] reserved
[    0.000000] NX (Execute Disable) protection: active
[    0.000000] SMBIOS 2.7 present.
[    0.000000] DMI: VMware, Inc. VMware Virtual Platform/440BX Desktop Reference Platform, BIOS 6.00 11/12/2020

```

同样的我们也可以使用这条命令查看我们磁盘是否成功加载，以及磁盘对应的文件系统格式

```
# 查询系统加载的sda磁盘的情况，匹配sda时忽略大小写
[zhangshiyu@localhost ~]$ dmesg |grep -i sda
[    3.199217] sd 0:0:0:0: [sda] 44040192 512-byte logical blocks: (22.5 GB/21.0 GiB)
[    3.199384] sd 0:0:0:0: [sda] Write Protect is off
[    3.199386] sd 0:0:0:0: [sda] Mode Sense: 61 00 00 00
[    3.199568] sd 0:0:0:0: [sda] Cache data unavailable
[    3.199570] sd 0:0:0:0: [sda] Assuming drive cache: write through
[    3.201243]  sda: sda1 sda2
[    3.203114] sd 0:0:0:0: [sda] Attached SCSI disk
[    6.552787] XFS (sda1): Mounting V5 Filesystem
[    6.691573] XFS (sda1): Ending clean mount
[11355.991889] EXT4-fs (sda3): mounted filesystem with ordered data mode. Opts: (null)
[11356.366564] sda3: WRITE SAME failed. Manually zeroing.
[13245.141400] XFS (sda5): Mounting V5 Filesystem
[13245.153175] XFS (sda5): Ending clean mount
[14089.872450] XFS (sda5): Unmounting Filesystem
[14174.239242] XFS (sda5): Mounting V5 Filesystem
[14174.253655] XFS (sda5): Ending clean mount

```

#### vmstat (侦测系统资源变化)

```
[root@study ~]#  vmstat [ - a] [ 延 迟 [ [ 总计侦测 次 数 ]] <==CPU/内存等信息
[root@study ~]#  vmstat [ - fs] <==内存相关
[root@study ~]#  vmstat [ - S  单 位 ] <==设定显示数据的单位
[root@study ~]#  vmstat [- d] <==与磁盘有关
[root@study ~]#  vmstat [- p  分区 槽 ] <==与磁盘有关
选项与参数：
-a ：使用 inactive/active(活跃与否) 取代 buffer/cache 的内存输出信息；
-f ：开机到目前为止，系统复制 (fork) 的进程数；
-s ：将一些事件 (开机至目前为止) 导致的内存变化情况列表说明；
-S ：后面可以接单位，让显示的数据有单位。例如 K/M 取代 bytes 的容量；
-d ：列出磁盘的读写总量统计表
-p ：后面列出分区槽，可显示该分区槽的读写总量统计表
```

基础使用

```
[zhangshiyu@localhost ~]$ vmstat
# r 等待运行的进程数量，不可被唤醒的进程数量，这两者越多就说明系统越忙碌
# memory:swpd   代表虚拟内存未被使用的数量，free表示内存未被使用的数量，buff用于缓冲区的内存数量，cache是用于缓存的内存总量
# swap:si由磁盘将进程读取的数量，so由于内存不足由swap分区写入磁盘的总量，若这两个值过大就说明数据经常在磁盘和内存来回切换，系统性能很差
# io bi 由磁盘读入的区块数量，bo将区块写入磁盘的数量，这两个值高则说明io频繁
# system:in被中断的进程数量 cs  每分钟进程切换的数量
# cpu  us 用户进程消耗cpu时间百分比 sy:系统进程消耗系统时间百分比  id 空闲时间占百分比 wa：等待io时间所占百分比 st:被虚拟机所占用的时间的百分比
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0 162048  63024    360 222168    0    1    57     3   18   24  0  0 100  0  0

```

## 特殊文件与进程

### 具有SUID/SGID权限的指令执行状态

非root用户拥有passwd的执行权(即拥有suid权限)，当非root用户执行passwd时，在这期间就会拥有passwd的root权限

如下我们使用非root用户键入passwd后按ctrl z +entrer

```
[zhangshiyu@localhost ~]$ passwd
Changing password for user zhangshiyu.
Changing password for zhangshiyu.
(current) UNIX password:

[1]+  Stopped                 passwd

```

使用进程树命令，就可以印证上述所说

```
[zhangshiyu@localhost ~]$ pstree -uA
# 输出 可以看到sshd非root用户键入passwd之后短暂拥有root权限
-sshd---sshd(zhangshiyu)---bash-+-passwd(root)
        |                                       `-pstree

```

### 查询已开启文件或者一致性进程开启的文件

#### fuser (查看某目录下正在使用该目录的进程)

如果我们想查看当前目录下，我们开启了多少个文件，就可以使用这条命令

```
[root@study ~]#  fuser [- umv] [- k [i] [- signal]] file/dir
选项与参数：
-u ：除了进程的 PID 之外，同时列出该进程的拥有者；
-m ：后面接的那个档名会主动的上提到该文件系统的最顶层，对 umount 不成功很有效！
-v ：可以列出每个文件与进程还有指令的完整相关性！
-k ：找出使用该文件/目录的 PID ，并试图以 SIGKILL 这个讯号给予该 PID；
-i ：必须与 -k 配合，在删除 PID 之前会先询问使用者意愿！
-signal：例如 -1 -15 等等，若不加的话，预设是 SIGKILL (-9) 啰！
[root@localhost zhangshiyu]# fuser -uv .


# 这里重点介绍一下ACCESS 
#  c ：此进程在当前的目录下(非次目录)；
#   e ：可被触发为执行状态；
#    f ：是一个被开启的文件；
#  r ：代表顶层目录 (root directory)；
#   F ：该文件被开启了，不过在等待回应中；
#   m ：可能为分享的动态函式库；
#
                     USER        PID ACCESS COMMAND
/home/zhangshiyu:    zhangshiyu   7112 ..c.. (zhangshiyu)bash
                     zhangshiyu   7143 ..c.. (zhangshiyu)sftp-server
                     root       8447 ..c.. (root)passwd
                     root       8515 ..c.. (root)bash

```

看看proc文件夹下运行的文件

```
[root@localhost zhangshiyu]# fuser -uv /proc/
                     USER        PID ACCESS COMMAND
/proc:               root     kernel mount (root)/proc
                     rtkit       783 .rc.. (rtkit)rtkit-daemon



[root@localhost zhangshiyu]# fuser -muv /proc/
                     USER        PID ACCESS COMMAND
/proc:               root     kernel mount (root)/proc
                     root          1 f.... (root)systemd
                     root        537 f.... (root)systemd-journal
                     rtkit       783 .rc.. (rtkit)rtkit-daemon
                     root        786 f.... (root)udisksd
                     root        944 f.... (root)NetworkManager
                     root       1219 F.... (root)libvirtd
                     root       1618 F.... (root)X
                     root       1790 f.... (root)packagekitd
                     root       2267 f.... (root)gvfs-udisks2-vo
                     root       2368 f.... (root)gsd-housekeepin
                     root       2442 f.... (root)gvfsd-trash

# 输出使用到home这个进程的pid
[root@localhost zhangshiyu]# echo $$
8515
# 进入home目录查看，果然有一个8515的进程在使用这个文件夹
[root@localhost zhangshiyu]# cd /home/
[root@localhost home]# fuser -uv .
                     USER        PID ACCESS COMMAND
/home:               root       8515 ..c.. (root)bash

```

这时候我们就可以使用fuser进程尝试卸载，这也说明fuser这条指令常用于卸载那些挂载且正在使用中的文件系统

```
[root@localhost home]# umount /home/
umount: /home/: not mounted
[root@localhost home]# fuser -mki /home/
/home:                   1rce     2rc     4rc     6rc     7rc     8rc     9rc    10rc    11rc    12rc    13rc    14rc    16rc    17rc    18rc    19rc    21rc    22rc    23rc    24rc    26rc    27rc    28rc    29rc    31rc    32rc    33rc    34rc    36rc    39rc    40rc    41rc    42rc    43rc    44rc    45rc    46rc    47rc    48rc    49rc    55rc    56rc    57rc    58rc    66rc    68rc    69rc    71rc    73rc    86rc   123rc   318rc   319rc   322rc   326rc   329rc   330rc   332rc   333rc   334rc   335rc   338rc   339rc   416rc   417rc   428rc   429rc   442rc   443rc   444rc   445rc   446rc   447rc   448rc   449rc   450rc   451rc   452rc   453rc   537rce   568rce   579rce   699rc   700rc   701rc   702rc   703rc   704rc   705rc   706rc   714rc   748rce   750rce   752rce   754rc   755rc   777rce   778rce   779rce   781rce   782rce   783e   784rce   786rce   787rce   792rce   793rce   795rce   797rce   798rce   804rce   810rce   812rce   815rce   846rce   849rce   853rce   856rce   861rce   883rce   891rce   905rc   944rce  1205rce  1208rce  1209rce  1210rce  1219rce  1222rc  1225rce  1226rce  1228rce  1434rce  1444rce  1545rce  1546rce  1616rc  1618rce  1703rce  1780rce  1785rce  1790rce  1871rce  1937rc  1974rce  1988rce  2005rce  2014rce  2015rce  2048rce  2052rce  2057rce  2138rce  2152rce  2157rce  2160rce  2189rce  2218rce  2222rce  2224rce  2227rce  2239rce  2244rce  2249rce  2255rce  2256rce  2265rce  2267rce  2280rce  2288rce  2294rce  2300rce  2305rce  2309rce  2310rce  2312rce  2313rce  2324rce  2327rce  2332rce  2335rce  2336rce  2339rce  2354rce  2361rce  2362rce  2364rce  2365rce  2368rce  2375rce  2377rce  2378rce  2400rce  2418rc  2423rce  2435rce  2442rce  2447rce  2459rce  2464rce  2465rce  2466rce  2475rce  2490rce  2493rce  2499rce  2502rce  2516rce  2524rce  2536rce  2541rce  2606rce  2612rce  2638rce  3411rc  3973rc  4876rc  5370rc  5371rc  5400rc  6036rc  6726rc  6767rc  6768rc  6769rc  6770rc  6771rc  6772rc  6773rc  6774rc  6863rc  6914rc  6915rc  6916rc  6918rc  6951rc  7026rc  7040rce  7103rce  7107rce  7110rce  7112rce  7136rce  7143rce  7382rc  7759rc  7828rc  8239rce  8447rce  8505rc  8506rce  8515rce  8556rc  8653rc  8715rc  8730rce
Kill process 1 ? (y/N) n
Kill process 2 ? (y/N) ^C

```

当然这条指令也同样适合用于文件

```
[root@localhost home]# find /run/ -type p
/run/dmeventd-client
/run/dmeventd-server
/run/systemd/inhibit/12.ref
/run/systemd/inhibit/11.ref
/run/systemd/inhibit/10.ref
/run/systemd/inhibit/8.ref
/run/systemd/inhibit/4.ref
/run/systemd/inhibit/2.ref
/run/systemd/inhibit/1.ref
/run/systemd/sessions/39.ref
/run/systemd/sessions/38.ref
/run/systemd/sessions/1.ref
/run/systemd/initctl/fifo

[root@localhost home]# fuser -uv /run/systemd/inhibit/1.ref
                     USER        PID ACCESS COMMAND
/run/systemd/inhibit/1.ref:
                     root        804 F.... (root)ModemManager
                     root        856 f.... (root)systemd-logind

```

#### lsof (查看进程使用了那些文件)

```
[root@study ~]#  lsof [- - aUu] [+d]
选项与参数：
-a ：多项数据需要『同时成立』才显示出结果时！
-U ：仅列出 Unix like 系统的 socket 文件类型；
-u ：后面接 username，列出该使用者相关进程所开启的文件；
+d ：后面接目录，亦即找出某个目录底下已经被开启的文件！
```

基础示例

```
[root@localhost home]# lsof

# 可以看到systemd这个命令用到了根目录

COMMAND    PID  TID           USER   FD      TYPE             DEVICE  SIZE/OFF       NODE NAME
systemd      1                root  cwd       DIR              253,0       251         64 /
systemd      1                root  rtd       DIR              253,0       251         64 /
systemd      1                root  txt       REG              253,0   1632776   17448437 /usr/lib/systemd/systemd
systemd      1                root  mem       REG              253,0     20064     153193 /usr/lib64/libuuid.so.1.3.0
systemd      1                root  mem       REG              253,0    265576     900547 /usr/lib64/libblkid.so.1.1.0
systemd      1                root  mem       REG              253,0     90248     153189 /usr/lib64/libz.so.1.2.7
systemd      1                root  mem       REG              253,0    157424     154974 /usr/lib64/liblzma.so.5.2.2
systemd      1                root  mem       REG              253,0     23968     154955 /usr/lib64/libcap-ng.so.0.0.0
systemd      1                root  mem       REG              253,0     19896     155185 /usr/lib64/libattr.so.1.1.0
systemd      1                root  mem       REG              253,0     19248     360823 /usr/lib64/libdl-2.17.so
systemd      1                root  mem       REG              253,0    402384     377014 /usr/lib64/libpcre.so.1.2.0
systemd      1                root  mem       REG              253,0   2156272     360817 /usr/lib64/libc-2.17.so
systemd      1                root  mem       REG              253,0    142144     360843 /usr/lib64/libpthread-2.17.so

```

查看root用户所开启的socket进程所用到的文件

```
[root@localhost home]# lsof -u root -a -U
COMMAND    PID USER   FD   TYPE             DEVICE SIZE/OFF  NODE NAME
systemd      1 root   12u  unix 0xffff9f5f79d7bb80      0t0 10584 /run/systemd/private
systemd      1 root   13u  unix 0xffff9f5f61628440      0t0 37290 /run/systemd/journal/stdout
systemd      1 root   15u  unix 0xffff9f5f6162ea40      0t0 37291 /run/systemd/journal/stdout
systemd      1 root   16u  unix 0xffff9f5f4c405d80      0t0 37294 /run/systemd/journal/stdout
systemd      1 root   17u  unix 0xffff9f5f4c400440      0t0 37295 /run/systemd/journal/stdout
systemd      1 root   18u  unix 0xffff9f5f4c404400      0t0 36160 /run/systemd/journal/stdout
systemd      1 root   21u  unix 0xffff9f5f7553b740      0t0 11980 /run/systemd/shutdownd
systemd      1 root   22u  unix 0xffff9f5f7553c840      0t0 11982 /run/lvm/lvmpolld.socket
systemd      1 root   23u  unix 0xffff9f5f758c8000      0t0  1416 /run/systemd/notify
systemd      1 root   25u  unix 0xffff9f5f758c8440      0t0  1418 /run/systemd/cgroups-agent
systemd      1 root   26u  unix 0xffff9f5f7553cc80      0t0 11988 /run/lvm/lvmetad.socket
systemd      1 root   28u  unix 0xffff9f5f758c8cc0      0t0  1433 /run/systemd/journal/stdout
systemd      1 root   29u  unix 0xffff9f5f758c9100      0t0  1436 /run/systemd/journal/socket
systemd      1 root   30u  unix 0xffff9f5f758c9540      0t0  1438 /dev/log
systemd      1 root   35u  unix 0xffff9f5f7553d0c0      0t0 12259 /run/udev/control
systemd      1 root   36u  unix 0xffff9f5f7553ee80      0t0 17498 socket

```

查看系统目前开启的硬件装置

```
[root@localhost home]# lsof +d /dev/
COMMAND    PID           USER   FD   TYPE             DEVICE SIZE/OFF  NODE NAME
systemd      1           root    0u   CHR                1,3      0t0  1028 /dev/null
systemd      1           root    1u   CHR                1,3      0t0  1028 /dev/null
systemd      1           root    2u   CHR                1,3      0t0  1028 /dev/null
systemd      1           root   30u  unix 0xffff9f5f758c9540      0t0  1438 /dev/log
systemd      1           root   31r   CHR             10,235      0t0  1126 /dev/autofs
kdevtmpfs   38           root  cwd    DIR                0,5     3380  1025 /dev
kdevtmpfs   38           root  rtd    DIR                0,5     3380  1025 /dev

```

查看root用户使用bash时所用到的文件

```
[root@localhost home]# lsof -u root |grep bash
ksmtuned   891 root  txt       REG              253,0    964536   50414404 /usr/bin/bash
bash      8515 root  cwd       DIR              253,0        24   50331764 /home
bash      8515 root  rtd       DIR              253,0       251         64 /
bash      8515 root  txt       REG              253,0    964536   50414404 /usr/bin/bash
bash      8515 root  mem       REG              253,0     61560     360835 /usr/lib64/libnss_files-2.17.so
bash      8515 root  mem       REG              253,0 106172832     376961 /usr/lib/locale/locale-archive
bash      8515 root  mem       REG              253,0   2156272     360817 /usr/lib64/libc-2.17.so
bash      8515 root  mem       REG              253,0     19248     360823 /usr/lib64/libdl-2.17.so
bash      8515 root  mem       REG              253,0    174576     376997 /usr/lib64/libtinfo.so.5.9
bash      8515 root  mem       REG              253,0    163312     360810 /usr/lib64/ld-2.17.so
bash      8515 root  mem       REG              253,0     26970   16888728 /usr/lib64/gconv/gconv-modules.cache
bash      8515 root    0u      CHR              136,1       0t0          4 /dev/pts/1
bash      8515 root    1u      CHR              136,1       0t0          4 /dev/pts/1
bash      8515 root    2u      CHR              136,1       0t0          4 /dev/pts/1
bash      8515 root  255u      CHR              136,1       0t0          4 /dev/pts/1

```

#### pidof (找出某支正在执行的程序的 PID)

```
[root@study ~]#  pidof [- - sx] program_name
选项与参数：
-s ：仅列出一个 PID 而不列出所有的 PID
-x ：同时列出该 program name 可能的 PPID 那个进程的 PID
```

使用示例

```
[root@localhost home]# pidof systemd rsyslogd
# 可以看到pid分别是1 和1208
1 1208
```