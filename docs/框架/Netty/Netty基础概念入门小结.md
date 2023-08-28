# Netty基础概念入门小结

## 来了解一下需要NIO

在了解Netty之前，我们必须了解一些基础的概念，首先自然是传统的BIO模型，我们以代码示例的方式给出BIO服务端的代码，逻辑非常清晰:

1. 创建一个服务端，端口号设置为8888。
2. 创建一个线程，等待客户端建立连接。
3. 为了实现多客户端通信，收到客户端连接申请，需要专门创建一个新的线程和当前客户端保持通信状态。

```java
/**
 * BIO 服务端
 *
 * @author shrk-chili
 */
public class IOServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(8888);
        //创建一个线程等待连接进来的客户端
        new Thread(() -> waitConnect(serverSocket)).start();
    }

    private static void waitConnect(ServerSocket serverSocket) {
        while (true) {
            try {
                // 1. 阻塞方法获取新连接
                Socket socket = serverSocket.accept();

                // 2. 每个客户端来了，就专门创建一个新的连接处理
                new Thread(() -> {
                    int len;
                    byte[] data = new byte[1024];
                    try {
                        InputStream inputStream = socket.getInputStream();
                        // 3. 按字节流方式读取数据
                        while ((len = inputStream.read(data)) != -1) {
                            System.out.println(Thread.currentThread().getName() + " receive msg:" + new String(data, 0, len));
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }).start();

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

同理我们也给出客户端代码，笔者这里创建了3个线程创建客户端，并向客户端写数据:

```java
/**
 * BIO 客户端
 *
 */
