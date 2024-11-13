// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./PriceConverter.sol";

// Eth Gas price = 18 gwei
// Creation cost: 852846 gas / 15351228 gwei / $16.69
// Creation cost: 834167 gas / 15015006 gwei / $16.32 => after I added constant
// Creation cost: 810600 gas / 14590800 gwei / $15.86 => after made variable immutable
// Creation cost: 785482 gas / 14138676 gwei / $15.37 => after adding error NotOwner()

error FundMe__NotOwner();

// Interfaces, Libraries, Contracts

/** @title A contract for crowd funding
 *  @author iosifv
 *  @notice
 *  @dev
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables!
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 5 * 1e18;

    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    function fund() public payable {
        // require(getConversionRate(msg.value) >= MINIMUM_USD, "Didn't send enough!");
        require(
            // Cool thing here is that msg.value is the first parameter of getConversionRate()
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough!"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function minimumInEth() public view returns (uint256) {
        return MINIMUM_USD.getConversionRate(s_priceFeed);
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        // reset the array of funders:
        // initialise the variable with a new address array of 0 elements
        s_funders = new address[](0);

        // withdraw the funds in 3ways: transfer / send / call

        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed!");

        // call
        (
            bool callSuccess, /* bytes memory dataReturned */

        ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Transfer failed!");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory...
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Transfer failed!");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
