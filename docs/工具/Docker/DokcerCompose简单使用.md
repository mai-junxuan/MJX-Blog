# 简介

我们的使用docker部署微服务时，如果每个微服务都要手动启停，效率是非常低的，所以我们需要一个工具来一键管理这庞大的微服务，Docker Compose就是最好的帮手。

# 安装Docker Compose

## 步骤

### 安装Docker Compose

如下命令所示，这条命令会自动安装适应系统版本的compose

```bash
curl -L "https://github.com/docker/compose/releases/download/1.10.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 为命令添加可执行权限

```bash
chmod +x /usr/local/bin/docker-compose
```

### 查看是否安装成功

```bash
docker-compose --version
```

如下图所示，显示版本号即说明安装成功了

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010152067.png)

### 安装命令补全工具

```bash
curl -L https://raw.githubusercontent.com/docker/compose/$(docker-compose version--short)/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose
```

# 一个快速入门的例子

## 步骤

### 打个jar包扔到服务器上

这里使用书本中参考的源码，具体可以去这里下载 [https://github.com/itmuch/spring-cloud-docker-microservice-book-code-docker.git](http://github.com/itmuch/spring-cloud-docker-microservice-book-code-docker.git) 如下图所示，将这个eureka的项目打成jar扔到自己的服务器上 

![image-20221001015252436](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010153309.png)

### 编写一个Dockerfile

```bash
FROM java:8
VOLUME /tmp
ADD microservice-discovery-eureka-0.0.1.jar app.jar
RUN bash -c 'touch /app.jar'
EXPOSE 8761
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
```

### 编写一个docker-compose.yml

```bash
version: '2'
services:
  eureka: # 指定服务名称
    build: . # 使用当前路径的Dockerfile
    ports:
      - "8761:8761" # 类似与docker run -p 的端口映射
```

### 使用docker-compose up 启动

```bash
docker-compose up
```

### 测试

如下图所示，使用ip:8761即可进入eureka界面，说明配置完成了

![image-20221001015321845](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010153027.png)

# 来聊聊Docker-compose.yml常用指令

## image

指定镜像名称或者镜像id，如果该镜像在本地不存在，Compose会尝试pull下来。

示例：

```bash
image: java
```

## build

指定Dockerfile的路径，如下所示，这就说明Dockerfile文件在当前目录的dir目录下

```bash
build: ./dir
```

## command

覆盖之前的容器启动后默认执行的指令 示例：

```bash
command: bundle exec thin -p 3000
# 也可以是一个list，类似于Dockerfile总的CMD指令，格式如下：

command: [bundle, exec, thin, -p, 3000]
```

## links

链接到其他服务中的容器。可以指定服务名称然后给他起一个别名来使用，就有点mysql语法中的as的意思，如下所示连接到db，我们给他起了哥别名database，后续需要使用这个链接的时候一律使用database：

```bash
web:
  links:
   - db
   - db:database
   - redis
```

## external_links

表示链接到docker-compose.yml外部的容器，甚至并非Compose管理的容器，特别是对于那些提供共享容器或共同服务。格式跟links类似，示例：

```bash
external_links:
 - redis_1
 - project_db_1:mysql
 - project_db_1:postgresql
```

## ports

暴露端口信息。使用宿主端口:容器端口的格式，或者仅仅指定容器的端口（此时宿主机将会随机指定端口），类似于docker run -p ，示例：

```bash
ports:
 - "3000"
 - "3000-3005"
 - "8000:8000"
 - "9090-9091:8080-8081"
 - "49100:22"
 - "127.0.0.1:8001:8001"
 - "127.0.0.1:5000-5010:5000-5010"
```

## expose

暴露端口，只将端口暴露给连接的服务，而不暴露给宿主机，示例：

```bash
expose:
 - "3000"
 - "8000"
```

## volumes

卷挂载路径设置。可以设置宿主机路径 （HOST:CONTAINER） 或加上访问模式 （HOST![CONTAINER](http://github.githubassets.com/images/icons/emoji/CONTAINER.png)ro）。示例：

```bash
volumes:
  # Just specify a path and let the Engine create a volume
  - /var/lib/mysql

  # Specify an absolute path mapping
  - /opt/data:/var/lib/mysql

  # Path on the host, relative to the Compose file
  - ./cache:/tmp/cache

  # User-relative path
  - ~/configs:/etc/configs/:ro

  # Named volume
  - datavolume:/var/lib/mysql
