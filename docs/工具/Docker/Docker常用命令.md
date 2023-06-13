## Docker命令

### Docker安装

##### 查看Linux版本

```bash
cat /etc/redhat-release
```

##### yum安装gcc相关

```bash
yum -y install gcc
yum -y install gcc-c++
```

##### yum安装所需的工具包

```bash
yum install -y yum-utils
```

##### 设置镜像源为阿里云

```bash
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

##### 更新yum软件包索引

```bash
yum makecache fast
```

##### 安装docker ce

```bash
yum -y install docker-ce docker-ce-cli containerd.io
```

##### 启动docker

```bash
systemctl start docker
```

##### 查看docker版本

```bash
docker version
```

##### 卸载docker

```bash
systemctl stop docker
yum remove docker-ce docker-ce-cli containerd.io
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
```

##### 获得阿里镜像源加速器

打开阿里云的容器镜像服务->镜像工具->镜像加速器，获取加速器地址

在Centos里

```bash
mkdir -p /etc/docker
```

在里面创建一个文件，daemon.json

文件内容为，将加速器地址粘在这。

```json
{
    "registry-mirrors": ["https://xxxx.com"]
}
```

##### 重启服务器

```bash
systemctl daemon-reload
systemctl restart docker
```



### 启动类命令

##### 启动docker：

```bash
systemctl start docker
```

##### 停止docker

```bash
system stop docker
```

##### 重启docker

```bash
systemctl restart docker
```

##### 查看docker状态

```bash
systemctl status docker
```

##### 开机启动

```bash
systemctl enable docker
```

##### 查看docker概要信息

```bash
docker info
```



### Docker镜像命令

##### 列出本地主机上的镜像

参数说明：

- -a：列出本地所有的镜像（含历史映像层）
- -q：只显示镜像ID

```bash
docker images
```

##### 查找某个镜像

参数说明：

- --limit：只列出N个镜像，默认25个

```bash
docker search 镜像名字
```

##### 拉取镜像

如果不确定版本，可以去docker hub上找相对应的镜像

```bash
docker pull 镜像名字[:TAG]
```

##### 查看镜像/容器/数据卷所占的空间

```bash
docker system df
```

##### 删除镜像

```bash
删除某个特定镜像，-f代表强制删除，如果已经有容器运行了该镜像，不加上-f是删除不掉的
docker rmi -f 镜像ID
删除多个
docker rmi -f 镜像名1:TAG 镜像名2:TAG
删除全部
docker rmi -f $(docker images -qa)
```



### Docker容器命令

##### 新建+启动容器

参数说明：

- --name：指定容器新名称
- -d：后台运行容器，即启动守护式容器
- -i：以交互模式启动运行容器，与-t同时使用
- -P：随机端口映射，大写P
- -p：指定端口映射，小写p

```bash
docker run [OPTIONS] image [COMMAND] [ARG...]
```

##### 列出正在运行的容器

参数说明：

- -a：列出当前所有正在运行的容器+历史上运行过的
- -l：显示最近创建的容器
- -n：显示最近n个创建的容器
- -q：静默模式，只显示容器编号

```bash
docker ps [OPTIONS]
```

##### 退出容器

```bash
如果是run进去的容器，使用exit退出，容器停止
如果是run进去的容器，使用ctrl+p+q，容器不停止
```

##### 启动已停止运行的容器

```bash
docker start 容器ID或者容器名
```

##### 重启容器

```bash
docker restart 容器ID或者容器名
```

##### 停止容器

```bash
docker stop 容器ID或者容器名
```

##### 强制停止容器

```bash
docker kill 容器ID或者容器名
```

##### 删除已停止的容器

```bash
docker rm 容器ID
一次性删除所有的容器（危险操作）
docker rm -f $(docker ps -a -q)
docker ps -a -q | xargs docker rm
```

##### 前台后台启动

```bash
docker run -it 容器ID:TAG
docker run -d 容器ID:TAG
```

##### 查看容器日志

```bash
docker logs 容器ID
```

##### 查看容器内运行的进程

```bash
docker top 容器ID
```

##### 查看容器内部细节

```bash
docker inspect 容器ID
```

##### 进入正在运行的容器并以命令行交互

```bash
docker exec -it 容器id /bin/bash
docker attach 容器id

