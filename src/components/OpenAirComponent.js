import React, { Component } from 'react';
import { getOpenAirInstance } from '../web3/openAirContract'
import { getOpinionTokenInstance } from '../web3/opinionTokenContract'
import { getSpeechInstance } from '../web3/speechContract'
import { Header, Form, Divider, Segment, Button, Icon, Label, Tab, Table, Dropdown} from 'semantic-ui-react'


export class OpenAirComponent extends Component {

  TAB_TYPE_FIELD = '0'
  TAB_TYPE_AREA = '1'

  WORKSPACE_MODE_SPEAKING = '0'
  WORKSPACE_MODE_VOTING = '1'
  WORKSPACE_MODE_NONE = '2'



  state = {
    openAir: {
      address: 'invalid',
      tokenContractAddress: 'n/a',

      userAccountBalance: 0,
      selectedSpeechIndex: 0,

      userAccounts: [],
      currentUserAccountIndex: 0,
      currentUserAccountBalance: 0
    },
    
    isSpeaking: this.WORKSPACE_MODE_NONE,
    newSpeechTitle: "Title",
    newSpeechContent: "..."
  }

  constructor(props) {
    super(props)
    this.onSubmitSpeech = this.onSubmitSpeech.bind(this)
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
    const chargePerVote = await contract.methods.getChargePerVote().call()
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

    let userAccounts = this.state.openAir.userAccounts
    let currentUserAccountBalance = this.state.openAir.currentUserAccountBalance
    if (window.ethereum) {
      try {
        
        userAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log(userAccounts[0])
        currentUserAccountBalance = await tokenContract.methods.balanceOf(userAccounts[this.state.currentUserAccountIndex]).call()
    
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
      chargePerSpeech: chargePerSpeech,
      chargePerVote: chargePerVote,
      awardPerAreaParticipation: awardPerAreaParticipation,
      awardToVoterPerFollower: awardToVoterPerFollower,
      awardToSpeakerPerUpVote: awardToSpeakerPerUpVote,
      speechRows : rows,
      userAccounts: userAccounts,
      currentUserAccount: userAccounts[this.state.openAir.currentUserAccountIndex],
      currentUserAccountBalance: currentUserAccountBalance      
    }
  }

  headerGridRow(iconName, label, value) {
    return <Table.Row>
      <Table.Cell className='warning'>  
        <Header as='h5' color='blue'>
        <Icon name={iconName}/>
          <Header.Content>
            {label}
          </Header.Content>
        </Header>
        
      </Table.Cell>
      <Table.Cell color='blue'>
        {value}
      </Table.Cell>
    </Table.Row>
  }

  render() {
    return (
      <div>
        
        <Header icon color="blue" size='huge'>
          <Icon name='skyatlas' />
            Open Air
          <Header.Subheader color="blue">
            a smart contract based autonomous speech platform
          </Header.Subheader>
        </Header>

        <div className="ui divider"></div>
        <div>
          <Segment inverted color='blue'>
            <Table columns={2} padded>
              {this.headerGridRow('ethereum', 'OpenAir Contract Address:', this.state.openAir.address)}
              {this.headerGridRow('ethereum', 'OpenAir Contract Creator:', this.state.openAir.creator)}
              {this.headerGridRow('ethereum', 'OpinionToken(AIR) Contract Address: ', this.state.openAir.tokenContractAddress)}
              {this.headerGridRow('money bill alternate outline', 'Tokens in Contract Coffer', this.state.openAir.tokensInCoffer)}         
            </Table>
          </Segment>

          <Segment inverted color='green'>
            <Table columns={2} padded>
              <Table.Row>
                <Table.Cell className='warning'>  
                  <Header as='h5' color='green'>
                  <Icon name='ethereum'/>
                    <Header.Content>
                      Current User Account:
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell color='green'>
                  {this.accountsDropDown()}
                </Table.Cell>
              </Table.Row>  
              <Table.Row>
                <Table.Cell className='warning'>  
                  <Header as='h5' color='green'>
                  <Icon name='money bill alternate outline'/>
                    <Header.Content>
                      Current User Account Balance:
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell color='green'>
                  {this.state.openAir.userAccountBalance}
                </Table.Cell>
              </Table.Row>      
            </Table>
          </Segment>


          {this.iconLabelsField('green', 'ethereum', 'User accout: ', this.state.openAir.currentUserAccount)}
          {this.iconLabelsField('green', 'money bill alternate outline', 'User account balance', this.state.openAir.currentUserAccountBalance)}
          <Divider horizontal></Divider>

          
          <div>
            <Tab menu={{ pointing: true }} panes={this.getPanes(this.state.openAir.fields, this.TAB_TYPE_FIELD)} />
            <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={this.getPanes(this.state.openAir.areas, this.TAB_TYPE_AREA)} />
          </div>              
        </div>

        <Divider horizontal></Divider>
        {this.workspaceUI(this.state.isSpeaking)}

      </div>
    );
  }

  accountsDropDown() {
    return <Dropdown
        className="ui primary"
        onChange={this.handleDropDownSelect}         
        options={this.getAccountsDropDownOptions()}
        defaultValue='0'
      /> 
  }

  getAccountsDropDownOptions() {
    var options = []
    const accounts = this.state.openAir.userAccounts
    for (var i = 0; i < accounts.length; i ++) {
      const item = { key: i, value: i, text : accounts[i] }
      options.push(item);
    }
    //options = [{ key: 'af', value: 'af', text: 'Afghanistan' }, { key: 'ax', value: 'ax', text: 'Aland Islands' }]
    return options
  }

  async onParticipate() {
    const currentUserAccount = this.state.openAir.userAccounts[this.state.openAir.currentUserAccountIndex]
    const openAirInstance = getOpenAirInstance(this.state.openAir.address)
    await openAirInstance.methods.registerAreaParticipation(this.state.openAir.currentField, this.state.openAir.currentArea).send({from: currentUserAccount})
    
    //refresh state
    const openAirState = await this.getOpenAirState(this.state.openAir.address)
    this.setState({
      openAir: openAirState
    })
    alert("Participated.")
  }

  workspaceUI(mode) {
    if (mode === this.WORKSPACE_MODE_SPEAKING) {
      return  <Segment inverted color="green">
        <Form inverted onSubmit={this.onSubmitSpeech}>
          <Form.Input fluid label='Title' placeholder={this.state.newSpeechTitle} onChange={(e) => this.setState({newSpeechTitle: e.target.value})}/>
          <Form.TextArea label='Speech' placeholder={this.state.newSpeechContent} onChange={(e) => this.setState({newSpeechContent: e.target.value})}/>
          <Form.Button color="blue">
            <Icon name='microphone' />
            Submit
          </Form.Button>
          <p>(Charge per speech: {this.state.openAir.chargePerSpeech})</p>
        </Form>
      </Segment>
    } else if (mode === this.WORKSPACE_MODE_VOTING) {
      return  <Segment inverted color="grey">
        <Form inverted onSubmit={this.onSubmit}>
        <Form.Input fluid label='Title' placeholder={this.state.openAir.selectedSpeechTitle}/>
          <Form.TextArea label='Speech' placeholder={this.state.openAir.selectedSpeechContent} />
          <Form.Button color="blue">
            <Icon name='microphone' />
            Vote
          </Form.Button>
          <p>(Charge per vote: {this.state.openAir.chargePerVote})</p>
        </Form>
      </Segment>      
    } else {   //mode == this.WORKSPACE_MODE_NONE
      return <Button as='div' labelPosition='right' size='huge' onClick={()=>{this.setState({isSpeaking : true})}}>
        <Label color='green'>
          <Icon name='bullhorn' />
          Speak
        </Label>
      </Button>
    }

  }

  async onSubmitSpeech(event) {
    const currentUserAccount = this.state.openAir.userAccounts[this.state.openAir.currentUserAccountIndex]
    const openAirInstance = getOpenAirInstance(this.state.openAir.address)
    await openAirInstance.methods.registerAreaParticipation(this.state.openAir.currentField, this.state.openAir.currentArea).send({from: currentUserAccount})
    const chargePerSpeech = (await openAirInstance.methods.getChargePerSpeech().call())
    const tokenContract = getOpinionTokenInstance(this.state.openAir.tokenContractAddress)
    await tokenContract.methods.approveAndSpeak(this.state.openAir.address, chargePerSpeech, this.state.openAir.currentField, this.state.openAir.currentArea, this.state.speechTitle, this.state.speechContent).send({
      from: currentUserAccount,
      gasPrice: 1000,
      gas: 10000000000})

    const openAirState = await this.getOpenAirState(this.state.openAir.address)
    this.setState({
      openAir: openAirState,
      isSpeaking: this.WORKSPACE_MODE_NONE

    })
    alert("Submitted.")
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
          <Table.Cell title={item.title}> {this.iconLabelsField('red', 'thumbs up', '', 0)}  </Table.Cell>
          <Table.Cell title={item.title}> {this.iconLabelsField('red', 'thumbs down', '', 0)} </Table.Cell>
        </Table.Row>
      );
    });

    return rows;
  }

  setActiveRow(index) {
    this.setState({
      openAir: {
        selectedSpeechIndex: index
      }
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



}