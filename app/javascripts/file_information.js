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
        var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));  
        
        var saddr = request['sname'];  
        var ebal = request['ebal']; 
         
	document.getElementById("saddr").innerHTML = saddr;
        //document.getElementById("sbal").innerHTML = ebal;
       
        var PowerTrade = contract(metacoin_artifacts);
        var provider = new Web3.providers.HttpProvider("http://localhost:8545");
        PowerTrade.setProvider(provider);
        
	//var user_account = web3.eth.accounts[0];
	var user_account = saddr;
        alert("正在登录...");
        //alert(user_account);
        PowerTrade.deployed().then(function(i){
             i.addUser(ebal,{from:user_account,gas:1314222}).then(function(f){
             /*alert(JSON.stringify(f));*/console.log(f);})});
	PowerTrade.deployed().then(function(i){
             i.getEBalance.call(user_account,{from:user_account,gas:1314222}).then(function(f){
		document.getElementById("sbal").innerHTML = f[1];
	})});
        PowerTrade.deployed().then(function(i){
             i.verifyUser.call(user_account,{from:user_account,gas:1314222}).then(function(f){
             //alert(JSON.stringify(f));
 	     var valid = JSON.stringify(f);
	             if(valid == "true")
	{
	     var value = JSON.stringify(web3.toWei(web3.eth.getBalance(user_account),"wei"));
	     value = value.substring(1,value.length-1);
             document.getElementById("snum").innerHTML = value + "wei";
	}})});

                    
