import React, { Component } from 'react';
import { Button, Header, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router';
import { web3 } from '../web3/web3';
import OpenAir from '../ethereum/build/contracts/OpenAir.json';

export class Home extends Component {

  state = {
    address: ''
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const networkId = await web3.eth.net.getId()
    const contractAddress = OpenAir.networks[networkId].address   //prefilled with one of the deployed addresses (there could be multiple)
    this.setState({
      address: contractAddress
    })
  }

  render() {
    return (
      <div>
        <Header as='h1'>OPEN AIR</Header>

        <Form>
          <Form.Input
            label='Contract Address'
            type='text'
            value={this.state.address}
            onChange={this.onChange}
          />
          <Button
            type='submit'
            onClick={this.onSubmit}
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  onChange(event) {
    this.setState({address: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.history.push(`/open-air/${this.state.address}`)
  }
}

export default withRouter(Home);