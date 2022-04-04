import React, { Component } from 'react';
import { createOpenAirContract } from '../web3/openAirContract'
import { web3 } from '../web3/web3'

export class OpenAirComponent extends Component {

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
    var fields
    var creator 
    try {
      tokenContractAddress = await contract.methods.getTokenContractAddress().call()  
      fields = await contract.methods.getFieldNames().call()
      creator = await contract.methods.getContractCreator().call()
    } catch (err) {
      console.log(err)
    }

    return {
      address: address,   
      creator: creator,
      tokenContractAddress: tokenContractAddress,
      fields: fields.length,
      currentField: fields[0],
    }
  }

  render() {
    return (
      <div>
          <h1>OpenAirContractAddress: {this.state.openAir.address}</h1>
          <h1>contract creator : {this.state.openAir.creator} </h1>
          <h1>tokenContractAddress : {this.state.openAir.tokenContractAddress} </h1>
          <h1>Number of Fields: {this.state.openAir.fields}</h1>
          <h1>Current Field : {this.state.openAir.currentField} </h1>
      </div>
    );
  }

}