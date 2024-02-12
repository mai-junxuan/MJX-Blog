(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{319:function(e,r,a){"use strict";a.r(r);var _=a(10),t=Object(_.a)({},(function(){var e=this,r=e._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h1",{attrs:{id:"普通索引和唯一索引的区别"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#普通索引和唯一索引的区别"}},[e._v("#")]),e._v(" 普通索引和唯一索引的区别")]),e._v(" "),r("p",[e._v("普通索引和唯一索引的区别就是，普通索引的字段内容是可以重复的，唯一索引的字段内容不可重复。")]),e._v(" "),r("h2",{attrs:{id:"一、查询过程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#一、查询过程"}},[e._v("#")]),e._v(" 一、查询过程")]),e._v(" "),r("p",[e._v("假设查询语句为"),r("code",[e._v("select id from test where k=10;")]),e._v("首先会通过B+树的树根开始按层搜索叶子节点，找到对应的数据页后，在页内进行二分查找定位记录。")]),e._v(" "),r("ul",[r("li",[e._v("对于普通索引，查找到第一条符合条件的记录(id,10)之后，"),r("strong",[e._v("继续往后查找，直到找到第一条不满足k=10的记录")]),e._v("；")]),e._v(" "),r("li",[e._v("对于唯一索引，"),r("strong",[e._v("查找到第一条符合条件的记录(id,10)之后，直接返回结果")]),e._v("；")])]),e._v(" "),r("blockquote",[r("p",[e._v("唯一索引定义了唯一性，有且只有一条符合条件的记录，普通索引则可能存在多条记录")])]),e._v(" "),r("p",[r("strong",[e._v("这两种情况下，性能会相差多少？")])]),e._v(" "),r("p",[e._v("我们知道，InnoDB中的数据是按"),r("strong",[e._v("数据页为单位进行读写")]),e._v("的，也就是说，当找到K=10的那条记录，包含这条记录的数据页已经在内存中，并且是顺序读取，读取一条记录和读取多条记录，性能相差不了多少。当然，如果刚好要读取的下一条记录在下一个数据页，花费的时间会长一点，但是这是小概率事件。 总而言之，"),r("strong",[e._v("对于查询过程，普通索引和唯一索引的效率相近")]),e._v("。")]),e._v(" "),r("h2",{attrs:{id:"二、更新过程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#二、更新过程"}},[e._v("#")]),e._v(" 二、更新过程")]),e._v(" "),r("h3",{attrs:{id:"_1-change-buffer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-change-buffer"}},[e._v("#")]),e._v(" 1. change buffer")]),e._v(" "),r("p",[e._v("当需要更新某个数据页时，有两种情况：")]),e._v(" "),r("ul",[r("li",[e._v("数据页在内存中：直接更新，该数据页标记为脏。")]),e._v(" "),r("li",[e._v("数据页不在内存中，把更新操作缓存在change buffer当中，在下次需要读取这个数据页时，把该数据页加载到内存，并且把change buffer中的更新操作应用到数据页中，以此保证数据的一致性。")])]),e._v(" "),r("h3",{attrs:{id:"_2、merge"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2、merge"}},[e._v("#")]),e._v(" 2、merge")]),e._v(" "),r("p",[e._v("将change buffer中的操作应用到原始数据页的过程称为merge。 触发merge的情况有以下几种：读取该数据页、系统后台定期merge、数据库正常关闭。")]),e._v(" "),r("p",[e._v("显然，将更新语句缓存在change buffer的好处有两个：1、减少磁盘的IO次数，语句执行速度提升；2、减少数据页读入内存，提高内存利用率；")]),e._v(" "),r("h3",{attrs:{id:"_3、使用场景"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3、使用场景"}},[e._v("#")]),e._v(" 3、使用场景")]),e._v(" "),r("p",[e._v("当然，并不是任何情况下使用change buffer都会提升性能的。")]),e._v(" "),r("h4",{attrs:{id:"唯一索引还是普通索引"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#唯一索引还是普通索引"}},[e._v("#")]),e._v(" 唯一索引还是普通索引？")]),e._v(" "),r("p",[e._v("对于唯一索引，每次对数据的更新都需要先把数据页加载到内存，判断是否违反唯一性约束，而对于已经在内存当中的数据页，是否随机读写已经不重要了，也就没有必要使用change buffer缓存更新操作。")]),e._v(" "),r("p",[e._v("对于普通索引，由于不需要数据页在内存中判断唯一性约束，可以缓存更新操作，减少了对磁盘的随机IO次数。")]),e._v(" "),r("h4",{attrs:{id:"普通索引就可以了吗"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#普通索引就可以了吗"}},[e._v("#")]),e._v(" 普通索引就可以了吗？")]),e._v(" "),r("p",[e._v("如果业务场景是写后需要立即读取，change buffer还有优势吗？")]),e._v(" "),r("p",[e._v("更新操作写入change buffer后，由于需要马上读取，也就是立即触发了merge过程，这种情况下磁盘的随机IO次数并不会减少，甚至还额外增加了change buffer的维护成本。")]),e._v(" "),r("p",[e._v("也就是说，"),r("strong",[e._v("change buffer适用于写多读少的场景")]),e._v("，这样才能在下一次merge之前缓存更多的更新操作，收益才更大。这种业务模型常见的就是账单、日志等系统。")]),e._v(" "),r("h2",{attrs:{id:"总结"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[e._v("#")]),e._v(" 总结")]),e._v(" "),r("p",[e._v("由于唯一索引用不了change buffer的优化机制，因此如果业务可以接受，从性能角度，推荐优先考虑非唯一索引。")])])}),[],!1,null,null,null);r.default=t.exports}}]);