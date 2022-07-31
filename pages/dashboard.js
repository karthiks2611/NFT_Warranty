import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'


import {
  nftaddress, nftmarketaddress
} from '../config'

import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"



export default function check() {

    const [formInput, updateFormInput] = useState({  pno: '' })

  let [nfts, setNfts] = useState([])
  let [loadingState, setLoadingState] = useState('not-loaded')
  
    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
    
        const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        
        let pno = formInput.pno;
        pno = Number(pno)
  
        const data = await marketContract.checkOwner(pno)
     
       
        
        const items = await Promise.all(data.map(async i => {
          const tokenURI = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenURI)
          let item = {
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            period: i.period.toNumber(),
            pno: i.pno.toNumber(),
            owner: i.owner,
            name: meta.data.name,
            claim: i.claim.toNumber(),
            image: meta.data.image,
            tokenURI
          }
          

          return item
        }))
        
        setNfts(items)
        setLoadingState('loaded') 
        if(Object.keys(data).length === 0){

          setLoadingState("no-loaded")
        }
        
        
      }
      
      if (loadingState === 'loaded' && nfts.length){
        return (
        <div className="flex justify-center">
          <div className="w-1/2 flex flex-col  pb-12">
            
        <input 
          placeholder="Enter Product ID"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, pno: e.target.value })}
        />
        <button onClick={loadNFTs} className="font-bold mt-4 bg-blue-500 text-yellow-500 rounded p-4 shadow-lg">
          Check Ownership
        </button>
           <br></br>
            <div className="gap-4 pt-4">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <img src={nft.image} />
                    <div className="p-1">
                      <p style={{ height: '34px' }} className="text-2xl font-semibold">{nft.name}</p>
                      <div style={{ overflow: 'hidden' }}>
                        <p className="text-gray-700">{nft.description}</p>
                      <br></br>
                        <p className="text-gray-700">Owner Address: {nft.owner}</p>
                       <br></br>
                        <p className="text-gray-700">Product Number: {nft.pno}</p>
                        <br></br>
                        <p className="text-gray-700">Seller Address: {nft.seller}</p>
                        <br></br>
                        <p className="text-gray-700">Warranty Claimed: {nft.claim} times</p>
                      </div>
                    </div>
                  </div>
                ))
              }
          </div>
        </div>
        </div>
      )
    }
    if(loadingState === 'not-loaded'){ 
      
      return (
      <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Enter Product ID"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, pno: e.target.value })}
        />
        <button onClick={loadNFTs} className="font-bold mt-4 bg-blue-500 text-yellow-500 rounded p-4 shadow-lg">
          Check Ownership
        </button>
        
      </div>
    </div>
    )
    }
    if(loadingState === "no-loaded"){
      
      return (
      <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Enter Product ID"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, pno: e.target.value })}
        />
        <button onClick={loadNFTs} className="font-bold mt-4 bg-blue-500 text-yellow-500 rounded p-4 shadow-lg">
          Check Ownership
        </button>
        <br></br>
        <p className="text-gray-900 text-center">Counterfeit Product / Unregistered Product</p>
      </div>
    </div>)
      }
    
      
  
   
    }