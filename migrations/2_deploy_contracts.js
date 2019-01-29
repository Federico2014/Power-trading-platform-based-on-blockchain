var ConvertLib = artifacts.require("./ConvertLib.sol");
var PowerTrade = artifacts.require("./PowerTrade.sol");
var Transaction = artifacts.require("./Transaction.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  //deployer.link(ConvertLib, Transaction);
  //deployer.deploy(MetaCoin);
  deployer.deploy(PowerTrade);
  deployer.deploy(Transaction);
};
