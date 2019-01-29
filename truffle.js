// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    }, 
    live: {
      host: "localhost", //本地地址，因为是在本机上建立的节点
      port: 9545,        //Ethereum的rpc监听的端口号，默认是8545
      network_id: '15'    // 自定义网络号
    }
  }
}
