import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import metacoin_artifacts from '../../build/contracts/PowerTrade.json'

var PowerTrade = contract(metacoin_artifacts);
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
PowerTrade.setProvider(provider);
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));  

//var contract_address ="0x1550add201927b9c18040c9576d3bd52ba221f9e";

/*function showRequest()
{

	var table = document.getElementById("info");
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
		newcell.style.width = "400";
		newcell.align="center";
	}
        var x=table.rows[0].cells;
	x[0].innerHTML="ID";
        x[1].innerHTML="电量";
	x[2].innerHTML="竞拍开始时间";
	x[3].innerHTML="密封报价结束时间";
	x[4].innerHTML="结算时间";
	x[5].innerHTML="状态";
        //alert(f[6]);
        for (;i<f[6];i++)
        {
		var tableRow= table.insertRow(-1); //firefox need -1
                //申购ID，需购买电量，竞拍开始时间，密封报价结束时间，结算时间，状态，||数量
 		for (j=0;j<6;j++)
           	{
			var newcell = tableRow.insertCell(-1);
			newcell.style.width = "400";
			newcell.align="center";
		}
                var x=table.rows[i+1].cells;
                for (j=0;j<6;j++)
                {
			var result = f[j];

			//alert(result[i]);
			if( j==2 || j==3 || j==4) {
				var value = JSON.stringify(result[i]);
				value = value.substring(1,value.length-1);
				var value_int = parseInt(value)+8*3600;
				var d = new Date(value_int * 1000);
				x[j].innerHTML=d.toISOString()
				

			}
			else{
				x[j].innerHTML=JSON.stringify(result[i]);
			}			
		}			
	}
	})});

	return 1;
}


	var request = new Object();  
        request = showRequest(); 
       //alert(web3.eth.accounts[0]);*/
        document.getElementById("sname").value = web3.eth.accounts[0];
       

document.getElementById("login_bt").onclick =function login(){
	var sname = document.getElementById("sname").value;	//获取用户地址
        var ebal = document.getElementById("ebal").value
	var html = "./main.html?sname=" + sname+ "&ebal=" + ebal;
                    
		window.open(html);
}
