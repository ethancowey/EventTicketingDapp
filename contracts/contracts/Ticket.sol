// SPDX-License-Identifier: MIT

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/utils/Strings.sol";

string constant name = "MyToken";

string constant symbol = "MTKN";

contract Ticket is ERC721(name, symbol), ERC721URIStorage, Ownable {

    uint256 public ticketPrice = 1 ether;
    address payable vendor = payable(msg.sender);
    function make(string memory uri) public{
        _safeMint(msg.sender, 111);
        _setTokenURI(111, uri);
    }
    function make2() public{
        _safeMint(msg.sender, 1113);
    }
    function _baseURI() internal pure override returns (string memory) {
        return "http://EventTicket/";
    }


    function buyVendor(address to, uint256 ticketID, string memory uri) public payable{
        require(msg.value >= ticketPrice, "This ticket costs more that paid");
        {
            _safeMint(to, ticketID);
            _setTokenURI(ticketID, uri);
        }
    }
    function vendorWithdraw() public payable{
        require(msg.sender == vendor, "You are not the ticket vendor");
        selfdestruct(vendor);
    }
    //required overide by solidity from openzepplin docs
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    //required overide by solidity from openzepplin docs
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
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
