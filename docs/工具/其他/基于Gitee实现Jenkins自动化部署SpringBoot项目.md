# 基于Gitee实现Jenkins自动化部署SpringBoot项目

## 前言

近期项目组需要对老项目做一些持续集成和持续部署的要求，所以再次部署了一边Jenkins，将整个配置过程记录到博客中。 在部署的过程中笔者尝试通过阿里云的方式部署了一遍，而本文为了更直观的介绍整个过程会给予虚拟机再次进行部署。

注:本篇教程部署过程是基于外网部署的，关于内网的部署过程后续笔者会将文章整理出来。

## 预期效果

如下图我们本次配置的Jenkins可以做到下图所示的效果:

1. 我们本地开发项目提交到gitee上。
2. gitee根据我们的配置通知Jenkins更新。
3. Jenkins收到更新通知完成最新分支拉取并更新服务器项目。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719479.png)

所以我们现在在gitee上准备了这样一个spring boot项目。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719266.png)

可以看到如果我们键入

```text
curl 127.0.0.1:9500/hello
```

那么就会输出

```text
Hello mjx!
```

这一点，我们也可以在服务器上得以印证。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719933.png)

现在我们不妨做个修改，将输出结果改为hello java

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719098.png)

然后将项目提交

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719552.png)

随后可以看到我们服务器上的Jenkins自动开始打包。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719928.png)

再次curl一遍，发现结果更新了。这就是我们的持续集成和持续部署的一次完整的流程，是不是比手动打包更方便呢？

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719465.png)

了解了整体预期效果之后，我们就开始Jenkins的安装和配置过程。

## Jenkins安装与配置

### 准备jdk11

注意，最新版本的Jenkins基本都是使用jdk11，所以我们这里需要提前准备一下jdk11。这一步网上应该很多地方都可以找到资料，感兴趣的读者可以自行配置。笔者这里服务器已经提前准备好了，就不多赘述了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719460.png)

### 下载Jenkins安装包

首先自然是到Jenkins官网下载，笔者为了简单，就直接采用war包的形式进行部署。对应war包地址下载如下:

[http://mirrors.jenkins.io/war-stable/latest/jenkins.war(opens new window)](http://mirrors.jenkins.io/war-stable/latest/jenkins.war)

完成war包下载之后，我们将这个包推送到服务器上。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719598.png)

### 启动Jenkins

为了保证后续步骤的顺利，我们先使用前台命令启动一下Jenkins。

```bash
/root/jdk11/bin/java -jar jenkins.war --httpPort=8080
```

如下图所示，如果我们可以通过8080端口打开看到这个页面就说明Jenkins启动成功了。那么我们就可以开始进行Jenkins的初始化配置了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719811.png)

### 进行Jenkins初始化配置

从上文图中我们知道初次访问Jenkins需要键入管理员密码，密码位置在上图也已经展示，我们按需找到对应文件复制粘贴即可。

我们键入命令

```bash
 cat /root/.jenkins/secrets/initialAdminPassword
```

然后会看到一段输出结果，我们将其复制粘贴到页面上即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719438.png)

然后直接点击下一步

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719808.png)

下一个页面，我们按照默认选择推荐插件安装即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719369.png)

这一步可能比较久，大家需要耐心等待一会就好了。等到这一步完成之后我们进入用户基本信息配置了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719284.png)

### 基本信息页面配置用户基本信息

如下图所示，我们只要配置后续用到的登录用户信息即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719583.png)

这里选择默认即可，点击下一步即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719666.png)

自此我们就完成了Jenkins最基础的配置了，后续我们就进入页面进行系统全局的配置了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719106.png)

### 常规插件安装

笔者本次安装的版本为2.387.2，界面看起来还是蛮清爽的。这里我们需要点击下图所示的按钮进入管理界面，找到插件管理进行一些插件安装。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833088.png)

如下图，我们点击manage plugins

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833008.png)

首先找到Publish over SSH，点击安装。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719205.png)

同理由于我们的项目为spring boot项目，所以我们要找到maven插件点击安装。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833222.png)

由于我们的项目存放在gitee上，所以最后就是gitee插件了的安装了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833380.png)

上述步骤安装完成之后，我们重启一下Jenkins确保插件生效以及后台启动开始进入下一步配置步骤。

```bash
nohup /root/jdk11/bin/java  -jar /home/jenkins/jenkins.war --httpPort=8080 &
```

### Jenkins系统配置

我们点击系统配置进入Jenkins全局配置页面。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833674.png)