public class IOClient {
    public static void main(String[] args) {

        for (int i = 0; i < 3; i++) {
            new Thread(() -> {
                try {
                    Socket socket = new Socket("127.0.0.1", 8888);
                    while (true) {
                        socket.getOutputStream().write((new Date() + ": hello world").getBytes());

                        Thread.sleep(1000);
                    }
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                }
            }, "client-" + i).start();
        }

    }
}
```

随后我们将服务端和客户端启动，可以看到服务端会输出下面这样的结果，可以看到服务端为了客户端专门创建一个线程确保何其通信。

```shell
Thread-1 receive msg:Tue Aug 22 23:03:32 CST 2023: hello world
Thread-3 receive msg:Tue Aug 22 23:03:32 CST 2023: hello world
Thread-2 receive msg:Tue Aug 22 23:03:32 CST 2023: hello world
Thread-2 receive msg:Tue Aug 22 23:03:33 CST 2023: hello world
Thread-3 receive msg:Tue Aug 22 23:03:33 CST 2023: hello world
Thread-1 receive msg:Tue Aug 22 23:03:33 CST 2023: hello world
```

这样就会导致下面这些问题：

1. 高并发场景下，多线程会导致频繁的上下文切换，导致某些任务可能迟迟无法结束。
2. 资源浪费，创建一个线程需要在斩上分配64k甚至是1M的内存空间。
3. 每一个和客户端保持通信的线程并不是实时都有消息接受，可能会有很长一段时间处于空闲阻塞状态，造成没必要的性能开销。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025428.png)

于是我们就有了NIO的概念，如下图所示，在NIO模型上，我们只需用一个线程处理每个客户端的连接请求，收到请求后不再建立新的连接，而是将连接绑定到clientSelector上。 之后客户端的读写请求都会被clientSelector线程轮询到，我们完全可以建立一个线程池将这些事件扔到线程池中，但是这里笔者做了简化，直接用clientSelector的线程处理读写请求，不难看出NIO模型做到了用最少的线程处理尽可能多的连接。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025405.png)

于是我们给出了NIO的示例代码，可以看到代码非常冗长且复杂，但是整体逻辑也很笔者上述差不多:

1. 创建serverSelector 轮询是否有新连接。
2. 创建serverSelector 轮询到新连接，则建立连接后注册读事件到clientSelector 上。
3. clientSelector 轮询，处理每个客户端的连接。
4. clientSelector 处理完轮询到的事件后将事件的key移除。

这里笔者都已给出注释，读者可自行参阅。

```java
public class NIOServer {
    public static void main(String[] args) throws IOException {
        //负责轮询是否有新连接
        Selector serverSelector = Selector.open();
        //负责处理每个客户端是否有数据可读
        Selector clientSelector = Selector.open();

        new Thread(() -> {
            try {
                //创建服务端socket监听通道
                ServerSocketChannel listenerChannel = ServerSocketChannel.open();
                //绑定端口
                listenerChannel.socket().bind(new InetSocketAddress(8888));
                //设置为非阻塞监听
                listenerChannel.configureBlocking(false);
                //注册感兴趣的事件为OP_ACCEPT事件
                listenerChannel.register(serverSelector, SelectionKey.OP_ACCEPT);

                while (true) {
                    //阻塞1毫秒查看是否有新的连接进来
                    if (serverSelector.select(1) > 0) {

                        Set<SelectionKey> set = serverSelector.selectedKeys();
                        Iterator<SelectionKey> keyIterator = set.iterator();

                        while (keyIterator.hasNext()) {
                            SelectionKey key = keyIterator.next();
                            //判断是否是新的socket连接加入
                            if (key.isAcceptable()) {
                                System.out.println("有新的socket连接加入");
                                //接收此通道与socket的连接
                                SocketChannel clientChannel = ((ServerSocketChannel) key.channel()).accept();
                                clientChannel.configureBlocking(false);
                                //服务端监测到新连接之后，不再创建一个新线程，而是直接将
                                //新连接绑定到clientSelector上
                                clientChannel.register(clientSelector, SelectionKey.OP_READ);
                                keyIterator.remove();
                            }
                        }
                    }
                }


            } catch (Exception e) {

            }
        }).start();


        new Thread(() -> {
            while (true) {
                try {
                    //通过clientSelector.select(1)方法可以轮询
                    //出来，进而批量处理
                    if (clientSelector.select(1) > 0) {
                        Set<SelectionKey> set = clientSelector.selectedKeys();
                        Iterator<SelectionKey> keyIterator = set.iterator();
                        while (keyIterator.hasNext()) {
                            SelectionKey key = keyIterator.next();
                            if (key.isReadable()) {
                                try {
                                    //获取事件的通道
                                    SocketChannel clientChannel = (SocketChannel) key.channel();
                                    //数据的读写面向Buffer
                                    ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
                                    //读取数据到buffer中
                                    clientChannel.read(byteBuffer);
                                    byteBuffer.flip();
                                    System.out.println(Thread.currentThread().getName() + ":" + Charset.defaultCharset().newDecoder().decode(byteBuffer).toString());
                                } catch (Exception e) {

                                } finally {
                                    keyIterator.remove();
                                    key.interestOps(SelectionKey.OP_READ);
                                }
                            }
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();


    }
}
```

调试的客户端代码完成可以基于上一个例子，运行后从输出结果可以看出3个客户端对应的请求都用一个线程处理了。

```java
有新的socket连接加入
有新的socket连接加入
有新的socket连接加入
Thread-1:Tue Aug 22 23:26:32 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:32 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:32 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:33 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:33 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:33 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:34 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:34 CST 2023: hello world
Thread-1:Tue Aug 22 23:26:34 CST 2023: hello world
```

可以看出原生NIO虽然相对BIO减小了一定开销且提高一定的性能，但是缺点也很明显:

1. 原生的JDK的NIO概念非常多，使用非常复杂对新手不友好。
2. 底层使用epoll，很容易导致空轮询进而出现CPU100%。
3. 没有对建立连接和处理请求的两个处理建立线程模型，无法较好的发挥它的优势，需要自己进行扩展实现。
4. 项目庞大后，会出现各种奇奇怪怪的bug，很难排查，且维护成本较高。

## Netty详解

### Netty简介

相对与JDK的原生nio，Netty与之相比有着一下的优势:

1. 统一的API，支持多种传输类型、阻塞的和非阻塞的简单而强大的线程模型，真正的无连接数据报套接字，支持链接逻辑组件以支持复用。
2. 易于使用，各种配置只需几个方法的调用就能完成。
3. 性能较好，拥有比 Java 的核心API更高的吞吐量以及更低的延迟得益于池化和复用，拥有更低的资源消耗最少的内存复制。
4. 健壮，不会因为慢速、快速或者超载的连接而导致OutOfMemoryError消除在高速网络中NIO应用程序常见的不公平读/写比率。
5. 安全，完整的SSL/TLS以及 StartTLS支持可用于受限环境下，如Applet和 OSGI。
6. 社区活跃。

### 代码示例

#### 基础代码示例

同样以上面的NIO模型，我们使用Netty编写的服务端代码示例如下，整体步骤非常简单就能完成服务端配置了:

1. 创建serverBootstrap，创建两个NioEventLoopGroup即可完成连接监听和事件处理的线程组配置。
2. channel方法即可完成模型的配置，这里我们选择NIO模型。
3. childHandler即可完成对读写事件处理的配置。
4. 在childHandler里笔者添加了一个SimpleChannelInboundHandler的处理器，该处理器会在服务端与客户端建立连接后调用initChannel，于是笔者通过nioSocketChannel.pipeline()得到处理链添加一个SimpleChannelInboundHandler用于处理所有客户端的发送的消息。
5. 后续一些serverBootstrap的各种配置即可完成TCP等参数配置，读者可自行参阅。
6. 调用bind完成异步连接端口，该方法返回一个future用于判断连接状态。

对应完整的代码，笔者都已详尽注释，读者可自行参阅。

```java
public class NettyServer {
    public static void main(String[] args) {
        // 启动一个netty服务端需要指定 线程模型 IO模型 业务处理逻辑

        // 引导类负责引导服务端启动工作
        ServerBootstrap serverBootstrap = new ServerBootstrap();

        // 以下两个对象可以看做是两个线程组

        // 负责监听端口，接受新的连接
        NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
        // 负责处理每一个连接读写的线程组
        NioEventLoopGroup workerGroup = new NioEventLoopGroup(1);

        // 配置线程组并指定NIO模型
        serverBootstrap.group(bossGroup, workerGroup)
                //设置IO模型，这里为NioServerSocketChannel,建议Linux服务器使用 EpollServerSocketChannel
                .channel(NioServerSocketChannel.class)
                // 定义后续每个连接的数据读写，对于业务处理逻辑
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel nioSocketChannel) throws Exception {
                        nioSocketChannel.pipeline().addLast(new StringDecoder())
                                .addLast(new SimpleChannelInboundHandler<String>() {
                                    @Override
                                    protected void channelRead0(ChannelHandlerContext channelHandlerContext, String msg) throws Exception {
                                        System.out.println(Thread.currentThread().getName() + ":" + msg);
                                    }
                                });
                    }
                });


        // handler() 方法 用于指定服务端启动时的一些逻辑; 注意 childHandler() 方法是为每个新连接添加的处理逻辑，通常用不到
//        serverBootstrap.handler(new ChannelInitializer<NioSocketChannel>() {
//            @Override
//            protected void initChannel(NioSocketChannel nioSocketChannel) throws Exception {
//
//            }
//        });


        // attr() 方法 用于给 NioServerSocketChannel 维护一个 Map，通常也用不到这个方法
        serverBootstrap.attr(AttributeKey.newInstance("serverName"), "nettyServer");
        // childAttr() 方法 可以为每个连接都指定自定义的属性
        serverBootstrap.childAttr(AttributeKey.newInstance("clientKey"), "clientValue");
        // option() 方法 用于给服务端Channel设置一些TCP参数 SO_BACKLOG 表示系统用于临时存放已完成三次握手的请求的队列的最大长度
        serverBootstrap.option(ChannelOption.SO_BACKLOG, 1024);
        // childOption() 方法 用于给每个连接都设置一些TCP参数，SO_KEEPALIVE 表示是否开启TCP心跳机制
        serverBootstrap.childOption(ChannelOption.SO_KEEPALIVE, true);
        // TCP_NODELAY 表示是否开启Nagle算法,如果要求高实时性，有数据发送时就马上发送，就设置为关闭；如果需要减少发送次数，减少网络交互，就设置为开启
        serverBootstrap.childOption(ChannelOption.TCP_NODELAY, true);

        bind(serverBootstrap, 8888);
    }

    /**
     * 以端口号递增的形式尝试绑定端口号
     */
    private static void bind(ServerBootstrap serverBootstrap, int port) {
        // bind 方法是异步的，为其添加监听器，如果绑定成功则结束，反之端口号+1进行绑定
        serverBootstrap.bind(port).addListener(future -> {
            if (future.isSuccess()) {
                System.out.println("端口[" + port + "]绑定成功!");
            } else {
                System.err.println("端口[" + port + "]绑定失败!");
                bind(serverBootstrap, port + 1);
            }
        });
    }
}
```

同样的客户端代码如下，整体步骤也差不多，唯一区别就是客户端没有bossGroup，读者可参考注释理解:

```java
public class NettyClient {

    /**
     * 最大重连间隔
     */
    private static final int MAX_RETRY = 5;

    public static void main(String[] args) throws InterruptedException {
        // 整体即完成netty客户端需要指定线程模型、IO模型、业务处理逻辑

        // 负责客户端的启动
        Bootstrap bootstrap = new Bootstrap();
        // 客户端的线程模型
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();

        // 指定线程组
        bootstrap.group(workerGroup)
                //指定NIO模型
                .channel(NioSocketChannel.class)
                // IO处理逻辑
                .handler(new ChannelInitializer<Channel>() {
                    @Override
                    protected void initChannel(Channel channel) throws Exception {
                        channel.pipeline().addLast(new StringEncoder());
                    }
                });

        // attr() 方法 用于给NioSocketChannel指定一个Map 按需从其中取值
        bootstrap.attr(AttributeKey.newInstance("clientName"), "nettyClient");
        // option() 方法用于指定一些TCP参数 CONNECT_TIMEOUT_MILLIS 指定连接超时的时间
        bootstrap.option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000);
        // SO_KEEPALIVE 表示是否开启TCP心跳机制
        bootstrap.option(ChannelOption.SO_KEEPALIVE, true);
        // TCP_NODELAY 表示是否开启Nagle算法
        bootstrap.option(ChannelOption.TCP_NODELAY, true);

        for (int i = 0; i < 3; i++) {
            new Thread(() -> {
                // 建立连接
                Channel channel = connect(bootstrap, "127.0.0.1", 8888, MAX_RETRY);

                while (true) {
                    System.out.println(Thread.currentThread().getName() + "发送消息");
                    channel.writeAndFlush(Thread.currentThread().getName() + ":" + new Date() + ": Hello world!");
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        }

    }

    /**
     * 建立连接的方法，使用监听器来进行重试
     */
    private static Channel connect(Bootstrap bootstrap, String host, int port, int retry) {
        //connect会返回一个异步的future，所以我们可以通过添加监听查看连接结果
        return bootstrap.connect(host, port)
                .addListener(future -> {
                    if (future.isSuccess()) {
                        System.out.println("连接成功!");
                    } else if (retry == 0) {
                        System.err.println("重试次数已用完，放弃连接！");
                    } else {
                        // 第几次重连
                        int order = (MAX_RETRY - retry) + 1;
                        // 定时任务下次执行重连的时间
                        int delay = 1 << order;
                        System.err.println(new Date() + ": 连接失败，第" + order + "次重连……");
                        //递归进入下一次重连
                        bootstrap.config()
                                .group()
                                .schedule(() -> connect(bootstrap, host, port, retry - 1),
                                delay, TimeUnit.SECONDS);
                    }
                }).channel();
    }
}
```

启动后服务端输出结果:

```java
端口[8888]绑定成功!
nioEventLoopGroup-3-1:Thread-2:Tue Aug 22 23:48:15 CST 2023: Hello world!
nioEventLoopGroup-3-1:Thread-3:Tue Aug 22 23:48:15 CST 2023: Hello world!
nioEventLoopGroup-3-1:Thread-1:Tue Aug 22 23:48:15 CST 2023: Hello world!
nioEventLoopGroup-3-1:Thread-2:Tue Aug 22 23:48:16 CST 2023: Hello world!
nioEventLoopGroup-3-1:Thread-3:Tue Aug 22 23:48:16 CST 2023: Hello world!
nioEventLoopGroup-3-1:Thread-1:Tue Aug 22 23:48:16 CST 2023: Hello world!
```

客户端输出结果:

```java
Thread-1发送消息
Thread-3发送消息
Thread-2发送消息
连接成功!
连接成功!
连接成功!
Thread-2发送消息
Thread-1发送消息
Thread-3发送消息
```

#### 客户端服务端双向通信示例

上一个示例我们完成了客户端和服务端基础使用示例，接下来我们要实现一个需求，我们希望客户端发送给服务端`hello Netty Server`后，服务端会向客户端回复:`Hello Netty client`。

于是我们的服务端配置代码如下，可以看出该客户端按需添加了这样一条逻辑链:

1. 收到客户端消息后，InboundHandlerA先处理消息。
2. InboundHandlerB再处理。
3. FirstServerHandler再处理。
4. 写出数据时，OutboundHandlerA先写，OutboundHandlerB后写。

```java
public class NettyServer {
    public static void main(String[] args) {
        ServerBootstrap serverBootstrap = new ServerBootstrap();

        NioEventLoopGroup boss = new NioEventLoopGroup();
        NioEventLoopGroup worker = new NioEventLoopGroup();

        serverBootstrap.group(boss, worker).channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel ch) throws Exception {
                        // 处理读数据的逻辑
                        ch.pipeline().addLast(new InboundHandlerA()).addLast(new InboundHandlerB());
						//负责处理客户端的读写事件
                        ch.pipeline().addLast(new FirstServerHandler());

                        // 处理写数据的逻辑
                        ch.pipeline().addLast(new OutboundHandlerA()).addLast(new OutboundHandlerB());
                    }
                });

        serverBootstrap.bind("127.0.0.1", 8080);
    }
}
```

对应InboundHandlerA代码如下，InboundHandlerB同理仅修改输出结果:

```java
public class InboundHandlerA extends ChannelInboundHandlerAdapter {

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        System.out.println("InBoundHandlerA: " + msg);
        super.channelRead(ctx, msg);
    }
}
```

FirstServerHandler 代码如下，该类继承ChannelInboundHandlerAdapter并注册到逻辑链上，使得服务端收到消息时会回调channelRead方法，我们就可以通过这个方法处理读请求，并将需要写的数据发送给客户端。

```java
public class FirstServerHandler extends ChannelInboundHandlerAdapter {

