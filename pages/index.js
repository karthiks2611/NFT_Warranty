import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {useRouter} from 'next/router'


import {
  nftaddress, nftmarketaddress
} from '../config'

import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import { Router } from 'next/router'
export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  const router = useRouter()
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/hZpUZQ9ZA2HqMCpj84Xb1abhgdYvtMbl`)
    const tokencontract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketcontract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider)
    const data = await marketcontract.fetchWarranty()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokencontract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let item = {
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        period: i.period.toNumber(),
        pno: i.pno.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
      
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId)
    await transaction.wait()
    
    const tokencontract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const approve = await tokencontract.giveResaleApproval();
    await approve.wait();
    loadNFTs()

    
  }


  if (loadingState === 'loaded' && !nfts.length) return (
  <h1 className="px-20 py-10 text-3xl text-center">No Items in Marketplace</h1>)
  
  
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '190px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                    <br></br>
                    
                    <p className="text-gray-400">Product Number: {nft.pno}</p>
                    <br></br>
                    <p className="text-gray-400">Warranty Period: {nft.period} Months</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <button className="mt-4 w-full bg-blue-500 text-yellow-400 font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}