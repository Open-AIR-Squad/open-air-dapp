import { web3 } from "./web3"
//import openAirAbi from "./openAirAbi"
import OpenAir from '../ethereum/build/contracts/OpenAir.json'
//import { OpenAir } from "../components/OpenAir";

export function createOpenAirContract(contractAddress) {
    let openAirInstance = new web3.eth.Contract(OpenAir.abi, contractAddress);

    return openAirInstance;
}