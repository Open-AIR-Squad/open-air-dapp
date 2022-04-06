import { web3 } from "./web3"
import Speech from '../ethereum/build/contracts/Speech.json'


export function getSpeechInstance(contractAddress) {
    let speechInstance = new web3.eth.Contract(Speech.abi, contractAddress);

    return speechInstance;
}