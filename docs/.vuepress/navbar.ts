import {navbar} from "vuepress-theme-hope";

export default navbar([
    {
        text: 'AI探索',
        children: [
            {text: 'MCP相关原理', link: '/AI探索/MCP相关原理'},
        ]
    },
    {
        text: '日常',
        children: [
            {text: 'IDEA翻译插件报错更新TKK的问题', link: '/日常/IDEA翻译插件报错更新TKK的问题'},
            {text: 'Vue3中为什么不能使用this', link: '/日常/Vue3中为什么不能使用this'},
            {text: 'windows端口冲突解决', link: '/日常/windows端口冲突解决'},
            {text: '解决依赖冲突', link: '/日常/解决依赖冲突'},
            {text: '如何写好一个单元测试', link: '/日常/如何写好一个单元测试'},
            {text: 'RocketMQ的ConsumeFromWhere失效问题排查', link: '/日常/RocketMQ的ConsumeFromWhere失效问题排查'},
        ]
    },
    {
        text: 'Java',
        children: [
            {text: 'Java基础小结', link: '/Java/Java基础小结'},
            {text: 'Java注解小结', link: '/Java/Java注解小结'},
            {text: 'Java反射小结', link: '/Java/Java反射小结'},
            {text: 'Java中的泛型', link: '/Java/Java中的泛型'},
            {text: '谈谈Java的异常', link: '/Java/谈谈Java的异常'},
            {text: 'Lambda实践', link: '/Java/Lambda实践'},
            {text: 'Stream流实践', link: '/Java/Stream流实践'},
            {text: 'Java中的字符串', link: '/Java/Java中的字符串'},
        ]
    },
    {
        text: 'JUC',
        children: [
            {text: 'Java中的线程池', link: '/JUC/Java中的线程池'},
            {text: 'Java中的并发容器', link: '/JUC/Java中的并发容器'},
            {text: '谈谈ThreadLocal', link: '/JUC/谈谈ThreadLocal'},
            {text: 'synchronized的优化', link: '/JUC/synchronized的优化'},
            {text: 'CAS和原子类', link: '/JUC/CAS和原子类'},
            {text: 'volatile和CAS的弊端', link: '/JUC/volatile和CAS的弊端'},
            {text: 'CompletableFuture简单使用', link: '/JUC/CompletableFuture简单使用'},
            {text: 'AQS简述', link: '/JUC/AQS简述'},
            {text: 'JUC常用工具类', link: '/JUC/JUC常用工具类'},
        ]
    },
    {
        text: 'MySQL',
        children: [
            {text: 'MySQL常用语句', link: '/MySQL/MySQL常用语句'},
            {text: 'MySQL中的事务', link: '/MySQL/MySQL中的事务'},
            {text: '一条SQL的执行过程', link: '/MySQL/一条SQL的执行过程'},
            {text: 'MySQL中datetime和timestamp的区别与选择', link: '/MySQL/MySQL中datetime和timestamp的区别与选择'},
            {text: '普通索引和唯一索引的区别', link: '/MySQL/普通索引和唯一索引的区别'},
            {text: 'Explain语句', link: '/MySQL/Explain语句'},
            {text: 'MySQL的执行成本怎么算', link: '/MySQL/MySQL的执行成本怎么算'},
            {text: 'MVCC实现原理', link: '/MySQL/MVCC实现原理'},
        ]
    },
    {
        text: 'Redis',
        children: [
            {text: 'Redis的安装与基本操作', link: '/Redis/Redis的安装与基本操作'},
            {text: 'Redis的3种特殊类型', link: '/Redis/Redis的3种特殊类型'},
            {text: 'Redis配置文件介绍', link: '/Redis/Redis配置文件介绍'},
            {text: 'Redis的Java客户端示例', link: '/Redis/Redis的Java客户端示例'},
            {text: 'Redis事务', link: '/Redis/Redis事务'},
            {text: 'RDB简介', link: '/Redis/RDB简介'},
            {text: 'AOF简介', link: '/Redis/AOF简介'},
            {text: '主从复制及哨兵', link: '/Redis/主从复制及哨兵'},
            {text: 'Redis集群', link: '/Redis/Redis集群'},
            {text: '使用缓存会存在哪些问题', link: '/Redis/使用缓存会存在哪些问题'},
        ]
    },
    {
        text: '工具',
        children: [
            {
                text: 'Git', children: [
                    {text: 'Git常用命令', link: '/工具/Git/Git常用命令'},
                    {text: 'Git 提交规约', link: '/工具/Git/Git 提交规约'}
                ]
            },
            {
                text: 'Linux', children: [
                    {text: 'Linux的文件结构', link: '/工具/Linux/Linux的文件结构'},
                    {text: 'Linux的进程管理', link: '/工具/Linux/Linux的进程管理'},
                    {text: 'Linux常用网络命令', link: '/工具/Linux/Linux常用网络命令'},
                ]
            },
            {
                text: 'Docker', children: [
                    {text: 'Docker常用命令', link: '/工具/Docker/Docker常用命令'},
                    {text: 'DokcerCompose简单使用', link: '/工具/Docker/DokcerCompose简单使用'}
                ]
            },
            {
                text: 'Nginx', children: [
                    {text: 'Nginx的安装', link: '/工具/Nginx/Nginx的安装'},
                    {text: 'Nginx基础入门', link: '/工具/Nginx/Nginx基础入门'}
                ]
            },
            {
                text: '其他', children: [
                    {text: 'Arthas使用小结', link: '/工具/其他/Arthas使用小结'},
                    {
                        text: '基于Gitee实现Jenkins自动化部署SpringBoot项目',
                        link: '/工具/其他/基于Gitee实现Jenkins自动化部署SpringBoot项目/'
                    },
                    {text: '基于jmeter完成压测', link: '/工具/其他/基于jmeter完成压测'},
                ]
            },
        ]
    },
    {
        text: '分布式',
        children: [
            {text: 'CAP和BASE理论', link: '/分布式/CAP和BASE理论'},
            {text: '分布式事务的解决方案', link: '/分布式/分布式事务的解决方案'},
            {text: '分布式锁的几种实现方式', link: '/分布式/分布式锁的几种实现方式'},
            {text: '什么是xxl-job，它解决什么问题', link: '/分布式/什么是xxl-job，它解决什么问题'},
        ]
    },
    {
        text: '框架',
        children: [
            {
                text: 'Spring', children: [
                    {text: 'Spring的常用注解', link: '/框架/Spring/Spring的常用注解'},
                    {text: '@Autowired注解详解', link: '/框架/Spring/@Autowired注解详解'},
                    {text: 'SpringBean的作用域', link: '/框架/Spring/SpringBean的作用域'},
                    {text: 'Spring三级缓存与循环依赖', link: '/框架/Spring/Spring三级缓存与循环依赖'},
                    {text: 'JDK动态代理和CGlib代理', link: '/框架/Spring/JDK动态代理和CGlib代理'},
                ]
            },
            {
                text: 'Netty', children: [
                    {text: 'Netty基础概念入门小结', link: '/框架/Netty/Netty基础概念入门小结'},
                ]
            },

        ]
    },
    {
        text: '中间件',
        children: [
            {
                text: '消息队列', children: [
                    {text: 'RabbitMQ简单使用', link: '/中间件/RabbitMQ/RabbitMQ简单使用'}
                ]
            },
            {
                text: 'Canal', children: [
                    {text: 'Canal的使用', link: '/中间件/Canal/Canal的使用'}
                ]
            },
            {
                text: 'Sharding-JDBC', children: [
                    {text: 'Sharding-JDBC的简单使用', link: '/中间件/Canal/Canal的使用/Sharding-JDBC的简单使用'}
                ]
            },
        ]
    },
    {
        text: '业务理解',
        children: [
            {text: '对支付系统的个人理解', link: '/业务理解/对支付系统的个人理解'}
        ]
    },
]);