// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract MyContract is ERC721 {
    // When I call my constructor, it will call the parent's constructor too
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol) {
            console.log("Contract Name:   ", name);
            console.log("Contract Symbol: ", symbol);
            console.log("Contract Sender: ", msg.sender);
        }
}