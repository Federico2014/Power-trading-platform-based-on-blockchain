pragma solidity ^0.4.4;

contract HelloWorld {
  uint []T = [1,2,3,4];
  function print() constant returns (string,uint[]) {
    string memory str = "HelloWorld";
    return (str,T);
  }
}
