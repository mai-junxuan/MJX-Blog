## Git 提交规约

### 格式



```text
<type>[scope]: <subject>
// 空一行
[body]
// 空一行
[footer]
```

**注：[]代表可选，<>代表必选。**

### type

必填，用于指定 commit 的类型。



```text
feat：增加新功能
fix：修复 bug
docs：只改动了文档相关的内容
style：格式修改，没有修改代码逻辑，比如格式化、换行等
refactor：重构代码，既没有新增功能，也没有修复 bug，比如提取某段代码为一个方法、重构某个功能等
perf：性能、体验优化等
test：新增 test 用例或修改现有测试用例
build：构造工具的或者外部依赖的改动，比如 maven
ci：与 CI（持续集成服务）有关的改动
chore：不修改 src 或者 test 的其余修改，例如构建过程或辅助工具的变动
revert：执行 git revert 打印的 message
```

**当同时有feat、fix和其他类型时，类型取feat、fix。**

### scope

非必填，用于描述改动的范围，格式一般为项目名/模块名，如果一次 commit 修改多个模块，建议拆分成多次 commit，以便更好追踪和维护。

### subject

必填，此次提交的简短描述，动词开头，第一人称现在时，比如add，而不用 added、adds，第一个字母小写，句尾不加句号（.）

### body

非必填，此次提交的详细描述，主要描述改动之前的情况及修改动机，对于小的修改不作要求，但是重大需求、更新等必须添加body来作说明。

### footer

footer只用于以下两种情况

- break changes

break changes 指明是否产生了破坏性修改，涉及 break changes 的改动必须指明该项，类似版本升级、接口参数减少、接口删除、迁移等，以`BREAKING CHANGE：`开头，后面是变动的描述、变动的理由以及迁移的方法。

- 关闭 issue

当前提交修改了某个 issue

### 示例



```text
fix(ngStyle): correctly remove old style when new style value is invalid

Since d6098ee, old styles were not removed if `newStyles` specified an
invalid value for the style (e.g. `false`). The assumption was that the
new style would overwrite the old style value, but using an invalid
value made browsers ignore the new value and thus keep the old style.
This would typically happen when guarding a style with a boolean flag;
e.g.: `ng-style="{backgroundColor: isError && 'red'}"`

This commit essentially revers commit d6098ee, whose main purpose was
to work around jquery/jquery#4185. The jQuery issue has been fixed in
3.4.0, so that should not be a problem any more.

Fixes #16860

Closes #16868
```