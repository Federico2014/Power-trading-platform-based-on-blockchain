import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import metacoin_artifacts from '../../build/contracts/PowerTrade.json'


var PowerTrade = contract(metacoin_artifacts);
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
PowerTrade.setProvider(provider);

document.getElementById("buy_submit").onclick = function relRequest()
{


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
var user_account = saddr;

    //alert("show time");
    var elec_need = document.getElementById("elec_need").value;
    var time_end = document.getElementById("time_end").value;
    //alert(user_account);//alert(elec_need);alert(time_end);
    /*PowerTrade.deployed().then(function(i){
          i.releaseRequest(parseInt(elec_need),parseInt(time_end),{from:user_account,gas:1314222}).then(function(f){
             alert(JSON.stringify(f));
             if (JSON.stringify(f)=="true")
                  alert("release succeed");
             else if (JSON.stringify(f)=="false")
                  alert("release failed");
     }).then(function(err){console.log(err);})});*/
if(parseInt(elec_need)<=0  ||  parseInt(time_end)<=600)
{
	alert("发布操作失败");
return;
}
	PowerTrade.deployed().then(function(i){i.releaseRequest(elec_need,time_end,{from:user_account,value:elec_need*5,gas:1314222}).then(function(f){console.log(f);})});
    PowerTrade.deployed().then(function(i){i.releaseRequest.call(elec_need,time_end,{from:user_account,value:elec_need*5,gas:1314222}).then(function(f){console.log(f);/*alert(JSON.stringify(f))*/
	if(JSON.stringify(f)=="true")
		alert("发布成功");
	else
		alert("发布失败")})});
    alert("发布操作结束");
}