```

## volumes_from

从另一个服务或者容器挂载卷。可以指定只读或者可读写，如果访问模式没有指定，则默认是可读写。示例：

```bash
volumes_from:
 - service_name
 - service_name:ro
 - container:container_name
 - container:container_name:rw
```

## environment

设置环境变量。可以使用数组或者字典两种方式。只有一个key的环境变量可以在运行Compose的机器上找到对应的值，这有助于加密的或者特殊主机的值。示例：

```bash
environment:
  RACK_ENV: development
  SHOW: 'true'
  SESSION_SECRET:

environment:
  - RACK_ENV=development
  - SHOW=true
  - SESSION_SECRET
```

## env_file

从文件中获取环境变量，可以为单独的文件路径或列表。如果通过 docker-compose -f FILE 指定了模板文件，则 env_file 中路径会基于模板文件路径。如果有变量名称与 environment 指令冲突，则以envirment 为准。示例：

```bash
env_file: .env

env_file:
  - ./common.env
  - ./apps/web.env
  - /opt/secrets.env
```

## extends

继承另一个服务，基于已有的服务进行扩展。

## net

设置网络模式。示例：

```bash
net: "bridge"
net: "host"
net: "none"
net: "container:[service name or container name/id]"
```

## dns

配置dns服务器。可以是一个值，也可以是一个列表。示例：

```bash
dns: 8.8.8.8
dns:
  - 8.8.8.8
  - 9.9.9.9
```

## dns_search

配置DNS的搜索域，可以是一个值，也可以是一个列表，示例：

```bash
dns_search: example.com
dns_search:
  - dc1.example.com
  - dc2.example.com
```

# 更进一步，使用Docker编排微服务

## 需求分析

根据笔者了解的资料，为了专注于了解Docker编排微服务，笔者这个实验只用两个服务进行演示，即源码中的eureka模块和user模块，如下图所示两个 

![image-20221001015418328](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010154468.png)

## 步骤

### 两个模块的pom文件都添加构建docker镜像的配置

#### eureka模块

```xml
 <build>
    <plugins>
      <!-- 添加spring-boot的maven插件 -->
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>

      <!-- 添加docker-maven插件 -->
      <plugin>
        <groupId>com.spotify</groupId>
        <artifactId>docker-maven-plugin</artifactId>
        <version>0.4.13</version>
        <configuration>
          <forceTags>true</forceTags>
          <imageName>zhangshiyu3007/microservice-discovery-eureka:0.0.1</imageName>
          <baseImage>java</baseImage>
          <entryPoint>["java", "-jar", "/${project.build.finalName}.jar"]</entryPoint>
          <resources>
            <resource>
              <targetPath>/</targetPath>
              <directory>${project.build.directory}</directory>
              <include>${project.build.finalName}.jar</include>
            </resource>
          </resources>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

#### user模块

```xml
<!-- 添加spring-boot的maven插件 -->
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>

      <!-- 添加docker-maven插件 -->
      <plugin>
        <groupId>com.spotify</groupId>
        <artifactId>docker-maven-plugin</artifactId>
        <version>0.4.13</version>
        <configuration>
          <forceTags>true</forceTags>
          <imageName>zhangshiyu3007/microservice-provider-user:0.0.1</imageName>
          <baseImage>java</baseImage>
          <entryPoint>["java", "-jar", "/${project.build.finalName}.jar"]</entryPoint>
          <resources>
            <resource>
              <targetPath>/</targetPath>
              <directory>${project.build.directory}</directory>
              <include>${project.build.finalName}.jar</include>
            </resource>
          </resources>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

### 编写docker-compose.yml

由于docker中网络模式默认未bridge，而各个容器的ip又不同，因此使用localhost访问是不行的，所以笔者在配置user模块的link时，使用`microservice-discovery-eureka`并起了个别名`discovery`

```bash
version: '2'        # 表示该docker-compose.yml文件使用的是Version 2 file format
services:           # Version 2 file format的固定写法，为project定义服务。
  microservice-discovery-eureka:                                  # 指定服务名称
    image: zhangshiyu3007/microservice-discovery-eureka:0.0.1    # 指定服务所使用的镜像
    ports:                                                        # 暴露端口信息
      - "8761:8761"
  microservice-provider-user:
    image: zhangshiyu3007/microservice-provider-user:0.0.1
    ports:                                                        # 暴露端口信息
    - "8000:8000"
    links:          # 链接到microservice-discovery-eureka，这边使用的是SERVICE:ALIAS的形式
      - microservice-discovery-eureka:discovery
