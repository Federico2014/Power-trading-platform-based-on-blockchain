pragma solidity ^0.4.18;
contract Transaction {
  enum OrderStatus {
    Open,  //订单公开
    Accept,//订单被卖家加入
    UnAccept//没有卖家加入
  }
  uint public orderIndex;//订单ＩＤ　统计订单数量
  //通过买家的钱包地址找到订单信息
  mapping (address => mapping (uint => Order)) orderInfo;
  //买家钱包地址
  mapping (uint => address) buyeraddress;
  //订单信息
  struct Order{
    uint id;
    uint topprice;
    uint begintime;
    uint endtime;
    uint elecpurchase;
    uint total;
    OrderStatus status;
    //加入该订单的卖家信息
    mapping (address => mapping (uint => Seller)) sellers;
  }
  struct Seller {
    address seller;
    uint orderid;
    uint price;
    uint elecsell;
    //uint replytime;
    //uint sellerprice;//卖家违约金
  }

  //构造函数，初始无订单
  function Transaction() public{
    orderIndex = 0;
  }

  function getBalance() returns(uint) {
     return this.balance;
  }
  //增加订单
  function addOrder(uint _topprice,uint _begintime,uint _endtime,uint _elecpurchase) public{
    require(_begintime < _endtime);//判断输入是否出错
    orderIndex += 1;
    Order memory order = Order(orderIndex,_topprice,_begintime,_endtime,_elecpurchase,0,OrderStatus.Open);
    orderInfo[msg.sender][orderIndex] = order;
    buyeraddress[orderIndex] = msg.sender;
  }
  //读取订单
  function getOrder(uint _orderID) view public returns (uint,uint,uint,uint,uint,uint,OrderStatus) {
    Order memory order = orderInfo[buyeraddress[_orderID]][_orderID];
    return (order.id,order.topprice,order.begintime,order.endtime,order.elecpurchase,order.total,order.status);
  }
  //卖家加入订单
  function joinOrder(uint _orderID,uint _elecsell) payable public returns (bool){
    Order storage order = orderInfo[buyeraddress[_orderID]][_orderID];
    /* require(now >= order.begintime);
    require(now <= order.endtime); */
    require(msg.value <= order.topprice);
    order.sellers[buyeraddress[_orderID]][_orderID] = Seller(msg.sender,_orderID,msg.value,_elecsell);
    order.total += 1;
    return true;
  }
  //查看最终订单信息
  function getJoinOrder(uint _orderID) view public returns(uint,address,address,uint,uint){
    /* return (order.id,buyeraddress[order.id],order.sellers[buyeraddress[order.id]][order.id].seller,order.sellers[buyeraddress[order.id]][order.id].price,order.sellers[buyeraddress[order.id]][order.id].elecsell); */
    Order storage order = orderInfo[buyeraddress[_orderID]][_orderID];
    Seller memory sellerinfo = order.sellers[buyeraddress[_orderID]][_orderID];
    return (sellerinfo.orderid,buyeraddress[_orderID],sellerinfo.seller,sellerinfo.price,sellerinfo.elecsell);
  }
  /* //买家确认购买
  function confirmPurchase(uint _orderID) public{
    Order memory order = orderInfo[buyeraddress[_orderID]][_orderID];


  } */

//转账有bug，调试ing
  function buyUpload(uint _orderID,address to,uint _elecuse) payable public{
    uint value;
    Order storage order = orderInfo[buyeraddress[_orderID]][_orderID];
    Seller storage sellerinfo = order.sellers[msg.sender][_orderID];
    uint elecnum = order.elecpurchase;
    uint price = sellerinfo.price;
    if(_elecuse > elecnum)
       {
         value = price * 3;
       }
    else if(_elecuse < elecnum)
       {
         value = price * 2;

       }
else if(_elecuse == elecnum )
       {
                value = price;
       }
    to.transfer(value);
    order.status = OrderStatus.Accept;
     }

  function sellUpload(uint _orderID,address to,uint _elecsell) payable public{
    uint value;
    Order storage order = orderInfo[buyeraddress[_orderID]][_orderID];
    Seller storage sellerinfo = order.sellers[buyeraddress[_orderID]][_orderID];
    uint elecnum = order.elecpurchase;
    uint price = sellerinfo.price;
    if(_elecsell < elecnum)
    {
      value = price * 2;
    }
    to.transfer(value);
    order.status = OrderStatus.Accept;
  }
  //根据订单ＩＤ返回卖家加入的人数
  function totalJoin(uint _orderID) view public returns(uint){
    Order memory order = orderInfo[buyeraddress[_orderID]][_orderID];
    return order.total;
  }
}
