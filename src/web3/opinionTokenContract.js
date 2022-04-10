import { web3 } from "./web3"
import OpinionToken from '../truffle/build/contracts/OpinionToken.json'

export function getOpinionTokenInstance(contractAddress) {
    let opinionTokenInstance = new web3.eth.Contract(OpinionToken.abi, contractAddress);

    return opinionTokenInstance;
}