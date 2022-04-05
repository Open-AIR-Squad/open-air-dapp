import React, { Component } from 'react';
import { createOpenAirContract } from '../web3/openAirContract'
import { Tab, Header, Form, Divider } from 'semantic-ui-react'


export class OpenAirComponent extends Component {

  state = {
    openAir: {
      address: 0,
      tokenContractAddress: 'n/a'
    }
  }

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentDidMount() {
    const address = await this.getOpenAirAddress()
    const openAirInstance = await this.getOpenAir(address)
    this.setState({
      openAir: openAirInstance 
    })
  }

  async getOpenAirAddress() {
    var contractAddress = this.props.match.params.address    
    return contractAddress
  }

  async getOpenAir(address) {

    const contract = createOpenAirContract(await this.getOpenAirAddress())
    const creator = await contract.methods.getContractCreator().call()
    const tokenContractAddress = await contract.methods.getTokenContractAddress().call()  
    //const tokenContract = await this.getOpinionToken(tokenContractAddress)
    //cofferBalance = tokenContract.tokenBalance(address)
    const fields = await contract.methods.getFieldNames().call();
    const areas = await contract.methods.getAreaNames(fields[0]).call();
    const speeches = await contract.methods.getSpeeches(fields[0], areas[0]).call();

    return {
      address: address, 
      creator: creator,
      tokenContractAddress: tokenContractAddress,
      fields: fields,
      currentField: fields[0],
      areas: areas,
      currentArea: areas[0],
      speeches: speeches
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
          <Header as='h6'>Fields: {this.state.openAir.fields}</Header>
          <Header as='h6'>Areas: {this.state.openAir.areas} </Header>
          <Header as='h6'>Speeches: {this.state.openAir.speeches}</Header>          
        </div>
        <Divider horizontal></Divider>
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

  async onSubmit(event) {
    /*
    const accounts = await web3.eth.getAccounts()
    const amount = web3.utils.toWei(
      this.state.contributionAmount,
      'ether'
    )
    const contract = createContract(this.getCampaignAddress())
    await contract.methods.contribute().send({
      from: accounts[0],
      value: amount
    })

    const campaign = this.state.campaign
    campaign.totalCollected = Number.parseInt(campaign.totalCollected) +  Number.parseInt(amount)

    this.setState({ campaign: campaign })
    */
  }

}