exec进入和attach的区别
attach是直接进入容器启动命令的终端，不会启动新的进程，用exit退出，会导致容器的停止。
exec是在容器中打开新的终端，并且可以启动新的进程，用exit退出，会导致容器的停止。
```

##### 从容器内拷贝文件到主机上

```bash
docker cp 容器id:容器内路径 目的主机路径
例:docker cp f1abwef244aa:/usr/local/mycptest/container.txt /tmp/c.txt
```

##### 导入和导出容器

**导出**

```bash
该命令会在当前目录下将该容器打包，形成一个镜像文件。
docker export 容器id > abcd.tar.gz
```

**导入**

```bash
cat abcd.tar.gz | docker import - 镜像名:[TAG]
```

##### Docker镜像commit操作

commit完后可以在docker images中查看到自己commit的容器

```bash
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:[标签名]
```

##### 在ubuntu下安装yum

```bash
apt-get update
apt-get -y install vim
```



### 仓库操作

#### 阿里云库

##### 将自己commit的镜像推送到阿里云

打开自己的仓库镜像，进入到管理界面获取脚本。

```bash
登录
docker login --username=xxxxx registry.cn-shenzhen.aliyuncs.com
将镜像推送到Registry
docker tag 镜像id registry.cn-shenzhen.aliyuncs.com/镜像名:[镜像版本号]
docker push registry.cn-shenzhen.aliyuncs.com/镜像名:[镜像版本号]
```

##### 将阿里云上的镜像下载到本地

```bash
docker pull registry.cn-shenzhen.aliyuncs.com/镜像名:[镜像版本号]
```

#### Docker Registry私服

##### 先下载Docker Registry镜像

```bash
docker pull registry
```

##### 运行registry

```bash
docker run -d -p 5000:5000 -v 宿主机目录:容器目录 --privileged=true registry
```

##### 提交自定义的镜像

```
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:[标签名]
```

##### 查看私服库上有什么镜像

```bash
curl -XGET http://本机ip:5000/v2/_catalog
```

##### 将新的镜像修改为符合私服规范的Tag

```bash
docker tag 镜像:Tag 本机ip:5000/镜像名称:[TAG]
```

##### 修改配置文件daemon.json，加上insecure-registries使其支持http

```json
{
    "registry-mirrors": ["https://xxxx.com"],
    "insecure-registries": ["本机ip:5000"]
}
```

##### 使用push目录推送到私服库

```bash
docker push 本机ip:5000/镜像名
```

##### 拉取私服镜像到本地

```
docker pull 本机ip:5000/镜像名:[TAG]
```



### Docker容器卷

##### 容器卷挂载，宿主机与容器内文件双向绑定

```bash
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录 镜像名
```

##### 使用inspect命令查看是否绑定成功

```bash
docker inspect 容器id
```

![](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202209022310004.png)
##### 容器默认挂载是双向可读可写的

```bash
容器内对该目录可读可写
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:rw 镜像名

容器内对该目录只可读
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录:ro 镜像名
```

##### 容器套娃挂载

```bash
容器1使用挂载命令与本机进行挂载后，容器2与容器1进行挂载
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录 --name 容器1名称 容器1镜像
docker run -it --privileged=true --volumes-from 容器1名称 --name 容器2名称 容器2镜像
```




### Docker安装MySQL

#### 第一步：新建MySQL容器实例

```bash
docker run -d -p 3320:3306 --privileged=true --restart=always -v /docker_mount/mysql3320/mysql/log:/var/log/mysql -v /docker_mount/mysql3320/mysql/data:/var/lib/mysql -v /docker_mount/mysql3320/mysql/conf:/etc/mysql/conf.d  -e MYSQL_ROOT_PASSWORD=123456 -e LANG="C.UTF-8" --name mysql3320 mysql:5.7
```

此台mysql部署在3320端口，并挂载数据在宿主机上。

#### 第二步：在宿主机上配置my.cnf

```ini
[client]
default_character_set=utf8
[mysqld]
collation_server = utf8_general_ci
character_set_server = utf8
```
如果连接慢的话，可以在[mysqld]下加上skip-name-resolve
#### 第三步：重新启动mysql

```bash
docker restart mysql
```

注意：如果之前没有配置my.cnf就建了库和表的话，对于以前的库表的字符集配置文件配置的是不生效的。

#### 总结：

该种方法配置的mysql容器，就算停止掉了，或者直接将该容器删除了，只要再次新建mysql容器的时候，挂载的数据卷一致，数据全部都能保留的。



### Docker-portainer安装

```bash
docker run -d -p 9000:9000 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /portainer_data:/data portainer/portainer-ce:2.0.1
```