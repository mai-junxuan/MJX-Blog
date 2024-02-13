import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as i,c as n,a}from"./app-DITNE2eT.js";const s={},d=a(`<h1 id="aof简介" tabindex="-1"><a class="header-anchor" href="#aof简介"><span>AOF简介</span></a></h1><h2 id="什么是aof" tabindex="-1"><a class="header-anchor" href="#什么是aof"><span>什么是AOF</span></a></h2><p>AOF 持久化就是在客户端执行完成操作指令后将该指定先记录到内存中，在根据持久化机制将这些指令持久化到硬盘的一种机制**(写后再日志记录)**。注意，这种持久化机制会将指令以文本的形式存储。</p><h2 id="aof为什么采用写后日志" tabindex="-1"><a class="header-anchor" href="#aof为什么采用写后日志"><span>AOF为什么采用写后日志</span></a></h2><h3 id="优势" tabindex="-1"><a class="header-anchor" href="#优势"><span>优势</span></a></h3><p>综合考量，redis写后再日志有以下两点好处:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 客户端操作的指令可能会出错，采用写后再日志的形式可以避免很多没必要的日志记录，节约磁盘空间
2. 写日志需要进行磁盘IO，可能会产生阻塞，所以采用先写入再日志，可以避免写时阻塞
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="劣势" tabindex="-1"><a class="header-anchor" href="#劣势"><span>劣势</span></a></h3><p>当然在生产环境，这种持久化机制很可能产生两种问题:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 有可能在写操作之后，日志记录之前服务器出现宕机，可能会造成数据丢失
2. 主线程磁盘压力过大，导致写入磁盘慢，进而造成后续操作阻塞。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置参数详解" tabindex="-1"><a class="header-anchor" href="#配置参数详解"><span>配置参数详解</span></a></h2><h3 id="appendonly" tabindex="-1"><a class="header-anchor" href="#appendonly"><span>appendonly</span></a></h3><h4 id="参数详解" tabindex="-1"><a class="header-anchor" href="#参数详解"><span>参数详解</span></a></h4><p>若将该参数设置为yes，则开启aof持久化机制，此时redis持久化机制就以aof为主，而非rdb</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>############################## APPEND ONLY MODE ###############################

# By default Redis asynchronously dumps the dataset on disk. This mode is
# good enough in many applications, but an issue with the Redis process or
# a power outage may result into a few minutes of writes lost (depending on
# the configured save points).
#
# The Append Only File is an alternative persistence mode that provides
# much better durability. For instance using the default data fsync policy
# (see later in the config file) Redis can lose just one second of writes in a
# dramatic event like a server power outage, or a single write if something
# wrong with the Redis process itself happens, but the operating system is
# still running correctly.
#
# AOF and RDB persistence can be enabled at the same time without problems.
# If the AOF is enabled on startup Redis will load the AOF, that is the file
# with the better durability guarantees.
#
# Please check https://redis.io/topics/persistence for more information.

appendonly yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例"><span>使用示例</span></a></h4><p>我们将该参数配置为yes后重启redis服务端，使用客户端完成如下操作</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 设置三个key
127.0.0.1:6379&gt; set k1 v1
OK
127.0.0.1:6379&gt; set k2 v2
OK
127.0.0.1:6379&gt; set k3 v3
OK
127.0.0.1:6379&gt;


# 全局搜索发现已生成aof文件，大小为110

[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# find / -name appendonly.aof
/usr/sbin/appendonly.aof
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# find / -name appendonly
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# find / -name appendonly.aof
/usr/sbin/appendonly.aof
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ll appendonly.aof
-rw-r--r-- 1 root root 110 Aug 26 00:09 appendonly.aof




# 再次使用redis客户端写入指令
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379&gt; set test vv
(error) NOAUTH Authentication required.
127.0.0.1:6379&gt; auth 123
OK
127.0.0.1:6379&gt; set k4 v4
OK
127.0.0.1:6379&gt;


# 再次查看aof文件大小，变为139，说明aof配置生效
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# ll appendonly.aof
-rw-r--r-- 1 root root 139 Aug 26 00:10 appendonly.aof
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]#
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="appendfilename" tabindex="-1"><a class="header-anchor" href="#appendfilename"><span>appendfilename</span></a></h3><p>该参数决定aof持久化文件的名字</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># The name of the append only file (default: &quot;appendonly.aof&quot;)

appendfilename &quot;appendonly.aof&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dir" tabindex="-1"><a class="header-anchor" href="#dir"><span>dir</span></a></h3><p>该参数决定aof文件持久化位置，默认为redis-server的位置</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># The working directory.
#
# The DB will be written inside this directory, with the filename specified
# above using the &#39;dbfilename&#39; configuration directive.
#
# The Append Only File will also be created inside this directory.
#
# Note that you must specify a directory here, not a file name.
dir ./

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="appendfsync" tabindex="-1"><a class="header-anchor" href="#appendfsync"><span>appendfsync</span></a></h3><p>在介绍appendfsync，我们必须介绍一下操作系统提供的两个函数</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. write:write操作会触发操作系统延迟写机制，即将需要被写入磁盘的数据先写入页缓冲区，写入完成后立刻返回。同步到硬盘操作由操作系统决定，有可能会因为页缓冲区满了或者特定周期时间点到了，页缓冲区的数据就会被写到磁盘中。所以在文件同步前，如果服务器宕机了，就很可能造成数据丢失。
2. fsync:该调用会强制将缓存写入磁盘中，写入完成后才会结束阻塞，从而保证数据持久化。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>appendfsync 参数决定aof的同步策略，参数有如下三种:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. always:该选项会使得命令一旦写入aof_buf后，就会调用操作系统的fsync将指令写到aof物理文件中，完成操作后线程返回
2. everysec:该选项会在命令写入aof_buf后调用操作系统的wirte，完成write后线程返回。fsync会由专门的线程美标调用一次
3. no:该选项会在命令写入aof_buf后调用操作系统的write，完成write后线程返回，不调用fsync，同步操作由操作系统执行，最长周期为30s。
 appendfsync always
# appendfsync everysec
# appendfsync no

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以配置时，我们建议采用默认的写入策略everysec，他不会像always造成线程阻塞亦或者像no一样不可控。</p><h3 id="no-appendfsync-on-rewrite" tabindex="-1"><a class="header-anchor" href="#no-appendfsync-on-rewrite"><span>no-appendfsync-on-rewrite</span></a></h3><p>redis为了保证持久化aof文件时调用fsync时不会出现长时间的卡顿，增加了该参数，若设置为yes，则加redis调用fsync时不会将这段时间客户端写入的指令存放到页缓存(Page Cache)中(但是redis服务端仍然在接收客户端的各种指令)。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># When the AOF fsync policy is set to always or everysec, and a background
# saving process (a background save or AOF log background rewriting) is
# performing a lot of I/O against the disk, in some Linux configurations
# Redis may block too long on the fsync() call. Note that there is no fix for
# this currently, as even performing fsync in a different thread will block
# our synchronous write(2) call.
#
# In order to mitigate this problem it&#39;s possible to use the following option
# that will prevent fsync() from being called in the main process while a
# BGSAVE or BGREWRITEAOF is in progress.
#
# This means that while another child is saving, the durability of Redis is
# the same as &quot;appendfsync none&quot;. In practical terms, this means that it is
# possible to lose up to 30 seconds of log in the worst scenario (with the
# default Linux settings).
#
# If you have latency problems turn this to &quot;yes&quot;. Otherwise leave it as
# &quot;no&quot; that is the safest pick from the point of view of durability.

no-appendfsync-on-rewrite no

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>auto-aof-rewrite-percentage和auto-aof-rewrite-min-size</p><p>这两个参数决定redis合适进行重写，如下所示，这两个参数分别为100和64mb，意味当本次aof文件超过<code>64+64*100%</code>就触发redis自动重写。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="aof-load-truncated" tabindex="-1"><a class="header-anchor" href="#aof-load-truncated"><span>aof-load-truncated</span></a></h3><p>若设置为yes时在redis加载aof文件出错后会发送日志通知用户，反之则不做任何处理也不会启动redis，用户可以使用<code>redis-check-aof</code>指令完成数据修复。 这个参数笔者会在后文演示。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># If aof-load-truncated is set to yes, a truncated AOF file is loaded and
# the Redis server starts emitting a log to inform the user of the event.
# Otherwise if the option is set to no, the server aborts with an error
# and refuses to start. When the option is set to no, the user requires
# to fix the AOF file using the &quot;redis-check-aof&quot; utility before to restart
# the server.
#
# Note that if the AOF file will be found to be corrupted in the middle
# the server will still exit with an error. This option only applies when
# Redis will try to read more data from the AOF file but not enough bytes
# will be found.
aof-load-truncated yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="aof-rewrite-incremental-fsync" tabindex="-1"><a class="header-anchor" href="#aof-rewrite-incremental-fsync"><span>aof-rewrite-incremental-fsync</span></a></h3><p>开启该参数后，子进程在进行aof重写时，每32m就会将数据写到的新的aof文件中，从而避免单刷造成的线程阻塞。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># When a child rewrites the AOF file, if the following option is enabled
# the file will be fsync-ed every 32 MB of data generated. This is useful
# in order to commit the file to the disk more incrementally and avoid
# big latency spikes.
aof-rewrite-incremental-fsync yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="aof-use-rdb-preamble" tabindex="-1"><a class="header-anchor" href="#aof-use-rdb-preamble"><span>aof-use-rdb-preamble</span></a></h3><p>redis 4.0之后支持同时开启rdb和aof，具体后文会详述</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># When rewriting the AOF file, Redis is able to use an RDB preamble in the
# AOF file for faster rewrites and recoveries. When this option is turned
# on the rewritten AOF file is composed of two different stanzas:
#
#   [RDB file][AOF tail]
#
# When loading, Redis recognizes that the AOF file starts with the &quot;REDIS&quot;
# string and loads the prefixed RDB file, then continues loading the AOF
# tail.
aof-use-rdb-preamble yes

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="aof实践" tabindex="-1"><a class="header-anchor" href="#aof实践"><span>AOF实践</span></a></h2><p>介绍aof相关参数后，我们就来演示一下aof使用</p><h3 id="模拟断电数据丢失恢复" tabindex="-1"><a class="header-anchor" href="#模拟断电数据丢失恢复"><span>模拟断电数据丢失恢复</span></a></h3><p>我们在之前的aof文件重命名，模拟断电后数据丢失</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv appendonly.aof appendonly.aof.bak


# 重启redis服务端，打开客户端查看数据都丢失了
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379&gt; auth 123
OK
127.0.0.1:6379&gt; keys *
(empty array)


# 将aof文件还原，并重启redis

[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# mv appendonly.aof.bak appendonly.aof
mv: overwrite ‘appendonly.aof’? y
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf


# 再次使用redis查看，丢失的数据都回来了
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379&gt; auth 123
OK
127.0.0.1:6379&gt; keys *
1) &quot;k4&quot;
2) &quot;k3&quot;
3) &quot;k2&quot;
4) &quot;k1&quot;
127.0.0.1:6379&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重写机制" tabindex="-1"><a class="header-anchor" href="#重写机制"><span>重写机制</span></a></h2><h3 id="重写如何压缩文件体积" tabindex="-1"><a class="header-anchor" href="#重写如何压缩文件体积"><span>重写如何压缩文件体积</span></a></h3><p>上文已经阐述了redis重写的时机，随着时间的推移，aof文件大小会不断扩大，所以我们需要进行重写完成对aof文件体积的压缩，重写压缩的方式如下，而redis之所以可以实现文件压缩原因有如下:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>        1. redis重写会根据进程内的数据将过期的指令移除，如下所示列表里面A B C等都被pop掉了，所以重写时就不会记录这些指令的push操作
        2. 如下图所示，最终列表u:list只会剩下D C N三个值，重写会将这些值使用一条指令完成
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022043777.png" alt="在这里插入图片描述"></p><h3 id="重写是否会阻塞线程" tabindex="-1"><a class="header-anchor" href="#重写是否会阻塞线程"><span>重写是否会阻塞线程</span></a></h3><p>会，只不过是fork出bgrewriteaof子进程时阻塞。其重写工作流程如下图所示，整体步骤为:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. fork一个子进程完成负责将原有的aof文件进行重写，此时的客户端新写的数据都会存放到aof缓冲中
2. 子进程完成重写后通知父进程，父进程会将新写的数据追加到aof日志缓冲区，但是在高并发情况下，这极可能造成缓冲区过大，造成追加数据阻塞，所以redis后来通过Linux管道技术实现重写期间就能将缓冲区的数据进行存放到新的aof日志中，这样重写结束后，也只需追加最新的aof缓冲数据即可
3. 重写aof新文件的名字，原子覆盖旧的aof文件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044090.png" alt="在这里插入图片描述"></p><h3 id="重启加载" tabindex="-1"><a class="header-anchor" href="#重启加载"><span>重启加载</span></a></h3><p>由于redis持久化机制存在两种情况，所以重启redis加载磁盘数据文件就会先判断是否存在aof，若有aof优先加载aof文件，若没有才加载rdb文件。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044237.png" alt="在这里插入图片描述"></p><h3 id="文件校验" tabindex="-1"><a class="header-anchor" href="#文件校验"><span>文件校验</span></a></h3><p>上文说过，aof机制很可能出现写入一半服务器宕机造成aof文件存在错误数据，以下这个示例就是实现如何修复错误数据</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 追加一个错误数据到aof文件末行并杀死redis 模拟服务器宕机
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# vim appendonly.aof


# 再次启动redis，操作数据时发现登录失败
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
Could not connect to Redis at 127.0.0.1:6379: Connection refused
not connected&gt;


#  使用 redis-check-aof --fix aof文件 修复文件
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-check-aof --fix appendonly.aof
0x              8b: Expected prefix &#39;*&#39;, got: &#39;s&#39;
AOF analyzed: size=151, ok_up_to=139, ok_up_to_line=34, diff=12
This will shrink the AOF from 151 bytes, with 12 bytes, to 139 bytes
# 这里选择y
Continue? [y/N]: y
Successfully truncated AOF

# 重启redis，使用客户端连接发现启动成功且数据都还在
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-server /root/redis/redis.conf
[root@iZ8vb7bhe4b8nhhhpavhwpZ sbin]# redis-cli
127.0.0.1:6379&gt; auth 123
OK
OK
127.0.0.1:6379&gt; keys *
1) &quot;k4&quot;
2) &quot;k3&quot;
3) &quot;k2&quot;
4) &quot;k1&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><h3 id="使用优势和劣势" tabindex="-1"><a class="header-anchor" href="#使用优势和劣势"><span>使用优势和劣势</span></a></h3><p>优势:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>    1. 备份机制更稳健，丢失数据几率低
    2. 日志可读，可以处理误操作
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>劣势:</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 比RDB更占磁盘空间
2. 每次AOF都进行fsync的话，性能开销大
3. 恢复和备份速度较慢
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用建议" tabindex="-1"><a class="header-anchor" href="#使用建议"><span>使用建议</span></a></h3><p><code>Redis4.0</code>实现了RDB和AOF混合方式，即可在两次RDB之间使用AOF记录操作，RDB持久化数据之后清空两次rdb之间的aof文件记录。从而用到RDB快照恢复以及AOF简单记录的优势。</p><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044226.png" alt="在这里插入图片描述"></p><h2 id="相关面试题" tabindex="-1"><a class="header-anchor" href="#相关面试题"><span>相关面试题</span></a></h2><ol><li>什么是 AOF 持久化？</li></ol><blockquote><p>与RDB相对的持久化机制，实时性更好，记录的是用户成功操作后的指令，缺点是数据备份和恢复略慢与RDB。</p></blockquote><ol><li>AOF 重写了解吗？</li></ol><blockquote><p>上文给出两条配置会触发redis重写机制，重写会fork一个子进程完成旧aof文件压缩重写，在此期间新写入数据都会在aof_buf中，redis通过Linux管道技术支持将aof缓冲数据直接写道新的aof文件。重写完成后会通过修改新的aof文件名实现原子替换。</p></blockquote><ol><li>Redis 4.0 对于持久化机制做了什么优化？</li></ol><blockquote><p>开启aof-use-rdb-preamble，支持两次rdb之间使用aof记录数据，每次RDB结束后将AOF文件数据清空。完美利用RDB持久化快照恢复和AOF数据实时记录的优势。</p></blockquote>`,81),l=[d];function t(r,o){return i(),n("div",null,l)}const u=e(s,[["render",t],["__file","AOF简介.html.vue"]]),h=JSON.parse('{"path":"/Redis/AOF%E7%AE%80%E4%BB%8B.html","title":"AOF简介","lang":"zh-CN","frontmatter":{"description":"AOF简介 什么是AOF AOF 持久化就是在客户端执行完成操作指令后将该指定先记录到内存中，在根据持久化机制将这些指令持久化到硬盘的一种机制**(写后再日志记录)**。注意，这种持久化机制会将指令以文本的形式存储。 AOF为什么采用写后日志 优势 综合考量，redis写后再日志有以下两点好处: 劣势 当然在生产环境，这种持久化机制很可能产生两种问题:...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/Redis/AOF%E7%AE%80%E4%BB%8B.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"AOF简介"}],["meta",{"property":"og:description","content":"AOF简介 什么是AOF AOF 持久化就是在客户端执行完成操作指令后将该指定先记录到内存中，在根据持久化机制将这些指令持久化到硬盘的一种机制**(写后再日志记录)**。注意，这种持久化机制会将指令以文本的形式存储。 AOF为什么采用写后日志 优势 综合考量，redis写后再日志有以下两点好处: 劣势 当然在生产环境，这种持久化机制很可能产生两种问题:..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022043777.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"AOF简介"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"AOF简介\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022043777.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044090.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044237.png\\",\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022044226.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"什么是AOF","slug":"什么是aof","link":"#什么是aof","children":[]},{"level":2,"title":"AOF为什么采用写后日志","slug":"aof为什么采用写后日志","link":"#aof为什么采用写后日志","children":[{"level":3,"title":"优势","slug":"优势","link":"#优势","children":[]},{"level":3,"title":"劣势","slug":"劣势","link":"#劣势","children":[]}]},{"level":2,"title":"配置参数详解","slug":"配置参数详解","link":"#配置参数详解","children":[{"level":3,"title":"appendonly","slug":"appendonly","link":"#appendonly","children":[]},{"level":3,"title":"appendfilename","slug":"appendfilename","link":"#appendfilename","children":[]},{"level":3,"title":"dir","slug":"dir","link":"#dir","children":[]},{"level":3,"title":"appendfsync","slug":"appendfsync","link":"#appendfsync","children":[]},{"level":3,"title":"no-appendfsync-on-rewrite","slug":"no-appendfsync-on-rewrite","link":"#no-appendfsync-on-rewrite","children":[]},{"level":3,"title":"aof-load-truncated","slug":"aof-load-truncated","link":"#aof-load-truncated","children":[]},{"level":3,"title":"aof-rewrite-incremental-fsync","slug":"aof-rewrite-incremental-fsync","link":"#aof-rewrite-incremental-fsync","children":[]},{"level":3,"title":"aof-use-rdb-preamble","slug":"aof-use-rdb-preamble","link":"#aof-use-rdb-preamble","children":[]}]},{"level":2,"title":"AOF实践","slug":"aof实践","link":"#aof实践","children":[{"level":3,"title":"模拟断电数据丢失恢复","slug":"模拟断电数据丢失恢复","link":"#模拟断电数据丢失恢复","children":[]}]},{"level":2,"title":"重写机制","slug":"重写机制","link":"#重写机制","children":[{"level":3,"title":"重写如何压缩文件体积","slug":"重写如何压缩文件体积","link":"#重写如何压缩文件体积","children":[]},{"level":3,"title":"重写是否会阻塞线程","slug":"重写是否会阻塞线程","link":"#重写是否会阻塞线程","children":[]},{"level":3,"title":"重启加载","slug":"重启加载","link":"#重启加载","children":[]},{"level":3,"title":"文件校验","slug":"文件校验","link":"#文件校验","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[{"level":3,"title":"使用优势和劣势","slug":"使用优势和劣势","link":"#使用优势和劣势","children":[]},{"level":3,"title":"使用建议","slug":"使用建议","link":"#使用建议","children":[]}]},{"level":2,"title":"相关面试题","slug":"相关面试题","link":"#相关面试题","children":[]}],"git":{"createdTime":1662316251000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":10.52,"words":3156},"filePathRelative":"Redis/AOF简介.md","localizedDate":"2022年9月4日","excerpt":"\\n<h2>什么是AOF</h2>\\n<p>AOF 持久化就是在客户端执行完成操作指令后将该指定先记录到内存中，在根据持久化机制将这些指令持久化到硬盘的一种机制**(写后再日志记录)**。注意，这种持久化机制会将指令以文本的形式存储。</p>\\n<h2>AOF为什么采用写后日志</h2>\\n<h3>优势</h3>\\n<p>综合考量，redis写后再日志有以下两点好处:</p>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code>1. 客户端操作的指令可能会出错，采用写后再日志的形式可以避免很多没必要的日志记录，节约磁盘空间\\n2. 写日志需要进行磁盘IO，可能会产生阻塞，所以采用先写入再日志，可以避免写时阻塞\\n</code></pre></div>","autoDesc":true}');export{u as comp,h as data};
