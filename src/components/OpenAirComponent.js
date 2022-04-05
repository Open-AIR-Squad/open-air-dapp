import React, { Component } from 'react';
import { getOpenAirInstance } from '../web3/openAirContract'
import { getOpinionTokenInstance } from '../web3/opinionTokenContract'
import { Header, Form, Divider, Segment, Button, Icon, Label, Tab } from 'semantic-ui-react'


export class OpenAirComponent extends Component {

  state = {
    openAir: {
      address: 'invalid',
      tokenContractAddress: 'n/a',

      userAccount: 'invalid',
      userAccountBalance: 0
    },
    speechTitle: "Title",
    speechContent: "..."
  }

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onParticipate = this.onParticipate.bind(this)
  }

  async componentDidMount() {
    const address = await this.getOpenAirAddress()
    const openAirState = await this.getOpenAirState(address)
    this.setState({
      openAir: openAirState
    })
  }



  async getOpenAirAddress() {
    var contractAddress = this.props.match.params.address    
    return contractAddress
  }

  async getOpenAirState(address) {

    const contract = getOpenAirInstance(address)
    const creator = await contract.methods.getContractCreator().call()
    const tokenContractAddress = await contract.methods.getTokenContractAddress().call()  
    const fields = await contract.methods.getFieldNames().call()
    const areas = await contract.methods.getAreaNames(fields[0]).call()
    const speeches = await contract.methods.getSpeeches(fields[0], areas[0]).call()

    const tokenContract = getOpinionTokenInstance(tokenContractAddress)
    const tokensInCoffer = await tokenContract.methods.balanceOf(address).call()

    let userAccount = this.state.openAir.userAccount
    let userAccountBalance = this.state.openAir.userAccountBalance
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        userAccountBalance = await tokenContract.methods.balanceOf(userAccount).call()
      } catch (error) {
        if (error.code === 4001) {
          alert("User rejected request.")
        }
        alert(error)
      }
    }

    return {
      address: address, 
      creator: creator,
      tokenContractAddress: tokenContractAddress,
      tokensInCoffer: tokensInCoffer,
      fields: fields,
      currentField: fields[0],
      areas: areas,
      currentArea: areas[0],
      speeches: speeches,
      userAccount: userAccount,
      userAccountBalance: userAccountBalance
    }
  }

  render() {
    return (
      <div>
        <Header as='h1' color='blue'>OPEN AIR</Header>
        <div className="ui divider"></div>
        <div>
          {this.iconLabelsField('blue', 'ethereum', 'OpenAir contract address:', this.state.openAir.address)}
          {this.iconLabelsField('blue', 'ethereum', 'OpenAir contract creator:', this.state.openAir.creator)}
 
          {this.iconLabelsField('blue', 'ethereum', 'OpinionToken contract address: ', this.state.openAir.tokenContractAddress)}
          
          {this.iconLabelsField('blue','money bill alternate outline', 'Tokens in coffer', this.state.openAir.tokensInCoffer)}
         
          {this.iconLabelsField('green', 'ethereum', 'User accout: ', this.state.openAir.userAccount)}
          {this.iconLabelsField('green', 'money bill alternate outline', 'User account balance', this.state.openAir.userAccountBalance)}
          <Header as='h6'>Fields: {this.state.openAir.fields}</Header>
          <Header as='h6'>Areas: {this.state.openAir.areas} </Header>
          <Header as='h6'>Speeches: {this.state.openAir.speeches}</Header> 
          {/*}  
          <div>
            <Tab menu={{ pointing: true }} panes={this.getPanes(this.state.openAir.fields)} />
          </div>   
          */}    
        </div>
        <div>
          <Button primary onClick={this.onParticipate}>Participate</Button> 
        </div>
        <Divider horizontal></Divider>
        <Segment inverted>
          <Form inverted onSubmit={this.onSubmit}>
            <Form.Input fluid label='Title' placeholder={this.state.openAir.speechTitle} onChange={(e) => this.setState({speechTitle: e.target.value})}/>
            <Form.TextArea label='Speech' placeholder={this.state.openAir.speechTitle} onChange={(e) => this.setState({speechContent: e.target.value})}/>
            <Form.Button>
              <Icon name='microphone' />
              Submit
            </Form.Button>
          </Form>
        </Segment>
      </div>
    );
  }


  getPanes(sections) {
    return sections.map((section) => ({ 
      menuItem: section, 
      render: () => <Tab.Pane>{section} Content</Tab.Pane> 
      }))
  }




  iconLabelsField(color, icon, label, value) {
    return <div>
      <Button as='div' labelPosition='right'>
        <Label color={color}>
          <Icon name={icon} />
          {label}
        </Label>
        <Label as='a' basic color={color} pointing='left'>
          {value}
        </Label>
      </Button>
    </div>
  }

  async onParticipate() {
    const openAirInstance = getOpenAirInstance(this.state.openAir.address)
    await openAirInstance.methods.registerAreaParticipation(this.state.openAir.currentField, this.state.openAir.currentArea).send({from: this.state.openAir.userAccount})
    
    //refresh state
    const openAirState = await this.getOpenAirState(this.state.openAir.address)
    this.setState({
      openAir: openAirState
    })
    alert("Participated.")
  }

  async onSubmit(event) {
    const openAirInstance = getOpenAirInstance(this.state.openAir.address)
    await openAirInstance.methods.registerAreaParticipation(this.state.openAir.currentField, this.state.openAir.currentArea).send({from: this.state.openAir.userAccount})
    const chargePerSpeech = (await openAirInstance.methods.getChargePerSpeech().call())
    const tokenContract = getOpinionTokenInstance(this.state.openAir.tokenContractAddress)
    await tokenContract.methods.approveAndSpeak(this.state.openAir.address, chargePerSpeech, this.state.openAir.currentField, this.state.openAir.currentArea, this.state.speechTitle, this.state.speechContent).send({
      from: this.state.openAir.userAccount,
      gasPrice: 1000,
      gas: 10000000000})

    const openAirState = await this.getOpenAirState(this.state.openAir.address)
    this.setState({
      openAir: openAirState
    })
    alert("Submitted.")
  }

}