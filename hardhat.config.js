require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle")

require('dotenv').config();
const fs = require('fs')

// Add private key of the wallet in .secret file
const privateKey = fs.readFileSync(".secret").toString()

// If created in Infura, paste the PROJECT_ID in .env folder
// const projectID = process.env.PROJECT_ID;

// If created in Alchemy, Paste the API_KEY of the testnet, in .env folder
const alch = process.env.API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true
    },
    localhost: {
      allowUnlimitedContractSize: true
    },
    mumbai: {
    url: "https://rpc-mumbai.maticvigil.com/",
    accounts: [privateKey],
    allowUnlimitedContractSize: true
    },
    mainnet:{
      url: "https://polygon-mainnet.infura.io/v3/${projectID}",
      accounts: [privateKey]
    },
    goerli:{
      url: `https://eth-goerli.g.alchemy.com/v2/${alch}`,
      accounts: [privateKey]
    }

  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
