## 数据库

### Mysql

#### InnoDB

默认使用的B+树的索引模型

##### MyISAM和InnoDB区别

MyISAM是MySQL 5.5版之前的默认数据库引擎。5.5版本之后，默认的存储引擎为InnoDB。

**两者的对比：**

1. **是否支持行级锁** : MyISAM 只有表级锁(table-level locking)，而InnoDB 支持行级锁(row-level locking)和表级锁,默认为行级锁。
2. **是否支持事务和崩溃后的安全恢复： MyISAM** 强调的是性能，每次查询具有原子性,其执行速度比InnoDB类型更快，但是不提供事务支持。但是**InnoDB** 提供事务支持，外键等高级数据库功能。 具有事务、回滚和崩溃修复能力的事务安全型表。
3. **是否支持外键：** MyISAM不支持，而InnoDB支持。
4. **是否支持MVCC** ：仅 InnoDB 支持。应对高并发事务, MVCC比单纯的加锁更高效;MVCC只在 `READ COMMITTED` 和 `REPEATABLE READ` 两个隔离级别下工作;MVCC可以使用乐观锁和悲观锁来实现;各数据库中MVCC实现并不统一。

#### 索引

##### 结构

MySQL索引使用的数据结构主要有**BTree索引**和**哈希索引**。

##### 主键索引

###### 回表

从非主键索引树回到主键索引树的查询的过程叫做回表。

也就是说通过非主键索引的查询需要多扫描一棵索引树，因此需要尽量使用主键索引查询。

##### 覆盖索引

覆盖索引（covering index ，或称为索引覆盖）即从非主键索引中就能查到的记录，而不需要查询主键索引中的记录，避免了回表的产生减少了树的搜索次数，显著提升性能。

例如：存在联合索引（col1，col2），之后根据 col1 查询 col2，此时由于索引结点上包含所需的值，所以不需要回表。

##### 主键索引与非主键索引的区别

非主键索引的叶子节点存放的是**主键的值**，而主键索引的叶子节点存放的是**整行数据**。非主键索引也被称为**二级索引**，而主键索引也被称为**聚簇索引**。

非主键索引列的查询，则先搜索非主键索引树，得到主键ID值，再到主键索引树搜索一次，这个过程也被称为回表。

##### 非主键索引一定会查询多次吗？

覆盖索引也可以只查询一次，覆盖索引（covering index）指一个查询语句的执行只用从索引中就能够取得，不必从数据表中读取。也可以称之为实现了索引覆盖。

##### 聚集索引和非聚集索引的区别

1. 聚集索引表示表中存储的数据按照索引的顺序存储，检索效率比非聚集索引高，但对数据更新影响较大。（比如主键索引）
2. 非聚集索引表示数据存储在一个地方，索引存储在另一个地方，索引带有指针指向数据的存储位置。非聚集索引检索效率比聚集索引低，但对数据更新影响较小。

##### B+树索引和Hash索引比较

> InnoDB 为什么使用B+树而不是hash索引

1. 哈希索引适合等值查询，不适合范围查询
2. 哈希索引没办法利用索引完成排序
3. 哈希索引不支持多列联合索引的最左匹配规则
4. 如果有大量重复键值的情况下，因为哈希碰撞问题，会导致哈希索引的效率大大降低。

##### 联合索引

联合索引（A，B，C），但是查询的时候是反过来查的（C=xxx and B=xxx and A=xxx），这种能走索引吗？

where里面的条件顺序在查询之前会被mysql自动优化，变为A，B，C，然后使用联合索引。