    /**
     * 收到客户端数据后会回调该方法
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf byteBuf = (ByteBuf) msg;
        //打印读取到的数据
        System.out.println(new Date() + ": 服务端读到数据 -> " + byteBuf.toString(StandardCharsets.UTF_8));

        // 回复客户端数据
        System.out.println(new Date() + ": 服务端写出数据");
        //组装数据并发送
        ByteBuf out = getByteBuf(ctx);
        ctx.channel().writeAndFlush(out);
    }

    private ByteBuf getByteBuf(ChannelHandlerContext ctx) {
        ByteBuf buffer = ctx.alloc().buffer();

        byte[] bytes = "Hello Netty client ".getBytes(StandardCharsets.UTF_8);

        buffer.writeBytes(bytes);

        return buffer;
    }
}
```

OutboundHandlerA 代码如下，OutboundHandlerB同理仅修改输出。

```java
public class OutboundHandlerA extends ChannelOutboundHandlerAdapter {

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        System.out.println("OutBoundHandlerA: " + msg);
        super.write(ctx, msg, promise);
    }
}
```

同理服务端配置类代码如下，可以看到逻辑链山添加一个FirstClientHandler处理器。

```java
public class NettyClient {
    public static void main(String[] args) {
        Bootstrap bootstrap = new Bootstrap();
        NioEventLoopGroup group = new NioEventLoopGroup();

        bootstrap.group(group).channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    //和服务端建立连接后会调用该方法
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        //返回逻辑处理链
                        ch.pipeline()
                        //添加客户端逻辑处理器
                       .addLast(new FirstClientHandler());
                    }
                });

        bootstrap.connect("127.0.0.1", 8080);
    }
}
```

对应FirstClientHandler 代码如下，可以看到该类继承ChannelInboundHandlerAdapter ，使得客户端处理做到以下几点:

1. 和服务端建立连接后调用channelActive，我们就可以再此时发送数据给服务端。
2. 服务端回复消息时，逻辑链就会回调channelRead，我们就可以读取服务端的消息。

```java
public class FirstClientHandler extends ChannelInboundHandlerAdapter {

    /**
     * 客户端连接服务端成功后会回调该方法
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        System.out.println(new Date() + ": 客户端写出数据");

        // 获取数据
        ByteBuf byteBuf = getByteBuf(ctx);

        // 把数据写到服务端
        ctx.channel().writeAndFlush(byteBuf);
    }

    private ByteBuf getByteBuf(ChannelHandlerContext ctx) {
        byte[] bytes = "hello Netty Server".getBytes(StandardCharsets.UTF_8);

        ByteBuf buffer = ctx.alloc().buffer();

        buffer.writeBytes(bytes);

        return buffer;
    }

    /**
     * 收到服务端数据后，会回调该方法
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg)  {
        ByteBuf byteBuf = (ByteBuf) msg;

        System.out.println("客户端读到数据 -> " + byteBuf.toString(StandardCharsets.UTF_8));
    }
}
```

启动后服务端输出结果如下，可以看到输出顺序就是我们逻辑链上配置的顺序，唯一就是OutBound顺序相反了:`InBoundHandlerA->InBoundHandlerB->FirstServerHandler->OutBoundHandlerB OutBoundHandlerA`。

```java
InBoundHandlerA: PooledUnsafeDirectByteBuf(ridx: 0, widx: 18, cap: 1024)
InBoundHandlerB: PooledUnsafeDirectByteBuf(ridx: 0, widx: 18, cap: 1024)
Wed Aug 23 00:01:17 CST 2023: 服务端读到数据 -> hello Netty Server
Wed Aug 23 00:01:17 CST 2023: 服务端写出数据
OutBoundHandlerB: PooledUnsafeDirectByteBuf(ridx: 0, widx: 19, cap: 256)
OutBoundHandlerA: PooledUnsafeDirectByteBuf(ridx: 0, widx: 19, cap: 256)
```

客户端输出结果，可以看到收到服务端的回复了:

```java
Wed Aug 23 00:01:17 CST 2023: 客户端写出数据
客户端读到数据 -> Hello Netty client 
```

### 异步和事件驱动

Netty的设计思想就是通过选择器使用较少的线程监听更多的连接上的事件，实现非阻塞式的网络IO，结合异步回调的方式调用用户对于IO的逻辑，正是这种工作机制，使得Netty可以从容的应付高并发场景。

## Netty核心组件概览

### 管道(Channel)

我们常常称之为管道，这里我们暂时可以将其理解为一个数据的载体，通过Channel我们可以收到别的数据，也可以将自己的数据发送出去，同样的我们也可以将这个管道打开或者关闭。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025160.png)

### 什么是回调

这个和Netty无关，我们可以说回调其实是一种设计思想，我们还是以Netty为例，例如我们希望在连接被建立进行一些响应的处理，那么Netty就会在连接建立的时候预埋一个接口方法。

如下图，AbstractChannelHandlerContext就编写了一个ChannelInboundHandler接口channelActive方法。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025859.png)

如果我们希望在源码下方即连接建立的时候进行响应的处理，我们就可以继承这个接口，然后编写自己的逻辑，如下代码所示(具体案例笔者会在后文介绍，这里暂时了解一下就行了):

```bash
public class ConnectHandler extends ChannelInboundHandlerAdapter {
    @Override
    //当一个新的连接已经被建立时，channelActive(ChannelHandlerContext)将会被调用
    public void channelActive(ChannelHandlerContext ctx)
            throws Exception {
        System.out.println(
                "Client " + ctx.channel().remoteAddress() + " connected");
    }
}
```

### Future和channel串联

jdk中也有Future相关的概念，只不过Netty对此进行了进一步的优化，如下代码所示，当Netty需要建立连接时，只需使用connect方法建立连接即可，该方法会返回一个ChannelFuture 。

```bash
 //异步地连接到远程节点
        ChannelFuture future = channel.connect(
                new InetSocketAddress("192.168.0.1", 25));
```

而ChannelFuture 则是Netty继承JDK的Future之后自己编写的Future。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025768.png)

那么ChannelFuture 的优化点在哪呢？如下图所示，可以看到Netty使用异步建立连接任务之后，会通过回调的方式，调用我们的注册到future监听上的事件，这就使得我们无需像使用Future那样去阻塞等待或者说时不时的手动判断连接情况，对于连接完成的处理会变得更加高效灵活。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025781.png)

### EventLoop

Netty通过EventLoop将Selector抽象出来,EventLoop为我们做了如下几件事情：

1. 注册感兴趣的事件。
2. 派发请求给响应Handler。
3. 安排进一步的工作。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025149.png)

## Netty基础示例演示

### 服务端代码示例

通过上文我们了解了关于Netty一些概念，我们不妨编写一段代码入门一下Netty，首先我们编写一下服务端的代码，我们首先编写一下服务端的回调处理器，具体参见下方注释，可以看到逻辑很简单:

1. 当服务端收到请求，我们会让服务端走到我们EchoServerHandler ，它会通过channelRead接受客户端请求并输出到控制台，然后告诉客户端收到请求了。
2. 通过channelReadComplete告知channelRead当前读取的消息是最后一条消息了。
3. 当遇到异常时，通过exceptionCaught进行处理错误，避免该请求走到后续注册到ChannelPipeline的channel收到这个请求。

```bash
//标示一个ChannelHandler可以被多个 Channel 安全地共享
@Sharable
public class EchoServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf in = (ByteBuf) msg;

        // 创建一个Bytebuf，默认创建的容量是256
        ByteBuf buffer = ByteBufAllocator.DEFAULT.buffer();
        String resp = "服务端收到你的请求了";
        // 将数据写入ByteBuf
        buffer.writeBytes(resp.getBytes());


        //将消息记录到控制台
        System.out.println(
                "服务端收到客户端的请求: " + in.toString(CharsetUtil.UTF_8));
        //将接收到的消息写给发送者，而不冲刷出站消息
        ctx.write(buffer);
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx)
            throws Exception {
        //将未决消息冲刷到远程节点，并且关闭该 Channel
        ctx.writeAndFlush(Unpooled.EMPTY_BUFFER)
                .addListener(ChannelFutureListener.CLOSE);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause) {
        //打印异常栈跟踪
        cause.printStackTrace();
        //关闭该Channel
        ctx.close();
    }
}
```

完成处理器的逻辑之后，我们就可以创建服务端了，代码如下，笔者已经给出详细逻辑这里就不多赘述了，唯一需要注意的就是`ch.pipeline().addLast(serverHandler);`就是告知服务端，收到请求后要走的回调处理器要用到我们的EchoServerHandler。

```bash
public class EchoServer {
    private final int port;

    public EchoServer(int port) {
        this.port = port;
    }

    public static void main(String[] args)
        throws Exception {

        //设置端口值
        int port = 7000;
        //调用服务器的 start()方法
        new EchoServer(port).start();
    }

    public void start() throws Exception {
        //自定义的ChannelHandler
        final EchoServerHandler serverHandler = new EchoServerHandler();
        //(1) 创建EventLoopGroup
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            //(2) 创建ServerBootstrap
            ServerBootstrap b = new ServerBootstrap();
            b.group(group)
                //(3) 指定所使用的 NIO 传输 Channel
                .channel(NioServerSocketChannel.class)
                //(4) 使用指定的端口设置套接字地址
                .localAddress(new InetSocketAddress(port))
                //(5) 添加一个EchoServerHandler到于Channel的 ChannelPipeline
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    public void initChannel(SocketChannel ch) throws Exception {
                        //EchoServerHandler 被标注为@Shareable，所以我们可以总是使用同样的实例
                        //这里对于所有的客户端连接来说，都会使用同一个 EchoServerHandler，因为其被标注为@Sharable，
                        //这将在后面的章节中讲到。
                        ch.pipeline().addLast(serverHandler);
                    }
                });
            //(6) 异步地绑定服务器；调用 sync()方法阻塞等待直到绑定完成
            ChannelFuture f = b.bind().sync();
            System.out.println(EchoServer.class.getSimpleName() +
                " 开始异步地绑定服务器: " + f.channel().localAddress());
            //(7) 获取 Channel 的CloseFuture，并且阻塞当前线程直到它完成
            f.channel().closeFuture().sync();
        } finally {
            //(8) 关闭 EventLoopGroup，释放所有的资源
            group.shutdownGracefully().sync();
        }
    }
}
```

### 客户端示例

同样我们编写客户端的回调处理器:

1. 它会在连接建立时触发channelActive回调，发送给服务端"你好，我是客户端"。通过channelRead0获取服务端发送的消息。
2. 通过channelRead0收到服务器的请求。
3. 通过exceptionCaught记录连接过程中的错误。

```bash
//标记该类的实例可以被多个 Channel 共享
@Sharable
public class EchoClientHandler
    extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        //当被通知 Channel是活跃的时候，发送一条消息
        ctx.writeAndFlush(Unpooled.copiedBuffer("你好，我是客户端", CharsetUtil.UTF_8));
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx, ByteBuf in) {
        //记录已接收消息的转储
        System.out.println(
                "客户端收到服务端消息: " + in.toString(CharsetUtil.UTF_8));
    }

    @Override
    //在发生异常时，记录错误并关闭Channel
    public void exceptionCaught(ChannelHandlerContext ctx,
        Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
```

然后编写客户端的启动代码

```bash
public class EchoClient {
    private final String host;
    private final int port;

    public EchoClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void start()
        throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            //创建 Bootstrap
            Bootstrap b = new Bootstrap();
            //指定 EventLoopGroup 以处理客户端事件；需要适用于 NIO 的实现
            b.group(group)
                //适用于 NIO 传输的Channel 类型
                .channel(NioSocketChannel.class)
                //设置服务器的InetSocketAddress
                .remoteAddress(new InetSocketAddress(host, port))
                //在创建Channel时，向 ChannelPipeline中添加一个 EchoClientHandler实例
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    public void initChannel(SocketChannel ch)
                        throws Exception {
                        ch.pipeline().addLast(
                             new EchoClientHandler());
                    }
                });
            //连接到远程节点，阻塞等待直到连接完成
            ChannelFuture f = b.connect().sync();
            //阻塞，直到Channel 关闭
            f.channel().closeFuture().sync();
        } finally {
            //关闭线程池并且释放所有的资源
            group.shutdownGracefully().sync();
        }
    }

    public static void main(String[] args)
            throws Exception {


        final String host = "127.0.0.1";
        final int port = 7000;
        new EchoClient(host, port).start();
    }
}
```

### 运行效果

如下图我们首先运行服务端,可以看到服务端监听7000端口了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025218.png)

然后将客户端启动，服务端就会收到消息

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025292.png)

同样的客户端也会收到服务端的回复

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202308231025592.png)

自此我们就简单的完成了Netty的基础入门。