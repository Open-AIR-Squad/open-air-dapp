import React, { Component } from 'react';
import { createOpenAirContract } from '../web3/openAirContract'
import { web3 } from '../web3/web3'
import { Tab, Header } from 'semantic-ui-react'

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
    //contractAddress = OpenAir.networks[networkId].address;
    
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
          <h1>Open-Air Speech Platform</h1>
          <Header as='h5'>Contract address: {this.state.openAir.address}</Header>
          <Header as='h5'>contract creator: {this.state.openAir.creator} </Header>
          <Header as='h5'>Opinion Token contract address: {this.state.openAir.tokenContractAddress}</Header>
          <h2>Number of Fields: {this.state.openAir.fields}</h2>
          <h2>Current Field : {this.state.openAir.currentField} </h2>
          <Tab panes={this.fieldPanes()} />
      </div>
    );
  }

  fieldPanes() {
    /*
      return this.state.openAir.fields.map((field) => ({ 
        menuItem: field, 
        render: () => <Tab.Pane> {field} Content</Tab.Pane> 
      }))
    */
    const panes = [
      { menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
      { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
      { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
    ]  
    return panes
  }



}