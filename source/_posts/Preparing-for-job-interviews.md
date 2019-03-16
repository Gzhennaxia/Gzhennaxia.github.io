---
title: Preparing for job interviews
description: 面试准备资料
date: 2019-03-06 16:55:09
top: true
---

<img src="https://www.insperity.com/wp-content/uploads/stay_interview_questions_640x302.jpg" width="100%"/>

<!-- more -->

## 数据类型

### Object

#### equals 方法和 hashcode 方法

Object 中的 hashcode 是根据对象的内存地址生成的，equals 使用 ‘==’ 直接比较对象的地址。

改写 equals 时总是要改写 hashcode，使得 equals 结果为 true 时，hashcode 结果也为 true，hashcode 结果为 false，equals 结果也为 false（即 hashcode 是 equals 的必要不充分条件）。因为在集合类（HashMap，HashSet 等）中的比较操作为了提高效率，一般都是先比较 hashcode 值，再比较 equals。可以利用 IDEA 快速生成 equals 和 hashcode 方法。

### Class







- 获取Class对象引用的方式有3种，Object类的getClass方法，Class类的静态方法forName以及字面常量的方式”.class”
- 实例类的getClass方法和Class类的静态方法forName都会触发类的初始化阶段，而字面常量获取Class对象的方式则不会触发初始化。
- 向Class引用添加泛型约束仅仅是为了提供编译期类型的检查从而避免将错误延续到运行时期。
- 在Java中，所有类型转换都是在运行时进行正确性检查的
- 一个类在 JVM 中只会有一个 Class 实例



### HashMap

#### 实现原理

基于哈希表这种数据结构实现的。哈希冲突（哈希碰撞）的解决方案有多种：开放定址法（发生冲突，继续寻找下一块未被占用的存储地址），再散列函数法，链地址法，HashMap采用了链地址法，也就是**数组+链表**的方式。

JDK 1.8对HashMap进行了比较大的优化，底层实现由之前的“数组+链表”改为**“数组+链表+红黑树”**，当链表节点较少时仍然是以链表存在，当链表节点较多时（大于8）会转为红黑树。

#### 源码分析

