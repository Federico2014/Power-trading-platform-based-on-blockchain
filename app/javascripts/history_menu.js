import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import metacoin_artifacts from '../../build/contracts/PowerTrade.json'



function GetRequest() {  
	var url = parent.window.location.search; //»ñÈ¡urlÖÐ"?"·ûºóµÄ×ÖŽ®  
	var theRequest = new Object();  
	if (url.indexOf("?") != -1) {  
   	    	var str = url.substr(1);  
   	//alert(str);  
   	    	var strs = str.split("&");  
   		for (var i = 0; i < strs.length; i++) {  
      			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);  
       		}  
   	}  
    	return theRequest;  
}  
var request = new Object();  
request = GetRequest();  
var saddr = request['sname'];  
var ebal = request['ebal']; 
//alert(saddr);alert(ebal);  
//document.getElementById("saddr").innerHTML = saddr;
//document.getElementById("sbal").innerHTML = ebal;
var PowerTrade = contract(metacoin_artifacts);
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
PowerTrade.setProvider(provider);
//var contract_address ="0x1550add201927b9c18040c9576d3bd52ba221f9e";

var user_account = saddr;
    

document.getElementById("buy_info").onclick = function changeInfo1()
{
	var table = document.getElementById("info_table");
	var trs=table.getElementsByTagName("tr");
        var c=trs.length;
        while (--c>=0){
        	trs[c].parentNode.removeChild(trs[c]);
	}
 	PowerTrade.deployed().then(function(i){
		i.getOwnPurchaseRuquest.call({from:user_account,gas:1314222}).then(function(f){
               
		//alert(JSON.stringify(f));
        var i = 0;
        var j =0;
        //alert(f[4]);
        var tableRow= table.insertRow(-1); //firefox need -1
        //申购ID，要购买的电量，保证金，状态
 	for (j=0;j<4;j++)
        {
		var newcell = tableRow.insertCell(-1);
		newcell.style.width = "200";
		newcell.align="center";
		newcell.style.color="white";
	}
        var x=table.rows[0].cells;
	x[0].innerHTML="ID";
        x[1].innerHTML="电量";
	x[2].innerHTML="保证金";
	x[3].innerHTML="状态";
        for (i=0;i<f[4];i++)
        {
		var tableRow= table.insertRow(-1); //firefox need -1
                //申购ID，要购买的电量，保证金，状态||数量
 		for (j=0;j<4;j++)
                {
			var newcell = tableRow.insertCell(-1);
			newcell.style.width = "200";
			newcell.align="center";
			newcell.style.color="white";
		}
                var x=table.rows[i+1].cells;
                for (j=0;j<4;j++)
                {
			var result = f[j];
			//alert(result[i]);
			if( j==1 ) 
			{
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				value = value + "度";
				x[j].innerHTML=value;
			}
			else if(j == 3)
			{
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				if( value == "1" )
					x[j].innerHTML= "交易中";
				else
					x[j].innerHTML= "交易结束";
			}
			else	
				x[j].innerHTML= JSON.stringify(result[i]);
		}			
	}
	})});
}

document.getElementById("sell_info").onclick = function changeInfo2()
{
	var table = document.getElementById("info_table");
	var trs=table.getElementsByTagName("tr");
        var c=trs.length;
        while (--c>=0){
        	trs[c].parentNode.removeChild(trs[c]);
	}
//alert("dddd");
 	PowerTrade.deployed().then(function(i){
		i.getOwnBidRecord.call({from:user_account,gas:1314222}).then(function(f){
		//alert(JSON.stringify(f));
	var i = 0;
        var j =0;
	var tableRow= table.insertRow(-1); //firefox need -1
        //申购ID，电量，价格，保证金，状态，
 	for (j=0;j<5;j++)
        {
		var newcell = tableRow.insertCell(-1);
		newcell.style.width = "200";
		newcell.align="center";
		newcell.style.color="white";
	}
        var x=table.rows[0].cells;
	x[0].innerHTML="ID";
        x[1].innerHTML="电量";
	x[2].innerHTML="价格";
	x[3].innerHTML="保证金";
	x[4].innerHTML="状态";
	for (i=0;i<f[5];i++)
        {
		var tableRow= table.insertRow(-1); //firefox need -1
                //申购ID，电量，价格，保证金，状态，||数量
 		for (j=0;j<5;j++)
           	{
			var newcell = tableRow.insertCell(-1);
			newcell.style.width = "200";
			newcell.align="center";
			newcell.style.color="white";
		}
                var x=table.rows[i+1].cells;
                for (j=0;j<5;j++)
                {
			var result = f[j];
			//alert(result[i]);
			if( j== 1)
			{
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				value = value + "度";
				x[j].innerHTML=value;
			}
			else if(j == 2)
			{
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				if( value == "0" )
					x[j].innerHTML= "密封报价";
				else
					x[j].innerHTML= JSON.stringify(result[i]);
			}
			else if(j == 4)
			{
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				if( value == "1" )
					x[j].innerHTML= "交易中";
				else
					x[j].innerHTML= "交易结束";
			}
			else	
				x[j].innerHTML= JSON.stringify(result[i]);
		}			
	}

})});	
}

document.getElementById("sEprice").onclick = function sEPrice(){
	
var requestID = document.getElementById("request_idd").value;
var sprice = document.getElementById("ssprice").value;
var srand = document.getElementById("ssrand").value;
var shash = sprice+srand;
shash = shash.toString();
	PowerTrade.deployed().then(function(i){
	i.sendRealPrice(requestID,shash,sprice,{from:user_account,gas:1314222}).then(function(f){
	console.log(f);})}); 

        PowerTrade.deployed().then(function(i){
	i.sendRealPrice.call(requestID,shash,sprice,{from:user_account,gas:1314222}).then(function(f){
	//alert(JSON.stringify(f));
	if(JSON.stringify(f)=="true")
		alert("公开报价成功");
	else
		alert("公开报价失败");})});  
}

var requestIDSet =  document.getElementById("request_idd_settle").value;
function newEbal()
{
	PowerTrade.deployed().then(function(i){
     		i.getEBalance.call({from:user_account,gas:6500000}).then(function(f){	
				//alert(f[1]);
					//var value = JSON.stringify(f[1]);
					//value = value.substring(1,value.length-1);
					//ebal = f[1];
var html = "./main.html?sname=" + saddr+ "&ebal=" + f[1];         
		window.open(html);
	})}); 	
}

document.getElementById("requestSettle").onclick = function requestSettle(){
     //alert("dfdfdfd");
	var requestID = document.getElementById("request_idd").value;
	PowerTrade.deployed().then(function(i){
     		i.transactionAccount.call(requestID,{from:user_account,gas:6500000}).then(function(f){		       
 	if(JSON.stringify(f) == "true")  
	{
		alert("结算成功");	
		var request = new Object(); 
		//ebal = newEbal();
request = newEbal();
		
	}    })}); 
	PowerTrade.deployed().then(function(i){
     		i.transactionAccount(requestID,{from:user_account,gas:6500000}).then(function(f){		       
 	/*alert(JSON.stringify(f));*/console.log(f);})}); 
//alert("asaaass");
}



