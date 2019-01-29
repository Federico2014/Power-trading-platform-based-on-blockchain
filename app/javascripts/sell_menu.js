import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import metacoin_artifacts from '../../build/contracts/PowerTrade.json'
var PowerTrade = contract(metacoin_artifacts);
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
PowerTrade.setProvider(provider);

document.getElementById("sEprice").onclick = function sEPrice(){
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

//var contract_address ="0x1550add201927b9c18040c9576d3bd52ba221f9e";
    
var user_account = saddr;
var requestID = document.getElementById("request_id").value;
var sellerProvide = document.getElementById("elec_sell").value;
var sprice = document.getElementById("sprice").value;
var srand = document.getElementById("srand").value;
       var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));      
var shash = web3.sha3(sprice+srand);

var deposit = 2 * sprice * sellerProvide;
PowerTrade.deployed().then(function(i){
i.sendEncryptPrice(requestID,sellerProvide,deposit,shash,{from:user_account,value:2*sprice*sellerProvide,gas:1314222}).then(function(f){
console.log(f);})});
PowerTrade.deployed().then(function(i){
i.sendEncryptPrice.call(requestID,sellerProvide,deposit,shash,{from:user_account,value:2*sprice*sellerProvide,gas:1314222}).then(function(f){
alert(JSON.stringify(f));
var value = JSON.stringify(f);
if(value == "true")
alert("密封报价成功");
else 
alert("密封报价失败");})});
alert("??");
}


function showRequest()
{

	var table = document.getElementById("sell_table");
	var trs=table.getElementsByTagName("tr");
        var c=trs.length;
        while (--c>=0){
        	trs[c].parentNode.removeChild(trs[c]);
	}
 	PowerTrade.deployed().then(function(i){
		i.getAllEnabledPurchaserRequest.call().then(function(f){               
		//alert(JSON.stringify(f));
        var i = 0;
        var j =0;
	var tableRow= table.insertRow(-1); //firefox need -1
        //申购ID，需购买电量，竞拍开始时间，密封报价结束时间，结算时间，状态，||数量
 	for (j=0;j<6;j++)
        {
		var newcell = tableRow.insertCell(-1);
		newcell.style.width = "150";
		newcell.align="center";
		newcell.style.color="white";
	}
        var x=table.rows[0].cells;
	x[0].innerHTML="ID";
        x[1].innerHTML="电量";
	x[2].innerHTML="竞拍开始时间";
	x[3].innerHTML="密封报价结束时间";
	x[4].innerHTML="结算时间";
	x[5].innerHTML="状态";
        //alert(f[6]);
        for (i=0;i<f[6];i++)
        {
		var tableRow= table.insertRow(-1); //firefox need -1
                //申购ID，需购买电量，竞拍开始时间，密封报价结束时间，结算时间，状态，||数量
 		for (j=0;j<6;j++)
           	{
			var newcell = tableRow.insertCell(-1);
			newcell.style.width = "100";
			newcell.style.height = "50";
			newcell.align="center";
			newcell.style.color="white";
		}
                var x=table.rows[i+1].cells;
                for (j=0;j<6;j++)
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
			else if(j==2 || j==3 || j==4) {
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				var value_int = parseInt(value)+8*3600;
				var d = new Date(value_int * 1000);
				x[j].innerHTML=d.toISOString();
				/*var x = d.toISOString();
				var y = "  ";
				var z = y+x;
				x[j].innerHTML=z;*/
			}
			else if(j == 5)
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
	return 1;
}


	var requestt = new Object();  
        requestt = showRequest(); 
//alert(requestt);