> [Java7/8 中的 HashMap 和 ConcurrentHashMap 全解析](http://www.importnew.com/28263.html)
>
> [Java集合：HashMap详解（JDK 1.8）](https://blog.csdn.net/v123411739/article/details/78996181)

- HashMap的主干是一个Entry（1.8是Node，不过，Node 只能用于链表的情况，红黑树的情况需要使用 TreeNode）数组。Entry是HashMap的基本组成单元，每一个Entry包含一个key-value键值对。

- HashMap有4个构造器，**在常规构造器中，没有为数组table分配内存空间（入参为指定Map的构造器例外），而是在执行put操作的时候才真正构建table数组**。

- JDK 1.8 中 key 的 hash 值取的是`(h = key.hashCode()) ^ (h >>> 16)`，就是把高16bit和低16bit异或了一下。因为当数组长度较小的时候，hash值参与运算只是低位的值，发生碰撞的可能性比较大。一般情况下，key的分布符合“局部性原理”，低比特位相同的概率大于高低位异或后仍然相同的概率，从而降低了碰撞的概率。[【1】](http://www.importnew.com/27043.html)

- 计算具体数组位置，使用 key 的 hash 值对数组长度进行取模就可以了。`hash & (length-1);`这个方法很简单，简单说就是取 hash 值的低 n 位。如在数组长度为 32 的时候，其实取的就是 key 的 hash 值的低 5 位，作为它在数组中的下标位置。如果key为null的话，hash值为0。

  **当 b = 2^n 时，a % b = a & (b - 1)** 例如 a = 18, b = 16 时：

  ```
  		1  0  0  1  0
      &   0  1  1  1  1
      __________________
          0  0  0  1  0    = 2
  ```

- 扩容就是用一个新的大数组替换原来的小数组，并将原来数组中的值迁移到新的数组中。

  由于是双倍扩容，迁移过程中，会将原来 table[i] 中的链表的所有节点，分拆到新的数组的 newTable[i] 和 newTable[i + oldLength] 位置上。如原来数组长度是 16，那么扩容后，原来 table[0] 处的链表中的所有元素会被分到新数组中 newTable[0] 和 newTable[16] 这两个位置。

  通过`Integer.highestOneBit((number - 1) << 1)`可以确保capacity为大于或等于 number 的最接近number 的二次幂。Integer.highestOneBit是用来获取最左边的bit（其他bit位为0）所代表的数值。

  Java7 是先扩容后插入新值的，Java8 先插值再扩容。

- HashMap的容量一定保持2的次幂的原因

  1. 减少扩容后数据位置的重新hash

     在移动元素的时候，不需要重新定位，只需要看原来的hash值新增的那个bit是1还是0就好了，是0的话位置没变，是1的话位置变成“原位置+oldCap”。[【2】](http://www.importnew.com/27043.html)

  2. 使用位运算代替取模运算，即保证了散列的均匀，同时也提升了效率

- 相对于 put 过程，get 过程是非常简单的。

  1. 根据 key 计算 hash 值。
  2. 找到相应的数组下标：hash & (length – 1)。
  3. 遍历该数组位置处的链表，直到找到相等(==或equals)的 key。

- 判断元素相等的设计比较经典，利用了bool表达式的短路特性：先比较hash值；如果hash值相等，就通过==比较；如果==不等，再通过equals方法比较。hash是提前计算好的；如果没有重载运算符（通常也不建议这样做），==一般直接比较引用值；equals方法最有可能耗费性能，如String的equals方法需要O(n)的时间，n是字符串长度。一定要记住这里的判断顺序，很能考察对碰撞处理源码的理解。

- put 流程：

  ![](https://img-blog.csdn.net/20180108094243335?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29nYTYxMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



1. HashMap 的 key 为什么一般用字符串比较多，能用其他对象，或者自定义的对象吗？为什么？

    在使用 String 类型的对象做 key 时我们可以只根据传入的字符串内容就能获得对应存在 map 中的 value 值。

    如果你想把自定义的对象作为 key，只需要重写 hashCode() 方法与 equals() 方法即可。

2. HashMap和Hashtable的区别

    > [HashMap和HashTable的理解与区别](https://blog.csdn.net/yu849893679/article/details/81530298)

    1. 父类不同

       HashMap是继承自AbstractMap类，而HashTable是继承自Dictionary（已被废弃，详情看源代码）。不过它们都同时实现了map、Cloneable、Serializable这三个接口。
       Hashtable比HashMap多提供了elments() 和contains() 两个方法。elments() 方法继承自Hashtable的父类Dictionnary，用于返回此Hashtable中value的枚举。contains()方法判断该Hashtable是否包含传入的value。它的作用与containsValue()一致。事实上，contansValue() 就只是调用了一下contains() 方法。HashMap去掉了contains方法，改成containsValue和containsKey了。

    2. null值问题

       Hashtable既不支持Null key也不支持Null value。Hashtable的put()方法的注释中有说明 。HashMap中，null可以作为键，这样的键只有一个；可以有一个或多个键所对应的值为null。当get()方法返回null值时，可能是 HashMap中没有该键，也可能使该键所对应的值为null。因此，在HashMap中不能由get()方法来判断HashMap中是否存在某个键， 而应该用containsKey()方法来判断。

    3. 线程安全性

       Hashtable是线程安全的，它的每个方法中都加入了Synchronize方法。在多线程并发的环境下，可以直接使用Hashtable，不需要自己为它的方法实现同步

       HashMap不是线程安全的，可以通过 `Map map = Collections.synchronizedMap(new HashMap())`来达到同步的效果。

       虽然HashMap不是线程安全的，但是它的效率会比Hashtable要好很多。这样设计是合理的。在我们的日常使用当中，大部分时间是单线程操作的。HashMap把这部分操作解放出来了。当需要多线程操作的时候可以使用线程安全的ConcurrentHashMap。ConcurrentHashMap虽然也是线程安全的，但是它的效率比Hashtable要高好多倍。因为ConcurrentHashMap使用了分段锁，并不对整个数据进行锁定。

    4. 遍历方式不同

       Hashtable、HashMap都使用了Iterator。而由于历史原因，Hashtable还使用了Enumeration的方式 。

       HashMap的Iterator是fail-fast迭代器。当有其它线程改变了HashMap的结构（增加，删除），将会抛出ConcurrentModificationException。不过，通过Iterator的remove()方法移除元素则不会抛出ConcurrentModificationException异常。但这并不是一个一定发生的行为，要看JVM。

       JDK8之前的版本中，Hashtable是没有fast-fail机制的。在JDK8及以后的版本中 ，Hashtable也是使用fast-fail的。（此处可以去看一下1.5和1.8JDK源码的对比）

    5. 初始容量不同

       Hashtable的初始长度是11，之后每次扩充容量变为之前的2n+1（n为上一次的长度），而HashMap的初始长度为16，之后每次扩充变为原来的两倍。

       创建时，如果给定了容量初始值，那么Hashtable会直接使用你给定的大小，而HashMap会将其扩充为2的幂次方大小。

    6. 计算哈希值的方法不同

       Hashtable直接使用对象的hashCode。hashCode是JDK根据对象的地址或者字符串或者数字算出来的int类型的数值。然后再使用除留余数发来获得最终的位置。 然而除法运算是非常耗费时间的。效率很低

       HashMap为了提高计算效率，将哈希表的大小固定为了2的幂，这样在取模预算时，不需要做除法，只需要做位运算。位运算比除法的效率要高很多。

3. ConcurrentHashMap和Hashtable的区别

    ConcurrentHashMap和CopyOnWriteArrayList保留了线程安全的同时，也提供了更高的并发性。

    当Hashtable的大小增加到一定的时候，性能会急剧下降，因为迭代时需要被锁定很长的时间。而ConcurrentHashMap引入了分割(segmentation)，不论它变得多么大，仅仅需要锁定map的某个部分，而其它的线程不需要等到迭代完成才能访问map。简而言之，在迭代的过程中，ConcurrentHashMap仅仅锁定map的某个部分，而Hashtable则会锁定整个map。

    简单理解，ConcurrentHashMap 是一个 Segment 数组，Segment 通过继承 ReentrantLock 来进行加锁，所以每次需要加锁的操作锁住的是一个 segment，这样只要保证每个 Segment 是线程安全的，也就实现了全局的线程安全。

    ![](https://javadoop.com/blogimages/map/3.png)

    ![](https://javadoop.com/blogimages/map/4.png)

- Hashtable 在 Java 诞生之初时就有了，HashMap 是 JDk1.2 之后有的，而在 JDK1.5 才有ConcurrentHashMap
- HashMap不能保证随着时间的推移Map中的元素次序是不变的

### int 和 Integer 的区别

> [java面试题之int和Integer的区别](https://www.cnblogs.com/guodongdidi/p/6953217.html)

- Integer是int的包装类，int则是java的一种基本数据类型 

- Integer变量必须实例化后才能使用，而int变量不需要 

- Integer实际是对象的引用，当new一个Integer时，实际上是生成一个指针指向此对象；而int则是直接存储数据值 

- Integer 的默认值是 null，int 的默认值是 0

- 由于Integer变量实际上是对一个Integer对象的引用，所以两个通过new生成的Integer变量永远是不相等的（因为new生成的是两个对象，其内存地址不同）。

- Integer变量和int变量比较时，只要两个变量的值是向等的，则结果为true（因为包装类Integer和基本数据类型int比较时，java会自动拆包装为int，然后进行比较，实际上就变为两个int变量的比较）

- 非new生成的Integer变量和new Integer()生成的变量比较时，结果为false。（因为非new生成的Integer变量指向的是java常量池中的对象，而new Integer()生成的变量指向堆中新建的对象，两者在内存中的地址不同）

  ```java
  Integer i = new Integer(100);
  Integer j = 100;
  System.out.print(i == j); //false
  ```

- 对于两个非new生成的Integer对象，进行比较时，如果两个变量的值在区间-128到127之间，则比较结果为true，如果两个变量的值不在此区间，则比较结果为false

  ```
  Integer i = 100;
  Integer j = 100;
  System.out.print(i == j); //true
  Integer i = 128;
  Integer j = 128;
  System.out.print(i == j); //false
  ```

  对于第4条的原因： 
  **java在编译Integer i = 100 ;时，会翻译成为Integer i = Integer.valueOf(100)；这就是自动装箱**，而java API中对Integer类型的valueOf的定义如下：

  ```
  public static Integer valueOf(int i){
      assert IntegerCache.high >= 127;
      if (i >= IntegerCache.low && i <= IntegerCache.high){
          return IntegerCache.cache[i + (-IntegerCache.low)];
      }
      return new Integer(i);
  }
  ```

  **java对于-128到127之间的数，会进行缓存，Integer i = 127时，会将127进行缓存，下次再写Integer j = 127时，就会直接从缓存中取，就不会new了**，简要的说就是在Integer类中有一个静态内部类IntegerCache，在IntegerCache类中有一个Integer数组，用以缓存当数值范围为-128~127时的Integer对象。

- 简单来讲：自动装箱就是`Integer.valueOf(int i);`自动拆箱就是` i.intValue();`

- 在java中包装类，比较多的用途是用在于各种数据类型的转化中。

### byte

两个byte类型相加，结果是int，也就是需要使用int接收。

## 泛型

> [Java泛型详解](http://www.importnew.com/24029.html)

### 定义

泛型是Java SE 1.5的新特性，**泛型的本质**是**参数化类型**，也就是说所操作的数据类型被指定为一个参数。这种参数类型可以用在类、接口和方法的创建中，分别称为泛型类、泛型接口、泛型方法。

### 语法

1. 泛型的类型参数只能是类类型（包括自定义类），不能是简单类型

2. 泛型的类型参数可以有多个

3. 不能创建一个确切的泛型类型的数组，但可以创建通配符类型的泛型数组

   编译错误：`List<String>[] list = new List<String>[10];`

   编译通过：`List<?>[] list = new List<?>[10];`

4. 不能利用类型参数直接创建实例（`E = new E();`）

5. 不能对确切的泛型类型使用`instanceof`关键字

   编译错误：`list instanceof ArrayList<Integer>`

   编译通过：`list instanceof ArrayList<?>`

6. 静态方法无法访问类上定义的泛型，所以静态方法要使用泛型的话，必须定义成泛型方法。

7. 多接口限制：`<T extends SomeClass & interface1 & interface2 & interface3>`

### 类型擦除

Java泛型只能用于在**编译期间的静态类型检查**，编译器生成的代码会擦除相应的类型信息，到了运行期间实际上JVM知道泛型所代表的具体类型。这样做的原因是因为Java泛型是1.5之后才被引入的，为了保持向下的兼容性，所以只能做类型擦除来兼容以前的非泛型代码。



对于泛型代码，Java编译器实际上还会帮我们实现一个Bridge method。



- 一条规律，”Producer Extends, Consumer Super”：
  - “Producer Extends” – 如果你需要一个只读List，用它来produce T，那么使用`? extends T`。
  - “Consumer Super” – 如果你需要一个只写List，用它来consume T，那么使用`? super T`。
  - 如果需要同时读取以及写入，那么我们就不能使用通配符了。

- 方法上是否定义泛型和类上是否定义没有必然的联系

- 在Java集合类框架中泛型被广泛应用

## 反射

### 什么是反射

JAVA反射机制是在运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为java语言的反射机制。

Java反射机制的实现要借助于4个类：Class，Constructor，Field，Method。

反射就是把java类中的各种成分映射成一个个的Java对象。

反射：程序在运行状态中，可以动态加载一个只有名称的类，加载完类之后，在堆内存中，就产生了一个 Class 类型的对象，这个对象就包含了这个类完整的结构信息，通过这个对象我们可以看到类的结构。这个对象就像一面镜子，所以我们形象的称之为——反射

### 反射能做什么？

代码可以在运行时装配，无需在组件之间进行源代码链接，降低代码的耦合度；还有动态代理的实现等等，JDBC原生代码注册驱动，hibernate 的实体类，Spring 的 AOP 等等都有反射的实现。通过反射运行配置文件内容，通过反射越过泛型检查。



- RTTI（Run-Time Type Identification 运行时类型识别）和反射之间的区别在于，RTTI 编译器在编译时打开和检查.class文件，反射在运行时打开和检查.class文件
- 获取 Class 类对象有三种方法，使用 Class.forName 静态方法、使用 .class 方法、使用类对象的 getClass() 方法。
- 通过反射创建类对象主要有两种方式：通过 Class 对象的 newInstance() 方法、通过 Constructor 对象的 newInstance() 方法。
- Method 类的 invoke 方法内部有两种实现方式，一种是 native 原生的实现方式，一种是 Java 实现方式Native 版本一开始启动快，但是随着运行时间变长，速度变慢。Java 版本一开始加载慢，但是随着运行时间变长，速度变快。正是因为两种存在这些问题，所以第一次加载的时候我们会发现使用的是NativeMethodAccessorImpl 的实现，而当反射调用次数超过 15 次之后，则使用 MethodAccessorGenerator 生成的 MethodAccessorImpl 对象去实现反射。

## 接口

### 接口设计规范

1. 字段类型统一使用 String 类型，参数和返回值都使用 String 类型。Boolean类型一律使用1/0来表示。

   使用此接口的用户，对方可能是Java，也可能是VB6，也可能是C#，不要使用某种编程语言的特定类型，比较好的一种方式是，参数和返回值都使用string类型，这样基本上的编程语言都能支持。

2. 响应数据统一格式：code、msg、data。

3. 接口路径中需要加入版本号信息（使用 v1、v2 依次递推）

4. 分页数据中必须包含：

   recordCount: 当前页记录数
   totalCount: 总记录数
   pageNo: 当前页码
   pageSize: 每页大小
   totalPage: 总页数

### 支付接口的设计

> [支付网关的设计](https://www.cnblogs.com/vianzhang/p/7603184.html)
>
> [聚合支付系统设计](https://blog.csdn.net/think2017/article/details/79820786)

聚合支付平台的核心，就是怎么合理的去管理接入的各种支付SDK，从官网下载的 SDK，不做任何逻辑修改，就直接放到项目的目录中使用，这样做虽然开发成本很低，但弊端颇多：

1. 首先要说的就是不易维护，各支付SDK代码结构、风格不一样，后期维护成本高；
2. 代码各自为政，没有统一的调用方法；
3. 配置分散，无法集中维护系统配置项；
4. 无法提供统一有效的日志数据等

因此，首先定义一个Interface，然后每次接入新的支付方式的过程，其实就是实现该Interface的过程。

通常情况下，一种支付方式有一个class来实现，但面对一种支付方式提供了多种支付场景，比如微信（提供了公众号支付、APP支付、扫码支付、H5支付、小程序支付、微信免密代扣等）、中国银联（提供了PC网关支付、WAP支付、APP支付、银联云闪付等），建议针对每种不同的支付场景，都有单独的class来实现，理由如下：

- 不同的支付场景，程序执行的流程也不一样，比如中国银联PC网关支付，是需要将支付报文通过客户端浏览器表单POST给银联支付网关，跳转至银联支付网页进行支付，而银联APP支付则是通过curl将支付报文提交给银联支付网关，再将其返回的tn码返回给商户APP，商户APP凭该tn码发起支付交易；
- 对订单系统的订单支付方式展示更加准确，分配给商户不同购物平台（PC端、H5端、APP）的支付方式id是唯一的。如果商户系统不同支付场景所申请的商户号不一样，则需要在推送至财务系统的支付方式也不能重复，否则无法对账；
- 支付类的代码逻辑只关注于自身的支付逻辑处理，不引入额外的判断流程。

那么这时候就有一个很头疼的问题，代码冗余。大部分第三方支付，虽然提供了不同支付场景，但基础接口都是一样的，只是部分参数不同，或支付流程上面的少许差别。这时候就要考虑好以第三方支付平台为单位来封装一个支付抽象类，实现对第三方支付平台的所有api对接，不涉及到商户系统的业务流程，比如微信支付，创建一个WechatDriver抽象类

有了支付抽象类，针对每一种支付方法，都可以继承该抽象类，并拥有自己的独立的支付流程，比如：微信app支付，可以创建一个 WechatAppDriver 支付子类，支付子类调用抽象类提供的各种底层api，来实现支付、查询、退款等功能。

支付Interface、支付抽象类、支付子类三种支付类，它们之间的关系如下：

![](https://img-blog.csdn.net/20180404181515932)

对上图做简要说明，PaymentHandlerInterface是所有支付类的接口，WechatPayment是所有微信支付类的基类，WechatAPPPayment、WechatJSAPIPayment、WechatNativePayment都是提供支付服务的支付类，都需要继承WechatPayment并实现PaymentHandlerInterface接口。同理，系统如果需要接入银联在线支付，那么就需要按照开发文档实现一个ChinaPayPayment做为银联在线支付的基类，然后分别开发出具体支付场景的支付类，比如ChinaPayAPPPayment(银联app支付)、ChinaPayWAPPayment(银联wap支付)、ChinaPayPCPayment(银联pc支付)，这三个支付类需要继承ChinaPayPayment并实现PaymentHandlerInterface接口。





## 数据库

### 数据库设计

#### 无限级数据库设计

> [mysql（多级分销）无限极数据库设计方法](https://www.phpbloger.com/index.php/article/50.html)
>
> [数据库表设计-邻接表、路径枚举、嵌套集、闭包表](http://www.php.cn/mysql-tutorials-369214.html)

##### 采用**邻接表**的设计方式

```sql
create table user(
    id int primary key auto_increment COMMENT '自增ID',
    parentid int COMMENT '父节点ID',
    username varchar(20) COMMENT '用户名',
    password varchar(20) COMMENT '密码'
    ……
);
```

- 查询一个节点的所有后代

  方式一：定义 SQL 函数递归查询

  > [MySQL递归查询树状表的子节点、父节点](https://www.cnblogs.com/franson-2016/p/6873233.html)

  ```sql
  CREATE FUNCTION `getChildList`(rootId INT)
  RETURNS VARCHAR(1000)
  BEGIN
    DECLARE idList VARCHAR(1000);
    DECLARE idTemp VARCHAR(1000);
    SET idTemp = CAST(rootId AS CHAR);
    WHILE idTemp IS NOT NULL DO
  	IF (idList IS NOT NULL) THEN
  	  SET idList = CONCAT(idList,',',idTemp);
  	ELSE
  	  SET idList = CONCAT(idTemp);
  	END IF;
  	SELECT GROUP_CONCAT(id) INTO idTemp FROM `user` WHERE FIND_IN_SET(parentid,idTemp)>0;
    END WHILE;
    RETURN idList;
  END;
  ```

  注意：

  > [mysql之使用find_in_set和group_concat组合递归函数时数据不全](https://blog.csdn.net/dream_broken/article/details/69554303)

  group_concat 是有长度限制的，超过限制时会导致数据不全。

  方式二：使用共用表表达式递归查询（8.0 的版本才支持 WITH）

  > [WITH语法（公用表表达式）](https://dev.mysql.com/doc/refman/8.0/en/with.html)

  ```sql
  WITH RECURSIVE cte(id, parentid, username, `level`) AS (
      SELECT id, parentid, username, 0 AS `level` FROM `user` WHERE parentid = 4
      UNION ALL
      SELECT u.id, u.parentid, u.username, ce.`level` + 1 FROM `user` AS u 
      INNER JOIN cte AS ce
      ON u.parentid = ce.id
  )SELECT * FROM cte；
  ```

- 查询一个节点的祖先节点

  方式一：定义 SQL 函数递归查询

  ```sql
  CREATE FUNCTION `getParentList`(rootId INT)
  	RETURNS varchar(1000)
  	BEGIN
  		DECLARE idList varchar(1000);
  		DECLARE idTemp varchar(1000);
  		SET idTemp = CAST(rootId as CHAR);
  		WHILE idTemp is not null DO
  			IF (idList is not null) THEN
  				SET idList = concat(idTemp,',',idList);
  			ELSE
  				SET idList = concat(idTemp);
  			END IF;
  			SELECT group_concat(parentid) INTO idTemp FROM user_role where FIND_IN_SET(id,idTemp)>0;
  		END WHILE;
  	  RETURN idList;
  	END;
  ```

  方式二：使用共用表表达式递归查询（8.0 的版本才支持 WITH）

  > [WITH语法（公用表表达式）](https://dev.mysql.com/doc/refman/8.0/en/with.html)

  ```sql
  WITH RECURSIVE RECURSIVE cte(id, parentid, username, `level`) AS (
      SELECT id, parentid, username, 0 AS `level` FROM `user` WHERE id = 6
      UNION ALL
      SELECT u.id, u.parentid, u.username, ce.`level` - 1  FROM `user` AS u 
      INNER JOIN COMMENT_CTE AS ce　　
  	ON ce.parentid = u.id where ce.id <> ce.parentid
  )SELECT * FROM cte;
  ```


##### 路径枚举

路径枚举是一个由连续的直接层级关系组成的完整路径。如"1/4/7",其中 1 是 4 的直接父亲，这也就意味着 1 是 7 的祖先。

```sql
create table user(
    id int primary key auto_increment COMMENT '自增ID',
    path int COMMENT '节点路径',
    username varchar(20) COMMENT '用户名',
    password varchar(20) COMMENT '密码'
    ……
);
```

- 查询一个节点的所有后代

  ```sql
  SELECT * FROM `user` AS u WHERE u.path LIKE '1/%';
  ```

- 查询一个节点的祖先节点

  ```sql
  SELECT * FROM `user` AS u WHERE '1/3/5/7/' LIKE u.path + '%';
  ```

**路径枚举的缺点:**

　　1、数据库不能确保路径的格式总是正确或者路径中的节点确实存在(中间节点被删除的情况，没外键约束)。

　　2、要依赖高级程序来维护路径中的字符串，并且验证字符串的正确性的开销很大。

　　3、VARCHAR的长度很难确定。无论VARCHAR的长度设为多大，都存在不能够无限扩展的情况。

**路径枚举的优点:**

​	1、 查询父子节点的 SQL 语句简单

​	2、 能够很方便地根据节点的层级排序，因为通过比较字符串长度就能知道层级的深浅

##### 嵌套集

嵌套集解决方案是存储子孙节点的信息，而不是节点的直接祖先。我们使用两个数字来编码每个节点，表示这个信息。可以将这两个数字称为nsleft和nsright。这些数字和 当前节点的主键ID 的值并没有任何关联。

nsleft值的确定：nsleft 的数值小于该节点所有后代的nsleft和nsright。

nsright值的确定：nsright 的值大于该节点所有后代的nsleft和nsright。

也就是当前节点的（nsleft，nsright）要包含其所有子孙节点的（nsleft，nsright）

确定值的方式是对树进行一次深度优先遍历，在逐层深入的过程中依次递增地分配nsleft的值，并在返回时依次递增地分配nsright的值。

- 查询一个节点的所有后代

  ```mysql
  SELECT u2.* FROM `user` AS u1 JOIN `user` AS u2 ON u2.neleft BETWEEN u1.nsleft AND u1.nsright WHERE u1.id = 1;
  ```

- 查询一个节点的祖先节点

  ```mysql
  SELECT u2.* FROM `user` AS u1 JOIN `user` AS u2 ON u1.nsleft BETWEEN u2.nsleft AND u2.nsright WHERE u1.id = 7;
  ```

**嵌套集的优点:**

​	1、 查询父子节点的 SQL 语句简单

​	2、 当删除一个节点造成数值不连续时，并不会对树的结构产生任何影响。

**嵌套集的缺点:**

　　1、插入操作比较麻烦

##### 闭包表

闭包表是解决分层存储一个简单而又优雅的解决方案，它记录了表中所有的节点关系，并不仅仅是直接的父子关系。在闭包表的设计中，额外创建了一张tree_paths的表(空间换取时间)，它包含祖先，后代两列。

可以优化闭包表来使它更方便地查询直接父亲节点或者子节点： 在 tree_paths 表中添加一个 path_length 字段。一个节点的自我引用的path_length 为0，到它直接子节点的path_length 为1，再下一层为2，以此类推。

```mysql
create table tree_paths (
	ancestor    int COMMENT '祖先ID',
　　descendant int COMMENT '后代ID',
	path_length int COMMENT '代际层数'
    ……
);
```

- 查询一个节点的所有后代

  ```mysql
  SELECT u.* FROM `user` AS u INNER JOIN tree_paths t on c.id = t.descendant WHERE t.ancestor = 4;
  ```

- 查询一个节点的祖先节点

  ```mysql
  SELECT u.* FROM `user` AS u INNER JOIN tree_paths t on c.id = t.ancestor WHERE t.descendant = 4;
  ```

- 插入新节点

  要插入一个新的叶子节点，比如 6 的一个子节点，应首先插入一条自己到自己的关系，然后搜索 tree_paths 表中后代是 6 的节点，增加这些节点和新插入节点的“祖先一后代”关系（假设新节点 ID 为8）。

  ```mysql
  INSERT INTO tree_paths (ancestor, descendant) SELECT t.ancestor, 8 FROM tree_paths AS t WHERE t.descendant = 6 UNION ALL SELECT 8, 8;
  ```

  要删除一颗完整的子树，比如 4 和它所有的后代，可删除所有在 tree_paths 表中后代为 4 的行，以及那些以4 的后代为后代的行。

##### 总结

| 设计     | 表数量 | 查询子 | 查询树 | 插入 | 删除 | 引用完整性 |
| -------- | ------ | ------ | ------ | ---- | ---- | ---------- |
| 邻接表   | 1      | 简单   | 简单   | 简单 | 简单 | 是         |
| 枚举路径 | 1      | 简单   | 简单   | 简单 | 简单 | 否         |
| 嵌套集   | 1      | 困难   | 简单   | 困难 | 困难 | 否         |
| 闭包表   | 2      | 简单   | 简单   | 简单 | 简单 | 是         |

　　1、邻接表是最方便的设计，并且很多软件开发者都了解它。并且在递归查询的帮助下，使得邻接表的查询更加高效。

　　2、枚举路径能够很直观地展示出祖先到后代之间的路径，但由于不能确保引用完整性，使得这个设计比较脆弱。枚举路径也使得数据的存储变得冗余。

　　3、嵌套集是一个聪明的解决方案，但不能确保引用完整性，并且只能使用于查询性能要求较高，而其他要求一般的场合使用它。

　　4、闭包表是最通用的设计，并且最灵活，易扩展，并且一个节点能属于多棵树，能减少冗余的计算时间。但它要求一张额外的表来存储关系，是一个空间换取时间的方案。

### MySQL中派生表、临时表、公共表、子查询的区别

1. 公用表表达式CTE(Common Table Expression)是一个命名的临时结果集，仅在单个SQL语句(例如SELECT，INSERT，UPDATE或DELETE)的执行范围内存在。

   ```sql
   WITH customers_in_usa AS (
       SELECT 
           customerName, state
       FROM
           customers
       WHERE
           country = 'USA'
   ) SELECT 
       customerName
    FROM
       customers_in_usa
    WHERE
       state = 'CA';
   ```

2. 派生表是从SELECT语句返回的虚拟表。与子查询不同，派生表必须具有别名，以便稍后在查询中引用其名称。

   ```sql
   SELECT 
       customerName
   FROM
       (SELECT 
           customerName, state
       FROM
           user
   	WHERE country = 'USA') customers_in_usa
   WHERE state = 'CA';
   ```

3. 临时表是一种特殊类型的表，它允许您存储一个临时结果集，可以在单个会话中多次重用。

   ```sql
   CREATE TEMPORARY TABLE customers_in_usa
   SELECT 
   	customerName, state
   FROM
   	user
   WHERE country = 'USA';
   
   DROP TEMPORARY TABLE customers_in_usa;
   ```

4. 子查询是嵌套在另一个查询(如SELECT，INSERT，UPDATE或DELETE)中的查询。

   ```sql
   SELECT 
       customerName
   FROM
   	customers
   WHERE state = 'CA' AND id IN (
   SELECT 
   	id
   FROM
   	customers
   WHERE country = 'USA');
   ```


### 事务

1. 什么是事务

   **事务是**数据库中的**一个**单独的**执行单元**。是指作为单个逻辑工作单元执行的一系列操作，要么完全地执行，要么完全地不执行。

2. 事务的四大特性 ACID

   - **原子性（Atomicity）**

     原子性是指**事务是一个不可分割的工作单位**，事务中的操作要么都发生，要么都不发生。

   - **一致性（Consistency）**

     > [怎么理解数据库事务的一致性](https://blog.csdn.net/qq_37997523/article/details/83188003)

     事务执行前后，数据库系统保持一致性状态。即系统从一个一致的状态转换到另一个一致状态。

     一致性是指**数据处于一种语义上的有意义且正确的状态**。一致性是对数据**可见性**的约束，保证在一个事务中的多次操作的数据中间状态对其他事务是不可见的。

     原子性和一致性的的侧重点不同：**原子性关注状态**，要么全部成功，要么全部失败，不存在部分成功的状态。而一致性**关注数据的可见性**，中间状态的数据对外部不可见，只有最初状态和最终状态的数据对外可见。

     在未提交读的隔离级别下，会造成脏读，这就是因为一个事务读到了另一个事务操作内部的数据。ACID中的一致性描述的是一个最理想的事务应该是怎样的，是一个强一致性状态，如果要做到这点，需要使用排它锁把事务排成一队，即 Serializable 的隔离级别，这样性能就大大降低了。现实是骨感的，所以使用不同隔离级别来破坏一致性，以获取更好的性能。

   - **隔离性（Isolation）**

     多个事务并发访问时，事务之间是隔离的，一个事务不影响其它事务的执行。

   - **持久性（Durability）**

     事务一旦提交，对数据库数据的修改便是永久性的。即使系统或介质发生故障时，其修改也将持久化保存在数据库中。

3. 事务的并发问题

   > [MySQL高并发事务问题及解决方案](https://segmentfault.com/a/1190000012626590)

   1. **赃读**（Dirty Read）

      一个事务读取到了另外一个事务没有提交的数据。

   2. **不可重复读**（Nonrepeatable Read）

      在同一事务中，两次读取同一数据，得到不同内容。

   3. **幻读**（Phantom Read）

      同一事务中，用同样的操作读取两次，得到的记录数不相同。

   4. **丢失更新**（Lost Update）

      1. 第一类丢失更新: A事务撤销时, 把已经提交的B事务的更新数据覆盖了。
      2. 第二类丢失更新: A事务覆盖B事务已经提交的数据，造成B事务所做跟新丢失。

   [不可重复读与幻读的区别](https://segmentfault.com/a/1190000012669504)：

   - 不可重复读的重点是修改，幻读的重点在于新增或者删除。

   - 不可重复读主要是说多次读取一条记录, 发现该记录中某些列值被修改过。

   - 幻读主要是说多次读取一个范围内的记录(包括直接查询所有记录结果或者做聚合统计), 发现结果不一致(标准档案一般指记录增多, 记录的减少应该也算是幻读)。(可以参考[MySQL官方文档对 Phantom Rows 的介绍](https://dev.mysql.com/doc/refman/5.7/en/innodb-next-key-locking.html))

4. 事务的隔离级别

   > [数据库并发事务中的问题与解决方案](https://blog.csdn.net/u012739535/article/details/76855728)
   >
   > [数据库并发事务详解](https://blog.csdn.net/qq_21993785/article/details/81077318)

   1. READ_UNCOMMITTED**（读未提交）**

      - 读事务不阻塞其他读事务和写事务，未提交的写事务阻塞其他写事务但不阻塞读事务。

      - 可以防止更新丢失，但不能防止脏读、不可重复读、幻读。
      - 可以通过“排他写锁”实现。

   2. READ_COMMITTED **（读已提交）**

      - 读事务不阻塞其他读事务和写事务，未提交的写事务阻塞其他读事务和写事务。
      - 可以防止更新丢失、脏读，但不能防止不可重复读、幻读。
      - 可以通过“瞬间共享读锁”和“排他写锁”实现。

   3. REPEATABLE_READ**（可重复读）**

      - 以操作同一行数据为前提，读事务阻塞其他写事务但不阻塞读事务，未提交的写事务阻塞其他读事务和写事务。
      - 可以防止更新丢失、脏读、不可重复读，但不能防止幻读。
      - 可以通过“共享读锁”和“排他写锁”实现。

   4. SERIALIZABLE**（可序列化）**

      - 事务序列化执行，只能一个接着一个地执行，不能并发执行。
      - 可以防止更新丢失、脏读、不可重复读、幻读。
      - 如果仅仅通过“行级锁”是无法实现事务序列化的，需使用“表级锁”。

   | 事务隔离级别 | 回滚覆盖 | 脏读     | 不可重复读 | 提交覆盖 | 幻读     |
   | ------------ | -------- | -------- | ---------- | -------- | -------- |
   | 读未提交     | x        | 可能发生 | 可能发生   | 可能发生 | 可能发生 |
   | 读已提交     | x        | x        | 可能发生   | 可能发生 | 可能发生 |
   | 可重复读     | x        | x        | x          | x        | 可能发生 |
   | 串行化       | x        | x        | x          | x        | x        |

   隔离级别越高，越能保证数据的完整性和一致性，但是对并发性能的影响也越大。对于多数应用程序，可以优先考虑把数据库系统的隔离级别设为Read Committed。它能够避免脏读，而且具有较好的并发性能。尽管它会导致不可重复读、幻读和第二类丢失更新这些并发问题，在可能出现这类问题的个别场合，可以由应用程序采用悲观锁或乐观锁来控制。

   大多数数据库的默认级别就是Read committed，比如Sql Server , Oracle。

   MySQL 默认的事务隔离级别为 REPEATABLE_READ

### Spring声明式事务管理

> [Spring声明式事务管理之一：五大属性分析](https://segmentfault.com/a/1190000011743233)
>
> [可能是最漂亮的Spring事务管理详解](https://segmentfault.com/a/1190000014957011)


#### Spring五个事务隔离级别

| 隔离级别                   | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| ISOLATION_DEFAULT          | 使用数据库默认的隔离级别，Mysql 默认采用的 REPEATABLE_READ隔离级别，Oracle 默认采用的 READ_COMMITTED隔离级别。 |
| ISOLATION_READ_UNCOMMITTED | 读未提交                                                     |
| ISOLATION_READ_COMMITTED   | 读已提交                                                     |
| ISOLATION_REPEATABLE_READ  | 可重复度                                                     |
| ISOLATION_SERIALIZABLE     | 序列化                                                       |



#### Spring七个事务传播行为

> [Spring事务传播行为详解](https://segmentfault.com/a/1190000013341344)
>
> [spring 事务传播行为实例分析](https://blog.csdn.net/pml18710973036/article/details/58607148)
>
> [【Spring学习34】Spring事务(4)：事务属性之7种传播行为](https://blog.csdn.net/soonfly/article/details/70305683)

| 事务传播行为类型          | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_REQUIRED      | 如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。这是最常见的选择。 |
| PROPAGATION_SUPPORTS      | 支持当前事务，如果当前没有事务，就以非事务方式执行。         |
| PROPAGATION_MANDATORY     | 使用当前的事务，如果当前没有事务，就抛出异常。               |
| PROPAGATION_REQUIRES_NEW  | 新建事务，如果当前存在事务，把当前事务挂起。                 |
| PROPAGATION_NOT_SUPPORTED | 以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。   |
| PROPAGATION_NEVER         | 以非事务方式执行，如果当前存在事务，则抛出异常。             |
| PROPAGATION_NESTED        | 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与PROPAGATION_REQUIRED类似的操作。 |

事务传播行为定义的是事务的控制范围，事务隔离级别定义的是事务在数据库读写方面的控制范围。

#### 超时时间

TransactionDefinition 接口中定义了1个表示超时时间的常量TIMEOUT_DEFAULT 默认是30秒，使用getTimeout()方法可以获取到超时时间，单位是秒。Spring事务超时时间，是指一个事务所允许执行的最长时间，如果超过该时间限制但事务还没有完成，则自动回滚事务。

#### 是否只读

事务管理的只读属性是指对事务性资源进行只读操作或者是可读写操作。所谓事务性资源就是指那些被事务管理的资源，如数据源、JMS 资源，以及自定义的事务性资源等。如果确定只对事务性资源进行只读操作，那么我们可以将事务标志为只读的，以提高事务处理的性能。在TransactionDefinition 中以 boolean 类型来表示该事务是否只读，使用方法isReadOnly()来判断事务是否是只读的。

#### 回滚规则

通常情况下，如果在事务中抛出了未检查异常（继承自 RuntimeException 的异常），则默认将回滚事务。如果没有抛出任何异常，或者抛出了已检查异常，则正常提交事务。我们可以根据需要人为控制事务在抛出某些未检查异常时仍然提交事务，或者在抛出某些已检查异常时回滚事务。
Transactional注解中有4个属性通过设置系统异常类和自定义异常类来自定义回滚规则。

- **@Transactional(rollbackFor=RuntimeException.class)**
  用于设置需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，则事务回滚。
- **@Transactional(rollbackForClassName="RuntimeException")**
  用于设置需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，则进行事务回滚
- **@Transactional(noRollbackFor=RuntimeException.class)**
  用于设置不需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，不进行事务回滚
- **@Transactional(noRollbackForClassName=RuntimeException.class)**
  用于设置不需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，不进行事务回滚

**其他**

- @Transactional 只能被应用到public方法上, 对于其它非public的方法,如果标记了@Transactional也不会报错,但方法没有事务功能

- 可以在接口上使用 @Transactional  注解，但是只有当你设置了基于接口的代理时它才生效。因为**注解是不能继承的**。

- 当你在Spring中配置了 `<aop:aspectj-autoproxy></aop:aspectj-autoproxy>` 时，那么代理类就是基于接口的代理。 

  当你在Spring中配置了 `<aop:aspectj-autoproxy proxy-target-class="true"/>` 时，那么代理类就是基于类的代理。

- 事务传播机制只适用于不同bean之间方法的调用，如果一个bean中的两个方法互相调用并不会使用到事务传播。

  原因解释：spring的事物管理通过AOP代理来实现， 根据aop的思想，不可能在具体类上直接处理事务，而是通过代理类来处理，代理类在调用具体类的方法来实现，methodA通过this调用methodB，那么此时相当于调用methodB时是没有经过代理类的调用，因此spring无法对事物的传播行为做处理。


### 数据库的锁机制

> [MySqL 事务与锁的深入学习笔记](https://blog.csdn.net/canot/article/details/53815294)

**分类**

按锁类型划分，可分为共享锁、排他锁
按锁的粒度划分，可分为表级锁、行级锁、页级锁
按使用机制划分，可分为乐观锁、悲观锁

**共享锁与排他锁**

共享锁（Shared locks, S-locks）
也叫读锁、S锁。在没有检测到排他锁时才可以加共享锁，其他事务可以并发读取该数据，但任何事务都不能对数据进行修改（获取数据上的排他锁），直到已释放所有共享锁。
用法：`SELECT ... LOCK IN SHARE MODE;`

排他锁（Exclusive locks, X-locks）
也叫写锁、X锁。在没有加任何锁时才可以加排他锁，加上排他锁后，其他事务不能再加任何类型的锁，直到已释放该排他锁。
用法：`SELECT ... FOR UPDATE;`

InnoDB还有两个表锁：
意向共享锁（IS）：表示事务准备给数据行加入共享锁，也就是说一个数据行加共享锁前必须先取得该表的IS锁。
意向排他锁（IX）：表示事务准备给数据行加入排他锁，事务在一个数据行加排他锁前必须先取得该表的IX锁。
意向锁是InnoDB自动加的，不需要用户干预。

**级锁、行级锁、页级锁**   

表级锁：直接锁定整张表，在锁定期间，其他进程无法对该表进行写操作。如果你是写锁，则其他进程读也不允许。特点是：开销小、加锁快，不会出现死锁。锁定粒度最大，发生锁冲突的概率最高，并发度最低。
MYISAM存储引擎采用的就是表级锁。

行级锁：仅对指定的记录进行加锁，这样其他进程还是可以对同一个表中的其他记录进行操作。特点：开销大，加锁慢，会出现死锁。锁定的粒度最小，发生锁冲突的概率最低，并发度也最高。
InnoDB存储引擎既支持行级锁，也支持表级锁，但默认情况下是采用行级锁。

页级锁：一次锁定相邻的一组记录。开销和加锁时间介于表级锁和行级锁之间；会出现死锁；锁定粒度也介于表级锁和行级锁之间，并发度一般。

**乐观锁、悲观锁**

无论是悲观锁还是乐观锁，都是人们定义出来的概念，可以认为是一种思想。不要把乐观并发控制和悲观并发控制狭义的理解为DBMS中的概念，更不要把他们和数据中提供的锁机制（行锁、表锁、排他锁、共享锁）混为一谈。其实，在DBMS中，悲观锁正是利用数据库本身提供的锁机制来实现的。

悲观并发控制（又名“悲观锁”，Pessimistic Concurrency Control，缩写“PCC”）是一种并发控制的方法。锁如其名，它指的是对数据被外界修改持悲观态度，即假定当前事务操纵数据资源时，肯定还会有其他事务同时访问该数据资源。因此，为了避免当前事务的操作受到干扰，先锁定资源。悲观锁需使用数据库的锁机制实现，如使用行级排他锁或表级排它锁。

悲观并发控制实际上是“先取锁再访问”的保守策略，为数据处理的安全提供了保证。但是在效率方面，处理加锁的机制会让数据库产生额外的开销，增加产生死锁的机会；另外，在只读型事务处理中由于不会产生冲突，也没必要使用锁，这样做只能增加系统负载；还会降低了并行性。

乐观并发控制（又名“乐观锁”，Optimistic Concurrency Control，缩写“OCC”）是一种并发控制的方法。它对数据被外界修改持乐观态度，即假定当前事务操纵数据资源时，不会有其他事务同时访问该数据资源，因此不在数据库层次上锁定，乐观锁使用由程序逻辑控制的技术来避免可能出现的并发问题。

乐观锁的实现方式有两种，第一种是使用版本号，第二种是使用时间戳。

基于**数据版本记录机制**的实现：即每行数据多一个版本字段，当读取数据时，将版本标识的值一同读出，数据每更新一次，同时对版本标识进行更新。当我们提交更新的时候，将数据库表对应记录的当前版本信息与第一次取出来的版本标识进行比对，如果数据库表当前版本号与第一次取出来的版本标识值相等，则予以更新，否则认为是过期数据。 

使用时间戳的实现：依然是为每条数据增加一个时间戳字段，在更新提交的时候，将当前数据库中数据的时间戳与第一次读取的时间戳进行比对，如果一致则更新，否则认为是过期数据。

乐观锁不能解决脏读的问题，因此仍需要数据库至少启用“读已提交”的事务隔离级别。

#### MVCC

MySQL InnoDB存储引擎，实现的是基于**多版本的并发控制协议**——MVCC (Multi-Version Concurrency Control) (注：与MVCC相对的，是基于锁的并发控制，Lock-Based Concurrency Control)。MVCC最大的好处，相信也是耳熟能详：读不加锁，读写不冲突。在读多写少的应用中，读写不冲突是非常重要的，极大的增加了系统的并发性能，这也是为什么现阶段，几乎所有的RDBMS，都支持了MVCC。

在MVCC并发控制中，读操作可以分成两类：快照读 (snapshot read)与当前读 (current read)。快照读，读取的是记录的可见版本 (有可能是历史版本)，不用加锁。当前读，读取的是记录的最新版本，并且，当前读返回的记录，都会加上锁，保证其他事务不会再并发修改这条记录。

在一个支持MVCC并发控制的系统中，哪些读操作是快照读？哪些操作又是当前读呢？以MySQL InnoDB为例：

快照读：简单的select操作，属于快照读，不加锁。

`select * from table where ?;`

当前读：特殊的读操作，插入/更新/删除操作，属于当前读，需要加锁。

```mysql
select * from table where ? lock in share mode;
select * from table where ? for update;
insert into table values (…);
update table set ? where ?;
delete from table where ?;
```

除了第一条语句，对读取记录加S锁 (共享锁)外，其他的操作，都加的是X锁 (排它锁)。

#### 三级加锁协议、两段锁协议

> [数据库并发事务中的问题与解决方案](https://blog.csdn.net/u012739535/article/details/76855728)

三级加锁协议也称为三级封锁协议，是为了保证正确的调度事务的并发操作，事务在对数据库对象加锁、解锁时必须遵守的一种规则。在运用X锁和S锁对数据对象加锁时，还需要约定一些规则 ，例如何时申请X锁或S锁、持锁时间、何时释放等。称这些规则为封锁协议（Locking Protocol）。对封锁方式规定不同的规则，就形成了各种不同的封锁协议。

**一级封锁协议**
事务T在修改数据R之前必须先对其加X锁，直到事务结束才释放。事务结束包括正常结束（COMMIT）和非正常结束（ROLLBACK）。
一级封锁协议可以防止丢失修改，并保证事务T是可恢复的。使用一级封锁协议可以解决丢失修改问题。
在一级封锁协议中，如果仅仅是读数据不对其进行修改，是不需要加锁的，它不能保证可重复读和不读“脏”数据。

**二级封锁协议**
一级封锁协议加上事务T在读取数据R之前必须先对其加S锁，读完后方可释放S锁。
二级封锁协议除防止了丢失修改，还可以进一步防止读“脏”数据。但在二级封锁协议中，由于读完数据后即可释放S锁，所以它不能保证可重复读。

**三级封锁协议**
一级封锁协议加上事务T在读取数据R之前必须先对其加S锁，直到事务结束才释放。
三级封锁协议除防止了丢失修改和不读“脏”数据外，还进一步防止了不可重复读。

上述三级协议的主要区别在于什么操作需要申请封锁，以及何时释放。

**两段锁协议**

可串行化调度是指，通过并发控制，使得并发执行的事务结果与某个串行执行的事务结果相同。

两段锁协议规定在对任何数据进行读写操作之前，事务首先要获得对该数据的封锁；而且在释放一个封锁之后，事务不再获得任何其他封锁。就是说加锁和解锁分为两个阶段进行。

> 事务遵循两段锁协议是保证可串行化调度的充分条件。例如以下操作满足两段锁协议，它是可串行化调度。
> Xlock(A)…Slock(B)…Slock(C)…unlock(A)…unlock(C)…unlock(B) 
> 但不是必要条件，例如以下操作不满足两段锁协议，但是它还是可串行化调度: 
> Xlock(A)…unlock(A)…Slock(B)…unlock(B)…Slock(C)…unlock(C)

| 事务隔离级别 | 加锁协议     |
| ------------ | ------------ |
| 读未提交     | 一级加锁协议 |
| 读已提交     | 二级加锁协议 |
| 可重复读     | 三级加锁协议 |
| 串行化       | 两段锁协议   |

注：封锁协议和隔离级别并不是严格对应的。

MySQL 的 InnoDB 存储引擎采用两段锁协议，会根据隔离级别在需要的时候自动加锁，并且所有的锁都是在同一时刻被释放，这被称为隐式锁定。

#### 死锁

**产生死锁的四个必要条件：**

（1） 互斥条件：一个资源每次只能被一个进程使用。
（2） 请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放。
（3） 不剥夺条件:进程已获得的资源，在末使用完之前，不能强行剥夺。
（4） 循环等待条件:若干进程之间形成一种头尾相接的循环等待资源关系。

**避免死锁**

（1） 按同一顺序访问对象。(注：避免出现循环)
（2） 避免事务中的用户交互。(注：减少持有资源的时间，较少锁竞争)
（3） 保持事务简短并处于一个批处理中。(注：减少持有资源的时间)
（4） 使用较低的隔离级别。(注：使用较低的隔离级别比使用较高的隔离级别持有共享锁的时间更短)
（5） 使用基于行版本控制的隔离级别。
（6） 使用绑定连接。

## 多线程

- CAS
- AQS
- 线程池

##  设计模式

> [JAVA设计模式总结之23种设计模式](https://www.cnblogs.com/pony1223/p/7608955.html)

![](https://images2017.cnblogs.com/blog/401339/201709/401339-20170928225241215-295252070.png)

### 单例模式

一般有 8 种：饿汉式（静态常量）、饿汉式（静态代码块）、懒汉式(线程不安全)、懒汉式(线程安全，同步方法)、懒汉式(线程安全，同步代码块)、双重校验锁、静态内部类、枚举

| 实现方式                     | 线程安全 | 延迟加载 | 抵御反射攻击 |
| ---------------------------- | -------- | -------- | ------------ |
| 饿汉式（静态常量）           | Y        | N        | N            |
| 饿汉式（静态代码块）         | Y        | N        | N            |
| 懒汉式(线程不安全)           | Y        | Y        | N            |
| 懒汉式(线程安全，同步方法)   | Y        | Y        | N            |
| 懒汉式(线程安全，同步代码块) | N        | Y        | N            |
| 双重校验锁                   | Y        | Y        | N            |
| 静态内部类                   | Y        | Y        | N            |
| 枚举                         | Y        | Y        | Y            |

#### 饿汉式（静态常量）

```java
public class Singleton {
    private static Singleton instance = new Singleton();
    private Singleton (){}
    public static Singleton getInstance() {
        return instance;
    }
}
```

优点：基于 classloader 机制避免了多线程的同步问题。没有加锁，执行效率会提高。
缺点：类加载时就初始化，浪费内存。

#### 饿汉式（静态代码块）

```java
public class Singleton {
    private static Singleton instance;
    static{
        instance = new Singleton();
    }
    private Singleton (){}
    public static Singleton getInstance() {
        return instance;
    }
}
```

优点：基于 classloader 机制避免了多线程的同步问题。没有加锁，执行效率会提高。
缺点：类加载时就初始化，浪费内存。

#### 懒汉式(线程不安全)

```java
public class Singleton {
    private static Singleton instance;
    private Singleton (){}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

优点：懒加载。
缺点：线程不安全。

#### 懒汉式(线程安全，同步方法)

```java
public class Singleton {
    private static Singleton instance;
    private Singleton (){}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

优点：懒加载， 线程安全。
缺点：加锁影响效率。

#### 懒汉式(线程安全，同步代码块)

```java
public class Singleton {
   private static Singleton singleton;
   private Singleton() {}

   public static Singleton getInstance() {
       if (singleton == null) {
           synchronized (Singleton.class) {
               singleton = new Singleton();
           }
       }
       return singleton;
   }
}
```

优点：懒加载， 解决效率问题。
缺点：存在线程安全问题。

#### 双重校验锁（DCL，即 double-checked locking）

```java
public class Singleton {
    private volatile static Singleton singleton;
    private Singleton (){}
    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```

优点：线程安全且在多线程情况下能保持高性能。

缺点：由于JVM编译器的[**指令重排**可能会导致线程不安全](https://mp.weixin.qq.com/s?src=11&timestamp=1552554141&ver=1483&signature=JmbsFEDRnIJQwueG2QuOMFjXqS20v5f46WEEXm-ihMO4T8xymNheoGhBuO*qCN67WlFP9SoQIntPMnWzrwtT6aEi*mYtz8XB6a*W4GrFa5Er6LF6RVjJnsAam3TQta6D&new=1)。使用 volatile 修饰 singleton 可避免此问题。

#### 静态内部类

```java
public class Singleton {
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    private Singleton (){}
    public static final Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

优点：利用类加载机制避免了线程不安全，相对饿汉式增加了延迟加载能力，效率高。

#### 枚举

```java
public enum Singleton {
    INSTANCE;
}
```

优点：利用 enum 语法糖，JVM 会阻止获取枚举类的私有构造方法。使用枚举实现的单例模式，不但可以防止利用反射强行构建单例对象，而且可以在枚举类对象被**反序列化**的时候，保证反序列的返回结果是同一对象

缺点：非懒加载。

### 工厂模式

> [图说设计模式](https://design-patterns.readthedocs.io/zh_CN/latest/index.html)

#### 简单工厂

**定义**

简单工厂模式(Simple Factory Pattern)：又称为静态工厂方法(Static Factory Method)模式，它属于类创建型模式。在简单工厂模式中，可以根据参数的不同返回不同类的实例。简单工厂模式专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类。

**实例**

> [简单工厂实例](https://segmentfault.com/a/1190000015050674#articleHeader9)

**应用**

1. JDK类库中广泛使用了简单工厂模式，如工具类java.text.DateFormat，它用于格式化一个本地日期或者时间。

    ```java
    public final static DateFormat getDateInstance();
    public final static DateFormat getDateInstance(int style);
    public final static DateFormat getDateInstance(int style,Locale
    locale);
    ```

1. Java加密技术

    获取不同加密算法的密钥生成器:

    ```java
    KeyGenerator keyGen=KeyGenerator.getInstance("DESede");
    ```

    创建密码器:

    ```java
    Cipher cp=Cipher.getInstance("DESede");
    ```

优点：

1、屏蔽产品的具体实现，调用者只关心产品的接口。

2、实现简单

缺点：

1、增加产品，需要修改工厂类，不符合开放-封闭原则

2、工厂类集中了所有实例的创建逻辑，违反了高内聚责任分配原则

#### 工厂方法

**定义**
工厂方法模式(Factory Method Pattern)又称为工厂模式，也叫虚拟构造器(Virtual Constructor)模式或者多态工厂(Polymorphic Factory)模式，它属于类创建型模式。在工厂方法模式中，工厂父类负责定义创建产品对象的公共接口，而工厂子类则负责生成具体的产品对象，这样做的目的是将产品类的实例化操作延迟到工厂子类中完成，即通过工厂子类来确定究竟应该实例化哪一个具体产品类。

在工厂方法模式中，核心的工厂类不再负责所有产品的创建，而是将具体创建工作交给子类去做。这个核心类仅仅负责给出具体工厂必须实现的接口，而不负责哪一个产品类被实例化这种细节，这使得工厂方法模式可以允许系统在不修改工厂角色的情况下引进新产品。这一特点无疑使得工厂方法模式具有超越简单工厂模式的优越性，更加符合“开闭原则”。

**实例**

> [工厂方法模式实例](https://segmentfault.com/a/1190000015050674#articleHeader15)

**应用**

> [设计模式（六）——JDK中的那些工厂方法](https://www.hollischuang.com/archives/1408)

1. Collection中的iterator方法

   `java.util.Collection`接口中定义了一个抽象的`iterator()`方法，该方法就是一个工厂方法。

   对于`iterator()`方法来说`Collection`就是一个根抽象工厂，下面还有`List`等接口作为抽象工厂，再往下有`ArrayList`等具体工厂。

   `java.util.Iterator`接口是根抽象产品，下面有`ListIterator`等抽象产品，还有`ArrayListIterator`等作为具体产品。

   使用不同的具体工厂类中的`iterator`方法能得到不同的具体产品的实例。

优点：

1、继承了简单工厂模式的优点

2、符合开放-封闭原则

缺点：

1、增加产品，需要增加新的工厂类，导致系统类的个数成对增加，在一定程度上增加了系统的复杂性。

#### 抽象工厂

**定义**
抽象工厂模式(Abstract Factory Pattern)：提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为Kit模式，属于对象创建型模式。

抽象工厂是生产一整套有产品的（至少要生产两个产品)，这些产品必须相互是有关系或有依赖的，而工厂方法中的工厂是生产单一产品的工厂。

**实例**

> [抽象工厂模式实例](https://segmentfault.com/a/1190000015050674#articleHeader21)

**应用**

1. jdk 中的数据库链接

   ![](http://hi.csdn.net/attachment/201101/3/0_1294058833piFB.gif)

   抽象工厂：Connection

   具体工厂：MysqlCollectionImpl

   抽象产品：Statement、PreparedStatement、CallableStatement、ResultSet

   具体产品：MysqlStatement、MysqlPreparedStatement、MysqlCallableStatement、MysqlResultSet

2. 在很多软件系统中需要更换界面主题，要求界面中的按钮、文本框、背景色等一起发生改变时，可以使用抽象工厂模式进行设计。例如**UIManager（swing外观）**

### 适配器模式

**定义**

适配器模式(Adapter Pattern) ：将一个接口转换成客户希望的另一个接口，适配器模式使接口不兼容的那些类可以一起工作，其别名为包装器(Wrapper)。适配器模式既可以作为类结构型模式，也可以作为对象结构型模式。

**结构**
适配器模式包含如下角色：

- Target：目标抽象类
- Adapter：适配器类
- Adaptee：适配者类
- Client：客户类

适配器模式有对象适配器和类适配器两种实现：

**实例**

> [适配器模式| 菜鸟教程](http://www.runoob.com/design-pattern/adapter-pattern.html)
>
> [模式原理](https://blog.csdn.net/carson_ho/article/details/54910430#t3)

**类的适配器模式**

1.  创建Target接口（目标抽象类）

    ```java
    public interface Target {
        //这是源类Adapteee没有的方法
        public void Request(); 
    }
    ```


2. 创建源类 Adaptee（适配者类）

    ```java
    public class Adaptee {
        public void SpecificRequest(){
        }
    }
    ```


3. 创建适配器类 Adapter（适配器类）

    ```java
    //适配器Adapter继承自Adaptee，同时又实现了目标(Target)接口。
    public class Adapter extends Adaptee implements Target {

        //目标接口要求调用Request()这个方法名，但源类Adaptee没有方法Request()
        //因此适配器补充上这个方法名
        //但实际上Request()只是调用源类Adaptee的SpecificRequest()方法的内容
        //所以适配器只是将SpecificRequest()方法作了一层封装，封装成Target可以调用的Request()而已
        @Override
        public void Request() {
            this.SpecificRequest();
        }
    }
    ```
	
4. 定义具体使用目标类，并通过Adapter类调用所需要的方法从而实现目标（客户类）

    ```java
    public class AdapterPattern {

        public static void main(String[] args){
            Target mAdapter = new Adapter()；
            mAdapter.Request（）;
        }
    }
    ```

- 背景：小成买了一个进口的电视机
- 冲突：进口电视机要求电压（110V）与国内插头标准输出电压（220V）不兼容
- 解决方案：设置一个适配器，将插头输出的220V转变成110V

1. 创建**Target接口，期待得到的插头**能将 220V 转换成 110V（目标抽象类）

   ```java
   public interface Target {
       //将220V转换成110V（原有插头（Adaptee）没有的）
       public void Convert_110v();
   }
   ```

2. 创建源类，原有的插头（适配者类）

   ```java
   class PowerPort220V{
   	//原有插头只能接收220V
       public void Receive_220v(){
       }
   }
   ```

3. 创建适配器类

   ```java
   class Adapter220V extends PowerPort220V implements Target{
       //期待的插头要求调用 Convert_110v()，但原有插头没有
       //因此适配器补充上这个方法名
       //但实际上Convert_110v()只是调用原有插头的Receive_220v()方法的内容
       //所以适配器只是将Receive_220v()作了一层封装，封装成Target可以调用的Convert_110v()而已
       @Override
       public void Convert_110v(){
         this.Receive_220v;
       }
   }
   ```

4. 定义具体使用目标类，并通过Adapter类调用所需要的方法从而实现目标（客户类）

   ```java
   //进口机器类
   class ImportedMachine {
   
       public void Work() {
           System.out.println("进口机器正常运行");
       }
   }
   
   //通过Adapter类调用所需要的方法
   public class AdapterPattern {
       public static void main(String[] args){
   
           Target mAdapter220V = new Adapter220V();
           ImportedMachine mImportedMachine = new ImportedMachine();
           
           //用户拿着进口机器插上适配器（调用Convert_110v()方法）
           //再将适配器插上原有插头（Convert_110v()方法内部调用Receive_220v()方法接收220V）
           //适配器只是个外壳，对外提供110V，但本质还是220V进行供电
           mAdapter220V.Convert_110v();
           mImportedMachine.Work();
       }
   }
   ```

**对象的适配器模式**

与类的适配器模式不同的是，对象的适配器模式不是使用继承关系连接到Adaptee类，而是使用委派关系连接到Adaptee类。

1. 创建Target接口

   ```java
   public interface Target {
       //这是源类Adapteee没有的方法
       public void Request(); 
   }
   ```

2. 创建源类（Adaptee）

   ```java
   public class Adaptee {
       public void SpecificRequest(){
       }
   }
   ```

3. 创建适配器类（Adapter）（不用继承而是委派）

   ```java
   class Adapter implements Target{  
       // 直接关联被适配类  
       private Adaptee adaptee;  
   
       // 可以通过构造函数传入具体需要适配的适配者对象  
       public Adapter (Adaptee adaptee) {  
           this.adaptee = adaptee;
       }  
   
       @Override
       public void Request() {  
           // 这里是使用委托的方式完成特殊功能  
           this.adaptee.SpecificRequest();  
       }  
   }
   ```

4. 定义具体使用目标类，并通过Adapter类调用所需要的方法从而实现目标。

   ```java
   public class AdapterPattern {
       public static void main(String[] args){
           //需要先创建一个适配者的对象作为参数  
           Target mAdapter = new Adapter(new Adaptee())；
           mAdapter.Request();
   
       }
   }
   ```

**应用**

Sun公司在1996年公开了Java语言的数据库连接工具JDBC，JDBC使得Java语言程序能够与数据库连接，并使用SQL语言来查询和操作数据。JDBC给出一个客户端通用的抽象接口，每一个具体数据库引擎（如SQL Server、Oracle、MySQL等）的JDBC驱动软件都是一个介于JDBC接口和数据库引擎接口之间的适配器软件。抽象的JDBC接口和各个数据库引擎API之间都需要相应的适配器软件，这就是为各个不同数据库引擎准备的驱动程序。

### 装饰模式

> [设计模式——装饰模式（Decorator）](https://blog.csdn.net/zhshulin/article/details/38665187)
> [《JAVA与模式》之装饰模式](https://www.cnblogs.com/java-my-life/archive/2012/04/20/2455726.html)

**定义**

装饰模式(Decorator Pattern) ：动态地给一个对象增加一些额外的职责(Responsibility)，就增加对象功能来说，装饰模式比生成子类实现更为灵活。其别名也可以称为包装器(Wrapper)，与适配器模式的别名相同，但它们适用于不同的场合。根据翻译的不同，装饰模式也有人称之为“油漆工模式”，它是一种对象结构型模式。

在阎宏博士的《JAVA与模式》一书中开头是这样描述装饰（Decorator）模式的：
装饰模式又名包装(Wrapper)模式。装饰模式以对客户端透明的方式扩展对象的功能，是继承关系的一个替代方案。

**结构**

装饰模式包含如下角色：

- Component: 抽象构件
- ConcreteComponent: 具体构件
- Decorator: 抽象装饰类
- ConcreteDecorator: 具体装饰类

**实例**

齐天大圣的例子：孙悟空有七十二般变化，他的每一种变化都给他带来一种附加的本领。他变成鱼儿时，就可以到水里游泳；他变成鸟儿时，就可以在天上飞行。

本例中，Component的角色便由鼎鼎大名的齐天大圣扮演；ConcreteComponent的角色属于大圣的本尊，就是猢狲本人；Decorator的角色由大圣的七十二变扮演。而ConcreteDecorator的角色便是鱼儿、鸟儿等七十二般变化。

![img](data:image/png;base64,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)

1. 抽象构件角色“齐天大圣”接口定义了一个move()方法，这是所有的具体构件类和装饰类必须实现的。

    ```java
    //大圣的尊号
    public interface TheGreatestSage {    
        public void move();
    }
    ```

2. 具体构件角色“大圣本尊”猢狲类

    ```java
    public class Monkey implements TheGreatestSage {
    
        @Override
        public void move() {
            //代码
            System.out.println("Monkey Move");
        }
    }
    ```

3. 抽象装饰角色“七十二变”

    ```java
    public class Change implements TheGreatestSage {
        private TheGreatestSage sage;
    
        public Change(TheGreatestSage sage){
            this.sage = sage;
        }
        @Override
        public void move() {
            // 代码
            sage.move();
        }
    
    }
    ```

4. 具体装饰角色“鱼儿”

    ```java
    public class Fish extends Change {
    
        public Fish(TheGreatestSage sage) {
            super(sage);
        }
    
        @Override
        public void move() {
            // 代码
            System.out.println("Fish Move");
        }
    }
    ```

  5. 具体装饰角色“鸟儿”

    ```java
    public class Bird extends Change {
    
        public Bird(TheGreatestSage sage) {
            super(sage);
        }
    
        @Override
        public void move() {
            // 代码
            System.out.println("Bird Move");
        }
    }
    ```

  6. 客户端类

     ```java
     public class Client {
     
         public static void main(String[] args) {
             TheGreatestSage sage = new Monkey();
             // 第一种写法
             TheGreatestSage bird = new Bird(sage);
             TheGreatestSage fish = new Fish(bird);
             // 第二种写法
             //TheGreatestSage fish = new Fish(new Bird(sage));
             fish.move(); 
         }
     
     }
     ```

“大圣本尊”是ConcreteComponent类，而“鸟儿”、“鱼儿”是装饰类。要装饰的是“大圣本尊”，也即“猢狲”实例。

上面的例子中，系统把大圣从一只猢狲装饰成了一只鸟儿（把鸟儿的功能加到了猢狲身上），然后又把鸟儿装饰成了一条鱼儿（把鱼儿的功能加到了猢狲+鸟儿身上，得到了猢狲+鸟儿+鱼儿）。

　　![img](data:image/png;base64,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)

如上图所示，大圣的变化首先将鸟儿的功能附加到了猢狲身上，然后又将鱼儿的功能附加到猢狲+鸟儿身上。　　

**透明性的要求**

装饰模式对客户端的透明性要求程序不要声明一个ConcreteComponent类型的变量，而应当声明一个Component类型的变量。

用孙悟空的例子来说，必须永远把孙悟空的所有变化都当成孙悟空来对待，而如果把老孙变成的鱼儿当成鱼儿，而不是老孙，那就被老孙骗了，而这是不应当发生的。

下面的做法是对的：

```java
TheGreatestSage sage = new Monkey();
TheGreatestSage bird = new Bird(sage);
```

而下面的做法是不对的：

```java
Monkey sage = new Monkey();
Bird bird = new Bird(sage);
```

**半透明的装饰模式**

然而，纯粹的装饰模式很难找到。装饰模式的用意是在不改变接口的前提下，增强所考虑的类的性能。在增强性能的时候，往往需要建立新的公开的方法。即便是在孙大圣的系统里，也需要新的方法。比如齐天大圣类并没有飞行的能力，而鸟儿有。这就意味着鸟儿应当有一个新的fly()方法。再比如，齐天大圣类并没有游泳的能力，而鱼儿有，这就意味着在鱼儿类里应当有一个新的swim()方法。

这就导致了大多数的装饰模式的实现都是“半透明”的，而不是完全透明的。换言之，允许装饰模式改变接口，增加新的方法。这意味着客户端可以声明ConcreteDecorator类型的变量，从而可以调用ConcreteDecorator类中才有的方法：

```java
TheGreatestSage sage = new Monkey();
Bird bird = new Bird(sage);
bird.fly();
```

半透明的装饰模式是介于装饰模式和适配器模式之间的。适配器模式的用意是改变所考虑的类的接口，也可以通过改写一个或几个方法，或增加新的方法来增强或改变所考虑的类的功能。大多数的装饰模式实际上是半透明的装饰模式，这样的装饰模式也称做半装饰、半适配器模式。

装饰模式和适配器模式都是“包装模式(Wrapper Pattern)”，它们都是通过封装其他对象达到设计的目的的，但是它们的形态有很大区别。

理想的装饰模式在对被装饰对象进行功能增强的同时，要求具体构件角色、装饰角色的接口与抽象构件角色的接口完全一致。而适配器模式则不然，一般而言，适配器模式并不要求对源对象的功能进行增强，但是会改变源对象的接口，以便和目标接口相符合。

装饰模式有透明和半透明两种，这两种的区别就在于装饰角色的接口与抽象构件角色的接口是否完全一致。透明的装饰模式也就是理想的装饰模式，要求具体构件角色、装饰角色的接口与抽象构件角色的接口完全一致。相反，如果装饰角色的接口与抽象构件角色接口不一致，也就是说装饰角色的接口比抽象构件角色的接口宽的话，装饰角色实际上已经成了一个适配器角色，这种装饰模式也是可以接受的，称为“半透明”的装饰模式，如下图所示。

![img](data:image/png;base64,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)

在适配器模式里面，适配器类的接口通常会与目标类的接口重叠，但往往并不完全相同。换言之，适配器类的接口会比被装饰的目标类接口宽。

显然，半透明的装饰模式实际上就是处于适配器模式与装饰模式之间的灰色地带。如果将装饰模式与适配器模式合并成为一个“包装模式”的话，那么半透明的装饰模式倒可以成为这种合并后的“包装模式”的代表。

**InputStream类型中的装饰模式**

InputStream类型中的装饰模式是半透明的。为了说明这一点，不妨看一看作装饰模式的抽象构件角色的InputStream的源代码。这个抽象类声明了九个方法，并给出了其中八个的实现，另外一个是抽象方法，需要由子类实现。

```java
public abstract class InputStream implements Closeable {

    public abstract int read() throws IOException;

 
    public int read(byte b[]) throws IOException {}

    public int read(byte b[], int off, int len) throws IOException {}

    public long skip(long n) throws IOException {}

    public int available() throws IOException {}
    
    public void close() throws IOException {}
    
    public synchronized void mark(int readlimit) {}
    
    public synchronized void reset() throws IOException {}

    public boolean markSupported() {}

}
```

下面是作为装饰模式的抽象装饰角色FilterInputStream类的源代码。可以看出，FilterInputStream的接口与InputStream的接口是完全一致的。也就是说，直到这一步，还是与装饰模式相符合的。

```java
public class FilterInputStream extends InputStream {
    protected FilterInputStream(InputStream in) {}
    
    public int read() throws IOException {}

    public int read(byte b[]) throws IOException {}
    
    public int read(byte b[], int off, int len) throws IOException {}

    public long skip(long n) throws IOException {}

    public int available() throws IOException {}

    public void close() throws IOException {}

    public synchronized void mark(int readlimit) {}

    public synchronized void reset() throws IOException {}

    public boolean markSupported() {}
}
```

下面是具体装饰角色PushbackInputStream的源代码。

```java
public class PushbackInputStream extends FilterInputStream {
    private void ensureOpen() throws IOException {}
    
    public PushbackInputStream(InputStream in, int size) {}

    public PushbackInputStream(InputStream in) {}

    public int read() throws IOException {}

    public int read(byte[] b, int off, int len) throws IOException {}

    public void unread(int b) throws IOException {}

    public void unread(byte[] b, int off, int len) throws IOException {}

    public void unread(byte[] b) throws IOException {}

    public int available() throws IOException {}

    public long skip(long n) throws IOException {}

    public boolean markSupported() {}

    public synchronized void mark(int readlimit) {}
 
    public synchronized void reset() throws IOException {}

    public synchronized void close() throws IOException {}
}
```

查看源码，你会发现，这个装饰类提供了额外的方法unread()，这就意味着PushbackInputStream是一个半透明的装饰类。换言之，它破坏了理想的装饰模式的要求。如果客户端持有一个类型为InputStream对象的引用in的话，那么如果in的真实类型是 PushbackInputStream 的话，只要客户端不需要使用unread()方法，那么客户端一般没有问题。但是如果客户端必须使用这个方法，就必须进行向下类型转换。将in的类型转换成为PushbackInputStream之后才可能调用这个方法。但是，这个类型转换意味着客户端必须知道它拿到的引用是指向一个类型为PushbackInputStream的对象。这就破坏了使用装饰模式的原始用意。

现实世界与理论总归是有一段差距的。纯粹的装饰模式在真实的系统中很难找到。一般所遇到的，都是这种半透明的装饰模式。

下面是使用I/O流读取文件内容的简单操作示例：

```java
public class IOTest {

    public static void main(String[] args) throws IOException {
        // 流式读取文件
        DataInputStream dis = null;
        try{
            dis = new DataInputStream(
                    new BufferedInputStream(
                            new FileInputStream("test.txt")
                    )
            );
            //读取文件内容
            byte[] bs = new byte[dis.available()];
            dis.read(bs);
            String content = new String(bs);
            System.out.println(content);
        }finally{
            dis.close();
        }
    }

}
```

观察上面的代码，会发现最里层是一个FileInputStream对象，然后把它传递给一个BufferedInputStream对象，经过BufferedInputStream处理，再把处理后的对象传递给了DataInputStream对象进行处理，这个过程其实就是装饰器的组装过程，FileInputStream对象相当于原始的被装饰的对象，而BufferedInputStream对象和DataInputStream对象则相当于装饰器。

**应用**

**设计模式在JAVA I/O库中的应用**

装饰模式在Java语言中的最著名的应用莫过于Java I/O标准库的设计了。

由于Java I/O库需要很多性能的各种组合，如果这些性能都是用继承的方法实现的，那么每一种组合都需要一个类，这样就会造成大量性能重复的类出现。而如果采用装饰模式，那么类的数目就会大大减少，性能的重复也可以减至最少。因此装饰模式是Java I/O库的基本模式。

Java I/O库的对象结构图如下，由于Java I/O的对象众多，因此只画出InputStream的部分。

![img](data:image/png;base64,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)

根据上图可以看出：

- **抽象构件(Component)角色：**由InputStream扮演。这是一个抽象类，为各种子类型提供统一的接口。

- **具体构件(ConcreteComponent)角色：**由ByteArrayInputStream、FileInputStream、PipedInputStream、StringBufferInputStream等类扮演。它们实现了抽象构件角色所规定的接口。

- **抽象装饰(Decorator)角色：**由FilterInputStream扮演。它实现了InputStream所规定的接口。

- **具体装饰(ConcreteDecorator)角色：**由几个类扮演，分别是BufferedInputStream、DataInputStream以及两个不常用到的类LineNumberInputStream、PushbackInputStream。

### 代理模式

> [代理模式](https://design-patterns.readthedocs.io/zh_CN/latest/structural_patterns/proxy.html#proxy)

**定义**
代理模式(Proxy Pattern) ：给某一个对象提供一个代理，并由代理对象**控制**对原对象的引用。代理模式的英 文叫做Proxy或Surrogate，它是一种对象结构型模式。

**结构**
代理模式包含如下角色：

- Subject: 抽象主题角色
- Proxy: 代理主题角色
- RealSubject: 真实主题角色

**实例**

代理模式分为静态代理和动态代理两种。

区别在于:静态代理在编译期确定代理对象，在程序运行前代理类的.class文件就已经存在了;而动态代理在运行期，通过反射机制创建代理对象。

#### 静态代理

> [静态代理](https://segmentfault.com/a/1190000009235245#articleHeader4)
>
> [代理模式](https://www.runoob.com/design-pattern/proxy-pattern.html)

我们将创建一个 *Image* 接口和实现了 *Image* 接口的实体类。*ProxyImage* 是一个代理类，减少 *RealImage* 对象加载的内存占用。

*ProxyPatternDemo*，我们的演示类使用 *ProxyImage* 来获取要加载的 *Image* 对象，并按照需求进行显示。

![](https://www.runoob.com/wp-content/uploads/2014/08/proxy_pattern_uml_diagram.jpg)

1. 创建一个接口（抽象主题角色）

   ```java
   public interface Image {    
       void display(); 
   }
   ```

2. 创建实现接口的实体类（真实主题角色）

   ```java
   public class RealImage implements Image {
       private String fileName;
   
       public RealImage(String fileName) {
           this.fileName = fileName;
           loadFromDisk(fileName);
       }
   
       @Override
       public void display() {
           System.out.println("Displaying " + fileName);
       }
   
       private void loadFromDisk(String fileName) {
           System.out.println("Loading " + fileName);
       }
   }
   ```

3. 创建实现接口的实体类（代理主题角色）

   ```java
   public class ProxyImage implements Image {
       private RealImage realImage;
       private String fileName;
   
       public ProxyImage(String fileName) {
           this.fileName = fileName;
       }
   
       @Override
       public void display() {
           if (realImage == null) {
               realImage = new RealImage(fileName);
           }
           realImage.display();
       }
   }
   ```

4. 使用 *ProxyImage* 来获取 *RealImage* 类的对象

   ```java
    public class ProxyPatternDemo {
        public static void main(String[] args) {
            Image image = new ProxyImage("test_10mb.jpg");
            // 图像将从磁盘加载       
            image.display();
            System.out.println("");
            // 图像不需要从磁盘加载       
            image.display();
        }
    }
   ```

5. 执行程序，输出结果：

    ```
    Loading test_10mb.jpg
    Displaying test_10mb.jpg

    Displaying test_10mb.jpg
    ```

优点：可以做到在不修改目标对象的功能前提下，对目标功能扩展。

缺点：代理类和委托类实现相同的接口，同时要实现相同的方法。这样就出现了大量的代码重复。如果接口增加一个方法，除了所有实现类需要实现这个方法外，所有代理类也需要实现此方法。增加了代码维护的复杂度。

#### 动态代理

##### JDK动态代理

- java.lang.reflect.Proxy:生成动态代理类和对象；
- java.lang.reflect.InvocationHandler（处理器接口）：可以通过invoke方法实现对真实角色的代理访问。


JDK生成代理只需要使用 Proxy 的 newProxyInstance 方法，但是该方法需要接收三个参数：

```java
static Object newProxyInstance(ClassLoader loader, Class [] interfaces, InvocationHandler handler)
```

注意该方法是在Proxy类中是静态方法，每次通过 Proxy 生成的代理类对象都要指定对应的处理器对象。

- ClassLoader loader：指定当前目标对象使用类加载器，用null表示默认类加载器
- Class [] interfaces：需要实现的接口数组
- InvocationHandler handler：调用处理器,执行目标对象的方法时,会触发调用处理器的方法,从而把当前执行目标对象的方法作为参数传入

java.lang.reflect.InvocationHandler：这是调用处理器接口，它自定义了一个 invoke 方法，用于集中处理在动态代理类对象上的方法调用，通常在该方法中实现对委托类的代理访问。

```java
// 该方法负责集中处理动态代理类上的所有方法调用。
// 第一个参数既是代理类实例，第二个参数是被调用的方法对象，第三个是调用参数。
Object invoke(Object proxy, Method method, Object[] args)
```

**代码示例:**

1. 接口：Subject.java（抽象主题角色）

```java
public interface Subject {
    public int sellBooks();

    public String speak();
}
```

2. 真实对象：RealSubject.java（真实主题角色）

```java
public class RealSubject implements Subject{
    @Override
    public int sellBooks() {
        System.out.println("卖书");
        return 1 ;
    }

    @Override
    public String speak() {
        System.out.println("说话");
        return "张三";
    }
}
```

3. 处理器对象：MyInvocationHandler.java

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
 * 定义一个处理器
 */
public class MyInvocationHandler implements InvocationHandler {
    /**
     * 因为需要处理真实角色，所以要把真实角色传进来
     */
    Subject realSubject ;

    public MyInvocationHandler(Subject realSubject) {
        this.realSubject = realSubject;
    }

    /**
     *
     * @param proxy     代理类
     * @param method    正在调用的方法
     * @param args      方法的参数
     * @return
     * @throws Throwable
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("调用代理类");
        if(method.getName().equals("sellBooks")){
            int invoke = (int)method.invoke(realSubject, args);
            System.out.println("调用的是卖书的方法");
            return invoke ;
        }else {
            String string = (String) method.invoke(realSubject,args) ;
            System.out.println("调用的是说话的方法");
            return  string ;
        }
    }
}
```

4. 调用端：Client.java

```java
import java.lang.reflect.Proxy;

/**
 * 调用类
 */
public class Client {
    public static void main(String[] args) {
        //真实对象
        Subject realSubject =  new RealSubject();

        MyInvocationHandler myInvocationHandler = new MyInvocationHandler(realSubject);
        //代理对象
        Subject proxyClass = (Subject) Proxy.newProxyInstance(
            ClassLoader.getSystemClassLoader(),
            new Class[]{Subject.class},
            myInvocationHandler);
        // Subject proxyClass = (Subject) Proxy.newProxyInstance(
        //         realSubject.getClass().getClassLoader(),
        //         realSubject.getClass().getInterfaces(), 
        //         myInvocationHandler);
        
		proxyClass.sellBooks();

        proxyClass.speak();
    }
}
```

**总结：**代理对象不需要实现接口，但是目标对象一定要实现接口，否则不能用动态代理。

##### CGLIB动态代理

静态代理和JDK动态代理模式都是要求目标对象实现一个接口或者多个接口，但是有时候目标对象只是一个单独的对象,并没有实现任何的接口，这个时候就可以使用构建目标对象子类的方式实现代理，这种方法就叫做：Cglib代理。
Cglib代理，也叫作子类代理，它是在内存中构建一个子类对象从而实现对目标对象功能的扩展。

Cglib是一个强大的高性能的代码生成包,它可以在运行期扩展java类与实现java接口。它广泛的被许多AOP的框架使用,例如Spring AOP和synaop，为他们提供方法的interception(拦截)。

Cglib包的底层是通过使用**字节码处理框架ASM**来转换字节码并生成新的子类。

**代理的类不能为final，否则报错；目标对象的方法如果为 final/static，那么就不会被拦截，即不会执行目标对象额外的业务方法。**

Cglib 动态代理是针对目标类, 动态生成一个子类, 然后子类覆盖父类中的方法, 如果是private或是final类修饰的方法,则不会被重写。

1. 需要代理的类（真实主题角色）

```java
package cn.cpf.pattern.structure.proxy.cglib;

public class Engineer {
    // 可以被代理
    public void eat() {
        System.out.println("工程师正在吃饭");
    }

    // final 方法不会被生成的字类覆盖
    public final void work() {
        System.out.println("工程师正在工作");
    }

    // private 方法不会被生成的字类覆盖
    private void play() {
        System.out.println("this engineer is playing game");
    }
}
```

2. CGLIB 代理类（代理主题角色）

```java
package cn.cpf.pattern.structure.proxy.cglib;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import java.lang.reflect.Method;

public class CglibProxy implements MethodInterceptor {
    private Object target;

    public CglibProxy(Object target) {
        this.target = target;
    }

    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("###   before invocation");
        Object result = method.invoke(target, objects);
        System.out.println("###   end invocation");
        return result;
    }

    public static Object getProxy(Object target) {
        // 工具类
        Enhancer enhancer = new Enhancer();
        // 设置需要代理的对象
        enhancer.setSuperclass(target.getClass());
        // 设置代理人
        enhancer.setCallback(new CglibProxy(target));
        return enhancer.create();
    }
}
```

测试方法:

```java
import java.lang.reflect.Method;
import java.util.Arrays;

public class CglibMainTest {
    public static void main(String[] args) {
        // 生成 Cglib 代理类
        Engineer engineerProxy = (Engineer) CglibProxy.getProxy(new Engineer());
        // 调用相关方法
        engineerProxy.eat();
    }
}
```

运行结果:

```
###   before invocation
工程师正在吃饭
###   end invocation
```

**应用**

1. Spring AOP的实现。

2. 图片代理：一个很常见的代理模式的应用实例就是对大图浏览的控制。

   用户通过浏览器访问网页时先不加载真实的大图，而是通过代理对象的方法来进行处理，在代理对象的方法中，先使用一个线程向客户端浏览器加载一个小图片，然后在后台使用另一个线程来调用大图片的加载方法将大图片加载到客户端。当需要浏览大图片时，再将大图片在新网页中显示。如果用户在浏览大图时加载工作还没有完成，可以再启动一个线程来显示相应的提示信息。通过代理技术结合多线程编程将真实图片的加载放到后台来操作，不影响前台图片的浏览。

3. 远程代理。

   远程代理可以将网络的细节隐藏起来，使得客户端不必考虑网络的存在。客户完全可以认为被代理的远程业务对象是局域的而不是远程的，而远程代理对象承担了大部分的网络通信工作。

4. 虚拟代理。

   当一个对象的加载十分耗费资源的时候，虚拟代理的优势就非常明显地体现出来了。虚拟代理模式是一种内存节省技术，那些占用大量内存或处理复杂的对象将推迟到使用它的时候才创建。

5. Copy-on-Write 代理。 

6. 保护（Protect or Access）代理。 

7. Cache代理。 
   为结果提供临时的存储空间，以便其他客户端调用 

8. 防火墙（Firewall）代理。 

   保护目标不让恶意用户靠近

9. 同步化（Synchronization）代理。

10. 智能引用（Smart Reference）代理。

### 代理模式和装饰器模式的区别

- 装饰器模式：能动态的新增或组合对象的行为
  **在不改变接口的前提下，动态扩展对象的功能**
- 代理模式：为其他对象提供一种代理以控制对这个对象的访问
  **在不改变接口的前提下，控制对象的访问**

　　装饰模式是“新增行为”，而代理模式是“控制访问”。关键就是我们如何判断是“新增行为”还是“控制访问”。

- 代理类所能代理的类完全由代理类确定，装饰类装饰的对象需要根据实际使用时客户端的组合来确定
- **被代理对象由代理对象创建，客户端甚至不需要知道被代理类的存在；被装饰对象由客户端创建并传给装饰对象**

### 代理模式和适配器模式的区别

适配器模式主要改变所考虑对象的接口，而代理模式不能改变所代理类的接口。 

## Spring

简单来说，Spring 是一个分层的 JavaSE/EE full-stack(一站式) 轻量级开源框架。

Spring有分层的体系结构，这意味着你能选择使用它孤立的任何部分，它的架构仍然是内在稳定的。例如，你可能选择仅仅使用Spring来简化JDBC的使用，或用来管理所有的业务对象。

spring 特征：

- **轻量**

  从大小与开销两方面而言Spring都是轻量的。完整的Spring框架可以在一个大小只有1MB多的JAR文件里发布。并且Spring所需的处理开销也是微不足道的。

- **控制反转**

  Spring通过一种称作控制反转的技术促进了低耦合。当应用了IoC，一个对象依赖的其它对象会通过被动的方式传递进来，而不是这个对象自己创建或者查找依赖对象。你可以认为IoC与JNDI相反——不是对象从容器中查找依赖，而是容器在对象初始化时不等对象请求就主动将依赖传递给它。

- **面向切面**

  Spring提供了[面向切面编程](https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%88%87%E9%9D%A2%E7%BC%96%E7%A8%8B)的丰富支持，允许通过分离应用的业务逻辑与系统级服务（例如审计（auditing）和[事务](https://baike.baidu.com/item/%E4%BA%8B%E5%8A%A1)（[transaction](https://baike.baidu.com/item/transaction)）管理）进行[内聚性](https://baike.baidu.com/item/%E5%86%85%E8%81%9A%E6%80%A7)的开发。[应用对象](https://baike.baidu.com/item/%E5%BA%94%E7%94%A8%E5%AF%B9%E8%B1%A1)只实现它们应该做的——完成业务逻辑——仅此而已。它们并不负责（甚至是意识）其它的系统级关注点，例如日志或事务支持。

- **容器**

  Spring包含并管理应用对象的配置和生命周期，在这个意义上它是一种容器，你可以配置你的每个bean如何被创建——基于一个可配置原型（[prototype](https://baike.baidu.com/item/prototype/14335188)），你的bean可以创建一个单独的实例或者每次需要时都生成一个新的实例——以及它们是如何相互关联的。然而，Spring不应该被混同于传统的重量级的EJB容器，它们经常是庞大与笨重的，难以使用。

- **框架**

  Spring可以将简单的[组件](https://baike.baidu.com/item/%E7%BB%84%E4%BB%B6)配置、组合成为复杂的应用。在Spring中，[应用对象](https://baike.baidu.com/item/%E5%BA%94%E7%94%A8%E5%AF%B9%E8%B1%A1)被声明式地组合，典型地是在一个XML文件里。Spring也提供了很多基础功能（[事务管理](https://baike.baidu.com/item/%E4%BA%8B%E5%8A%A1%E7%AE%A1%E7%90%86)、持久化框架集成等等），将应用逻辑的开发留给了你。

- **MVC**

  Spring的作用是整合，但不仅仅限于整合，Spring 框架可以被看做是一个企业解决方案级别的框架。客户端发送请求，服务器控制器（由DispatcherServlet实现的)完成请求的转发，控制器调用一个用于映射的类HandlerMapping，该类用于将请求映射到对应的处理器来处理请求。HandlerMapping 将请求映射到对应的处理器Controller（相当于Action）在Spring 当中如果写一些处理器组件，一般实现Controller 接口，在Controller 中就可以调用一些Service 或DAO 来进行数据操作 ModelAndView 用于存放从DAO 中取出的数据，还可以存放响应视图的一些数据。 如果想将处理结果返回给用户，那么在Spring 框架中还提供一个视图组件ViewResolver，该组件根据Controller 返回的标示，找到对应的视图，将响应response 返回给用户。

spring 特点

1. 方便解耦，简化开发
   通过Spring提供的IoC容器，我们可以将对象之间的依赖关系交由Spring进行控制，避免硬编码所造成的过度程序耦合。有了Spring，用户不必再为单实例模式类、属性文件解析等这些很底层的需求编写代码，可以更专注于上层的应用。
2. AOP编程的支持
   通过Spring提供的AOP功能，方便进行面向切面的编程，许多不容易用传统OOP实现的功能可以通过AOP轻松应付。
3. 声明式事务的支持
   在Spring中，我们可以从单调烦闷的事务管理代码中解脱出来，通过声明式方式灵活地进行事务的管理，提高开发效率和质量。
4. 方便程序的测试
   可以用非容器依赖的编程方式进行几乎所有的测试工作，在Spring里，测试不再是昂贵的操作，而是随手可做的事情。例如：Spring对Junit4支持，可以通过注解方便的测试Spring程序。
5. 方便集成各种优秀框架
   Spring不排斥各种优秀的开源框架，相反，Spring可以降低各种框架的使用难度，Spring提供了对各种优秀框架（如Struts,Hibernate、Hessian、Quartz）等的直接支持。
6. 降低Java EE API的使用难度
   Spring对很多难用的Java EE API（如JDBC，JavaMail，远程调用等）提供了一个薄薄的封装层，通过Spring的简易封装，这些Java EE API的使用难度大为降低。
7. Java 源码是经典学习范例
   Spring的源码设计精妙、结构清晰、匠心独运，处处体现着大师对Java设计模式灵活运用以及对Java技术的高深造诣。Spring框架源码无疑是Java技术的最佳实践范例。如果想在短时间内迅速提高自己的Java技术水平和应用开发水平，学习和研究Spring源码将会使你收到意想不到的效果。

Spring 优点

1. 低侵入式设计，代码污染极低
2. 独立于各种应用服务器，基于Spring框架的应用，可以真正实现Write Once,Run Anywhere的承诺
3. Spring的DI机制降低了业务对象替换的复杂性，提高了组件之间的解耦
4. Spring的AOP支持允许将一些通用任务如安全、事务、日志等进行集中式管理，从而提供了更好的复用
5. Spring的ORM和DAO提供了与第三方持久层框架的良好整合，并简化了底层的数据库访问
6. Spring并不强制应用完全依赖于Spring，开发者可自由选用Spring框架的部分或全部

基本框架
Spring 框架是一个分层架构，由 7 个定义良好的模块组成。Spring 模块构建在核心容器之上，核心容器定义了创建、配置和管理 bean 的方式。组成Spring框架的每个模块（或组件）都可以单独存在，或者与其他一个或多个模块联合实现。

![](http://www.cs.trincoll.edu/hfoss/images/4/42/Spring_framework.gif)

1. 核心容器：

   核心容器提供 Spring 框架的基本功能(Spring Core)。核心容器的主要组件是 BeanFactory，它是工厂模式的实现。BeanFactory 使用控制反转（IOC） 模式将应用程序的配置和依赖性规范与实际的应用程序代码分开。

2. Spring 上下文：

   Spring 上下文是一个配置文件，向 Spring框架提供上下文信息。Spring 上下文包括企业服务，例如JNDI、EJB、电子邮件、国际化、校验和调度功能。

3. Spring AOP：

   通过配置管理特性，Spring AOP 模块直接将面向切面的编程功能集成到了 Spring 框架中。所以，可以很容易地使 Spring 框架管理的任何对象支持AOP。Spring AOP 模块为基于 Spring 的应用程序中的对象提供了事务管理服务。通过使用 Spring AOP，不用依赖 EJB 组件，就可以将声明性事务管理集成到应用程序中。

4. Spring DAO：

   JDBCDAO抽象层提供了有意义的异常层次结构，可用该结构来管理异常处理和不同数据库供应商抛出的错误消息。异常层次结构简化了错误处理，并且极大地降低了需要编写的异常代码数量（例如打开和关闭连接）。Spring DAO 的面向 JDBC 的异常遵从通用的 DAO 异常层次结构。

5. Spring ORM：

   Spring 框架插入了若干个ORM框架，从而提供了 ORM 的对象关系工具，其中包括JDO、Hibernate和iBatisSQL Map。所有这些都遵从 Spring 的通用事务和 DAO 异常层次结构。

6. Spring Web 模块：

   Web 上下文模块建立在应用程序上下文模块之上，为基于 Web 的应用程序提供了上下文。所以，Spring框架支持与 Jakarta Struts 的集成。Web 模块还简化了处理多部分请求以及将请求参数绑定到域对象的工作。

7. Spring MVC 框架：

   MVC框架是一个全功能的构建 Web应用程序的 MVC 实现。通过策略接口，MVC框架变成为高度可配置的，MVC 容纳了大量视图技术，其中包括 JSP、Velocity、Tiles、iText 和 POI。模型由javabean构成，存放于Map；视图是一个接口，负责显示模型；控制器表示逻辑代码，是Controller的实现。Spring框架的功能可以用在任何J2EE服务器中，大多数功能也适用于不受管理的环境。Spring 的核心要点是：支持不绑定到特定 J2EE服务的可重用业务和数据访问对象。毫无疑问，这样的对象可以在不同J2EE 环境（Web 或EJB）、独立应用程序、测试环境之间重用。

### 控制反转和依赖注入

> [Spring IoC有什么好处呢？ - Mingqi的回答 - 知乎](https://www.zhihu.com/question/23277575/answer/169698662)

#### IOC

**什么是IOC**

Ioc—Inversion of Control，即“控制反转”，不是什么技术，而**是一种设计思想**。在Java开发中，Ioc意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。理解好Ioc的关键是要明确“谁控制谁，控制什么，为何是反转（有反转就应该有正转了），哪些方面反转了”。

- 谁控制谁，控制什么：

  传统Java SE程序设计，我们直接在对象内部通过new进行创建对象，是程序主动去创建依赖对象；而IoC是有专门一个容器来创建这些对象，即由Ioc容器来控制对象的创建；

  谁控制谁：IoC 容器控制了对象

  控制什么：主要控制了外部资源获取（不只是对象，包括比如文件等）。

- 为何是反转，哪些方面反转了：

  有反转就有正转，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；

  为何是反转：因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转

  哪些方面反转了：依赖对象的获取被反转了。

#### DI

**什么是DI**

DI—Dependency Injection，即“依赖注入”：是组件之间依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。理解DI的关键是：“谁依赖谁，为什么需要依赖，谁注入谁，注入了什么”。

- 谁依赖于谁：当然是应用程序依赖于IoC容器；

- 为什么需要依赖：应用程序需要IoC容器来提供对象需要的外部资源；

- 谁注入谁：很明显是IoC容器注入应用程序某个对象，应用程序依赖的对象；

- 注入了什么：就是注入某个对象所需要的外部资源（包括对象、资源、常量数据）。

IoC和DI由什么关系呢？其实它们是同一个概念不同角度的描述，由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以2004年大师级人物Martin Fowler又给出了一个新的名字：“依赖注入”，相对IoC 而言，“依赖注入”明确描述了“被注入对象依赖IoC容器配置依赖对象”。

**依赖注入的三种实现方式**

- 构造方法注入
- Setter方式注入 
- 接口注入

[Spring IoC有什么好处呢？ - Mingqi的回答 - 知乎](https://www.zhihu.com/question/23277575/answer/169698662)

依赖倒置原则——把原本的高层建筑依赖底层建筑“倒置”过来，变成底层建筑依赖高层建筑。高层建筑决定需要什么，底层去实现这样的需求，但是高层并不用管底层是怎么实现的。这样就不会出现“牵一发动全身”的情况。

**控制反转（Inversion of Control）** 就是依赖倒置原则的一种代码设计的思路。具体采用的方法就是所谓的**依赖注入（Dependency Injection）**。

![](https://pic1.zhimg.com/80/v2-ee924f8693cff51785ad6637ac5b21c1_hd.jpg)

### AOP

**什么是AOP**

AOP，Aspect Orient Programming，即面向切面编程。是对OOP（Object Orient Programming）的一种补充。

**AOP 术语**

1. 通知（Advice）

   通知是织入到目标类连接点上的一段程序代码，在Spring中，通知除用于描述一段程序代码外，还拥有另一个和连接点相关的信息，这便是执行点的方位。结合执行点方位信息和切点信息，我们就可以找到特定的连接点。

2. 连接点（JoinPoint）

   即通知具体执行的地方，Spring仅支持方法的连接点，即仅能在方法调用前、方法调用后、方法抛出异常时以及方法调用前后这些程序执行点织入通知。连接点由两个信息确定：第一是用方法表示的程序执行点；第二是用相对点表示的方位。

3. 切点（Pointcut）

   每个程序类都拥有多个连接点，如一个拥有两个方法的类，这两个方法都是连接点，即连接点是程序类中客观存在的事物。AOP通过“切点”定位特定的连接点。连接点相当于数据库中的记录，而切点相当于查询条件。切点和连接点不是一对一的关系，一个切点可以匹配多个连接点。在Spring中，切点通过org.springframework.aop.Pointcut接口进行描述，它使用类和方法作为连接点的查询条件，Spring AOP的规则解析引擎负责切点所设定的查询条件，找到对应的连接点。其实确切地说，不能称之为查询连接点，因为连接点是方法执行前、执行后等包括方位信息的具体程序执行点，而切点只定位到某个方法上，所以如果希望定位到具体连接点上，还需要提供方位信息。

4. 切面（Aspect）
   切面是通知和切点的结合。现在发现了吧，没连接点什么事情，连接点就是为了让你好理解切点，搞出来的，明白这个概念就行了。通知说明了干什么和什么时候干（什么时候通过方法名中的before,after，around等就能知道），而切点说明了在哪干（指定到底是哪个方法），这就是一个完整的切面定义。

5. 引入（introduction）
   引介是一种特殊的增强，它为类添加一些属性和方法。这样，即使一个业务类原本没有实现某个接口，通过AOP的引介功能，我们可以动态地为该业务类添加接口的实现逻辑，让业务类成为这个接口的实现类。

6. 目标（target）
   增强逻辑的织入目标类。如果没有AOP，目标业务类需要自己实现所有逻辑，而在AOP的帮助下，目标业务类只实现那些非横切逻辑的程序逻辑，而性能监视和事务管理等这些横切逻辑则可以使用AOP动态织入到特定的连接点上。

7. 代理(proxy)
   一个类被AOP织入增强后，就产出了一个结果类，它是融合了原类和增强逻辑的代理类。

8. 织入(weaving)

   织入是将增强添加到目标类具体连接点上的过程。AOP像一台织布机，将目标类、通知或引入通过AOP这台织布机天衣无缝地编织到一起。AOP有三种织入方式：

   ​    a、编译期织入，这要求使用特殊的Java编译器。

   ​    b、类装载期织入，这要求使用特殊的类装载器。

   ​    c、动态代理织入，在运行期为目标类添加增强生成子类的方式。

   ​    Spring采用动态代理织入，而AspectJ采用编译期织入和类装载期织入。

**五种通知类型**

1. 前置通知[Before advice]：在连接点前面执行，前置通知不会影响连接点的执行，除非此处抛出异常。 
2. 正常返回通知[After returning advice]：在连接点正常执行完成后执行，如果连接点抛出异常，则不会执行。 
3. 异常返回通知[After throwing advice]：在连接点抛出异常后执行。 
4. 返回通知[After (finally) advice]：在连接点执行完成后执行，不管是正常执行完成，还是抛出异常，都会执行返回通知中的内容。 
5. 环绕通知[Around advice]：环绕通知围绕在连接点前后，比如一个方法调用的前后。这是最强大的通知类型，能在方法调用前后自定义一些操作。环绕通知还需要负责决定是继续处理join point(调用ProceedingJoinPoint的proceed方法)还是中断执行。

**切点表达式**

> [Spring AOP切点表达式详解](https://my.oschina.net/zhangxufeng/blog/1824275)

标准的Aspectj Aop的pointcut的表达式类型是很丰富的，但是Spring Aop只支持其中的9种，外加Spring Aop自己扩充的一种一共是10种类型的表达式，分别如下。

1. execution：一般用于指定方法的执行，用的最多。
2. within：指定某些类型的全部方法执行，也可用来指定一个包。
3. this：Spring Aop是基于代理的，生成的bean也是一个代理对象，this就是这个代理对象，当这个对象可以转换为指定的类型时，对应的切入点就是它了，Spring Aop将生效。
4. target：当被代理的对象可以转换为指定的类型时，对应的切入点就是它了，Spring Aop将生效。
5. args：当执行的方法的参数是指定类型时生效。
6. @target：当代理的目标对象上拥有指定的注解时生效。
7. @args：当执行的方法参数类型上拥有指定的注解时生效。
8. @within：与@target类似，看官方文档和网上的说法都是@within只需要目标对象的类或者父类上有指定的注解，则@within会生效，而@target则是必须是目标对象的类上有指定的注解。而根据笔者的测试这两者都是只要目标类或父类上有指定的注解即可。
9. @annotation：当执行的方法上拥有指定的注解时生效。

10. bean：当调用的方法是指定的bean的方法时生效。

**execution**

由于Spring切面粒度最小是达到方法级别，而execution表达式可以用于明确指定方法返回类型，类名，方法名和参数名等与方法相关的部件，并且在Spring中，大部分需要使用AOP的业务场景也只需要达到方法级别即可，因而execution表达式的使用是最为广泛的。如下是execution表达式的语法：

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)

execution([可见性] 返回类型 [声明类型].方法名(参数) [异常])
```

​       这里问号表示当前项可以有也可以没有，其中各项的语义如下：

- modifiers-pattern：方法的可见性，如public，protected；
- ret-type-pattern：方法的返回值类型，如int，void等；
- declaring-type-pattern：方法所在类的全路径名，如com.spring.Aspect；
- name-pattern：方法名类型，如buisinessService()；
- param-pattern：方法的参数类型，如java.lang.String；
- throws-pattern：方法抛出的异常类型，如java.lang.Exception；

​        如下是一个使用execution表达式的例子：

```
execution(public * com.spring.service.BusinessObject.businessService(java.lang.String,..))
```

​       上述切点表达式将会匹配使用public修饰，返回值为任意类型，并且是com.spring.BusinessObject类中名称为businessService的方法，方法可以有多个参数，但是第一个参数必须是java.lang.String类型的方法。上述示例中我们使用了..通配符，关于通配符的类型，主要有两种：

- \* 通配符：该通配符主要用于匹配单个单词，或者是以某个词为前缀或后缀的单词。

  如下示例表示返回值为任意类型，在com.spring.service.BusinessObject类中，并且参数个数为零的方法：

```
execution(* com.spring.service.BusinessObject.*())
```

​       下述示例表示返回值为任意类型，在com.spring.service包中，以Business为前缀的类，并且是类中参数个数为零方法：

```
execution(* com.spring.service.Business*.*())
```

- .. 通配符：该通配符表示0个或多个项，主要用于declaring-type-pattern和param-pattern中，如果用于declaring-type-pattern中，则表示匹配当前包及其子包，如果用于param-pattern中，则表示匹配0个或多个参数。

​       如下示例表示匹配返回值为任意类型，并且是com.spring.service包及其子包下的任意类的名称为businessService的方法，而且该方法不能有任何参数：

```
execution(* com.spring.service..*.businessService())
```

​       这里需要说明的是，包路径service..*.businessService()中的..应该理解为延续前面的service路径，表示到service路径为止，或者继续延续service路径，从而包括其子包路径；后面的*.businessService()，这里的*表示匹配一个单词，因为是在方法名前，因而表示匹配任意的类。

​       如下示例是使用..表示任意个数的参数的示例，需要注意，表示参数的时候可以在括号中事先指定某些类型的参数，而其余的参数则由..进行匹配：

```
execution(* com.spring.service.BusinessObject.businessService(java.lang.String,..))
```

**AOP应用**

- 日志记录，跟踪，优化和监控
- 事务的处理
- 持久化
- 性能的优化
- 资源池，如数据库连接池的管理
- 系统统一的认证、权限管理等
- 应用系统的异常捕捉及处理

**AOP的实现**

> [Spring AOP的实现原理](http://listenzhangbin.com/post/2016/09/spring-aop-cglib/)
>
> [《Spring设计思想》AOP实现原理（基于JDK和基于CGLIB）](https://blog.csdn.net/luanlouis/article/details/51155821)

AOP 的实现技术主要有Spring AOP和AspectJ。

1. AspectJ

AspectJ的底层技术是静态代理，即用一种AspectJ支持的特定语言编写切面，通过一个命令来编译，生成一个新的代理类，该代理类增强了业务类，这是在编译时增强，相对于下面说的运行时增强，编译时增强的性能更好。

2. Spring AOP

Spring AOP采用的是动态代理，在运行期间对业务方法进行增强，所以不会生成新类，对于动态代理技术，Spring AOP提供了对JDK动态代理的支持以及CGLib的支持。

## Spring Boot

### Spring Boot 的三种启动方式

1. IDE 运行Application这个类的main方法

2. 在Spring Boot应用的根目录下运行`mvn spring-boot:run`

3. 使用 mvn install 生成 jar后运行

   ```shell
   先到项目根目录
   mvn install
   cd target
   java -jar xxxx.jar
   ```

   

   

## 版本控制

### GIT 常用命令

> [常用Git 命令清单- 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

## 项目管理

### Maven 常用命令

- mvn compile

  编译项目

- mvn package

  打包
  - mvn package -Dmaven.test.skip=ture

    打包时跳过测试

  - mvn clean package -Dmaven.test.skip=true

    清除以前的 jar 包后重新打包，跳过测试类

- mvn install 

  安装当前工程的输出文件到本地仓库

- mvn clean

  清除项目目录中的生成结果