import { web3 } from "./web3"
import OpenAir from '../truffle/build/contracts/OpenAir.json'


export function getOpenAirInstance(contractAddress) {
    let openAirInstance = new web3.eth.Contract(OpenAir.abi, contractAddress);

    return openAirInstance;
}