// SPDX-License-Identifier: MIT

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

string constant name = "EventTicket";

string constant symbol = "ETCK";

contract Ticket is ERC721(name, symbol), Ownable, AccessControl, ERC721Enumerable {
    bytes32 public constant VERIFIED_ROLE = keccak256("VERIFIED"); // hash a USER as a role constant
    bytes32 public constant SCANNER_ROLE = keccak256("SCANNER"); //Ticket scanner role
    constructor() {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    //grantRole(DEFAULT_ADMIN_ROLE, account);
    using Counters for Counters.Counter;
    Counters.Counter private ticketIDs;
    Counters.Counter private eventIDs;

    uint256 public ticketPrice = 1 ether;// this can be made to change based on eventID in future

    mapping(uint256 => Details) public ticketDetails;
    struct Details{
        string eventName;
        uint256 eventID;
        uint256 seat;
        bool used;
    }

    mapping(uint256 => Events) public eventDetails;
    struct Events{
        string eventName;
        uint256 eventID;
        uint256 seatsAvailable;
        bool soldOut;
        bool presale;
    }

    address payable vendor = payable(msg.sender);


    function addEvent(string memory nameEvent, uint256 seats, bool onPresale) public onlyOwner{ //only vendor(contract owner) can call function
        require(msg.sender == vendor, "You are not the ticket vendor");
        eventIDs.increment();
        uint256 eventID = eventIDs.current();
        eventDetails[eventID] = Events(nameEvent, eventID, seats, false, onPresale);
    }


    function endPreSale(uint256 eventID) public onlyOwner{ //only vendor(contract owner) can call function
        require(msg.sender == vendor, "You are not the ticket vendor");
        eventDetails[eventID].presale = false;
    }

    function verified(address user) public view returns (bool){
        if(balanceOf(user) >= 1){
            return true;
        }
        return false;
    }

    function addScanner(address newScanner) public onlyOwner{
        grantRole(SCANNER_ROLE, newScanner);
    }
    function scanTicket(uint ticketID, uint eventIDAttending) public {
        require(hasRole(SCANNER_ROLE, msg.sender), "Not an event ticket scanner");
        require(ticketDetails[ticketID].used == false, "Ticket already scanned INVALID");
        require(ticketDetails[ticketID].eventID == eventIDAttending, "Ticket for wrong event");
        ticketDetails[ticketID].used = true;
    }

    function buyVendor(address to, address marketAddress, uint eventID, uint256 seatNum) public payable{
        require(msg.value >= ticketPrice, "This ticket costs more that paid");
        require(eventDetails[eventID].soldOut == false, "This ticket is sold out");
        require(eventDetails[eventID].presale == false, "This ticket is on presale still");
        require(eventDetails[eventID].eventID != 0, "Not a valid ticket to purchase");

        ticketIDs.increment();
        uint256 ticketID = ticketIDs.current();//auto increments id is gas efficient compared to enumerate approach
        {
            _safeMint(to, ticketID);
            ticketDetails[ticketID] = Details(eventDetails[eventID].eventName, eventID, seatNum, false);
            setApprovalForAll(marketAddress, true);

            eventDetails[eventID].seatsAvailable = eventDetails[eventID].seatsAvailable - 1; //update remaining seats
            if (eventDetails[eventID].seatsAvailable == 0){
                eventDetails[eventID].soldOut = true;
            }
        }
    }

    //buy preowned //transferfrom //approve functions

    //sell require msg.sender to be the owner

    function joinPreSale(address to, address marketAddress, uint eventID, uint256 seatNum) public payable{
        require(msg.value >= ticketPrice, "This ticket costs more that paid");
        require(eventDetails[eventID].soldOut == false, "This ticket is sold out");
        require(eventDetails[eventID].presale == true, "This ticket is on presale still");
        require(verified(msg.sender) == true, "You are not a verified user");
        require(eventDetails[eventID].eventID != 0, "Not a valid ticket to purchase");

        ticketIDs.increment();
        uint256 ticketID = ticketIDs.current();//auto increments id is gas efficient compared to enumerate approach
        {
            _safeMint(to, ticketID);
            ticketDetails[ticketID] = Details(eventDetails[eventID].eventName, eventID, seatNum, false);
            setApprovalForAll(marketAddress, true);

            eventDetails[eventID].seatsAvailable = eventDetails[eventID].seatsAvailable - 1; //update remaining seats
            if (eventDetails[eventID].seatsAvailable == 0){
                eventDetails[eventID].soldOut = true;
            }
        }
    }


    function rewardHolder(address user, string memory rewardName) public onlyOwner{
        require(verified(user) == true, "Not a verified user");
        ticketIDs.increment();
        uint256 ticketID = ticketIDs.current();//auto increments id is gas efficient compared to enumerate approach
        _safeMint(user, ticketID);
        ticketDetails[ticketID] = Details(rewardName, 0, 0, false);
    }

    function vendorWithdraw() public onlyOwner payable{ //only vendor(contract owner) can call function
        require(msg.sender == vendor, "You are not the ticket vendor");
        selfdestruct(vendor);
    }


    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
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

//contract Market is Ownable{
//  function buyPreowned(address ticketAdd, address to){

//}
//}
contract TicketMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.1 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
        return idToMarketItem[marketItemId];
    }

    //Set approvall must be called first
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        //require(msg.value >= listingPrice, "Price must be equal to listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] =  MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price
        );
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price
        );
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable{
        //uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == 1 ether, "Please submit the asking price in order to complete the purchase");
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].seller.transfer(msg.value);
        idToMarketItem[itemId].owner = payable(msg.sender);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
    //not needed
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}
