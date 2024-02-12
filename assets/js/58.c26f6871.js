(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{328:function(_,v,t){"use strict";t.r(v);var a=t(10),s=Object(a.a)({},(function(){var _=this,v=_._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("h1",{attrs:{id:"对支付系统的个人理解"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#对支付系统的个人理解"}},[_._v("#")]),_._v(" 对支付系统的个人理解")]),_._v(" "),v("h2",{attrs:{id:"常用支付形式"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#常用支付形式"}},[_._v("#")]),_._v(" 常用支付形式")]),_._v(" "),v("h3",{attrs:{id:"平台支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#平台支付"}},[_._v("#")]),_._v(" 平台支付")]),_._v(" "),v("p",[_._v("用户提前注册并登录到第三方支付平台，并且已经在该平台上完成绑卡等操作后，通过第三方支付平台进行支付。")]),_._v(" "),v("h3",{attrs:{id:"网银支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#网银支付"}},[_._v("#")]),_._v(" 网银支付")]),_._v(" "),v("p",[_._v("用户在完成必要的银行网银开通手续后，可以通过银行的网银系统进行在线支付和转账。在进行网银支付时，用户需要登录银行网银系统，输入相应的支付信息并进行身份验证，然后可以完成在线支付交易，移动互联网时代较为少用。")]),_._v(" "),v("h3",{attrs:{id:"快捷支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#快捷支付"}},[_._v("#")]),_._v(" 快捷支付")]),_._v(" "),v("p",[_._v("一种简化了支付流程的支付方式。通常情况下，用户在首次支付时需要绑定银行卡或者进行一次认证，之后就可以使用该支付方式来完成交易，无需重复输入银行卡信息或进行繁琐的身份验证。在后续的支付过程中，用户只需进行简单的确认操作或者输入支付密码，就能够快速完成交易。")]),_._v(" "),v("h3",{attrs:{id:"虚拟货币支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#虚拟货币支付"}},[_._v("#")]),_._v(" 虚拟货币支付")]),_._v(" "),v("p",[_._v("不少公司会有自己的虚拟币，这些虚币也可以作为一种支付方式。一般会有一些金额、品类的限制，如虚拟支付不得超过每笔订单结算金额的 50%。")]),_._v(" "),v("h3",{attrs:{id:"余额支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#余额支付"}},[_._v("#")]),_._v(" 余额支付")]),_._v(" "),v("p",[_._v("为用户建立本地账户并使用账户来完成支付，账户支持充值、提现等操作。")]),_._v(" "),v("h3",{attrs:{id:"信用支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#信用支付"}},[_._v("#")]),_._v(" 信用支付")]),_._v(" "),v("p",[_._v("指使用信用账户进行透支，类似信用卡支付。需要较强的风控能力。")]),_._v(" "),v("h2",{attrs:{id:"支付系统的常见接口"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#支付系统的常见接口"}},[_._v("#")]),_._v(" 支付系统的常见接口")]),_._v(" "),v("h3",{attrs:{id:"支付"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#支付"}},[_._v("#")]),_._v(" 支付")]),_._v(" "),v("ul",[v("li",[_._v("在商户的 H5 网站下单并确认支付。")]),_._v(" "),v("li",[_._v("商户系统生成订单信息并构造支付请求发送到该支付产品系统。")]),_._v(" "),v("li",[_._v("系统校验通过后拼装本次支付所需参数返回给商户前端。")]),_._v(" "),v("li",[_._v("商户前端将页面跳转至该支付产品官方中间页，如果用户手机上安装了该支付产品 App，则自动唤起 App；如果未安装，则继续在当前页面进入官方 H5 收银台。")]),_._v(" "),v("li",[_._v("用户完成密码输入并支付。")]),_._v(" "),v("li",[_._v("系统内部完成本次支付单处理流程。")]),_._v(" "),v("li",[_._v("处理完成后，以异步消息形式通知商户后台 Notify_URL，确认此次交易成功。")]),_._v(" "),v("li",[_._v("处理完成后，从官方中间页跳转商户自定义支付结果页 Return_URL，展示支付结果。")]),_._v(" "),v("li",[_._v("完成本次支付。")])]),_._v(" "),v("h3",{attrs:{id:"交易关闭"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#交易关闭"}},[_._v("#")]),_._v(" 交易关闭")]),_._v(" "),v("p",[_._v("针对需要的业务场景，支持主动取消订单（针对未支付订单，已支付单可走退款流程）。")]),_._v(" "),v("ul",[v("li",[_._v("用户发起/商户后台管理员发起订单取消申请。")]),_._v(" "),v("li",[_._v("商户系统向该支付产品系统发起关闭订单请求。")]),_._v(" "),v("li",[_._v("后台判断处理后返回取消结果。")])]),_._v(" "),v("h3",{attrs:{id:"交易查询"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#交易查询"}},[_._v("#")]),_._v(" 交易查询")]),_._v(" "),v("ul",[v("li",[_._v("商户后台发起交易查询请求。")]),_._v(" "),v("li",[_._v("系统判断交易单存在，并返回交易结果。")])]),_._v(" "),v("h3",{attrs:{id:"退款"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#退款"}},[_._v("#")]),_._v(" 退款")]),_._v(" "),v("ul",[v("li",[_._v("用户/商户发起退款请求")]),_._v(" "),v("li",[_._v("商户系统审核处理退款申请是否合法。")]),_._v(" "),v("li",[_._v("合法情况下，商户系统向该支付产品系统发起退款请求。")]),_._v(" "),v("li",[_._v("系统处理并返回结果。")]),_._v(" "),v("li",[_._v("相关渠道将资金返回（有一定时间延迟）。")])]),_._v(" "),v("h3",{attrs:{id:"退款查询"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#退款查询"}},[_._v("#")]),_._v(" 退款查询")]),_._v(" "),v("ul",[v("li",[_._v("用户/商户发起退款查询请求。")]),_._v(" "),v("li",[_._v("系统处理后返回结果。")])]),_._v(" "),v("h2",{attrs:{id:"支付的后续处理"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#支付的后续处理"}},[_._v("#")]),_._v(" 支付的后续处理")]),_._v(" "),v("h3",{attrs:{id:"结算、分账"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#结算、分账"}},[_._v("#")]),_._v(" 结算、分账")]),_._v(" "),v("p",[_._v("在支付成功后进行结算分账是指将支付的款项按照预定的规则分配给相关参与方。这通常涉及到商家、平台、供应商等各方之间的分账操作。下面是一些可能的步骤和相关的考虑：")]),_._v(" "),v("ol",[v("li",[v("strong",[_._v("确定分账方：")]),_._v(" 确定需要参与分账的各方，例如商家、平台、供应商等。")]),_._v(" "),v("li",[v("strong",[_._v("制定分账规则：")]),_._v(" 制定分账的具体规则，包括各方的分账比例、分账周期等。这通常在合同或协议中规定。")]),_._v(" "),v("li",[v("strong",[_._v("获取支付信息：")]),_._v(" 在支付成功后，系统需要获取支付的相关信息，例如支付金额、支付时间等。")]),_._v(" "),v("li",[v("strong",[_._v("计算分账金额：")]),_._v(" 根据制定的分账规则，计算各方应该分得的金额。")]),_._v(" "),v("li",[v("strong",[_._v("生成结算单据：")]),_._v(" 生成结算单据，明确每个参与方的分账金额，以便后续的结算操作。")]),_._v(" "),v("li",[v("strong",[_._v("执行结算：")]),_._v(" 将分账金额转入各方的账户，可以通过银行转账、第三方支付平台等方式进行结算。")]),_._v(" "),v("li",[v("strong",[_._v("记录结算信息：")]),_._v(" 记录每一笔结算的详细信息，包括结算时间、结算金额等，以便后续的查账和审计。")]),_._v(" "),v("li",[v("strong",[_._v("通知相关方：")]),_._v(" 可以通过系统通知或其他方式告知各方结算结果，确保信息的透明和及时性。")]),_._v(" "),v("li",[v("strong",[_._v("监控和调整：")]),_._v(" 建立监控机制，定期检查分账操作的准确性，根据实际情况进行调整和优化分账规则。")]),_._v(" "),v("li",[v("strong",[_._v("合规性和法律考虑：")]),_._v(" 确保分账操作符合相关法规和合同规定，防止出现法律风险。")])]),_._v(" "),v("h3",{attrs:{id:"二清合规"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#二清合规"}},[_._v("#")]),_._v(" 二清合规")]),_._v(" "),v("p",[_._v('"二清"通常指的是在支付流程中的两个清算环节，即二次结算，一般包括商户清算和平台清算。而"合规"则是指在业务运作中合乎法律法规和相关政策的规定。')]),_._v(" "),v("p",[_._v("在支付领域，二清合规通常是指在支付平台或支付系统中，商户和平台之间的结算过程要符合相关法规和政策，确保资金的流转合法合规，防范风险，保障各方的权益。这一概念通常涉及到支付服务提供商、商户、监管机构等多方的关系。")]),_._v(" "),v("p",[_._v("具体而言，二清合规可能包括以下方面：")]),_._v(" "),v("ol",[v("li",[v("strong",[_._v("资金监管：")]),_._v(" 确保支付平台对用户支付的资金进行合法监管，防范洗钱、诈骗等违法行为。")]),_._v(" "),v("li",[v("strong",[_._v("商户合规性：")]),_._v(" 确保商户符合相关法规和合同规定，防范违法交易和商户的不当行为。")]),_._v(" "),v("li",[v("strong",[_._v("隐私保护：")]),_._v(" 对用户的个人隐私信息进行保护，符合相关的隐私法规。")]),_._v(" "),v("li",[v("strong",[_._v("合同规范：")]),_._v(" 商户与支付平台之间的结算过程要符合双方签订的合同和协议，确保权责清晰。")]),_._v(" "),v("li",[v("strong",[_._v("风险管理：")]),_._v(" 建立风险管理体系，对支付过程中的各类风险进行评估和控制，确保支付过程的安全性。")]),_._v(" "),v("li",[v("strong",[_._v("透明度：")]),_._v(" 提供透明的结算信息，确保商户能够清晰地了解交易的结算过程和费用组成。")]),_._v(" "),v("li",[v("strong",[_._v("法规遵从：")]),_._v(" 遵守国家和地区的支付法规和监管政策，确保支付业务的合法性。")])]),_._v(" "),v("h2",{attrs:{id:"常见问题"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#常见问题"}},[_._v("#")]),_._v(" 常见问题")]),_._v(" "),v("h3",{attrs:{id:"支付订单超时时间"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#支付订单超时时间"}},[_._v("#")]),_._v(" 支付订单超时时间")]),_._v(" "),v("p",[_._v("用户在「确认订单页」点击「提交订单」就会创建订单并跳转至收银台，此时开始锁定库存并计时；而用户在收银台停留的时间是不确定的，这部分不确定时间造成了时间差。具体来讲，如果用户点击「去支付」创建预支付单时传递的过期时间是个固定值，那么就有可能会出现一种情况：在订单系统该订单已经过期失效了，但用户在支付平台内还能支付该笔订单（而此时支付成功回调订单系统，订单已取消，系统是不会进行后续发货流程的）。因此，支付单的过期时间要结合支付单创建当前时间和订单创建时间一起动态计算得出，保持一致，从而给平台用户提供更好的消费体验。")])])}),[],!1,null,null,null);v.default=s.exports}}]);