```
(1)    select * from myTest  where a=3 and b=5 and c=4;   ----  abc顺序
abc三个索引都在where条件里面用到了，而且都发挥了作用

(2)    select * from myTest  where  c=4 and b=6 and a=3;
where里面的条件顺序在查询之前会被mysql自动优化，效果跟上一句一样

(3)    select * from myTest  where a=3 and c=7;
a用到索引，b没有用，所以c是没有用到索引效果的

(4)    select * from myTest  where a=3 and b>7 and c=3;     ---- b范围值，断点，阻塞了c的索引
a用到了，b也用到了，c没有用到，这个地方b是范围值，也算断点，只不过自身用到了索引

(5)    select * from myTest  where b=3 and c=4;   --- 联合索引必须按照顺序使用，并且需要全部使用
因为a索引没有使用，所以这里 bc都没有用上索引效果

(6)    select * from myTest  where a>4 and b=7 and c=9;
a用到了  b没有使用，c没有使用

(7)    select * from myTest  where a=3 order by b;
a用到了索引，b在结果排序中也用到了索引的效果，a下面任意一段的b是排好序的

(8)    select * from myTest  where a=3 order by c;
a用到了索引，但是这个地方c没有发挥排序效果，因为中间断点了，使用 explain 可以看到 filesort

(9)    select * from mytable where b=3 order by a;
b没有用到索引，排序中a也没有发挥索引效果
```

##### MySql 索引自动优化

1. 当预估返回的数据量超过一定比例(当预估的查询量达到总量的30% )的时候，mysql 就会进行全表扫描。

2. mysql 会根据索引大概估算选择最快的索引。

   例如：

   ```mysql
   -- sql1: 
   select * from table where col_a = 123 and col_b in ('foo', 'bar') order by id desc;
   
   -- sql2:                                             select * from table where col_a = 456 and col_b in ('foo', 'bar') order by id desc;
   ```

   结果 sql1 选择利用了 col_a 的索引，速度很快，sql2利用了主键ID的索引，扫描了全表(40w行)。
   仔细分析，发现数据库中，col_a=456 的记录数有近1万条，而 col_a=123 的记录数只有几条。
   当 col_a=456 时，Mysql 认为主键索引会比普通index更快，所以mysql最后选择了数据量更大的id索引。
   那么，如何解决这个问题呢？
   很简单，只要在order语句里写多个键即可，比如：`order by col_a, id desc`

#### 事务

**事务是逻辑上的一组操作，要么都执行，要么都不执行。**

##### 事务的四大特性(ACID)

1. **原子性（Atomicity）：** 事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
2. **一致性（Consistency）：** 执行事务后，数据库从一个正确的状态变化到另一个正确的状态；
3. **隔离性（Isolation）：** 并发访问数据库时，一个事务不被其他事务所干扰，各并发事务之间数据库是独立的；
4. **持久性（Durability）：** 一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

##### 并发事务带来哪些问题?

- **脏读（Dirty read）:** 当一个事务正在访问数据并且对数据进行了修改，而这种修改还没有提交到数据库中，这时另外一个事务也访问了这个数据，然后使用了这个数据。因为这个数据是还没有提交的数据，那么另外一个事务读到的这个数据是“脏数据”，依据“脏数据”所做的操作可能是不正确的。
- **丢失修改（Lost to modify）:** 指在一个事务读取一个数据时，另外一个事务也访问了该数据，那么在第一个事务中修改了这个数据后，第二个事务也修改了这个数据。这样第一个事务内的修改结果就被丢失，因此称为丢失修改。
- **不可重复读（Unrepeatableread）:** 指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称为不可重复读。
- **幻读（Phantom read）:** 幻读与不可重复读类似。它发生在一个事务（T1）读取了几行数据，接着另一个并发事务（T2）插入了一些数据时。在随后的查询中，第一个事务（T1）就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以称为幻读。

**不可重复读和幻读区别：**

不可重复读的重点是修改，比如多次读取一条记录发现其中某些列的值被修改，幻读的重点在于新增或者删除，比如多次读取一条记录发现记录增多或减少了。

##### 事务隔离级别有哪些?MySQL的默认隔离级别是?

**SQL 标准定义了四个隔离级别：**

- **READ-UNCOMMITTED(读取未提交)：** 最低的隔离级别，允许读取尚未提交的数据变更，**可能会导致脏读、幻读或不可重复读**。
- **READ-COMMITTED(读取已提交)：** 允许读取并发事务已经提交的数据，**可以阻止脏读，但是幻读或不可重复读仍有可能发生**。
- **REPEATABLE-READ(可重复读)：** 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，**可以阻止脏读和不可重复读，但幻读仍有可能发生**。
- **SERIALIZABLE(可串行化)：** 最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，**该级别可以防止脏读、不可重复读以及幻读**。

