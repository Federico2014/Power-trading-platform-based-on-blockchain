pragma solidity ^0.4.4;

//User的value当前电量：用户的电量是实时变化的，合约无法实时更新
//purchases [] 的下标和List 的键都是指交易ID？

/*向合约发送以太币：
因此web3.js的函数调用可以通过指定{ from: __, value: __ }参数来发送以太币。在Solidity合约中，
你可以通过msg.sender和msg.value来获取这些信息：
*/


contract PowerTrade {
  address owner;  //合约拥有者
  /* mapping(address => uint) user; */
  struct User {
    address userAddress;   //账户地址
    uint value;      //当前电量
    bool valid;     //是否为合法用户（因为管理员可以删除用户）
  }
  User[] users; //记录系统中的所有用户。下标为用户ID

  struct Purchase {
    address purchaserAddress; //购电者的账户地址
    uint powerExpected;   //需要购买的电量
    uint purchaserDeposit;  //需要交纳的保证金
    uint auctionStart;    //竞拍开始时间
    uint biddingEnd;    //密封报价结束时间(注意：时间点，不是时间段)
    uint revealEnd;   //公开报价结束时间，即结算时间
    uint status;    //该请求的状态（1：密封报价阶段；2：公开密封报价阶段；3：已完成结算；0：交易失败）
  }
  Purchase[] purchases;

  struct Seller {
    address sellerAddress;  //竞标者的账户地址
    uint sellerProvide;   //竞标者要出售的电量
    bytes32 priceHash;    //密封报价
    uint price;     //价格
    bool valid;     //该竞标的有效性（验证哈希）
    uint sellerDeposit;   //需缴纳的保证金
  }
  mapping(uint=>Seller[]) List; //记录每一笔购电申请的竞标者。 key:申购ID，value:该申购下所有的竞标者竞标信息。

/*--------------function here------------------------------------------------------*/

/*-------------add here------------------------------------------------------------*/

//得到当前合约的余额
    function getBalance() constant public returns (uint) {
        return this.balance;//0
    }

    //向当前合约存款
    function deposit() payable returns(address addr, uint amount, bool success){
        //msg.sender 全局变量，调用合约的发起方
        //msg.value 全局变量，调用合约的发起方转发的货币量，以wei为单位。
        //send() 执行的结果
        return (msg.sender, msg.value, this.send(msg.value));
    }

  //得到系统中所有的  可报价的  申购请求   返回（申购ID，需购买电量，竞拍开始时间，密封报价结束时间，结算时间，状态，数量方便前端截取）
  function getAllEnabledPurchaserRequest() constant public returns (uint[10],uint[10],uint[10],uint[10],uint[10],uint[10],uint) {
    uint i=0;
    uint j=0;
    uint[10] memory requestID;
    uint[10] memory powerExpected;
    uint[10] memory auctionStart;
    uint[10] memory biddingEnd;
    uint[10] memory revealEnd;
    uint[10] memory status;
    for(i=0; i<purchases.length ;i++)
    {
        if (now > purchases[i].biddingEnd) {
          continue;
        }
        requestID[j] = i;
        powerExpected[j] = purchases[i].powerExpected;
        auctionStart[j] = purchases[i].auctionStart;
        biddingEnd[j] = purchases[i].biddingEnd;
        revealEnd[j] = purchases[i].revealEnd;
        status[j++] = purchases[i].status;
    }
    return(requestID,powerExpected,auctionStart,biddingEnd,revealEnd,status,j);
  }
  /*
  struct OwnBidRecord {
    uint requestID;
    uint sellerProvide;
    uint price;
    uint sellerDeposit;
    uint status;
  }
  */

//交易结算（申购ID），选择合适的多个售电方，可能多个  成功true,失败false  并退还保证金
  function transactionAccount(uint requestID) public returns(bool) {
    require( sortPrice(requestID) );
    Seller [] memory sellers = List[requestID];
    
    uint i=0;
    uint left = purchases[requestID].powerExpected;
    for(i=0;i<sellers.length;i++)
    {
        if(sellers[i].valid == false){
            continue;
        }
        else if(sellers[i].sellerProvide <= left) {
            sellers[i].sellerAddress.transfer(sellers[i].sellerProvide * sellers[i].price);
            purchases[requestID].purchaserDeposit -= sellers[i].sellerProvide * sellers[i].price;
            left = left - sellers[i].sellerProvide;
            changeElec(purchases[requestID].purchaserAddress,sellers[i].sellerAddress,sellers[i].sellerProvide);
        }
        else if(sellers[i].sellerProvide > left) {
            sellers[i].sellerProvide = sellers[i].sellerProvide - left;
            sellers[i].sellerAddress.transfer(sellers[i].sellerProvide * sellers[i].price);
            purchases[requestID].purchaserDeposit -= sellers[i].sellerProvide * sellers[i].price;
            left = 0;
            changeElec(purchases[requestID].purchaserAddress,sellers[i].sellerAddress,sellers[i].sellerProvide);
        }
    }
    //退售电方保证金
    for(i=0;i<sellers.length;i++) {
        if(sellers[i].valid == true) {
            sellers[i].sellerAddress.transfer(sellers[i].sellerDeposit);
        }
    }
    //退购电方保证金
    purchases[requestID].purchaserAddress.transfer(purchases[requestID].purchaserDeposit);
    purchases[requestID].status = 4;
    return true;
  }

  //对单价进行排序，选择合适的售电者
  function sortPrice (uint requestID) internal returns(bool )  {
    uint i=0;
    uint j=0;
    uint temp=0;
    uint n = List[requestID].length;
    
    for( i=0;i<n-1;i++) {
        for(j=0;j<n-1-i;j++) {
            if( List[requestID][j].price >  List[requestID][j+1].price) {
                temp = List[requestID][j].price;
                List[requestID][j].price = List[requestID][j+1].price;
                List[requestID][j+1].price = temp;
            }
        }
    }
    return true;
  }
  
  //改变电价
  function changeElec(address buyerAddress,address sellerAddress,uint amount) internal {
      uint i=0;
      for(i=0;i<users.length;i++) {
          if(users[i].userAddress == buyerAddress) {
              users[i].value += amount;
          }
          else if(users[i].userAddress == sellerAddress) {
              users[i].value -= amount;
          }
      }
  }

  function() payable { }

/*----------------add end----------------------------------------------------------*/

  //构造函数，记录合约拥有者，即管理员
  function PowerTrade() {
    owner = msg.sender;
  }

  //删除用户（用户ID）  只有合约拥有者可删除用户
  function deleteUser(uint userID) returns (bool){
    if(msg.sender != owner) {
      return false;
    }
    if(userID > users.length-1) {
      return false;
    }
    users[userID].valid = false;
    return true;
  }

  //验证用户合法性（用户地址）  是不是本系统的合法用户
  function verifyUser(address userAddress) public constant returns(bool) {
    uint i=0;
    for(i=0; i<users.length ;i++) {
      if(users[i].userAddress == userAddress && users[i].valid == true) {
        return true;
      }
    }
    return false;
  }
  //向系统中添加新用户（用户的电量），成功true，失败false
  function addUser(uint power) public returns (bool) {
    uint i=0;
    //如果该用户已经注册过，返回false
    for(i=0; i<users.length ;i++) {
      if( users[i].userAddress == msg.sender ) {
        return false;
      }
    }
    users.push( User(msg.sender,power,true) );
    return true;
  }

  //购电方发布交易请求（需要购买的电量），成功true,失败false
  function releaseRequest(uint powerExpected,uint endTime) payable returns (bool) {
    if( verifyUser(msg.sender) == false) {
      return false;
    }
    uint purchaserDeposit = powerExpected * 5;  //默认保证金等于要购买的电量
    
    var (addr, amount, success) = deposit();
    if(!success)
      return false;
    
    purchases.push( Purchase(msg.sender,powerExpected,purchaserDeposit,now,now+endTime/2,now+endTime,1) );

    return true;
  }

  //售电方密封报价（申购ID，要出售的电量，密封报价），成功true,失败false
  function sendEncryptPrice(uint requestID,uint sellerProvide,uint sellerDeposit,bytes32 hashValue) public payable returns (bool) {
    if(verifyUser(msg.sender)==false) {
      return false;
    }
    //密封报价阶段是否结束
    if(sendEncryptPriceEnd(requestID) == true) {
      return false;
    }


    /*add statr*/
    var (addr, amount, success) = deposit();
    if(!success)
      return false;
    /*add end*/

    List[requestID].push( Seller(msg.sender,sellerProvide,hashValue,0,false,sellerDeposit) );
    return true;
  }

  //密封报价是否截止（申购ID），截止true，未截止false
  function sendEncryptPriceEnd(uint requestID) public constant returns (bool) {
    if(now < purchases[requestID].biddingEnd) {
      return false;
    }
    else {
      return true;
    }
  }

  //公开密封报价（申购ID,真实报价和随机字符串，真实报价）售电方发送后，及时验证哈希  成功true,失败false
  function sendRealPrice(uint requestID,string pricerandomString,uint price) public returns (bool) {
    uint i=0;
    if( verifyUser(msg.sender) == false) {
      return false;
    }
    //公开报价是否结束
    if( sendRealPriceEnd(requestID) == true ) {
      return false;
    }

    for(i=0; i<List[requestID].length ;i++) {
      if(List[requestID][i].sellerAddress == msg.sender) {  //找到该用户的报价
        if( List[requestID][i].priceHash == sha3(pricerandomString) ) {
            List[requestID][i].valid = true;
            List[requestID][i].price = price;
            return true;
        }
        else {
          List[requestID][i].valid = false;
          return false;
        }
      }
    }
    return false;
  }

  //公开密封报价是否结束（申购ID）  （结算时间）结束true,未结束false
  function sendRealPriceEnd(uint requestID) public constant returns (bool) {
    if(now < purchases[requestID].revealEnd) {
      return false;
    }

    return true;
  }

  //得到系统中所有的申购请求   返回（申购ID，需购买电量，保证金，竞拍开始时间，密封报价结束时间，结算时间，状态）
  function getAllPurchaserRequest() constant public returns (uint[10],uint[10],uint[10],uint[10],uint[10],uint[10],uint[10]) {
    uint i=0;
    uint j=0;
    uint[10] memory requestID;
    uint[10] memory powerExpected;
    uint[10] memory purchaserDeposit;
    uint[10] memory auctionStart;
    uint[10] memory biddingEnd;
    uint[10] memory revealEnd;
    uint[10] memory status;
    for(i=0; i<purchases.length ;i++)
    {
        requestID[j] = i;
        powerExpected[j] = purchases[i].powerExpected;
        purchaserDeposit[j] = purchases[i].purchaserDeposit;
        auctionStart[j] = purchases[i].auctionStart;
        biddingEnd[j] = purchases[i].biddingEnd;
        revealEnd[j] = purchases[i].revealEnd;
        status[j++] = purchases[i].status;
    }
    return(requestID,powerExpected,purchaserDeposit,auctionStart,biddingEnd,revealEnd,status);
  }
  
  //得到系统中购买请求的数量，方便前端截取数组
  function getAllPurchaserNum() constant public returns (uint) {
      return purchases.length;
  }
  /*
  struct OwnBidRecord {
    uint requestID;
    uint sellerProvide;
    uint price;
    uint sellerDeposit;
    uint status;
  }
  */

   //得到自己的所有竞标记录   返回（申购ID，要出售电量，价格，保证金，状态，数量方便前端截取）
  function getOwnBidRecord() constant public returns (uint[10],uint[10],uint[10],uint[10],uint[10],uint) {
    uint i=0;
    uint j=0;
    uint k=0;
    uint[10] memory requestID;
    uint[10] memory sellerProvide;
    uint[10] memory price;
    uint[10] memory sellerDeposit;
    uint[10] memory status;

    for(i=0; i<purchases.length ;i++)
    {
      for(j=0; j<List[i].length ;j++)
      {
        if(List[i][j].sellerAddress == msg.sender)   //竞标者是否是调用者
        {
          requestID[k] = i;
          sellerProvide[k] = List[i][j].sellerProvide;
          price[k] = List[i][j].price;
          sellerDeposit[k] = List[i][j].sellerDeposit;
          status[k++] = purchases[i].status;
        }
      }
    }
    return(requestID,sellerProvide,price,sellerDeposit,status,k);
  }
  

  /*
  struct OwnPurchaseRuquest {
    uint powerExpected;
    uint purchaserDeposit;
    uint status;
  }
  */

  //得到自己的所有购买记录    返回（申购ID，要购买的电量，保证金，状态，数量方便前端截取）
  function getOwnPurchaseRuquest() constant public returns(uint[10],uint[10],uint[10],uint[10],uint) {
    uint i=0;
    uint j=0;
    uint[10] memory requestID;
    uint[10] memory powerExpected;
    uint[10] memory purchaserDeposit;
    uint[10] memory status;
    for(i=0; i<purchases.length ;i++)
    {
      if( purchases[i].purchaserAddress == msg.sender ) {   //购买者地址是否是调用者地址
        requestID[j] = i;
        powerExpected[j] = purchases[i].powerExpected;
        purchaserDeposit[j] = purchases[i].purchaserDeposit;
        status[j++] = purchases[i].status;
      }
    }
    return(requestID,powerExpected,purchaserDeposit,status,j);
  }


  function getEBalance() public constant returns(address,uint) {
    uint i=0;
    uint value;
    for(i=0;i<users.length;i++) {
      if(msg.sender == users[i].userAddress) {
        value = users[i].value;
      }
    }
    return (msg.sender,value);
  }
}
