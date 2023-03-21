# 前言

java8提供的流式编程使得我们对于集合的处理不再是以往的指令式操作(即各种显示循环拿元素操作)，所以笔者就以这篇文章介绍以下流式编程中的各种中间操作的终端操作。

# 筛选和切片

## 常规过滤筛选

常规的过滤筛选就是通过filter方法，为了介绍这个操作，我们不妨假设出这样一个需求，我们现在有一个菜肴类，他的类如下文所示

```java
public class Dish {

    private final String name;
    private final boolean vegetarian;
    private final int calories;
    private final Type type;

    public Dish(String name, boolean vegetarian, int calories, Type type) {
        this.name = name;
        this.vegetarian = vegetarian;
        this.calories = calories;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public int getCalories() {
        return calories;
    }

    public Type getType() {
        return type;
    }

    public enum Type { MEAT, FISH, OTHER }

    @Override
    public String toString() {
        return name;
    }


}
```

基于这个类，我们再创建一个菜肴的集合，集合声明如下所示

```java
public static final List<Dish> menu =
            Arrays.asList(
                    new Dish("pork", false, 800, Dish.Type.MEAT),
                           new Dish("beef", false, 700, Dish.Type.MEAT),
                           new Dish("chicken", false, 400, Dish.Type.MEAT),
                           new Dish("french fries", true, 530, Dish.Type.OTHER),
                           new Dish("rice", true, 350, Dish.Type.OTHER),
                           new Dish("season fruit", true, 120, Dish.Type.OTHER),
                           new Dish("pizza", true, 550, Dish.Type.OTHER),
                           new Dish("prawns", false, 400, Dish.Type.FISH),
                           new Dish("salmon", false, 450, Dish.Type.FISH)
            );
```

我们希望从这个集合中筛选中是蔬菜类的菜肴，所以我们就可以得出如下所示的编码

```java
 // Filtering with predicate
        List<Dish> vegetarianMenu =
            menu.stream()
                    //使用filter 结合函数式编程筛选出vegetarian 为true的菜肴
                .filter(Dish::isVegetarian)
                    //将这些流组成一个list数组
                .collect(toList());

        vegetarianMenu.forEach(System.out::println);
 /**
         * french fries
         * rice
         * season fruit
         * pizza
         */
```

可以看到这种写法写起来就像sql语句一样，我们无需各种for循环的声明指令，而是像是一种声明式的操作，而流的工作原理也如下图所示，将集合中的一个个元素循环合并成一个流水线，最终构成一个新的list

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252202669.png)

## 找出不重复元素

对于这个操作的介绍，我们也不妨提出这样一个示例，我们现在有一个无序且包含重复元素的整型数组，代码如下所示

```java
  List<Integer> numbers = Arrays.asList(1, 2, 1, 3, 3, 2, 4);
```

我们希望能够找出能够被2整除，且最终得到的结果没有重复的数字，对此我们的思路也很简单，首先过滤出能够被2整除的元素，然后再去重，想到这里，你的脑子里如果还停留在java8之前的方式的话，你一定想到的是for循环找到被2整除的元素，然后塞到一个set集合中，最终再转为list对吧，但是这样的代码又臭又长，我们不妨看看通过流式编程可以如何解决吧 代码如下所示，可以看到代码语义非常明显，且一个distinct就完成了去重操作，这样写起来是不是非常的简洁易读且优雅呢？

```java
 // Filtering unique elements
        List<Integer> numbers = Arrays.asList(1, 2, 1, 3, 3, 2, 4);
        numbers.stream()
                //过滤出能够被2整除的数字
               .filter(i -> i % 2 == 0)
                //去重
               .distinct()
                //循环遍历
               .forEach(System.out::println);
 /**输出结果
         * 2
         * 4
         */
```

再来看看流的工作图，他的操作也同样如流水线一般

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252202553.png)

## 限制筛选的元素数

关于限制元素数，举个例子，就以上文的菜肴集合为例，我们希望找到热量高于300卡的前三道菜，又该怎么操作呢？ 如果在java8之前，你一定的for循环加上一个count计数器，当找到三道菜了就停止循环。 java8同样为你提供了语义化的操作，来看看代码，我们在filter找到高于300卡的菜肴后，直接使用limit就可以完成限制筛选了

