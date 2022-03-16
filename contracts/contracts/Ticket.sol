// SPDX-License-Identifier: MIT

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

string constant name = "MyToken";

string constant symbol = "MTKN";

contract Ticket is ERC721(name, symbol) {

    uint256 public ticketPrice = 1 ether;
    address payable vendor = payable(msg.sender);
    function make() public{
        _safeMint(msg.sender, 111);
    }


    function buyVendor(address to, uint256 ticketID) public payable{
        require(msg.value >= ticketPrice, "This ticket costs more that paid");
        _safeMint(to, ticketID);
    }
    function vendorWithdraw() public payable{
        require(msg.sender == vendor, "You are not the ticket vendor");
        selfdestruct(vendor);
    }
    //buy ticket from vendor
    //ETH amount
    //safeMint
    //new id

    //Get QR code input id
    //require caller is owner
    //tokenURI function could be used
    //return uri to be made into a qr code

    //Use QR code
    //if uri matches existing ticket
    //burn ticket
}
