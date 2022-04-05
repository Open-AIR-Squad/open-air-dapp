import React, { Component } from 'react';
import { createOpenAirContract } from '../web3/openAirContract'
import { Tab, Header, Form } from 'semantic-ui-react'


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
    const address = await this.getOpenAirAddress()
    const currentOpenAir = await this.getOpenAir(address)
    this.setState({
      openAir: currentOpenAir
    })
  }

  async getOpenAirAddress() {
    var contractAddress = this.props.match.params.address    
    return contractAddress
  }

  async getOpenAir(address) {

    const contract = createOpenAirContract(await this.getOpenAirAddress())

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
      fields: fields,
      currentField: fields[0],
    }
  }

  render() {
    return (
      <div>
        <Header as='h1'>OPEN AIR</Header>
        <div className="ui divider"></div>
        <div>
          <Header as='h6'>Contract address: {this.state.openAir.address}</Header>
          <Header as='h6'>contract creator: {this.state.openAir.creator} </Header>
          <Header as='h6'>Opinion Token contract address: {this.state.openAir.tokenContractAddress}</Header>
        </div>
        <div>
          <Form className='formStyle'>
            <Form.Input fluid label='Title' placeholder='Title' />
            <Form.TextArea placeholder='...' />
            <Form.Button>Submit</Form.Button>
          </Form>
        </div>
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