```java
 // Truncating a stream
        List<Dish> dishesLimit3 =
            menu.stream()
                .filter(d -> d.getCalories() > 300)
                .limit(3)
                .collect(toList());

        /**
         * pork
         * beef
         * chicken
         */
        dishesLimit3.forEach(System.out::println);
```

## 跳过某些元素进行筛选

看到了限制的操作后，我们希望跳过前两个高于300卡的菜，再筛选出3道高于300卡的菜肴又该怎么办呢？ 同样的，可以看出笔者在完成筛选操作后，加了一个skip操作即可完成这个需求

```java
// Skipping elements
        List<Dish> dishesSkip2 =
                menu.stream()
                        .filter(d -> d.getCalories() > 300)
                        .skip(2)
                        .limit(3)
                        .collect(toList());

        /**
         * 输出结果
         * chicken
         * french fries
         * rice
         */
        dishesSkip2.forEach(System.out::println);
```

# 映射

## 只映射需要的元素

映射操作其实也很好理解，就像使用sql语句一样通过select出你所需要的字段，例如我们希望从菜肴中拿到所有菜肴的名字，如果在java8之前，你一定会声明一个`List<String>`,然后遍历菜肴集合，获取到每个菜肴的名字，添加到`List<String>`这个集合中。

再来看看java8的代码，可以看到笔者就用了一个map关键字，即可映射出自己所需要的成员属性，通过map(Dish::getName)告诉流我要菜肴集合中每道菜的菜名，并将这个流传给终端操作collect(toList())转为一个字符串数组

```java
 // map
        List<String> dishNames = menu.stream()
                                     .map(Dish::getName)
                                     .collect(toList());
        /**
         * 输出结果
         * chicken
         * french fries
         * rice
         */
        System.out.println(dishNames);
```

当然你可能还想知道每道菜菜名的长度，同样的再加一个map操作即可，代码如下所示

```java
   List<Integer> menuList = menu.stream()
                .map(Dish::getName)
                .map(String::length)
                .collect(toList());
        System.out.println(menuList);
```

## 流的扁平化使用

关于映射我们可能还可以用在这样的奇怪场合，例如有我们有 `List<String>` 的数组，我们希望找出数组中所有的字母(字母不能有重复)，存到`List<String>` 中并输出

```java
 List<String> words = Arrays.asList("Hello", "World");
```

这时候你第一时间可能想到这样，你的用意很明显，将数组中每个单词切成一个个单词，然后distinct去重，最后转成list输出

```java
words.stream()
//                这里映射的是stream<String[]> 后续的中间操作没有什么作用
                .map(w -> w.split(""))
                .distinct()
                .collect(toList());
```

实际上是错误的，这样的做法，最终得到的是一个 `List<String[]>`，代码如下，其工作原理也很好解释，`map(w -> w.split(""))`会将hello World分别切割成`String[]`,然后两个`String[]`，很显然对一个数组distinct自然是没有任何作用的，具体可以参考下图

```java
 List<String[]> list = words.stream()
//                这里映射的是stream<String[]> 后续的中间操作没有什么作用
                .map(w -> w.split(""))
                .distinct()
                .collect(toList());

```

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252202260.png)

打印以下输出结果

```java
for (String[] strings : list) {
            for (String string : strings) {
                /**
                 * H
                 * e
                 * l
                 * l
                 * o
                 * W
                 * o
                 * r
                 * l
                 * d
                 */
                System.out.println(string);
            }
        }
```

所以我们希望将一个个数组转为String的stream流，于是我们就有了第2个版本的写法，可以看到我们通过`map(Arrays::stream)`，将一个个字符串数组转为`Stream<String>`，但是去重再转为数组后得到类型却是 `List<Stream<String>>`，这意味者我们只是将两个单词转为两个独立的`stream<String>`所以我们需要更进一步的操作

```java
 List<Stream<String>> list1 = words.stream()
                .map(w -> w.split(""))
                //将stream<String[]>转为stream<String> 但还是没有解决问题 因为将数组变成string流
                .map(Arrays::stream)
                .distinct()
                .collect(toList());
```

来看看正确的写法,通过`flatMap`调用`Arrays::stream`，即可完成将两个独立的`Stream<String>`合并成一个扁平的`Stream<String>`最终得到正确结果，他的工作流程图也如下图所示

