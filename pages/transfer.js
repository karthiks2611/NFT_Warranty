import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'


import {
  nftaddress, nftmarketaddress
} from '../config'

import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"

export default function MyAssets() {
    const [formInput, updateFormInput] = useState({  pno: '' })

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyWarranty()
    
   
    const items = await Promise.all(data.map(async i => {
      const tokenURI = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let item = {
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        period: i.period,
        pno: i.pno.toNumber(),
        name: meta.data.name,
        image: meta.data.image,
        tokenURI
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function transferWarranty(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let address = formInput.address;

    const tokencontract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const approve = await tokencontract.giveResaleApproval();
    await approve.wait();
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    const data = await marketContract.transferWarranty(nftaddress, nft.tokenId, address);
    
    await data.wait();
   
    loadNFTs();
    
  }
  
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl text-center">No Active Warranties owned</h1>)
  
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <p className="text-gray-400">Product Number: {nft.pno}</p>
                  <input 
                        placeholder="Address to Transfer"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, address: e.target.value })}
                />
                </div>
                
                <div className="p-4 bg-white" >
                  <button className="mt-4 w-full bg-blue-500 text-yellow-400 font-bold py-2 px-12 rounded" onClick={() => transferWarranty(nft)}>Transfer Warranty</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}