```

### 修改两者的application.yml文件

由于docker中网络模式默认未bridge，而各个容器的ip又不同，因此使用localhost访问是不行的，所以我们可以在user中注册的eureka网络ip使用eureka对应的hostname，由于笔者上文指定eureka链接的别名为discovery，所以下述配置直接使用该名字了，两者的application.yml配置如下所示

#### eureka

```bash
server:
  port: 8761                    # 指定该Eureka实例的端口
eureka:
  client:
    registerWithEureka: false
    fetchRegistry: false
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/

# 参考文档：http://projects.spring.io/spring-cloud/docs/1.0.3/spring-cloud.html#_standalone_mode
# 参考文档：http://my.oschina.net/buwei/blog/618756
```

#### user

可以看到user指定的eureka的defaultZone为`http://discovery:8761/eureka/`

```bash
server:
  port: 8000
spring:
  application:
    name: microservice-provider-user
  jpa:
    generate-ddl: false
    show-sql: true
    hibernate:
      ddl-auto: none
  datasource:                           # 指定数据源
    platform: h2                        # 指定数据源类型
    schema: classpath:schema.sql        # 指定h2数据库的建表脚本
    data: classpath:data.sql            # 指定h2数据库的insert脚本
logging:                                # 配置日志级别，让hibernate打印出执行的SQL
  level:
    root: INFO
    org.hibernate: INFO
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
    org.hibernate.type.descriptor.sql.BasicExtractor: TRACE
eureka:
  client:
    serviceUrl:
      defaultZone: http://discovery:8761/eureka/
  instance:
    prefer-ip-address: true
```

### 扔到服务器中使用命令`mvn clean package docker:build`

### 到达docker-compose.yml的文件夹执行命令`docker-compose up`

```bash
docker-compose up
```

### 测试

最终通过8761和8000都能访问到对应的页面

#### 8761访问eureka界面成功并且可以看到user服务

![image-20221001015544306](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010155442.png) 键入8000端口的网址可以得到如下结果，说明部署成功了

```bash
http://ip:8000/1
```

![image-20221001015557123](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010155122.png)

# 更进一步，使用Docker编排高可用eureka

## 步骤

### 找到项目中的eureka模块

### 配置application.yml

```yaml
spring:
  application:
    name: microservice-discovery-eureka-ha
---
spring:
  profiles: peer1                                 # 指定profile=peer1
server:
  port: 8761
eureka:
  instance:
    hostname: peer1                               # 指定当profile=peer1时，主机名是peer1
  client:
    serviceUrl:
      defaultZone: http://peer2:8762/eureka/      # 将自己注册到peer2这个Eureka上面去

---
spring:
  profiles: peer2
server:
  port: 8762
eureka:
  instance:
    hostname: peer2
  client:
    serviceUrl:
      defaultZone: http://peer1:8761/eureka/
```

### 配置docker-compose.yml

```yaml
version: "2"
services:
  peer1:      # 默认情况下，其他服务可使用服务名称连接到该服务。对于peer2节点，它需连接http://peer1:8761/eureka/，因此，我们可配置该服务的名称为peer1。
    image: itmuch/microservice-discovery-eureka-ha:0.0.1-SNAPSHOT
    hostname: peer1
    ports:
      - "8761:8761"
    environment:
      - spring.profiles.active=peer1
  peer2:
    image: itmuch/microservice-discovery-eureka-ha:0.0.1-SNAPSHOT
    hostname: peer2
    ports:
      - "8762:8762"
    environment:
      - spring.profiles.active=peer2

# docker默认为桥接模式这个命令可以不写
#networks:
#  eureka-net:
#    driver: bridge

## 使用Compose编排高可用的Eureka Server。

```

### 项目扔到服务器中并构建镜像

```bash
mvn clean package docker:build
```

### 使用docker-compose up启动

```bash
docker-compose up
```

### 使用8761 8762端口访问查看结果