------

| 隔离级别         | 脏读 | 不可重复读 | 幻影读 |
| ---------------- | ---- | ---------- | ------ |
| READ-UNCOMMITTED | √    | √          | √      |
| READ-COMMITTED   | ×    | √          | √      |
| REPEATABLE-READ  | ×    | ×          | √      |
| SERIALIZABLE     | ×    | ×          | ×      |

MySQL InnoDB 存储引擎的默认支持的隔离级别是 **REPEATABLE-READ（可重读）**。我们可以通过`SELECT @@tx_isolation;`命令来查看，MySQL 8.0 该命令改为`SELECT @@transaction_isolation;`

```
mysql> SELECT @@tx_isolation;
+-----------------+
| @@tx_isolation  |
+-----------------+
| REPEATABLE-READ |
+-----------------+
```

这里需要注意的是：与 SQL 标准不同的地方在于 InnoDB 存储引擎在 **REPEATABLE-READ（可重读）** 事务隔离级别下使用的是Next-Key Lock 锁（间隙锁）算法，因此可以避免幻读的产生，这与其他数据库系统(如 SQL Server) 是不同的。所以说InnoDB 存储引擎的默认支持的隔离级别是 **REPEATABLE-READ（可重读）** 已经可以完全保证事务的隔离性要求，即达到了 SQL标准的 **SERIALIZABLE(可串行化)** 隔离级别。因为隔离级别越低，事务请求的锁越少，所以大部分数据库系统的隔离级别都是 **READ-COMMITTED(读取提交内容)** ，但是InnoDB 存储引擎默认使用 **REPEAaTABLE-READ（可重读）** 并不会有任何性能损失。

##### Next-Key Lock（间隙锁）

举例来说，假如emp表中只有101条记录，其empid的值分别是 1,2,...,100,101，下面的SQL：

`Select * from  emp where empid > 100 for update;`

是一个范围条件的检索，InnoDB不仅会对符合条件的empid值为101的记录加锁，也会对empid大于101（这些记录并不存在）的“间隙”加锁。

InnoDB使用间隙锁的目的，一方面是为了防止幻读，以满足相关隔离级别的要求，对于上面的例子，要是不使用间隙锁，如果其他事务插入了empid大于100的任何记录，那么本事务如果再次执行上述语句，就会发生幻读；另外一方面，是为了满足其恢复和复制的需要。

#### 锁

**InnoDB的行锁是针对索引加的锁，不是针对记录加的锁。并且该索引不能失效，否则都会从行锁升级为表锁**

InnoDB行锁是通过给索引上的索引项加锁来实现的，这一点MySQL与Oracle不同，后者是通过在数据块中对相应数据行加锁来实现的。InnoDB这种行锁实现特点意味着：只有通过索引条件检索数据，InnoDB才使用行级锁，否则，InnoDB将使用表锁！

由于MySQL的行锁是针对索引加的锁，不是针对记录加的锁，所以虽然是访问不同行的记录，但是如果是使用相同的索引键，是会出现锁冲突的。

如果MySQL认为全表扫描效率更高，比如对一些很小的表，它就不会使用索引，这种情况下InnoDB将使用表锁，而不是行锁。

##### 行锁 VS 表锁

- 表锁： 开销小，加锁快；不会出现死锁；锁定粒度大，发生锁冲突概率高，并发度低
- 行锁： 开销大，加锁慢；会出现死锁；锁定粒度小，发生锁冲突的概率低，并发度高

##### InnoDB的行锁模式及加锁方法

InnoDB实现了以下两种类型的行锁。

- 共享锁（S）：允许一个事务去读一行，阻止其他事务获得相同数据集的排他锁。
- 排他锁（X)：允许获得排他锁的事务更新数据，阻止其他事务取得相同数据集的共享读锁和排他写锁。另外，为了允许行锁和表锁共存，实现多粒度锁机制，InnoDB还有两种内部使用的意向锁（Intention Locks），这两种意向锁都是表锁。

