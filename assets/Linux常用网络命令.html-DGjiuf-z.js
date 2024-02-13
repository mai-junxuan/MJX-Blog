import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as i,c as n,a as s}from"./app-DITNE2eT.js";const d={},l=s(`<h1 id="linux常用网络命令" tabindex="-1"><a class="header-anchor" href="#linux常用网络命令"><span>Linux常用网络命令</span></a></h1><h2 id="手动-自动设定与启动-关闭-ip-参数-ifconfig-ifup-ifdown" tabindex="-1"><a class="header-anchor" href="#手动-自动设定与启动-关闭-ip-参数-ifconfig-ifup-ifdown"><span>手动/自动设定与启动/关闭 IP 参数：ifconfig, ifup, ifdown</span></a></h2><h3 id="ifconfig" tabindex="-1"><a class="header-anchor" href="#ifconfig"><span>ifconfig</span></a></h3><p>ifconfig常用于修改网络配置以及查看网络参数的指令</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# ifconfig {interface} {up|down} &lt;== 观察与启动接口
[root@www ~]# ifconfig interface {options} &lt;== 设定与修改接口
选项与参数：
interface：网络卡接口代号，包括 eth0, eth1, ppp0 等等
options ：可以接的参数，包括如下：
up, down ：启动 (up) 或关闭 (down) 该网络接口(不涉及任何参数)
mtu ：可以设定不同的 MTU 数值，例如 mtu 1500 (单位为 byte)
netmask ：就是子屏蔽网络；
broadcast：就是广播地址啊！
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基础示例</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[zhangshiyu@localhost ~]$ ifconfig

# 输出结果
# ens33为网卡代号 mtu为以太网最大传输单元 1500
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
# inet 为ipv4地址 netmask 为子网掩码 broadcast 为广播地址
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        # inet6 为ipv6地址
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        # RX packets 代表接受到网络包数量  errors代表网络包发生错误的数量 ，dropped 代表被丢失的网络包数量
        RX packets 63446  bytes 63343307 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        # 由本机传输的网络包数量 其余字段代表语义遇上相同，只不过传输方向相反
        TX packets 9302  bytes 1593829 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# 环回口网络参数信息，不多赘述
lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3668  bytes 316656 (309.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3668  bytes 316656 (309.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>临时修改某接口ip，如下所示，将lo环回口ip地址改为127.0.0.2，注意我们没有增加子网掩码、广播地址等配置，所以这些参数值都是由系统自动计算得出的</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@localhost zhangshiyu]# ifconfig lo 127.0.0.2
# 使用ifconfig确定修改结果是否生效
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 63701  bytes 63365589 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9417  bytes 1606248 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
        inet 127.0.0.2  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3668  bytes 316656 (309.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3668  bytes 316656 (309.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改环回口地址，子网掩码，mtu值</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@localhost zhangshiyu]# ifconfig lo 127.0.0.2 \\
&gt; netmask 255.255.255.255 mtu 8000
# 使用ifconfig确认修改是否生效
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 63887  bytes 63381397 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9500  bytes 1614832 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 8000
        inet 127.0.0.2  netmask 255.255.255.255
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3668  bytes 316656 (309.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3668  bytes 316656 (309.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@localhost zhangshiyu]#

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>仅仅修改以太网最大mtu的值</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@localhost zhangshiyu]# ifconfig lo mtu 9000
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 63963  bytes 63387686 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9535  bytes 1618429 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.2  netmask 255.255.255.255
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3668  bytes 316656 (309.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3668  bytes 316656 (309.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基于lo口，创建一个仿真的虚拟网络接口</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 如下所示格式为   ifconfig    网口:数字 ip地址等参数
[root@localhost zhangshiyu]# ifconfig lo:0 127.0.0.4
# 可以看到最终会输出一个lo:0的网口
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 64048  bytes 63394595 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9577  bytes 1622719 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.2  netmask 255.255.255.255
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3668  bytes 316656 (309.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3668  bytes 316656 (309.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo:0: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.4  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将上述修改还原</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>/etc/init.d/network restart

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们希望接口直接启动，而无需配置ip，使用下述命令即可</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>ifconfig eth0 up
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="ifup、ifdown" tabindex="-1"><a class="header-anchor" href="#ifup、ifdown"><span>ifup、ifdown</span></a></h3><p>这两条指令只能用于修改过<code>/etc/sysconfig/network-scripts</code>对应接口配置后，对接口进行启动和关闭所用的.注意假如你用ifconfig等命令修改过网络的话，那么ifup、ifdown可能就不会成功，因为这两条指令会将当前网络参数和上述的配置文件进行比较，若不同则不允许ifup、ifdown</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 关闭接口示例
[root@localhost ~]# ifdown ens33
Device &#39;ens33&#39; successfully disconnected.

# 可以看到ens33的ip消失了
[root@localhost ~]# ifconfig 
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 64366  bytes 63427667 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9731  bytes 1650547 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3892  bytes 336256 (328.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3892  bytes 336256 (328.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# 启动接口示例
[root@localhost ~]# ifup ens33
Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/8)

# 可以看到ens33的ip回来了
[root@localhost ~]# ifconfig 
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 64370  bytes 63428006 (60.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9749  bytes 1653181 (1.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3980  bytes 344032 (335.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3980  bytes 344032 (335.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="路由修改-route" tabindex="-1"><a class="header-anchor" href="#路由修改-route"><span>路由修改： route</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# route [-nee]
[root@www ~]# route add [-net|-host] [网域或主机] netmask [mask]
[gw|dev]
[root@www ~]# route del [-net|-host] [网域或主机] netmask [mask]
[gw|dev]
观察的参数：
-n ：不要使用通讯协议或主机名，直接使用 IP 或 port number；
-ee ：使用更详细的信息来显示
增加 (add) 与删除 (del) 路由的相关参数：
-net ：表示后面接的路由为一个网域；
-host ：表示后面接的为连接到单部主机的路由；
netmask ：与网域有关，可以设定 netmask 决定网域的大小；
gw ：gateway 的简写，后续接的是 IP 的数值喔，与 dev 不同；
net.qiang@hotmail.com
dev ：如果只是要指定由那一块网络卡联机出去，则使用这个设定，
后面接 eth0 等
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不显示计算机名字，直接以ip的形式查看路由</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[zhangshiyu@localhost ~]$ route -n

# 输出结果
#Destination     目标网段
# Gateway         经过网关
# Genmask         子网掩码
# flags:U 代表该路由启动的，H 目标是一部主机而非某个网段，G 该路由要走网关，R 使用动态路由时，恢复路由信息的旗标，D:已经由服务或转 port 功能设定为动态路由     M:路由已经被修改了；
# Iface该路由经过的网卡
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
192.168.0.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意路由的排序是由精确到模糊，所以当你配置的两条路由目标网段一致，永远只会走最上面的那条路由，如下所示，两条路由目标地址一致，但是计算机永远只会走ens33这个接口的路由</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens34
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>增加一条路由，注意这条路由必须是你和你计算机同网段或者是可达的，否则会报错</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 增加一条到达127网段的路由 从ens33这张网卡走
[root@localhost zhangshiyu]# route add -net 127.0.0.0 netmask 255.255.255.0 dev ens33

# 可以看到这条路有添加成功了
[root@localhost zhangshiyu]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
127.0.0.0       0.0.0.0         255.255.255.0   U     0      0        0 ens33
192.168.0.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>增加一条默认路由</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 增加一条默认路由 网关为127.0.0.6
[root@localhost zhangshiyu]# route add default gw 127.0.0.6

# 可以看到增加了一条经过网关的默认路由
[root@localhost zhangshiyu]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         127.0.0.6       0.0.0.0         UG    0      0        0 ens33
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
127.0.0.0       0.0.0.0         255.255.255.0   U     0      0        0 ens33
192.168.0.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>删除一条路由，就以笔者路由为例上文中有一条Gateway 为<code>127.0.0.6</code>的默认路由，Destination 为<code>0.0.0.0</code>所以我们的命令如下</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 删除一条Destination 为0.0.0.0 netmask 0.0.0.0 网口为ens33的路由
[root@localhost zhangshiyu]# route del -net 0.0.0.0 netmask 0.0.0.0 dev ens33

# 可以看到删除成功了
[root@localhost zhangshiyu]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
127.0.0.0       0.0.0.0         255.255.255.0   U     0      0        0 ens33
192.168.0.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="网络参数综合指令-ip" tabindex="-1"><a class="header-anchor" href="#网络参数综合指令-ip"><span>网络参数综合指令： ip</span></a></h2><p>这条指令可以完成上述指令的功能，且可以做更多的事情</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# ip [option] [动作] [指令]
选项与参数：
net.qiang@hotmail.com
option ：设定的参数，主要有：
-s ：显示出该装置的统计数据(statistics)，例如总接受封包数等；
动作：亦即是可以针对哪些网络参数进行动作，包括有：
link ：关于装置 (device) 的相关设定，包括 MTU, MAC 地址等等
addr/address ：关于额外的 IP 协议，例如多 IP 的达成等等；
route ：与路由有关的相关设定
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列出所有的接口信息</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@localhost zhangshiyu]# ip link show

# 输出内容
1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 9000 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: ens33: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 00:0c:29:bd:2b:9e brd ff:ff:ff:ff:ff:ff
3: virbr0: &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default qlen 1000
    link/ether 52:54:00:75:26:83 brd ff:ff:ff:ff:ff:ff
4: virbr0-nic: &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc pfifo_fast master virbr0 state DOWN mode DEFAULT group default qlen 1000
    link/ether 52:54:00:75:26:83 brd ff:ff:ff:ff:ff:ff

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动和关闭网络</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 关闭环回口
[root@localhost zhangshiyu]# ip link set lo down
# 查看ip发现lo消失
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 66790  bytes 63767299 (60.8 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 10587  bytes 1748607 (1.6 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# 开启环回口
[root@localhost zhangshiyu]# ip link set lo up

# 查看ip发现lo回来了
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 66879  bytes 63774928 (60.8 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 10641  bytes 1754435 (1.6 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 4194  bytes 362432 (353.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4194  bytes 362432 (353.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改网卡名称</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 修改前记得将网络关闭
[root@localhost zhangshiyu]# ip link set lo down

# 将lo修改为test_lo
[root@localhost zhangshiyu]# ip link set lo name test_lo

# 再次启动查看ip发现名字确实修改了
[root@localhost zhangshiyu]# ip link set lo up
Cannot find device &quot;lo&quot;
[root@localhost zhangshiyu]# ip link set test_lo up


# 查看ip发现名字确实修改了
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 67093  bytes 63792856 (60.8 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 10751  bytes 1765917 (1.6 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

test_lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 4194  bytes 362432 (353.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4194  bytes 362432 (353.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改mac地址</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 将test_lo环回口改为aa:aa:aa:aa:aa:aa
[root@localhost zhangshiyu]# ip link set test_lo address aa:aa:aa:aa:aa:aa

# 查看ip信息得以印证
[root@localhost zhangshiyu]# ip link show
1: test_lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 9000 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback aa:aa:aa:aa:aa:aa brd 00:00:00:00:00:00
2: ens33: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 00:0c:29:bd:2b:9e brd ff:ff:ff:ff:ff:ff
3: virbr0: &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default qlen 1000
    link/ether 52:54:00:75:26:83 brd ff:ff:ff:ff:ff:ff
4: virbr0-nic: &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc pfifo_fast master virbr0 state DOWN mode DEFAULT group default qlen 1000
    link/ether 52:54:00:75:26:83 brd ff:ff:ff:ff:ff:ff

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上文操作都是和网络第二层(数据链路层)相关的操作，接下来我们介绍一下网络第三层的操作</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# ip address show &lt;==就是查阅 IP 参数啊！
[root@www ~]# ip address [add|del] [IP 参数] [dev 装置名] [相关参数]
选项与参数：
show ：单纯的显示出接口的 IP 信息啊；
add|del ：进行相关参数的增加 (add) 或删除 (del) 设定，主要有：
IP 参数：主要就是网域的设定，例如 192.168.100.100/24 之类的设定
喔；
dev ：这个 IP 参数所要设定的接口，例如 eth0, eth1 等等；
相关参数：主要有底下这些：
broadcast：设定广播地址，如果设定值是 + 表示『让系统自动计算』
label ：亦即是这个装置的别名，例如 eth0:0 就是了！
scope ：这个界面的领域，通常是这几个大类：
global ：允许来自所有来源的联机；
site ：仅支持 IPv6 ，仅允许本主机的联机；
link ：仅允许本装置自我联机；
host ：仅允许本主机内部的联机；
所以当然是使用 global 啰！预设也是 global 啦
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列出所有接口的ip参数</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@localhost zhangshiyu]# ip address show

# 输出结果
1: test_lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 9000 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback aa:aa:aa:aa:aa:aa brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host test_lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: ens33: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:bd:2b:9e brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.100/24 brd 192.168.0.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::fee8:8f4e:2041:7509/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: virbr0: &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether 52:54:00:75:26:83 brd ff:ff:ff:ff:ff:ff
4: virbr0-nic: &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc pfifo_fast master virbr0 state DOWN group default qlen 1000
    link/ether 52:54:00:75:26:83 brd ff:ff:ff:ff:ff:ff

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为ens33网卡增加一个虚拟ip</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 增加一条 ip为192.168.2.33/24 广播地址为192.168.0.255 经过ens33网卡的地址
[root@localhost zhangshiyu]#ip address add 192.168.2.33/24 broadcast  +  dev ens33 label ens33:5233

# 可以看到增加成功了
[root@localhost zhangshiyu]# ifconfig
ens33: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::fee8:8f4e:2041:7509  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)
        RX packets 67995  bytes 63887086 (60.9 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 11217  bytes 1815310 (1.7 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens33:5233: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.2.33  netmask 255.255.255.0  broadcast 192.168.2.255
        ether 00:0c:29:bd:2b:9e  txqueuelen 1000  (Ethernet)

test_lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 9000
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 4350  bytes 376116 (367.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4350  bytes 376116 (367.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来就是ip指令关于路由的操作了</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 查看当前路由表
[root@localhost zhangshiyu]# ip route show
default via 192.168.0.254 dev ens33 proto static metric 100
192.168.0.0/24 dev ens33 proto kernel scope link src 192.168.0.100 metric 100
192.168.2.0/24 dev ens33 proto kernel scope link src 192.168.2.33


# 增加一条到达192.168.5.0网段的路由，交由ens33网卡处理
[root@localhost zhangshiyu]# ip route add 192.168.5.0/24 dev ens33

# 查看路由，可以看到增加的路由，说明配置成功了
[root@localhost zhangshiyu]# ip route show
default via 192.168.0.254 dev ens33 proto static metric 100
192.168.0.0/24 dev ens33 proto kernel scope link src 192.168.0.100 metric 100
192.168.2.0/24 dev ens33 proto kernel scope link src 192.168.2.33
192.168.5.0/24 dev ens33 scope link
[root@localhost zhangshiyu]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
192.168.0.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33
192.168.2.0     0.0.0.0         255.255.255.0   U     0      0        0 ens33
192.168.5.0     0.0.0.0         255.255.255.0   U     0      0        0 ens33

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>增加一条默认路由</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 查看当前路由
[root@localhost zhangshiyu]# ip route show
\\default via 192.168.0.254 dev ens33 proto static metric 100
192.168.0.0/24 dev ens33 proto kernel scope link src 192.168.0.100 metric 100
192.168.2.0/24 dev ens33 proto kernel scope link src 192.168.2.33
192.168.5.0/24 dev ens33 scope link

# 增加一条默认路由 网关为192.168.1.254 经过ens33网卡处理
[root@localhost zhangshiyu]# ip route add default via 192.168.1.254 dev ens33
RTNETLINK answers: Network is unreachable
[root@localhost zhangshiyu]# ip route add default via 192.168.0.254 dev ens33
[root@localhost zhangshiyu]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.0.254   0.0.0.0         UG    0      0        0 ens33
0.0.0.0         192.168.0.254   0.0.0.0         UG    100    0        0 ens33
192.168.0.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33
192.168.2.0     0.0.0.0         255.255.255.0   U     0      0        0 ens33
192.168.5.0     0.0.0.0         255.255.255.0   U     0      0        0 ens33

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="网络侦错与观察指令" tabindex="-1"><a class="header-anchor" href="#网络侦错与观察指令"><span>网络侦错与观察指令</span></a></h2><h3 id="两部主机两点沟通-ping-用-ping-追踪路径中的最大-mtu-数值" tabindex="-1"><a class="header-anchor" href="#两部主机两点沟通-ping-用-ping-追踪路径中的最大-mtu-数值"><span>两部主机两点沟通： ping, 用 ping 追踪路径中的最大 MTU 数值</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# ping [选项与参数] IP
选项与参数：
-c 数值：后面接的是执行 ping 的次数，例如 -c 5 ；
-n ：在输出数据时不进行 IP 与主机名的反查，直接使用 IP 输出(速度
较快)；
-s 数值：发送出去的 ICMP 封包大小，预设为 56bytes，不过你可以放大此
一数值；
-t 数值：TTL 的数值，预设是 255，每经过一个节点就会少一；
-W 数值：等待响应对方主机的秒数。
-M [do|dont] ：主要在侦测网络的 MTU 数值大小，两个常见的项目是：
do ：代表传送一个 DF (Don&#39;t Fragment) 旗标，让封包不能重新拆包与
打包；
dont：代表不要传送 DF 旗标，表示封包可以在其他主机上拆包与打包
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ping三次目标主机</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@localhost zhangshiyu]# ping -c 3 192.168.0.107


# 64 bytes 代表icmp封包大小
# icmp_seq=1 第几次探测 1代表第一次
#  ttl=128代表网络封包经过的最大跳数
# time响应时间
PING 192.168.0.107 (192.168.0.107) 56(84) bytes of data.
64 bytes from 192.168.0.107: icmp_seq=1 ttl=128 time=0.345 ms
64 bytes from 192.168.0.107: icmp_seq=2 ttl=128 time=0.352 ms
64 bytes from 192.168.0.107: icmp_seq=3 ttl=128 time=0.277 ms

--- 192.168.0.107 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms
rtt min/avg/max/mdev = 0.277/0.324/0.352/0.039 ms
[root@localhost zhangshiyu]#

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>探测目标路径最大mtu值</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># ping 3次 每个包都不切割，mtu大小为1000byte
[root@localhost zhangshiyu]# ping -c 3 -s 1000 -M do 192.168.0.107
PING 192.168.0.107 (192.168.0.107) 1000(1028) bytes of data.
1008 bytes from 192.168.0.107: icmp_seq=1 ttl=128 time=0.364 ms
1008 bytes from 192.168.0.107: icmp_seq=2 ttl=128 time=0.402 ms
1008 bytes from 192.168.0.107: icmp_seq=3 ttl=128 time=0.705 ms

--- 192.168.0.107 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2001ms
rtt min/avg/max/mdev = 0.364/0.490/0.705/0.153 ms


# 同理mtu增加到1501
[root@localhost zhangshiyu]# ping -c 3 -s 1501 -M do 192.168.0.107
PING 192.168.0.107 (192.168.0.107) 1501(1529) bytes of data.
ping: local error: Message too long, mtu=1500
ping: local error: Message too long, mtu=1500
ping: local error: Message too long, mtu=1500

--- 192.168.0.107 ping statistics ---
3 packets transmitted, 0 received, +3 errors, 100% packet loss, time 2001ms

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="两主机间各节点分析-traceroute" tabindex="-1"><a class="header-anchor" href="#两主机间各节点分析-traceroute"><span>两主机间各节点分析： traceroute</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# traceroute [选项与参数] IP
选项与参数：
-n ：可以不必进行主机的名称解析，单纯用 IP ，速度较快！
-U ：使用 UDP 的 port 33434 来进行侦测，这是预设的侦测协议；
-I ：使用 ICMP 的方式来进行侦测；
net.qiang@hotmail.com
-T ：使用 TCP 来进行侦测，一般使用 port 80 测试
-w ：若对方主机在几秒钟内没有回声就宣告不治...预设是 5 秒
-p 埠号：若不想使用 UDP 与 TCP 的预设埠号来侦测，可在此改变埠号。
-i 装置：用在比较复杂的环境，如果你的网络接口很多很复杂时，才会用到
这个参数；
举例来说，你有两条 ADSL 可以连接到外部，那你的主机会有两个
ppp，
你可以使用 -i 来选择是 ppp0 还是 ppp1 啦！
-g 路由：与 -i 的参数相仿，只是 -g 后面接的是 gateway 的 IP 就是了。
# 追踪本机到百度的路由状态
[root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# traceroute -n www.baidu.com
traceroute to www.baidu.com (110.242.68.3), 30 hops max, 60 byte packets
 1  10.247.219.126  0.730 ms 10.130.126.126  0.436 ms 10.130.127.126  0.804 ms
 2  11.73.6.241  0.971 ms 11.73.15.93  0.900 ms

# 设置等待时间 为1秒，以及 TCP 80 端口的情况下探测路由
[root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# traceroute -w 1    -n -T  www.baidu.com
traceroute to www.baidu.com (110.242.68.4), 30 hops max, 60 byte packets
 1  10.247.218.126  0.757 ms 10.247.219.126  0.682 ms 10.247.218.126  0.758 ms
 2  11.73.16.45  3.663 ms * 11.73.15.117  1.492 ms
 3  11.95.20.137  1.011 ms 11.95.19.193  1.085 ms 11.54.243.125  0.968 ms
 4  10.102.35.113  5.864 ms * 116.251.124.165  1.906 ms
 5  * 10.54.254.73  5.134 ms 140.205.24.145  6.110 ms
 6  10.102.155.114  6.082 ms 61.55.133.157  10.110 ms 10.102.155.130  6.065 ms
 7  202.99.167.25  10.245 ms 116.251.115.61  10.158 ms 202.99.167.53  17.354 ms
 8  211.90.1.37  9.495 ms 61.182.145.22  16.153 ms 211.90.1.69  11.396 ms
 9  61.182.172.41  16.644 ms 202.99.167.53  17.375 ms  17.153 ms
10  61.182.145.26  16.081 ms * 110.242.66.182  18.371 ms
11  * 61.182.184.105  13.422 ms *
12  110.242.66.182  18.259 ms * *
13  * * *
14  * * 110.242.68.4  19.453 ms

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="察看本机的网络联机与后门-netstat" tabindex="-1"><a class="header-anchor" href="#察看本机的网络联机与后门-netstat"><span>察看本机的网络联机与后门： netstat</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# netstat -[rn] &lt;==与路由有关的参数
[root@www ~]# netstat -[antulpc] &lt;==与网络接口有关的参数
选项与参数：
与路由 (route) 有关的参数说明：
-r ：列出路由表(route table)，功能如同 route 这个指令；
-n ：不使用主机名与服务名称，使用 IP 与 port number ，如同 route -n
与网络接口有关的参数：
-a ：列出所有的联机状态，包括 tcp/udp/unix socket 等；
-t ：仅列出 TCP 封包的联机；
-u ：仅列出 UDP 封包的联机；
-l ：仅列出有在 Listen (监听) 的服务之网络状态；
-p ：列出 PID 与 Program 的檔名；
-c ：可以设定几秒钟后自动更新一次，例如 -c 5 每五秒更新一次网络状态
的显示；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列出当前路由表，以ip和port的格式输出</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[zhangshiyu@localhost ~]$ netstat -rn

# 输出结果
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         192.168.92.254  0.0.0.0         UG        0 0          0 ens33
192.168.92.0    0.0.0.0         255.255.255.0   U         0 0          0 ens33
192.168.122.0   0.0.0.0         255.255.255.0   U         0 0          0 virbr0
[zhangshiyu@localhost ~]$

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看当前网络联机状态以ip和port的格式输出</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[zhangshiyu@localhost ~]$ netstat -an
# 输出内容
# Proto 协议是tcp还是udp
# Recv-Q:用户未接收字节数
# Send-Q: 用户未发送完成的字节数，或者说远程主机未确认收到的字节数
# Local Address:本地ip地址以及端口
# Foreign Address:远程ip地址以及端口
# State :连接状态
# ESTABLISED：已建立联机的状态；
#  SYN_SENT：请求同步；
#  SYN_RECV：远程主机收到我们的同步包
#  FIN_WAIT1：请求断开连接
#  FIN_WAIT2：该联机已挂断，但正在等待对方主机响应断线确认的封
包；
#  TIME_WAIT：该联机已挂断，但 socket 还在网络上等待结束；
#  LISTEN：通常用在服务的监听 port 

Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:6010          0.0.0.0:*               LISTEN
tcp        0      0 192.168.92.10:22        192.168.92.1:53374      ESTABLISHED
tcp        0     36 192.168.92.10:22        192.168.92.1:53373      ESTABLISHED
tcp6       0      0 :::111                  :::*                    LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN
tcp6       0      0 ::1:631                 :::*                    LISTEN
tcp6       0      0 ::1:25                  :::*                    LISTEN
tcp6       0      0 ::1:6010                :::*                    LISTEN
udp        0      0 127.0.0.1:323           0.0.0.0:*
udp        0      0 0.0.0.0:872             0.0.0.0:*
udp        0      0 192.168.122.1:53        0.0.0.0:*
udp        0      0 0.0.0.0:67              0.0.0.0:*
udp        0      0 0.0.0.0:111             0.0.0.0:*
udp        0      0 0.0.0.0:5353            0.0.0.0:*
udp        0      0 0.0.0.0:49417           0.0.0.0:*
udp6       0      0 ::1:323                 :::*
udp6       0      0 :::872                  :::*
udp6       0      0 :::111                  :::*
raw6       0      0 :::58                   :::*                    7
Active UNIX domain sockets (servers and established)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ACC ]     STREAM     LISTENING     28673    /var/run/libvirt/libvirt-sock
unix  2      [ ACC ]     STREAM     LISTENING     28675    /var/run/libvirt/libvirt-sock-ro
unix  2      [ ACC ]     STREAM     LISTENING     9219     /run/systemd/journal/stdout
unix  2      [ ACC ]     STREAM     LISTENING     28677    /var/run/libvirt/libvirt-admin-sock

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看当前启动的网络进程</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[zhangshiyu@localhost ~]$ netstat -tulnp
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      -
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:6010          0.0.0.0:*               LISTEN      -
tcp6       0      0 :::111                  :::*                    LISTEN      -
tcp6       0      0 :::22                   :::*                    LISTEN      -
tcp6       0      0 ::1:631                 :::*                    LISTEN      -
tcp6       0      0 ::1:25                  :::*                    LISTEN      -
tcp6       0      0 ::1:6010                :::*                    LISTEN      -
udp        0      0 127.0.0.1:323           0.0.0.0:*                           -
udp        0      0 0.0.0.0:872             0.0.0.0:*                           -
udp        0      0 192.168.122.1:53        0.0.0.0:*                           -
udp        0      0 0.0.0.0:67              0.0.0.0:*                           -
udp        0      0 0.0.0.0:111             0.0.0.0:*                           -
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           -
udp        0      0 0.0.0.0:49417           0.0.0.0:*                           -
udp6       0      0 ::1:323                 :::*                                -
udp6       0      0 :::872                  :::*                                -
udp6       0      0 :::111                  :::*                                -

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查出当前所有的网络进程</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[zhangshiyu@localhost ~]$ netstat -atunp
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      -
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:6010          0.0.0.0:*               LISTEN      -
tcp        0      0 192.168.92.10:22        192.168.92.1:53374      ESTABLISHED -
tcp        0     36 192.168.92.10:22        192.168.92.1:53373      ESTABLISHED -
tcp6       0      0 :::111                  :::*                    LISTEN      -
tcp6       0      0 :::22                   :::*                    LISTEN      -
tcp6       0      0 ::1:631                 :::*                    LISTEN      -
tcp6       0      0 ::1:25                  :::*                    LISTEN      -
tcp6       0      0 ::1:6010                :::*                    LISTEN      -
udp        0      0 127.0.0.1:323           0.0.0.0:*                           -
udp        0      0 0.0.0.0:872             0.0.0.0:*                           -
udp        0      0 192.168.122.1:53        0.0.0.0:*                           -
udp        0      0 0.0.0.0:67              0.0.0.0:*                           -
udp        0      0 0.0.0.0:111             0.0.0.0:*                           -
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           -
udp        0      0 0.0.0.0:49417           0.0.0.0:*                           -
udp6       0      0 ::1:323                 :::*                                -
udp6       0      0 :::872                  :::*                                -
udp6       0      0 :::111                  :::*                                -

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="侦测主机名与-ip-对应-host-nslookup" tabindex="-1"><a class="header-anchor" href="#侦测主机名与-ip-对应-host-nslookup"><span>侦测主机名与 IP 对应： host, nslookup</span></a></h3><h4 id="host" tabindex="-1"><a class="header-anchor" href="#host"><span>host</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# host [-a] hostname [server]
选项与参数：
-a ：列出该主机详细的各项主机名设定数据
[server] ：可以使用非为 /etc/resolv.conf 的 DNS 服务器 IP 来查询。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列出百度的ip地址</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# host www.baidu.com
www.baidu.com is an alias for www.a.shifen.com.
www.a.shifen.com has address 110.242.68.4
www.a.shifen.com has address 110.242.68.3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>指定dns解析域名，命令如下所示，笔者使用8.8.8.8这台dns解析百度的ip地址</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# host www.baidu.com 8.8.8.8
Using domain server:
Name: 8.8.8.8
Address: 8.8.8.8#53
Aliases:

www.baidu.com is an alias for www.a.shifen.com.
www.a.shifen.com is an alias for www.wshifen.com.
www.wshifen.com has address 103.235.46.40
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nslookup" tabindex="-1"><a class="header-anchor" href="#nslookup"><span>nslookup</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# nslookup [-query=[type]] [hostname|IP]
选项与参数：
-query=type：查询的类型，除了传统的 IP 与主机名对应外，DNS 还有很多
信息，
所以我们可以查询很多不同的信息，包括 mx, cname 等等，
例如： -query=mx 的查询方法！
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解析百度域名对应的ip</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# nslookup www.baidu.com
Server:         100.100.2.136
Address:        100.100.2.136#53

Non-authoritative answer:
www.baidu.com   canonical name = www.a.shifen.com.
Name:   www.a.shifen.com
Address: 110.242.68.4
Name:   www.a.shifen.com
Address: 110.242.68.3

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用ip找出对应的域名</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@iZ8vb7bhe4b8nhhhpavhwpZ ~]# nslookup 8.8.8.8
# 从输出结果可以看出这个ip是谷歌的
8.8.8.8.in-addr.arpa    name = dns.google.

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="文字接口网页浏览" tabindex="-1"><a class="header-anchor" href="#文字接口网页浏览"><span>文字接口网页浏览</span></a></h3><h4 id="links" tabindex="-1"><a class="header-anchor" href="#links"><span>links</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# links [options] [URL]
选项与参数：
-anonymous [0|1]：是否使用匿名登录的意思；
-dump [0|1] ：是否将网页的数据直接输出到 standard out 而非 links
软件功能
-dump_charset ：后面接想要透过 dump 输出到屏幕的语系编码，big5 使
用 cp950 喔
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>例如我们想访问Linux内核的网站</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> links http://www.kernel.org
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们就会见到如下图所示的界面，页面操作大抵如下</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>1. 回车或者方向键右:进入白标选中连接
2. 左键:回退到上一个网页
3. 上下键:切换白标选中项
4. g键：按住g输入网址后可进入另一个页面
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209052050361.png" alt="image-20220905205056722"></p><p>将百度的网页导到本地文件中</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 用links将连接文件导入到本地baidu.html中
[root@iZ8vb7bhe4b8nhhhpavhwpZ tmp]# links -dump www.baidu.com &gt;baidu.html
# 查看文件可以看出导入成功了
[root@iZ8vb7bhe4b8nhhhpavhwpZ tmp]# more baidu.html
   Refresh: http://www.baidu.com/baidu.html?from=noscript
   &lt;style data-for=&quot;result&quot; type=&quot;text/css&quot;
   &gt;body{color:#333;background:#fff;padding:6px 0
   0;margin:0;position:relative}body,th,td,.p1,.p2{font-family:arial}p,form,ol,ul,li,dl,dt,dd,h3{margin:0;padding:0;list-style:none}input{padding-top:0;padding
-bottom:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}table,img{border:0}td{font-size:9pt;line-height:18px}em{font-style:nor
mal}em{font-style:normal;color:#c00}a
   em{text-decoration:underline}cite{font-style:normal;color:green}.m,a.m{color:#666}a.m:visited{color:#606}.g,a.g{color:green}.c{color:#77c}.f14{font-size:14p


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="wget" tabindex="-1"><a class="header-anchor" href="#wget"><span>wget</span></a></h4><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# wget [option] [网址]
选项与参数：
若想要联机的网站有提供账号与密码的保护时，可以利用这两个参数来输入
喔！
--http-user=usrname
--http-password=password
--quiet ：不要显示 wget 在抓取数据时候的显示讯息
更多的参数请自行参考 man wget 吧！ ^_^
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用示例，使用wget获取jquery资源</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@iZ8vb7bhe4b8nhhhpavhwpZ tmp]# wget https://code.jquery.com/jquery-3.6.0.min.js
--2022-07-07 09:53:57--  https://code.jquery.com/jquery-3.6.0.min.js
Resolving code.jquery.com (code.jquery.com)... 69.16.175.10, 69.16.175.42, 2001:4de0:ac18::1:a:3a, ...
Connecting to code.jquery.com (code.jquery.com)|69.16.175.10|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 89501 (87K) [application/javascript]
Saving to: ‘jquery-3.6.0.min.js’

100%[=====================================================================================================================&gt;] 89,501       262KB/s   in 0.3s

2022-07-07 09:53:59 (262 KB/s) - ‘jquery-3.6.0.min.js’ saved [89501/89501]

[root@iZ8vb7bhe4b8nhhhpavhwpZ tmp]# ll

# 可以看到jquery的js已经下载到本地了
total 308
-rw-r--r-- 1 root root 211949 Jul  7 09:47 baidu.html
-rw-r--r-- 1 root root  89501 Oct 18  1991 jquery-3.6.0.min.js
drwx------ 3 root root   4096 May 21 19:18 systemd-private-c2a4f4c84d3e40f1b4accddd4d520313-chronyd.service-93ko8E
drwx------ 3 root root   4096 May 21 19:21 systemd-private-c2a4f4c84d3e40f1b4accddd4d520313-nginx.service-cHMIRd
drwxrwxrwx 2 root root   4096 Jun 22 10:28 testDir
[root@iZ8vb7bhe4b8nhhhpavhwpZ tmp]#

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然我们也可以修改wget的代理，只需编辑<code>/etc/wgetrc</code>文件即可，示例如下</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>[root@www ~]# vim /etc/wgetrc
#http_proxy = http://proxy.yoyodyne.com:18023/ &lt;==找到底下这几行，
大约在 78 行
#ftp_proxy = http://proxy.yoyodyne.com:18023/
#use_proxy = on
# 将他改成类似底下的模样，记得，你必须要有可接受的 proxy 主机才行！
net.qiang@hotmail.com
http_proxy = http://proxy.ksu.edu.tw:3128/
use_proxy = on
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,103),a=[l];function r(t,v){return i(),n("div",null,a)}const o=e(d,[["render",r],["__file","Linux常用网络命令.html.vue"]]),m=JSON.parse('{"path":"/%E5%B7%A5%E5%85%B7/Linux/Linux%E5%B8%B8%E7%94%A8%E7%BD%91%E7%BB%9C%E5%91%BD%E4%BB%A4.html","title":"Linux常用网络命令","lang":"zh-CN","frontmatter":{"description":"Linux常用网络命令 手动/自动设定与启动/关闭 IP 参数：ifconfig, ifup, ifdown ifconfig ifconfig常用于修改网络配置以及查看网络参数的指令 基础示例 临时修改某接口ip，如下所示，将lo环回口ip地址改为127.0.0.2，注意我们没有增加子网掩码、广播地址等配置，所以这些参数值都是由系统自动计算得出的 修...","head":[["meta",{"property":"og:url","content":"https://maijunxuan.cn/%E5%B7%A5%E5%85%B7/Linux/Linux%E5%B8%B8%E7%94%A8%E7%BD%91%E7%BB%9C%E5%91%BD%E4%BB%A4.html"}],["meta",{"property":"og:site_name","content":"麦俊轩的博客"}],["meta",{"property":"og:title","content":"Linux常用网络命令"}],["meta",{"property":"og:description","content":"Linux常用网络命令 手动/自动设定与启动/关闭 IP 参数：ifconfig, ifup, ifdown ifconfig ifconfig常用于修改网络配置以及查看网络参数的指令 基础示例 临时修改某接口ip，如下所示，将lo环回口ip地址改为127.0.0.2，注意我们没有增加子网掩码、广播地址等配置，所以这些参数值都是由系统自动计算得出的 修..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209052050361.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-13T21:01:35.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Linux常用网络命令"}],["meta",{"property":"article:author","content":"maijunxuan"}],["meta",{"property":"article:modified_time","content":"2023-06-13T21:01:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Linux常用网络命令\\",\\"image\\":[\\"https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209052050361.png\\"],\\"dateModified\\":\\"2023-06-13T21:01:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"maijunxuan\\"}]}"]]},"headers":[{"level":2,"title":"手动/自动设定与启动/关闭 IP 参数：ifconfig, ifup, ifdown","slug":"手动-自动设定与启动-关闭-ip-参数-ifconfig-ifup-ifdown","link":"#手动-自动设定与启动-关闭-ip-参数-ifconfig-ifup-ifdown","children":[{"level":3,"title":"ifconfig","slug":"ifconfig","link":"#ifconfig","children":[]},{"level":3,"title":"ifup、ifdown","slug":"ifup、ifdown","link":"#ifup、ifdown","children":[]}]},{"level":2,"title":"路由修改： route","slug":"路由修改-route","link":"#路由修改-route","children":[]},{"level":2,"title":"网络参数综合指令： ip","slug":"网络参数综合指令-ip","link":"#网络参数综合指令-ip","children":[]},{"level":2,"title":"网络侦错与观察指令","slug":"网络侦错与观察指令","link":"#网络侦错与观察指令","children":[{"level":3,"title":"两部主机两点沟通： ping, 用 ping 追踪路径中的最大 MTU 数值","slug":"两部主机两点沟通-ping-用-ping-追踪路径中的最大-mtu-数值","link":"#两部主机两点沟通-ping-用-ping-追踪路径中的最大-mtu-数值","children":[]},{"level":3,"title":"两主机间各节点分析： traceroute","slug":"两主机间各节点分析-traceroute","link":"#两主机间各节点分析-traceroute","children":[]},{"level":3,"title":"察看本机的网络联机与后门： netstat","slug":"察看本机的网络联机与后门-netstat","link":"#察看本机的网络联机与后门-netstat","children":[]},{"level":3,"title":"侦测主机名与 IP 对应： host, nslookup","slug":"侦测主机名与-ip-对应-host-nslookup","link":"#侦测主机名与-ip-对应-host-nslookup","children":[]},{"level":3,"title":"文字接口网页浏览","slug":"文字接口网页浏览","link":"#文字接口网页浏览","children":[]}]}],"git":{"createdTime":1662395905000,"updatedTime":1686690095000,"contributors":[{"name":"MJX","email":"1585225345@qq.com","commits":3}]},"readingTime":{"minutes":24.04,"words":7211},"filePathRelative":"工具/Linux/Linux常用网络命令.md","localizedDate":"2022年9月5日","excerpt":"\\n<h2>手动/自动设定与启动/关闭 IP 参数：ifconfig, ifup, ifdown</h2>\\n<h3>ifconfig</h3>\\n<p>ifconfig常用于修改网络配置以及查看网络参数的指令</p>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code>[root@www ~]# ifconfig {interface} {up|down} &lt;== 观察与启动接口\\n[root@www ~]# ifconfig interface {options} &lt;== 设定与修改接口\\n选项与参数：\\ninterface：网络卡接口代号，包括 eth0, eth1, ppp0 等等\\noptions ：可以接的参数，包括如下：\\nup, down ：启动 (up) 或关闭 (down) 该网络接口(不涉及任何参数)\\nmtu ：可以设定不同的 MTU 数值，例如 mtu 1500 (单位为 byte)\\nnetmask ：就是子屏蔽网络；\\nbroadcast：就是广播地址啊！\\n</code></pre></div>","autoDesc":true}');export{o as comp,m as data};