首先滑到最下方，找到 Publish over SSH进行远程服务器配置。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833735.png)

再往下滑一些输入远程服务器信息。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833392.png)

点击一下测试配置，确认连通性，如果没问题，点击保存即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833065.png)

### 跨域配置解决

笔者上一次搭建过程中，会遇到跨域的问题，所以这里提前设置的一下，解决跨域问题。首先我们点击全局安全设置。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833032.png)

找到跨域请求伪造保护，勾选启动代理兼容器，完成后点击保存即可。 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833329.png)

这里还需要补充一部，笔者上一次部署Jenkins时gitee推送请求到Jenkins报了`403 No valid crumb was included in the request`，所以我们还需要点击脚本命令行输入一段指令解决另一个跨域问题。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833459.png)

如下图所示,在文本框中输入

```bash
hudson.security.csrf.GlobalCrumbIssuerConfiguration.DISABLE_CSRF_PROTECTION = true
```

然后点击运行

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719603.png)

出现result为true，就说明这一步成功了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280835703.png)

回到我们的全局安全配置页面，可以看到跨站请求伪造保护变成这样的文本，由此确认所有的跨域问题都配置解决了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719714.png)

### 插件配置

接下来就是jdk、maven、git相关插件的配置了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833262.png)

首先是maven的配置，这里只需指定maven的setting文件路径即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719978.png)

然后就是jdk的配置

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719973.png)

然后就是git的安装和配置了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833647.png)

最后我们再配置一下maven的路径

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833946.png)

## 项目配置

### 准备一个spring-boot项目

关于Jenkins的基本配置都差不多完成了，接下来我们就可以准备一个web项目实现持续集成和持续部署了。

这里笔者也提前准备好了一个spring boot项目并将其初始化提交到gitee仓库。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833390.png)

### Jenkins上创建一个item

点击新建任务

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833748.png)

输入项目名称，选择构建一个maven项目并点击确定。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280833469.png)

然后我们就到达了项目配置页面了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832585.png)

我们不妨先添加一段描述

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832645.png)

然后输入项目的远程仓库地址，可以看到这里抛出了未认证的问题，原因很简单，我们没有键入git的账号和密码，所以我们点击添加键配置一下。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832596.png)

点击添加，选择Jenkins凭据提供者。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832235.png)

输入gitee账号和密码，然后点击确定。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832726.png)

然后页面就会跳转回源码管理的页面，我们选择刚刚配置的账号即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832775.png)

可以看到现在不仅不会报错了，还输出了一段分支的情况，这里我们默认选择master即可。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832208.png)

我们继续往下滑找到build，输入构建的maven命令，以笔者为例，键入的maven命令为:

```bash
clean package -U -Dmaven.testskip=true
```

注意，上述测试命令无法避免编译测试，如果希望跳过所有测试的用户建议使用下面这个命令:

```bash
clean package -Dmaven.test.skip=true -D.test.skip=true
```

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832452.png)

然后我们就继续配置后置构建完成后的操作了，因为笔者后续会将项目存到tmp目录，所以笔者这里会在tmp目录写一个名为stop.sh的脚本，内容如下:

```bash
#!/bin/bash
echo "Stop Procedure : jenkins-spring-boot.jar"
pid=`ps -ef |grep java|grep jenkins-spring-boot.jar|awk '{print $2}'`
echo 'old Procedure pid:'$pid
if [ -n "$pid" ]
then
kill -9 $pid
fi
exit 0
```

完成后将这个脚本权限设置为777

```bash
chmod 777 stop.sh
```

完成这个脚本配置之后，我们就可以配置post step了

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832471.png)

从上图中可以看到笔者键入了一段脚本，如下所示，这段脚本做的步骤为:

1. maven打包
2. 将打包的jar包复制到tmp目录下，注意这个目录路径格式为`Jenkins工作路径+创建的item名+target+jar包名称`。
3. 进入tmp目录。
4. 执行停止脚本。
5. 重点！！！改变BUILD_ID值，避免Jenkins脚本执行结束后将我们启动的maven项目关闭。
6. 启动项目。

```bash
#!/bin/bash
# 复制文件
cp /root/.jenkins/workspace/first-project/target/jenkins-spring-boot.jar /tmp/
# 进入服务器目录
cd /tmp/
# 停止
sh stop.sh
# 修改BUILD_ID避免下面的启动命令启动的子进程被Jenkins杀掉
BUILD_ID=dontKillMe
nohup java -jar jenkins-spring-boot.jar &
```

### 测试部署过程是否成功

