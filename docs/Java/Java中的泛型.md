# Java中的泛型

泛型是jdk5中引入的概念，他的出现使得我们操作集合在存取时无需手动进行类型判断、强转等操作。从而使得代码可以更加干净清爽。

## 泛型的基础使用示例

```java
/**
 * 泛型接口
 * @param <T>
 */
public interface GeneratorInterface<T> {
    T getVal();
}
/**
 * 实现泛型接口不指定类型
 * @param <T>
 */
public class GeneratorImpl<T> implements GeneratorInterface<T> {
    @Override
    public T getVal() {
        return null;
    }
}


/**
 * 泛型接口指定类型
 */
public class GeneratorImpl2 implements GeneratorInterface<String> {
    @Override
    public String getVal() {
        return null;
    }

}



/**
 * 泛型方法
 */
public class GeneratorMethod {
    public static <E> void printArray(List<E> array){
        for (E e : array) {
            System.out.println(e);
        }
    }

    public static void main(String[] args) {
        List<String> list=new ArrayList<>();
        list.add("11");
        list.add("11");
        list.add("11");
        list.add("11");
        list.add("11");
        list.add("11");
        GeneratorMethod.printArray(list);
    }
}
/**
 * 泛型类的用法
 * @param <T>
 */
public class GenericObj<T> {
    private T key;

    public T getKey() {
        return key;
    }

    public void setKey(T key) {
        this.key = key;
    }


    public static void main(String[] args) {
        GenericObj<Integer> obj=new GenericObj();
        obj.setKey(1);

    }
}
```

## 泛型的使用场景

泛型大部分是应用于项目开发中通用对象例如我们常用的Map 

![image-20220906000146969](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209060001687.png)

## 什么是泛型擦除，为什么要泛型擦除呢

java本质就一门伪泛型语言，泛型的作用仅仅在编译期间进行类型检查的，一旦生成字节码之后，关于泛型的一切都会消失，如下所示，我们定义了Integer类型的list集合，我们完完全全可以通过反射的方式将字符串存入集合中，如下图所示

```java
 public static void main(String[] args) throws Exception {
        List<Integer> list=new ArrayList<>();
        list.add(1);
//        list.add("s"); 报错
        Class<? extends List> clazz=list.getClass();
//        java的泛型时伪泛型，运行时就会被擦除
        Method add = clazz.getDeclaredMethod("add", Object.class);
        add.invoke(list,"k1");
        System.out.println(list);

        Object object=new Object();

    }
```

我们都知道泛型擦除是编译器行为，为了保证引入泛型而不创建新的类型，以及节省虚拟机没必要的开销，jvm会自动将泛型擦除。 这一点我们用如下的例子就能看出，相同参数不通泛型的方法根本不能重载

![img](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052355157.png)

## 既然编译器要把泛型擦除，为什么还要用泛型呢？用Object不行吗？

1. 使用泛型后便于集合的取操作，且提高的代码的可读性
2. 如下代码所示，虽然一下代码在编译后会擦除为Object类型，但是通过泛型限定后，jvm就会自动将其强转为Comparable类型，减少我们编写一些没必要的代码

```java
public class Test2 {
    public static void main(String[] args) {
        List<? extends Comparable> list=new ArrayList<>();
        for (Comparable comparable : list) {
            comparable.compareTo("1");
        }
    }
}

```

![image-20220905235453573](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052354031.png)

## 什么是桥方法

如下代码所示，我们创建了一个泛型类，然后继承这个泛型类，继承时ide时，为了保证类的多态性，他会自动让我们补充构造方法

```java
public class Node<T> {

    public T data;

    public Node(T data) {
        this.data = data;
    }

    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

public class MyNode extends Node<Integer>{

    //继承泛型类后自动添加的，用于保证泛型的多态性
    public MyNode(Integer data) {
        super(data);
    }
}

```

## 泛型有哪些限制？

### 泛型不可以被实例化，如下所示

![image-20220905235435825](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052354225.png)

### 泛型参数不可以是基本类型

我们都知道泛型仅在编译器存在，当编译结束泛型就会被擦除，对象就会编程Object类型，所以基本类型作为泛型参数ide就会直接报错 ![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052354579.png)

### 泛型无法被实例化，无论是泛型变量还是泛型数组

从上文我们就知道泛型会在编译期完成后被擦除，这正是因为jvm不想为泛型创建新的类型造成没必要的开销

### 不能抛出或者捕获T类型的泛型异常

![image-20220905235406238](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052354457.png)

### 不能声明两个参数一样泛型不同的方法

上述以说明，略

### 泛型不能被声明为static

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052353651.png)

## 以下代码是否能编译，为什么？

### 例1

明显不能T不知道是何种类型

```java
    public final class Algorithm {
        public static <T> T max(T x, T y) {
            return x > y ? x : y;
        }
    }

```

### 例2

不能，泛型不能被static修饰

```java
    public class Singleton<T> {

        public static T getInstance() {
            if (instance == null)
                instance = new Singleton<T>();

            return instance;
        }

        private static T instance = null;
    }

```

## 泛型的通配符

### 什么是通配符，它用于解决什么问题

我们都知道通配符是解决泛型之间无法协变的问题，当我们使用一种类型作为泛型参数时，却无法使用他的父类或者子类进行赋值，而通配符就是解决这种问题的对策。

### 上界通配符

#### 上界通配符使用示例

```java
/**
 * 水果父类
 */
public class Fruit {
}

/**
 * 水果的子类 苹果
 */
public class Apple extends Fruit {
}

/**
 * 容器类
 * @param <T>
 */
public class Container<T> {
}

/**
 * 泛型测试
 */
public class TestParttern {

    public static void main(String[] args) {
        Container<? extends Fruit> container=new Container<Apple>();
    }
}

```

#### 为什么上界通配符只能get不能set

如上代码所示，当我们用上界通配符`? extends Fruit`，我们用其子类作为泛型参数，这只能保证我们get到的都是这个子类的对象。 但我们却忘了一点，当我们用子类apple作为泛型参数时，泛型的工作机制仅仅是对这个对象加个一个编号`CAP#1`，当我set一个新的对象，编译器无法识别这个对象类型是否和编号匹配。

![image-20220905235325646](https://cdn.jsdelivr.net/gh/mai-junxuan/Cloud-image@master/image/202209052353210.png)

### 下界通配符

#### 下界通配符使用示例

这里使用的对象还是上述对象，只不过通配符改为下界通配符

```java
/**
 * 泛型测试
 */
public class TestParttern {

    public static void main(String[] args) {

        Container<? super Apple> container1=new Container<Fruit>();
    }
}

```

#### 下界通配符原理介绍

下界通配符决定了泛型的最大粒度的上限，通过super声明，它可以很直观的告诉我们泛型参数必须传super后的父类如下所示

```java
 Container<? super Apple> container1=new Container<Fruit>();
```

#### 为什么下界通配符只能set不能get

但是上界通配符有个缺点，他告诉我们泛型的最大粒度上限，结果上述声明后，我们泛型参数可以是apple的所有父类，所以我们进行set操作时，就可以set当前apple父类的所有子类型，这就使得我们get时无法很精确的确定类型，最好的情况只能以父类的形式get出来，而最差最差的情况只能以Object的方式get出来。

```java
 Fruit data = container.getData();
```