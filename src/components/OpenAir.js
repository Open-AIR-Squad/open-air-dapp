import React, { Component } from 'react';
import { createOpenAirContract } from '../web3/openAirContract'
import { web3 } from '../web3/web3'

export class OpenAir extends Component {

  state = {
    openAir: {
      address: 0,
      tokenContractAddress: 'n/a'
    }
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    const address = this.getOpenAirAddress()
    const currentOpenAir = await this.getOpenAir(address)
    this.setState({
      openAir: currentOpenAir
    })
  }

  getOpenAirAddress() {
    var contractAddress = this.props.match.params.address
    
    //const networkId = await web3.eth.net.getId();
    //const contractAddress = OpenAir.networks[networkId].address;
    
    return contractAddress
  }

  async getOpenAir(address) {

    const contract = createOpenAirContract(this.getOpenAirAddress())

    var tokenContractAddress = 0
    try {
      tokenContractAddress = await contract.methods.getTokenContractAddress().call()  
    } catch (err) {
      console.log(err)
    }

    return {
      address: address,   
      tokenContractAddress: tokenContractAddress
    }
  }

  render() {
    return (
      <div>
          <h1>Hello, OpenAir at {this.state.openAir.address}</h1>
          <h1>Hello, OpenAir at {this.props.match.params.address}</h1>
          <h1>tokenContractAddress = {this.state.openAir.tokenContractAddress} </h1>
      </div>
    );
  }

}