- 意向共享锁（IS）：事务打算给数据行加行共享锁，事务在给一个数据行加共享锁前必须先取得该表的IS锁。
- 意向排他锁（IX）：事务打算给数据行加行排他锁，事务在给一个数据行加排他锁前必须先取得该表的IX锁。

InnoDB行锁模式兼容性列表

| 请求锁模式<br />是否兼容当前锁模式 | X    | IX   | S    | IS   |
| ---------------------------------- | ---- | ---- | ---- | ---- |
| X                                  | 冲突 | 冲突 | 冲突 | 冲突 |
| IX                                 | 冲突 | 兼容 | 冲突 | 兼容 |
| S                                  | 冲突 | 冲突 | 兼容 | 兼容 |
| IS                                 | 冲突 | 兼容 | 兼容 | 兼容 |

#### 连接查询

1. left join （左连接）：返回包括左表中的所有记录和右表中连接字段相等的记录。
2. right join （右连接）：返回包括右表中的所有记录和左表中连接字段相等的记录。
3. inner join （等值连接或者叫内连接）：只返回两个表中连接字段相等的行。
4. full join （全外连接）：返回左右表中所有的记录和左右表中连接字段相等的记录。**MySQL不支持**

#### 优化

##### 查询数据库的运行情况

###### 显示数据库运行状态

`SHOW STATUS`

###### 显示数据库运行总时间

`SHOW STATUS LIKE 'uptime'`

###### 显示连接的次数

`SHOW STATUS LIKE 'connections'`

###### 显示执行CRUD的次数

```sql
SHOW STATUS LIKE 'com_select'
SHOW STATUS LIKE 'com_insert'
SHOW STATUS LIKE 'com_update'
SHOW STATUS LIKE 'com_delete'
```

##### 慢查询

###### 慢查询配置

Linux下修改my.cnf，Windows下修改my.ini。修改后需要重启mysql才会生效。

```properties
#开启慢查询
slow-query-log=1
#慢查询的文件路径
slow_query_log_file="D:/Program Files/MySQL/Log/mysql-slow.log"
#慢查询时间。默认为10秒
long_query_time=10
#记录没有使用索引的查询
log-queries-not-using-indexes=1
```

###### 定位慢查询SQL

如果慢查询日志中记录内容较多，则可以使用Mysql自带的慢查询日志分析工具mysqldumpslow来对慢查询日志进行分类汇总。该工具位于/mysql/bin目录下。mysqldumpslow会自动将文本完全一致但变量不同的SQL语句视为同一个语句进行统计，变量值用N来代替。

```mysql
mysqldumpslow -s r -t 10 /data/dbdata/frem-slow.log
```

