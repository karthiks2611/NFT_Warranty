// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    
    constructor(){
        owner = payable(msg.sender);
    }
    struct WarrantyItem {
        uint itemId;
        address nftWarranty;
        uint256 tokenId;
        uint256 period;
        uint256 pperiod;
        uint256 pno;
        address payable seller;
        address payable owner;
        uint256 claim;
        bool activated;
    }
    
    mapping(uint256 => WarrantyItem) private idToWarrantyItem;

    event WarrantyCreated (
        uint indexed itemId,
        address indexed nftWarranty,
        uint256 indexed tokenId,
        uint256 period,
        uint256 pperiod,
        uint256 pno,
        address seller,
        address owner,
        uint256 claim,
        bool activated
    );

    function createWarrantyItem(
        address nftWarranty,
        uint256 tokenId,
        uint256 period,
        uint256 pno
    ) public payable nonReentrant{
        require(msg.sender == 0x153fF7D5f5f21165750496826C0a8eB5d8a643bC, "Transaction Rejected! Account Not Authorized to Create NFT"); 
        _itemIds.increment();
        uint256 itemId = _itemIds.current();


        idToWarrantyItem[itemId] = WarrantyItem(
            itemId,
            nftWarranty,
            tokenId,
            period,
            0,
            pno,
            payable(msg.sender),
            payable(address(0)),
            0,
            false
        );

        IERC721(nftWarranty).transferFrom(msg.sender, address(this), tokenId);


        emit WarrantyCreated(
            itemId,
            nftWarranty,
            tokenId,
            period,
            0,
            pno,
            msg.sender,
            address(0),
            0,
            false
        );
    }
    
    function createMarketSale(
        address nftWarranty, 
        uint256 itemId
    ) public payable nonReentrant{
                         
        uint tokenId = idToWarrantyItem[itemId].tokenId;

        IERC721(nftWarranty).transferFrom(IERC721(nftWarranty).ownerOf(tokenId), msg.sender, tokenId);
        idToWarrantyItem[itemId].owner = payable(msg.sender);
        idToWarrantyItem[itemId].period = idToWarrantyItem[itemId].period*30 days;
        idToWarrantyItem[itemId].pperiod = idToWarrantyItem[itemId].pperiod + block.timestamp;
        //below line updates the expiry date corresponding to the time of first Buy transaction
        idToWarrantyItem[itemId].period = idToWarrantyItem[itemId].period + block.timestamp; 
        idToWarrantyItem[itemId].activated = true;
        _itemsSold.increment();
    }

    function claimWarranty(address nftWarranty, uint256 itemId) public returns(bool ){
        
        
        address dead_address = 0x000000000000000000000000000000000000dEaD;

        
        if( idToWarrantyItem[itemId].period < block.timestamp)
        {
            uint tokenId = idToWarrantyItem[itemId].tokenId;
            IERC721(nftWarranty).transferFrom(msg.sender, dead_address, tokenId);
            idToWarrantyItem[itemId].owner = payable(dead_address);
            return false;
        }
        else{
            idToWarrantyItem[itemId].claim += 1;
            return true;
        }
    }

    function transferWarranty(address nftWarranty, uint256 itemId, address to) public payable nonReentrant{
        
        uint tokenId = idToWarrantyItem[itemId].tokenId;

        IERC721(nftWarranty).transferFrom(msg.sender, to, tokenId);
        idToWarrantyItem[itemId].owner = payable(to);
        
        
    }

    function checkOwner(uint256 prodno) public view returns(WarrantyItem[] memory){
       uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i<totalItemCount; ++i){
            if(idToWarrantyItem[i+1].pno == prodno){
                itemCount += 1;
            }
        }

        WarrantyItem[] memory items = new WarrantyItem[](itemCount);
        for(uint i=0; i<totalItemCount; i++){
            if(idToWarrantyItem[i+1].pno == prodno){
                uint currentId = idToWarrantyItem[i+1].itemId;
                WarrantyItem storage currentItem = idToWarrantyItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchWarranty() public view returns(WarrantyItem[] memory){
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

      
        WarrantyItem[] memory items = new WarrantyItem[](unsoldItemCount);
        for(uint i=0; i< itemCount; i++){
            if (idToWarrantyItem[i+1].owner == address(0)){
                uint currentId = idToWarrantyItem[i+1].itemId;
                WarrantyItem storage currentItem = idToWarrantyItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyWarranty() public view returns(WarrantyItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i<totalItemCount; ++i){
            if(idToWarrantyItem[i+1].owner == msg.sender){
                itemCount += 1;
            }
        }

        WarrantyItem[] memory items = new WarrantyItem[](itemCount);
        for(uint i=0; i<totalItemCount; i++){
            if(idToWarrantyItem[i+1].owner == msg.sender){
                uint currentId = idToWarrantyItem[i+1].itemId;
                WarrantyItem storage currentItem = idToWarrantyItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    function fetchActivatedWarranty() public view returns (WarrantyItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i<totalItemCount; ++i){
            if(idToWarrantyItem[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        WarrantyItem[] memory items = new WarrantyItem[](itemCount);
        for(uint i=0; i<totalItemCount; i++){
            if(idToWarrantyItem[i+1].activated == true){
                uint currentId = idToWarrantyItem[i+1].itemId;
                WarrantyItem storage currentItem = idToWarrantyItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;

    }
    

}

