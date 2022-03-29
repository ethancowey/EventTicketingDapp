import React, { Component } from "react";
import SimpleStorageContract from "./abi/Ticket.json";
import getWeb3 from "./getWeb3";
//import { ethers } from "ethers";
import QRCode from "react-qr-code";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import BuyPreowned from './components/BuyPreowned';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, qrcode: 'hello' };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    console.log(contract);

    // Stores a given value, 5 by default.
    await contract.methods.balanceOf(accounts[0]).call(function (err, res) {
        if (err) {
            console.log("An error occured", err)
            return
        }
        console.log("The balance is: ", res);
        //this.setState({ storageValue: res });
    })
      await contract.methods.name().call(function (err, res) {
          if (err) {
              console.log("An error occured", err)
              return
          }
          console.log("The name is: ", res);
          //this.setState({ storageValue: res });
      })
  };
    buyNew = async () => {
        const { accounts, contract } = this.state;
        console.log(contract);
        //const hex = '0x'+Eth.Buffer
        // Stores a given value, 5 by default.
        //await contract.methods.make2().send({from: accounts[0]})
        await contract.methods.buyVendor(accounts[0], 6674, 2, 'poster show', 11).send({from: accounts[0], value: 1000000000000000000}).then();
    };
    getDetails = async () => {
        const { contract } = this.state;
        const uri = await  contract.methods.ticketDetails(667).call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The name is: ", res);
            //this.setState({qrcode: res});
            return res
            //this.setState({ storageValue: res });
        })

        this.setState({qrcode: uri.eventID + uri.seat + navigator.geolocation});
        return uri
    }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
          <button onClick={this.buyNew}>Buy a new ticket from the vendor for 1 eth</button>
          <button onClick={this.getDetails}>Get your QR code</button>
          <QRCode value={this.state.qrcode} />
        <div>The stored value is: {this.state.storageValue}</div>
          <BrowserRouter>
              <Routes>
                  <Route path="/marketplace" element={<BuyPreowned parentState = {this.state}/>}>

                  </Route>
              </Routes>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
