# RabbitMQ简单使用

## 一、基础

### 1.1是什么

RabbitMQ是一个开源的遵循AMQP协议实现的基于Erlang语言编写，支持多种客户端（语言）。用于在分布式系统中存储消息，转发消息，具有高可用，高可扩性，易用性等特征。

### 1.2命令

#### 常用命令

启动服务

> systemctl start rabbitmq-server

重启服务

> systemctl restart rabbitmq-server

查看服务状态

> systemctl status rabbitmq-server

停止服务

> systemctl stop rabbitmq-server

开机启动服务

> systemctl enable rabbitmq-server

安装web控制台插件

> rabbitmq-plugins enable rabbitmq_management

#### 用户相关

> rabbitmqctl add_user 账号 密码
>  rabbitmqctl set_user_tags 账号 administrator
>  rabbitmqctl change_password Username Newpassword 修改密码
>  rabbitmqctl delete_user Username 删除用户
>  rabbitmqctl list_users 查看用户清单
>  rabbitmqctl set_permissions -p / 用户名 ".*" ".*" ".*" 为用户设置administrator角色
>  rabbitmqctl set_permissions -p / root ".*" ".*" ".*"

#### linux排查命令

> more xxx.log  查看日记信息
>  netstat -naop | grep 5672 查看端口是否被占用
>  ps -ef | grep 5672  查看进程
>  systemctl stop 服务

#### docker相关命令

默认用户名密码guest

> docker run -di --name=myrabbit -p 15672:15672 rabbitmq:management

方式二 启动容器时命名为myrabbit，同时映射rabbitmq和宿主机的端口，并设置用户名和密码为admin

> docker run -di --name myrabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 -p 25672:25672 -p 61613:61613 -p 1883:1883 rabbitmq:management

### 1.3角色分类

#### none

- 不能访问management plugin

#### management：查看自己相关节点信息

- 列出自己可以通过AMQP登入的虚拟机
- 查看自己的虚拟机节点 virtual hosts的queues,exchanges和bindings信息
- 查看和关闭自己的channels和connections
- 查看有关自己的虚拟机节点virtual hosts的统计信息。包括其他用户在这个节点virtual hosts中的活动信息。

#### Policymaker

- 包含management所有权限
- 查看和创建和删除自己的virtual hosts所属的policies和parameters信息。

#### Monitoring

- 包含management所有权限
- 罗列出所有的virtual hosts，包括不能登录的virtual hosts。
- 查看其他用户的connections和channels信息
- 查看节点级别的数据如clustering和memory使用情况
- 查看所有的virtual hosts的全局统计信息。

#### Administrator

- 最高权限
- 可以创建和删除virtual hosts
- 可以查看，创建和删除users
- 查看创建permisssions
- 关闭所有用户的connections

## 二、核心组成部分

### 2.1核心概念

**Server**：又称Broker ,接受客户端的连接，实现AMQP实体服务。 安装rabbitmq-server
 **Connection**：连接，应用程序与Broker的网络连接 TCP/IP/ 三次握手和四次挥手
 **Channel**：网络信道，几乎所有的操作都在Channel中进行，Channel是进行消息读写的通道，客户端可以建立对各Channel，每个Channel代表一个会话任务。
 **Message** :消息：服务与应用程序之间传送的数据，由Properties和body组成，Properties可是对消息进行修饰，比如消息的优先级，延迟等高级特性，Body则就是消息体的内容。
 **Virtual Host** 虚拟地址，用于进行逻辑隔离，最上层的消息路由，一个虚拟主机理由可以有若干个Exhange和Queueu，同一个虚拟主机里面不能有相同名字的Exchange
 **Exchange**：交换机，接受消息，根据路由键发送消息到绑定的队列。(==不具备消息存储的能力==)
 **Bindings**：Exchange和Queue之间的虚拟连接，binding中可以保护多个routing key.
 **Routing key**：是一个路由规则，虚拟机可以用它来确定如何路由一个特定消息。
 **Queue**：队列：也成为Message Queue,消息队列，保存消息并将它们转发给消费者。

### 2.2运行流程

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532087.webp)

## 三、支持消息的模式

### 1. 简单模式(Hello World)

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532104.png)

做最简单的事情，一个生产者对应一个消费者，RabbitMQ相当于一个消息代理，负责将A的消息转发给B。

单生产者，单消费者，单队列。

------

应用场景：

> 将发送的电子邮件放到消息队列，然后邮件服务在队列中获取邮件并发送给收件人。

 