![img](https://img2018.cnblogs.com/blog/424830/201907/424830-20190707081744320-989448386.png)

##### 执行计划

```mysql
explain [要分析的sql]
```

分析结果中有如下几列：

1. id：查询序号
2. select_type
3. table
4. type
5. possible_keys
6. key
7. key_len
8. ref
9. rows
10. Extra

###### id

表示 select 查询序列号。**id值越大，越优先执行。\**如果id相同，执行顺序由上至下\****    **![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200502220732511-625086303.png)**

###### select_type

表示查询类型。主要用于区分普通查询、子查询、联合查询等几种查询情况。

取值：

1. simple
2. primary
3. subquery
4. derived
5. union
6. union result

①simple：表示简单查询，只有一个select操作，即不使用连接和union。

```mysql
#只有一个select操作，所以都是简单查询

select id from emp;

select id from emp join dept on emp.dept_id=dept.id;
```

②primary：表示主查询。子查询语句中的最外层select，或union操作的第一个select。

```mysql
#子查询形式：第一个select操作为primary
select * from app_school where id = (select id from app_school where id=100);

#union形式：第一个select操作为primary
select * from app_school where id=100
union
select * from app_school where id=101;
```

③subquery：表示子查询。子查询语句中的内层select。

```mysql
#第二个select操作为subquery
select * from app_school where id = (select id from app_school where id=100);
```

④derived：表示FROM后跟着的select查询，会被标记为derived(导出表/衍生表)。

```mysql
#第二个select操作为derived
select * from (select id from app_school) t;
```

⑤union：表示UNION操作后面的select查询。

```mysql
#第二个select操作为union
select * from app_school where id=100
union
select * from app_school where id=101;
```

⑥union result：表示获取UNION最后结果的查询。

```mysql
#第一个select操作为primary
#第二个select操作为union
#获取最终结果的操作为union result
select * from app_school where id=100
union
select * from app_school where id=101;
```

![img](https://img2018.cnblogs.com/blog/424830/201907/424830-20190712003515128-554921784.png)

###### table

表示查询用到的表。

###### type

表示找到匹配行用到的访问类型。

最为常见的类型有:

1. NULL
2. system
3. const
4. eq_ref
5. ref
6. range
7. index
8. All

按照性能从高到低顺序如下：NULL-->system-->const-->eq-ref-->ref-->range-->index-->All 。一般来说，要让查询至少达到range级别，最好能达到ref级别。

**①**NULL：不用访问表或索引，就可直接得出结果。
![img](https://img2018.cnblogs.com/blog/424830/201907/424830-20190706164443539-700840263.png)

**②system**：该表是最多仅有一行的系统表(这是const类型的一个特例)。系统表中的数据通常已经加载到了内存中，所以不需要磁盘IO。
例子1：查询系统表
![img](https://img2018.cnblogs.com/blog/424830/201907/424830-20190706164242606-1185621519.png)
例子2：内层嵌套(const)返回了一个临时表，外层嵌套从临时表中查询，其扫描类型也是system，也不需要磁盘IO。

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200502231552124-1649320315.png)

**③const**：最多只有一个匹配行，所以该行中的其它列的值可以当作常量来处理。例如，根据主键primary key或唯一索引unique index进行查询。**简单地说const就是直接按主键或唯一键取值。**例如在②中介绍system时的举例中user表的访问类型就是const，其通过主键来取值。

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200502231426915-1946155193.png)

**④eq_ref**：使用唯一索引，对于每个索引键值，表中只有一条记录匹配。简单说，就是多表连接中使用primary key或unique index作为关联条件。

**注意const和eq_ref的区别：简单地说是`const`是直接按主键或唯一键读取，`eq_ref`用于联表查询的情况，按联表的主键或唯一键联合查询。**

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503001453929-1612327840.png)![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503003027609-823944660.png)

**⑤ref**：使用非唯一索引，或唯一索引的前缀扫描，返回匹配某个单独值的所有行(可能匹配多个行)。

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503000159947-653574490.png)![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503000923679-747371819.png)

ref还经常出现在join操作中

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503001210640-1962805550.png)

**⑥**ref_or_null：与ref类似，区别在于条件中包含对NULL的查询。

**⑦**index_merge：索引合并优化。

**⑧**unique_subquery：in的后面是一个查询主键字段的子查询。

**⑨**index_subquery：与unique subquery类似，区别在于in的后面是查询非唯一索引字段的子查询。

**⑩range**：只检索指定范围的行，使用一个索引来选择行。常见于<，<=，>，>=，between或者IN操作符。
key列显示使用了哪个索引。key_len包含所使用索引的最长关键元素。

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503003455696-1174761682.png)

**11.index**：索引全扫描。遍历整个索引来查询匹配的行。

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503003823129-1724228939.png)

**12.ALL**：全表扫描，性能最差。

