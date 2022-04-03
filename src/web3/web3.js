import Web3 from 'web3'

//export const web3 = new Web3(window.ethereum.currentProvider)

export const web3 = new Web3((new Web3(window.ethereum)).currentProvider)