### 2. 工作队列模式(Work queues)

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532481.png)

在多个消费者之间分配任务(竞争的消费者模式)，一个生产者对应多个消费者。

适用于资源密集型任务， 单个消费者处理不过来，需要多个消费者进行处理的场景。

单生产者，多消费者，单队列。

------

应用场景：

> 一个订单的处理需要10s，有多个订单可以同时放到消息队列，
>
> 然后让多个消费者同时并行处理，而不是单个消费者的串行消费。

 

### 3. 发布订阅模式(Publish/Subscribe)

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532573.png)

一次向许多消费者发送消息，将消息将广播到所有的消费者。

单生产者，多消费者，多队列。

应用场景：

> 更新商品库存后需要通知多个缓存和多个数据库。

结构如下：

- 一个fanout类型交换机扇出两个消息队列，分别为缓存消息队列、数据库消息队列
- 一个缓存消息队列对应着多个缓存消费者
- 一个数据库消息队列对应着多个数据库消费者

 

### 4. 路由模式(Routing)

![路由模式(Routing)](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532800.png)

根据Routing Key有选择地接收消息。

多消费者，选择性多队列，每个队列通过routing key全文匹配。

> 发送消息到交换机并且要指定路由键(Routing key) 。
> 消费者将队列绑定到交换机时需要指定路由key，仅消费指定路由key的消息。

应用场景：

> 在商品库存中增加了1台iphone12，iphone12促销活动消费者指定routing key为iphone12 promote，
> 只有此促销活动会接收到消息，其它促销活动不关心也不会消费此routing key的消息。

 

### 5. 主题模式(Topics)

![主题模式(Topics)](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532250.png)

主题交换机方式接收消息，将routing key和模式进行匹配。

多消费者，选择性多队列，每个队列通过模式匹配。

> 队列需要绑定在一个模式上。
> \#匹配一个词或多个词，*只匹配一个词。

应用场景：

> iphone促销活动可以接收主题为多种iPhone的消息，如iphone12、iphone13等。

 

### 6. 远程过程调用(RPC)

![远程过程调用(RPC)](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532576.png)

在远程计算机上运行功能并等待结果。

应用场景：

> 需要等待接口返回数据，如订单支付。

 

### 7. 发布者确认(Publisher Confirms)

与发布者进行可靠的发布确认，发布者确认是RabbitMQ扩展，可以实现可靠的发布。

> 在通道上启用发布者确认后，RabbitMQ将异步确认发送者发布的消息，这意味着它们已在服务器端处理。

应用场景：

> 对于消息可靠性要求较高，比如钱包扣款。

## 四、RabbitMQ的使用场景

1. 异步执行
2. 高内聚，低耦合
3. 流量的削峰
4. 分布式事务的可靠消费和可靠生产
5. 索引、缓存、静态化处理的数据同步
6. 流量监控
7. 日志监控（ELK）
8. 下单、订单分发、抢票

## 五、过期时间TTL

过期时间TTL表示可以对消息设置预期的时间，在这个时间内都可以被消费者接收获取；过了之后消息将自动被删除。RabbitMQ可以对**消息和队列**设置TTL。目前有两种方法可以设置。

- 第一种是把消息队列设置成过期类型的队列，web界面会有TTL标识。设置完过期时间后，此队列的所有消息到期后都会过期。如果绑定了死信队列，则会把过期的消息==移到==死信队列里面。
- 第二种是给单个消息设置过期。
- 如果上述两种方法同时使用，则消息的过期时间以两者之间==TTL较小==的那个数值为准。

**TTL标识**

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532420.webp)

## 六、死信队列

DLX，全称为Dead-Letter-Exchange , 可以称之为死信交换机。当消息在一个队列中变成死信(dead message)之后，它能被重新发送到另一个交换机中，这个交换机就是DLX ，绑定DLX的队列就称之为死信队列。消息变成死信的原因：

- 消息被拒绝
- 消息过期
- 队列达到最大长度

> DLX也是一个正常的交换机，和一般的交换机没有区别，它能在任何的队列上被指定，实际上就是设置某一个队列的属性。当这个队列中存在死信时，Rabbitmq就会自动地将这个消息重新发布到设置的DLX上去，进而被路由到另一个队列，即死信队列。要想使用死信队列，只需要在定义队列的时候设置队列参数 `x-dead-letter-exchange` 指定交换机即可

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209210532597.webp)