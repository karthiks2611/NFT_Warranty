# Flipkart Grid 4.0 Challenge - Warranty System for Ecommerce using NFTs

This project demonstrates an E-commerce warranty system that uses Non-Fungible Tokens. The tokens act as burnable warranties promoting a more secure and efficient warranty sytsem while simultaneously contributing to a greener and healthier environment.

Run 
```
	yarn install .
```

Also Run this
```
npm install --save-dev "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-chai-matchers@^1.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "@types/mocha@^9.1.0" "@typechain/hardhat@^6.1.2" "hardhat-gas-reporter@^1.0.8" 
"solidity-coverage@^0.7.21" "ts-node@>=8.0.0" "typescript@>=4.5.0"
```

Files to be added:
```
.env
.secret
```

To run this project run the following commands:

```shell
npx hardhat run --network goerli scripts/deploy.js

npm run dev
```

Go to localhost:3000


After running command 1 copy the generated address and paste them in the config.js file in root directory.

Note: This deploys the contract in the Goerli Testnet, but it can be deployed in the following networks as well. 
    1. Polygon Mainnet - mainnet
    2. Localhost - localhost
    3. Goerli Test Network - goerli

    To run the project on any other network replace goerli by the key as given below and copy the RPC URL and pass it as an argument to the JSON RPC provider function in the LoadNFTs function defined in index.js.
