pragma solidity ^0.8.7;

contract MyFirstContract {
    uint256 number;
    string[] names;
    mapping(string => uint) public phoneNumbers;

    function changeNumber(uint256 _num) public {
        number = _num;
    }

    function addName(string memory _name) public {
        names.push(_name);
    }

    function addNumber(string memory _name, uint _number) public {
        phoneNumbers[_name] = _number;
    }

    function getNumberMultiplied(uint256 _num) public view returns (uint256) {
        return number * _num;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }

    function getName(uint _index) public view returns (string memory) {
        return names[_index];
    }

    function getNumber(string memory _name) public view returns (uint) {
        return phoneNumbers[_name];
    }

    function getNamesLength() public view returns (uint) {
        return names.length;
    }
}