```java
 List<String> list2 = words.stream()
                .map(w -> w.split(""))
                //将两个stream的String合并成一个流
                .flatMap(Arrays::stream)
                .distinct()
                .collect(toList());
                //输出 [H, e, l, o, W, r, d]
        System.out.println(list2);
```

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252202793.png)其实我们的写法可以更精简一些，如下所示

```java
  words.stream()
                 .flatMap((String line) -> Arrays.stream(line.split("")))
                 .distinct()
                 .forEach(System.out::println);
```

# 查找和匹配

## 检查是否至少匹配一个元素

查找和匹配常用于判断，假如我们想判断至少一个匹配的操作，我们完全可以使用`anyMatch` 例如，我想知道菜肴集合中是否存在素菜，我们完全可以这样写，可以看出anyMatch，是一个终端操作，他将返回一个Boolean值，就以下面代码为例，只要集合中看到一个素食的菜肴，那么这样流操作就会返回true

```java
private static boolean isVegetarianFriendlyMenu() {
        return menu.stream().anyMatch(Dish::isVegetarian);
    }
```

## 检查流元素是否都匹配

同理如果需要全部匹配，我们就用`allMatch`，例如我们需要判断菜肴中的菜肴是否都是低于1000卡的，我们完全可以这样写

```java
 private static boolean isHealthyMenu() {
        return menu.stream().allMatch(d -> d.getCalories() < 1000);
    }
```

反过来来说，我们可以要找低于1000卡的，同样我们也可以使用下面这样的写法，判断是否不包含高于1000卡的菜肴

```java
private static boolean isHealthyMenu2() {
        return menu.stream().noneMatch(d -> d.getCalories() >= 1000);
    }
```

## 查找元素

假如我们希望找出菜肴中是否包含素食，且告知我们查到的素食是什么菜，我们就可以这样写，可以看到笔者通过filter找到素食，在使用findAny将找到的菜直接返回 但是细心的读者看到了返回值竟然不是`Dish`而是`Optional<Dish>`，所以我们需要补充以下Optional的相关概念：

```java
1. Optional有个isPresent()方法，就以本文为例，假如集合中包含素食，我们调用这个方法就会返回true，说明找到了素食，反之返回false
2. get()方法，以本示例来说，假如找到了素食，get就会返回菜肴对象，若没找到则报出NoSuchElement异常
3. orElse()相比上一个方法更加友好，假如我们找到值就返回值，反之就返回orElse传入的参数值
 private static Optional<Dish> findVegetarianDish() {
        return menu.stream()
                .filter(Dish::isVegetarian)
                //短路操作 避免遍历整个流
                .findAny();
    }
```

调用示例

```java
Optional<Dish> dish = findVegetarianDish();
        dish.ifPresent(d -> System.out.println(d.getName()));
```

## 查找第一个元素

相比于查找元素，查找第一个元素语义化更加明显，例如我们想找到第一道素食，我们就可以这样写，实际上关于findAny和findFirst的使用场景区别不大，但是在并行的情况下，你想找到第一道素食的话，建议你使用findFirst，若在并行情况下你不关心当前找到的素食是不是集合中第一道素食的话，使用findAny即可，因为它使用并行流来说限制较少一些

```java
private static Optional<Dish> findVegetarianDish() {
        return menu.stream()
                .filter(Dish::isVegetarian)
                //短路操作 避免遍历整个流
                .findFirst();
    }
```

# 规约

## 元素求和

规约说白就是统计等相关归并计算的操作，还记得java8之前的数字相加嘛？例如我们要相加一个整型数组的和，我们可能会for循环配合一个sum变量+=计算。 但是在java8之后，我们的写法变成了这样，可以看到笔者使用了一个reduce，他对某种重复某事做个抽象，第一个参数传的就是结果的初始值，所以笔者传了0，而第2个参数传的是`BinaryOperator<T>`变量，`BinaryOperator<T>`是一个函数表达式，它要求传入两个值，然后返回一个和传入两个值一个类型的新值，就以笔者传入的lambda为例，她做的就是将传入的a、b相加返回。将这个表达式作为第2个参数传入reduce中就以为着将流中每个数值不断累加到初始值为0的变量中。具体工作过程如下图所示