![img](https://img2020.cnblogs.com/blog/424830/202005/424830-20200503003936777-1259627189.png)

###### possible_keys和key

possible_keys表示查询时可能使用到的索引，而key表示实际使用的索引

###### key_len

表示使用到的索引字段的长度

###### ref

表示该表的索引字段关联了哪张表的哪个字段

###### rows

表示扫描行的数量

###### Extra

表示执行情况的说明和描述。包含不适合在其它列中显示但对执行计划非常重要的额外信息。记录几个重要的：

- Using index ：使用覆盖索引的时候就会出现

- Using where：在查找使用索引的情况下，需要回表去查询所需的数据。表示Mysql将对storage engine提取的结果进行过滤，过滤条件字段无索引；

- Using index condition：查找使用了索引，但是需要回表查询数据。会先条件过滤索引，过滤完索引后找到所有符合索引条件的数据行，随后用 WHERE 子句中的其他条件去过滤这些数据行；

- Using index & using where：查找使用了索引，但是需要的数据都在索引列中能找到，所以不需要回表查询数据

- Using filesort：使用了文件排序。当查询语句包含ORDER BY时，如果无法使用索引来完成排序，则需要进行额外的排序操作。

- Using temporary：使用临时表来保存中间结果

### Oracle

#### 索引

oracle 默认的索引是 **B+树**索引

##### 索引结构

###### B+ 树索引

![](http://hongyitong.github.io/img/B%E6%A0%91%E7%B4%A2%E5%BC%95.jpg)

###### 位图索引

> [位图索引:原理（BitMap index）——浅显易懂](https://blog.csdn.net/qq_24236769/article/details/75801687)

![](http://hongyitong.github.io/img/%E4%BD%8D%E5%9B%BE%E7%B4%A2%E5%BC%95.jpg)

位图索引适合只有几个**固定值**的列，如性别、婚姻状况、行政区等。

位图可以通过 AND/OR 操作，快速得到查询结果。

此外，位图索引适合**静态**数据，而不适合索引频繁更新的列。

因为位图索引列的修改会将所有该值的行进行加锁。



#### 锁

### 优化

##### 最左前缀原则

联合索引的任何前缀索引都会使用到索引查询，(col1, col2, col3) 这个联合索引的所有前缀就是(col1), (col1, col2), (col1, col2, col3) 包含这些列的查询都会启用索引查询，除此之外的查询即时包含了联合索引中的多列也不会启用索引查询。即 (col2), (col3), (col2, col3) 都不会启动(col1, col2, col3) 这个联合索引查询。

##### 禁止使用 SELECT * 必须使用 SELECT <字段列表> 查询

**原因：**

- 消耗更多的 CPU 和 IO 以网络带宽资源
- 无法使用覆盖索引
- 可减少表结构变更带来的影响

##### 禁止使用不含字段列表的 INSERT 语句



##### 禁止对索引列使用函数

对索引列使用函数会导致索引失效。

##### 将不等于改成 or

将`<>a` `!=a` 改成`<a or >a`，因为不等于用不到索引。

##### 禁止使用左模糊和全模糊条件查询

左模糊 `%key` 和全模糊 `%key%` 无法使用索引，只有右模糊 `key%` 才能使用到索引。

##### 避免使用子查询，可以把子查询优化为 join 操作

通常子查询在 in 子句中，且子查询中为简单 SQL(不包含 union、group by、order by、limit 从句) 时,才可以把子查询转化为关联查询进行优化。

**子查询性能差的原因：**

子查询的结果集无法使用索引，通常子查询的结果集会被存储到临时表中，不论是内存临时表还是磁盘临时表都不存在索引，所以查询性能会受到一定的影响。特别是对于返回结果集比较大的子查询，其对查询性能的影响也就越大。

由于子查询会产生大量的临时表也没有索引，所以会消耗过多的 CPU 和 IO 资源，产生大量的慢查询。

##### 避免使用 JOIN 关联太多的表

对于 MySQL 来说，是存在关联缓存的，缓存的大小可以由 join_buffer_size 参数进行设置。

在 MySQL 中，对于同一个 SQL 多关联（join）一个表，就会多分配一个关联缓存，如果在一个 SQL 中关联的表越多，所占用的内存也就越大。

如果程序中大量的使用了多表关联的操作，同时 join_buffer_size 设置的也不合理的情况下，就容易造成服务器内存溢出的情况，就会影响到服务器数据库性能的稳定性。

同时对于关联操作来说，会产生临时表操作，影响查询效率，MySQL 最多允许关联 61 个表，建议不超过 5 个。

##### 对应同一列进行 or 判断时，使用 in 代替 or

in 的值不要超过 500 个，in 操作可以更有效的利用索引，or 大多数情况下很少能利用到索引。

##### 禁止使用 order by rand() 进行随机排序

order by rand() 会把表中所有符合条件的数据装载到内存中，然后在内存中对所有数据根据随机生成的值进行排序，并且可能会对每一行都生成一个随机值，如果满足条件的数据集非常大，就会消耗大量的 CPU 和 IO 及内存资源。

推荐在程序中获取一个随机值，然后从数据库中获取数据的方式。

##### 在明显不会有重复值时使用 UNION ALL 而不是 UNION

- UNION 会把两个结果集的所有数据放到临时表中后再进行去重操作
- UNION ALL 不会再对结果集进行去重操作

#### 执行计划

Mysql 使用 Explain + select...

比较重要的字段有：

- select_type : 查询类型，有简单查询、联合查询、子查询等
- key : 使用的索引
- rows : 扫描的行数

### 分库分表

**分库分表是为了解决由于库、表数据量过大，而导致数据库性能持续下降的问题。** 常见的分库分表工具有：`sharding-jdbc`（当当）、`TSharding`（蘑菇街）、`MyCAT`（基于 Cobar）、`Cobar`（阿里巴巴）...。

**推荐使用 `sharding-jdbc`** 。 因为，`sharding-jdbc` 是一款轻量级 `Java` 框架，以 `jar` 包形式提供服务，不要我们做额外的运维工作，并且兼容性也很好。

- **客户端代理：** **分片逻辑在应用端，封装在jar包中，通过修改或者封装JDBC层来实现。** 当当网的 **Sharding-JDBC** 、阿里的TDDL是两种比较常用的实现。
- **中间件代理：** **在应用和数据中间加了一个代理层。分片逻辑统一维护在中间件服务中。** 我们现在谈的 **Mycat** 、360的Atlas、网易的DDB等等都是这种架构的实现。

#### 分库分表之后,id 主键如何处理？

- **数据库自增 id** : 两台数据库分别设置不同步长，生成不重复ID的策略来实现高可用。这种方式生成的 id 有序，但是需要独立部署数据库实例，成本高，还会有性能瓶颈。
- **利用 redis 生成 id :** 性能比较好，灵活方便，不依赖于数据库。但是，引入了新的组件造成系统更加复杂，可用性降低，编码更加复杂，增加了系统成本。
- **Twitter的snowflake算法**
- **美团的[Leaf](https://tech.meituan.com/2017/04/21/mt-leaf.html)分布式ID生成系统** ：Leaf 是美团开源的分布式ID生成器，能保证全局唯一性、趋势递增、单调递增、信息安全，里面也提到了几种分布式方案的对比，但也需要依赖关系数据库、Zookeeper等中间件。

### MongoDB

面向集合(`Collection`)和文档(`document`)的存储，以JSON格式的文档保存数据。

#### 与关系型数据库术语类比

| mongodb            | 关系型数据库 |
| :----------------- | ------------ |
| Database           | Database     |
| Collection         | Table        |
| Document           | Record/Row   |
| Filed              | Column       |
| Embedded Documents | Table join   |

#### MongoDB的优势有哪些

- 面向文档的存储：以 BSON 格式的文档保存数据。
- 任何属性都可以建立索引。
- 复制以及高可扩展性。
- 自动分片。
- 丰富的查询功能。
- 快速的即时更新。
- 来自 MongoDB 的专业支持。

#### BSON VS JSON

1. BSON 有更快的遍历速度

   json需要扫字符串，而bson可以直接定位

2. json是像字符串一样存储的，bson是按结构存储的

#### 如何执行事务/加锁?

`mongodb`没有使用传统的锁或者复杂的带回滚的事务,因为它设计的宗旨是轻量,快速以及可预计的高性能

#### 在哪些场景使用`MongoDB`?

**规则：** 如果业务中存在大量复杂的事务逻辑操作，则不要用`MongoDB`数据库；在处理非结构化 / 半结构化的大数据使用`MongoDB`，操作的数据类型为动态时也使用`MongoDB`，比如：

- 内容管理系统，切面数据、日志记录
- 移动端`Apps`：`O2O`送快递骑手、快递商家的信息（包含位置信息）
- 数据管理，监控数据

