const { expect } = require("chai");

describe("NFTMarket", function() {
    it("Should create and execute Warranty transfers", async function(){
        const Market = await ethers.getContractFactory("NFTMarket")
        const market =  await Market.deploy()
        await market.deployed();
        const marketAddress = market.address;

        const NFT = await ethers.getContractFactory("NFT")
        const nft = await NFT.deploy(marketAddress)
        await nft.deployed();
        const nftContractAddress = nft.address;

        await nft.createToken("https://www.mytokenlocation.com")
        await nft.createToken("https://www.mytokenlocation2.com")

        await market.createWarrantyItem(nftContractAddress, 1)
        await market.createWarrantyItem(nftContractAddress, 2)

        const [_, clientAddress] = await ethers.getSigners()

        await market.connect(clientAddress).createMarketSale(nftContractAddress, 1);

        let items = await market.fetchWarranty();

        items = await Promise.all(items.map(async i =>{
            const tokenuri  = await nft.tokenURI(i.tokenId)
            let item = {
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                owner: i.owner,
                tokenuri
            }
            return item;
        }))
        console.log('items: ', items);
    });
});