```java
 List<Integer> numbers = Arrays.asList(3,4,5,1,2);
        int sum = numbers.stream().reduce(0, (a, b) -> a + b);
        System.out.println(sum);
```

![在这里插入图片描述](http://rrmrwrjnu.hn-bkt.clouddn.com/202209252202078.png)同样的java8为我们提供了一个强大的Integer API，即`sum`，他做的事情，就是让数字两两相加所以我们计算数字和的时候，代码可以简化成下图所示

```java
 int sum2 = numbers.stream().reduce(0, Integer::sum);
        System.out.println(sum2);
```

当然假如你的统计操作无需初始值的话，也可以像下文这种写法，这正是java8的高明之处，返回一个Optional操作，让你有余地进行判空操作

```java
//无需初始值
        Optional<Integer> sum3 = numbers.stream().reduce(Integer::sum);
        System.out.println(sum3.get());
```

## 求最大值和最小值

最大值和最小值做法和上文差不多，就不多赘述了

```java
int max = numbers.stream().reduce(0, (a, b) -> Integer.max(a, b));
        System.out.println(max);

        Optional<Integer> min = numbers.stream().reduce(Integer::min);
        min.ifPresent(System.out::println);
```

## 实践题

就以博客最早提到的菜肴类，我们希望用流式编程统计出菜肴的数量，可以看到笔者的做法很巧妙，通过映射将每道菜计算为1，传到reduce流中统计计算

```java
 Optional<Integer> menuCount = menu.stream()
                .map(d -> 1)
                .reduce(Integer::sum);
        System.out.println(menuCount.get());
```

我们甚至可以简写成这样，因为java8为我们提供了这样的终端操作

```java
 long count = menu.stream().count();
        System.out.println(count);
```

# 实践题

## 需求描述

我们现在有几个交易员，交易员类如下所示，该类描述了他们的姓名和居住城市

```java
public  class Trader{

    private String name;
    private String city;

    public Trader(String n, String c){
        this.name = n;
        this.city = c;
    }

    public String getName(){
        return this.name;
    }

    public String getCity(){
        return this.city;
    }

    public void setCity(String newCity){
        this.city = newCity;
    }

    public String toString(){
        return "Trader:"+this.name + " in " + this.city;
    }
}
```

然后还有一个交易订单类，它描述了订单的交易年份，金额，和交易这笔订单的人员是谁

```java
public class Transaction{

    private Trader trader;
    private int year;
    private int value;

    public Transaction(Trader trader, int year, int value)
    {
        this.trader = trader;
        this.year = year;
        this.value = value;
    }

    public Trader getTrader(){ 
        return this.trader;
    }

    public int getYear(){
        return this.year;
    }

    public int getValue(){
        return this.value;
    }

    public String toString(){
        return "{" + this.trader + ", " +
               "year: "+this.year+", " +
               "value:" + this.value +"}";
    }
}
```

用这两个类，构成了一个订单数组，如下所示

```java
 Trader raoul = new Trader("Raoul", "Cambridge");
        Trader mario = new Trader("Mario", "Milan");
        Trader alan = new Trader("Alan", "Cambridge");
        Trader brian = new Trader("Brian", "Cambridge");

        List<Transaction> transactions = Arrays.asList(
                new Transaction(brian, 2011, 300),
                new Transaction(raoul, 2012, 1000),
                new Transaction(raoul, 2011, 400),
                new Transaction(mario, 2012, 710),
                new Transaction(mario, 2012, 700),
                new Transaction(alan, 2012, 950)
        );
```

## 几道问题

所以我们现在提出这样几个问题

```java
(1) 找出2011年发生的所有交易，并按交易额排序（从低到高）。
(2) 交易员都在哪些不同的城市工作过？
(3) 查找所有来自于剑桥的交易员，并按姓名排序。
(4) 返回所有交易员的姓名字符串，按字母顺序排序。
(5) 有没有交易员是在米兰工作的？
(6) 打印生活在剑桥的交易员的所有交易额。
(7) 所有交易中，最高的交易额是多少？
(8) 找到交易额最小的交易。
```

答案如下所示，读者可以自行核对

```java
 // Query 1: Find all transactions from year 2011 and sort them by value (small to high).
        List<Transaction> tr2011 = transactions.stream()
                .filter(transaction -> transaction.getYear() == 2011)
                .sorted(comparing(Transaction::getValue))
                .collect(toList());
        System.out.println(tr2011);
        //找出2011年发生的所有交易，并按交易额排序（从低到高）
        List<Transaction> transactions_2011 = transactions.stream()
                .filter(t -> t.getYear() == 2011)
                .sorted(comparing(Transaction::getValue))
                .collect(toList());
        System.out.println(transactions_2011);


        // Query 2: What are all the unique cities where the traders work?
        List<String> cities =
                transactions.stream()
                        .map(transaction -> transaction.getTrader().getCity())
                        .distinct()
                        .collect(toList());
        System.out.println(cities);

        //交易员都在哪些不同的城市工作过
        List<String> citys = transactions.stream()
                .map(Transaction::getTrader)
                .map(Trader::getCity)
                .distinct()
                .collect(toList());
        System.out.println(citys);

        // Query 3: Find all traders from Cambridge and sort them by name.

        List<Trader> traders =
                transactions.stream()
                        .map(Transaction::getTrader)
                        .filter(trader -> trader.getCity().equals("Cambridge"))
                        .distinct()
                        .sorted(comparing(Trader::getName))
                        .collect(toList());
        System.out.println(traders);

        //查找所有来自于剑桥的交易员，并按姓名排序
        List<Trader> cambridgeTraders = transactions.stream()
                .map(Transaction::getTrader)
                .filter(t -> "Cambridge".equals(t.getCity()))
                .distinct()
                .sorted(comparing(Trader::getName))
                .collect(toList());
        System.out.println(cambridgeTraders);


        // Query 4: Return a string of all traders’ names sorted alphabetically.

        String traderStr =
                transactions.stream()
                        .map(transaction -> transaction.getTrader().getName())
                        .distinct()
                        .sorted()
                        .reduce("", (n1, n2) -> n1 + n2);
        System.out.println(traderStr);

        //返回所有交易员的姓名字符串，按字母顺序排序。×
        String names = transactions.stream()
                .map(Transaction::getTrader)
                .map(Trader::getName)
                .distinct()
                .sorted()
                .reduce("", (s1, s2) -> s1 + s2);

        System.out.println(names);

        // Query 5: Are there any trader based in Milan?

        boolean milanBased =
                transactions.stream()
                        .anyMatch(transaction -> transaction.getTrader()
                                .getCity()
                                .equals("Milan")
                        );
        System.out.println(milanBased);

        //(5) 有没有交易员是在米兰工作的？ 
        boolean hasMilan = transactions.stream()
                .anyMatch(t -> "Milan".equals(t.getTrader().getCity()));


        // Query 6: Update all transactions so that the traders from Milan are set to Cambridge.
        transactions.stream()
                .map(Transaction::getTrader)
                .filter(trader -> trader.getCity().equals("Milan"))
                .forEach(trader -> trader.setCity("Cambridge"));
        System.out.println(transactions);
        //(6) 打印生活在剑桥的交易员的所有交易额。
        Optional<Integer> sum = transactions.stream()
                .filter(t -> "Cambridge".equals(t.getTrader().getCity()))
                .map(Transaction::getValue)
                .reduce(Integer::sum);
        System.out.println(sum.get());


        // Query 7: What's the highest value in all the transactions?
        int highestValue =
                transactions.stream()
                        .map(Transaction::getValue)
                        .reduce(0, Integer::max);
        System.out.println(highestValue);


        //(7) 所有交易中，最高的交易额是多少？
        Optional<Integer> max = transactions.stream()
                .map(Transaction::getValue)
                .reduce(Integer::max);
        System.out.println(max.get());


        //(8) 找到交易额最小的交易
        Optional<Transaction> min = transactions.stream()
                .sorted(comparing(Transaction::getValue))
                .findFirst();

        //参考答案
        Optional<Transaction> min2 = transactions.stream()
                .reduce((t1, t2) -> t1.getValue() < t2.getValue() ? t1 : t2);
        Optional<Transaction> min3 = transactions.stream()
                .min(comparing(Transaction::getValue));


        System.out.println(min +" "+ min2 +" " +min3);
```