如下图所示，可以看到彼此都注册到彼此中心了 ![image-20221001015642614](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010156974.png)![image-20221001015713309](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010157381.png)

# 编排高可用spring cloud集群动态伸缩

## 简介

在很多场景下，例如双十一等高并发场景，某些服务需要分流，对此我们可以就可以通过docker-compose实现动态扩容微服务

## 步骤

### pom配置构建镜像相关和启动后执行的指令

eureka

```xml
 <!-- 添加spring-boot的maven插件 -->
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>

      <!-- 添加docker-maven插件 -->
      <plugin>
        <groupId>com.spotify</groupId>
        <artifactId>docker-maven-plugin</artifactId>
        <version>0.4.13</version>
        <configuration>
          <imageName>itmuch/${project.artifactId}:${project.version}</imageName>
          <forceTags>true</forceTags>
          <baseImage>java</baseImage>
          <entryPoint>["java", "-jar", "/${project.build.finalName}.jar"]</entryPoint>
          <resources>
            <resource>
              <targetPath>/</targetPath>
              <directory>${project.build.directory}</directory>
              <include>${project.build.finalName}.jar</include>
            </resource>
          </resources>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

user

```xml
 <!-- 添加spring-boot的maven插件 -->
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>

      <!-- 添加docker-maven插件 -->
      <plugin>
        <groupId>com.spotify</groupId>
        <artifactId>docker-maven-plugin</artifactId>
        <version>0.4.13</version>
        <configuration>
          <imageName>itmuch/${project.artifactId}:${project.version}</imageName>
          <forceTags>true</forceTags>
          <baseImage>java</baseImage>
          <entryPoint>["java", "-jar", "/${project.build.finalName}.jar"]</entryPoint>
          <resources>
            <resource>
              <targetPath>/</targetPath>
              <directory>${project.build.directory}</directory>
              <include>${project.build.finalName}.jar</include>
            </resource>
          </resources>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

### user服务的application.yml配置两个注册中心

从上文配置中我们已经实现了两个服务注册中心，所以我们这里需要为user模块配置两个注册中心保证高可用

![image-20221001015750531](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010157507.png)

```yaml
server:
  port: 8000
spring:
  application:
    name: microservice-provider-user
  jpa:
    generate-ddl: false
    show-sql: true
    hibernate:
      ddl-auto: none
  datasource:                           # 指定数据源
    platform: h2                        # 指定数据源类型
    schema: classpath:schema.sql        # 指定h2数据库的建表脚本
    data: classpath:data.sql            # 指定h2数据库的insert脚本
logging:                                # 配置日志级别，让hibernate打印出执行的SQL
  level:
    root: INFO
    org.hibernate: INFO
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
    org.hibernate.type.descriptor.sql.BasicExtractor: TRACE
eureka:
  client:
    serviceUrl:
      defaultZone: http://peer1:8761/eureka/,http://peer2:8762/eureka/
  instance:
    prefer-ip-address: true
```

### docker-compose.yml 将所有服务注册到注册中心

可以看到笔者本次的多服务配置，相较于上个例子的来说简便一些，由于所有服务共享一个隔离网络，所以这里服务使用名称`peer1` `peer2`提供给其他服务使用注册

```yaml
version: "2"
services:
  peer1:
    image: itmuch/microservice-discovery-eureka-ha:0.0.1-SNAPSHOT
    hostname: peer2
    ports:
      - "8761:8761"
    environment:
      - spring.profiles.active=peer1
  peer2:
    image: itmuch/microservice-discovery-eureka-ha:0.0.1-SNAPSHOT
    hostname: peer2
    ports:
      - "8762:8762"
    environment:
      - spring.profiles.active=peer2
  microservice-provider-user:
    image: itmuch/microservice-provider-user:0.0.1-SNAPSHOT

```

### 将这些模块的文件扔到服务器上

![image-20221001015814769](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010158793.png)

### 打包

到达每个项目的目录下执行命令

```bash
mvn clean package docker:build
```

### 到docker-compose.yml所在目录运行如下命令

```
docker-compose up
```

### 查看服务是否都起来

![image-20221001015836118](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010158061.png)

### 动态扩容

到达docker-compose.yml目录下键入如下指令可以看到，注册中心都进来了，且user也被扩容成了3个

```bash
docker-compose scale microservice-provider-user=3
```

![image-20221001015911008](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202210010159431.png)
