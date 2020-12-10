## Elasticsearch

*Elasticsearch* 是一个实时的分布式搜索分析引擎，它能让你以前所未有的速度和规模，去探索你的数据。 它被用作全文检索、结构化搜索、分析以及这三个功能的组合。例如 GitHub 使用 Elasticsearch 对1300亿行代码进行查询。

### 应用场景

- 日志实时分析

  日志分析是 ES 应用最广泛的领域，支持全栈的日志分析

- 搜索服务

  文档的全文检索、电商平台商品的搜索。

- 数据分析

### 为什么 Elasticsearch 那么快？

Elasticsearch 基于 Apache Lucene，Lucene 实现快速搜索的核心就是倒排索引。

#### 倒排索引

将文档中的单词作为索引，将文档ID作为记录的索引结构称为倒排索引。

##### 核心概念

- Term：文档拆分后的单词与文档ID的映射。

- Term Dictionary：所有单词组成的二叉排序树，根据 Term Dictionary 可以快速定位到 Term。

- Term Index：单词前缀的二叉排序树，根据 Term Index 可以快速定位到 Term Dictionary。

Term Index 以FST（finite state transducers）的形式保存在内存中，FST特点是非常节省内存。

Term dictionary在磁盘上是以分快的方式保存的，一个block内部利用公共前缀压缩，比如都是Ab开头的单词就可以把Ab省去。这样term dictionary可以更节约磁盘空间。

