import React, { Component } from 'react';
import { getOpenAirInstance } from '../web3/openAirContract'
import { getOpinionTokenInstance } from '../web3/opinionTokenContract'
import { getSpeechInstance } from '../web3/speechContract'
import { Header, Form, Divider, Segment, Button, Icon, Label, Tab, Table } from 'semantic-ui-react'


export class OpenAirComponent extends Component {

  TAB_TYPE_FIELD = '0'
  TAB_TYPE_AREA = '1'


  state = {
    openAir: {
      address: 'invalid',
      tokenContractAddress: 'n/a',

      userAccount: 'invalid',
      userAccountBalance: 0
    },
    
    speechTitle: "Title",
    speechContent: "...",
    activeSpeechRowIndex: 0
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
    const chargePerSpeech = await contract.methods.getChargePerSpeech().call()
    const awardPerAreaParticipation = await contract.methods.getAwardForParticipation().call()
    const awardToVoterPerFollower = await contract.methods.getAwardToVoterPerFollower().call()
    const awardToSpeakerPerUpVote = await contract.methods.getAwardToSpeakerPerUpVote().call()
    //const speechRows = await this.getSpeechRows(speeches)
    const rows = []
    for (var i = 0; i < speeches.length; i ++) {
      const speechInstance = getSpeechInstance(await contract.methods.getSpeechAddress(fields[0], areas[0], i).call())
      rows[i] = {index: i, title: (await speechInstance.methods.getTitle().call())}
    }
      

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
      userAccountBalance: userAccountBalance,
      chargePerSpeech: chargePerSpeech,
      awardPerAreaParticipation: awardPerAreaParticipation,
      awardToVoterPerFollower: awardToVoterPerFollower,
      awardToSpeakerPerUpVote: awardToSpeakerPerUpVote,
      speechRows : rows
    }
  }

  render() {
    return (
      <div>
        <Header as='h1' icon color="blue">
          <Icon name='skyatlas' />
            Open Air
          <Header.Subheader color="blue">
            a smart contract based autonomous speech platform
          </Header.Subheader>
        </Header>

        <div className="ui divider"></div>
        <div>
          {this.iconLabelsField('blue', 'ethereum', 'OpenAir contract address:', this.state.openAir.address)}
          {this.iconLabelsField('blue', 'ethereum', 'OpenAir contract creator:', this.state.openAir.creator)}
 
          {this.iconLabelsField('blue', 'ethereum', 'OpinionToken contract address: ', this.state.openAir.tokenContractAddress)}
          
          {this.iconLabelsField('blue','money bill alternate outline', 'Tokens in coffer', this.state.openAir.tokensInCoffer)}
         
          {this.iconLabelsField('green', 'ethereum', 'User accout: ', this.state.openAir.userAccount)}
          {this.iconLabelsField('green', 'money bill alternate outline', 'User account balance', this.state.openAir.userAccountBalance)}

          
          <div>
            <Tab menu={{ pointing: true }} panes={this.getPanes(this.state.openAir.fields, this.TAB_TYPE_FIELD)} />
            <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={this.getPanes(this.state.openAir.areas, this.TAB_TYPE_AREA)} />
          </div>              
        </div>

        <Divider horizontal></Divider>
        <Segment inverted color="green">
          <Form inverted onSubmit={this.onSubmit}>
            <Form.Input fluid label='Title' placeholder={this.state.openAir.speechTitle} onChange={(e) => this.setState({speechTitle: e.target.value})}/>
            <Form.TextArea label='Speech' placeholder={this.state.openAir.speechTitle} onChange={(e) => this.setState({speechContent: e.target.value})}/>
            <Form.Button color="blue">
              <Icon name='microphone' />
              Submit
            </Form.Button>
            <p>(Charge per speech: {this.state.openAir.chargePerSpeech})</p>
          </Form>
        </Segment>
      </div>
    );
  }


  getPanes(tabNames, tabType) {
    //console.log("tabNames=" + tabNames)
    if (tabNames) {
      return tabNames.map((tabName) => ({ 
        menuItem: tabName, 
        render: () => <Tab.Pane>{this.getPaneContent(tabName, tabType)}</Tab.Pane> 
        }))
    }
  }

  getPaneContent(tabName, tabType) {
    var content = tabName + ' Subject Areas'
    if (tabType === this.TAB_TYPE_AREA) {
      content = this.areaInteractionSection(tabName)
    }
    return content
  }

  areaInteractionSection(areaName) {
    //return areaName + ' area'
    return <div>
        <Button primary onClick={this.onParticipate}>
          <Icon name='hand paper'/>
          Participate
        </Button> 
        <p>(Award per area participation: {this.state.openAir.awardPerAreaParticipation})</p>
        <div>
          <Table celled fixed singleLine compact size="small" selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Index</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderSpeechRows()}</Table.Body>
          </Table>
        </div>
      </div>
  }


  renderSpeechRows() {
    let rows = this.state.openAir.speechRows.map(item => {
      return (
        <Table.Row
          key={item.index}
          active={item.index === this.state.activeSpeechRowIndex}
          onClick={() => {
            this.setActiveRow(item.index);
          }}
        >
          <Table.Cell title={item.index}>{item.index}</Table.Cell>
          <Table.Cell title={item.title}>{item.title}</Table.Cell>
          <Table.Cell title={item.title}> {this.iconLabelsField('green', 'thumbs up', '', 0)}  </Table.Cell>
          <Table.Cell title={item.title}> {this.iconLabelsField('green', 'thumbs down', '', 0)} </Table.Cell>
        </Table.Row>
      );
    });

    return rows;
  }

  setActiveRow(index) {
    this.setState({
      activeSpeechRowIndex: index
    });
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