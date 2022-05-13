import React, { Component } from "react";
import TicketContract from "./abi/Ticket.json";
import MarketContract from "./abi/TicketMarket.json";
import getWeb3 from "./getWeb3";
//import { ethers } from "ethers";
//import QRCode from "react-qr-code";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import BuyPreowned from './components/BuyPreowned';
import Admin from "./components/Admin";
import BuyNew from "./components/BuyNew";
import Owned from "./components/Owned";
import ListOwned from "./components/ListOwned";
import Scan from "./components/Scan";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, ticketContract: null, marketContract: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TicketContract.networks[networkId];
      const ticketInstance = new web3.eth.Contract(
        TicketContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
        const deployedMarket = MarketContract.networks[networkId];
        console.log(ticketInstance);
      const marketInstance = new web3.eth.Contract(
          MarketContract.abi,
          deployedMarket && deployedMarket.address,
      );
        console.log(marketInstance);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, ticketContract: ticketInstance, marketContract: marketInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, ticketContract } = this.state;
    console.log(ticketContract);

    // Stores a given value, 5 by default.
    await ticketContract.methods.balanceOf(accounts[0]).call(function (err, res) {
        if (err) {
            console.log("An error occured", err)
            return
        }
        console.log("The balance is: ", res);
        //this.setState({ storageValue: res });
    })
      await ticketContract.methods.name().call(function (err, res) {
          if (err) {
              console.log("An error occured", err)
              return
          }
          console.log("The name is: ", res);
          //this.setState({ storageValue: res });
      })
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Secure Event Ticketing</h1>
          <BrowserRouter>
              <Link to='/admin'> Admin Page</Link>
              <Link to='/scan'> Scanner Page</Link>
              <Link to='/buy'> Buy New</Link>
              <Link to='/owned'> Your Tickets</Link>
              <Link to='/marketplace'> Buy Preowned</Link>
              <Link to='/list'> List a Ticket</Link>
              <Routes>
                  <Route path="/marketplace" element={<BuyPreowned parentState = {this.state}/>}>

                  </Route>
                  <Route path="/admin" element={<Admin parentState = {this.state}/>}>

                  </Route>
                  <Route path="/buy" element={<BuyNew parentState = {this.state}/>}>

                  </Route>
                  <Route path="/owned" element={<Owned parentState = {this.state}/>}>

                  </Route>
                  <Route path="/list" element={<ListOwned parentState = {this.state}/>}>

                  </Route>
                  <Route path="/scan" element={<Scan parentState = {this.state}/>}>

                  </Route>
              </Routes>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
