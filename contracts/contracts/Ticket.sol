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

    mapping(uint256 => Details) public ticketDetails;
    struct Details{
        string eventName;
        uint256 eventID;
        uint256 seat;
    }

    address payable vendor = payable(msg.sender);

    function _baseURI() internal pure override returns (string memory) {
        return "http://EventTicket/";
    }

    function buyVendor(address to, uint256 ticketID, uint eventID, string memory nameEvent, uint256 seatNum) public payable{
        require(msg.value >= ticketPrice, "This ticket costs more that paid");
        {
            _safeMint(to, ticketID);
            _setTokenURI(ticketID, nameEvent);
            ticketDetails[ticketID] = Details(nameEvent, eventID, seatNum);
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