完成所有配置后，我们可以先看看配置是否准确，这里点击构建测试一下。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832198.png)

可以看到任务栏显示我们正在构建的任务，我们可以点击进度条查看进度。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832630.png)

点击控制台输出可以查看构建详情。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832866.png)

经过漫长的等待，可以看到我的部署成功了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832752.png)

我们到服务器看看有没有启动的Java进程，如下所示，可以可以看到Jenkins成功的拉到我们的项目并将项目启动了。

```bash
[root@localhost tmp]# ps -ef |grep java
root       9237      1  0 02:54 ?        00:01:16 /root/jdk11/bin/java -jar jenk                                                                              ins.war --httpPort=8080
root      12928      1 22 05:38 ?        00:00:03 java -jar jenkins-spring-boot.                                                                              jar
root      12969   9681  0 05:38 pts/3    00:00:00 grep --color=auto java
```

测试连通性，可以看到输出了hello java，自此Jenkins的基本部署配置是完成了。

```bash
[root@localhost tmp]# curl 127.0.0.1:9500/hello
Hello java ![root@localhost tmp]#
```

## 基于gitee的webhook实现自动化部署

### 配置Jenkins中的gitee配置

我们上文演示的项目可以看到，我们只需提交一下代码，Jenkins就会自动完成打包部署，这一点就是通过在gitee配置Jenkins的更新触发地址实现的，所以确保上述部署过程是成功的之后，我们不妨完善一下gitee的配置实现自动化部署。

我们在系统管理中找到系统配置选择gitee配置。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280832363.png)

如下图先输入完gitee链接名和url地址。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834311.png)

然后点击添加配置gitee令牌。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834504.png)

点击添加后会出现一个弹窗，如下图我们将类型设置为gitee api令牌，然后点击截图所示的地址到gitee去创建令牌。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280835994.png)

如下图点开这个链接输入我们的账号密码就会到达这个界面，我们需要点击添加创建一个令牌。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834713.png)

如下图，我们编辑好描述直接点击提交。 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280836946.png)

然后我们就会得到一串令牌的值，点击复制。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834081.png)

回到Jenkins粘贴上去，然后点击添加。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834736.png)

此时页面就会跳转回gitee配置页面，我们选择刚刚配置的令牌。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834592.png)

点击一下测试链接，确保成功之后，我们继续下一步。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719419.png)

### 配置构建触发器

回到Jenkins主页，点击我们配置的item

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834827.png)

点击配置，进入配置界面

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834411.png)

找到构建触发器，勾选gitee webhook触发构建，将截图中的url地址记下来，后面配置gitee会用到。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280836254.png)

往下走一点，找到webhook密码点击生成，生成后将其复制下来，配置gitee会用到。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719938.png)

完成配置并将url和生成密码记下来之后点击保存，进入gitee的配置。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834948.png)

### 配置gitee webhook

上文我们得到的Jenkins触发地址和webhook密码，这里我们到gitee界面完成剩余配置。首先点击我们的gitee上对应项目的地址，选择管理。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834879.png)

点击添加web hook,将刚刚复制的url和密码粘贴上去，完成后点击更新。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834358.png)

我们回到页面，可以看到gitee自动触发了一次构建，可以看到请求结果为成功。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834982.png)

我们立刻到Jenkins上看看，可以看到Jenkins收到了gitee的一次构建请求，自此自动化部署就算完全打通了，我们不妨修改一下代码测试一下全流程。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280834355.png)

### 全流程测试

如下图，我们将代码修改一下并提交，只要我们看到最终服务器上输出结果为hello shak-chili就说明Jenkins回自动化部署更新了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/img202305061719202.png)

代码提交后不久，我们看到看了Jenkins自动触发了一次更新。我们耐心等它构建完成。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280835527.png)

完成后，我们请求一下这个地址。可以看到输出结果为hello shack-chili，由此可知整个自动化部署步骤算是完结了。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image/image/202308280835120.png)

## 其他

有时候我们希望重启Jenkins让某些配置生效，亦或者让Jenkins关闭，这里笔者就介绍Jenkins中几个页面上重启和关闭的方式。

### 浏览器进入Jenkins完成登录

```cpp
http://Jenkins的ip地址:Jenkins启动端口/
```

### 关闭Jenkins

```cpp
http://Jenkins的ip地址:Jenkins启动端口/exit 
```

### 重启Jenkies

```cpp
http://Jenkins的ip地址:Jenkins启动端口/restart 
```

### 重新加载配置信息

```cpp
http://Jenkins的ip地址:Jenkins启动端口/reload 
```