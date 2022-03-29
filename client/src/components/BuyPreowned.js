import React, { Component } from "react";

//import "./App.css";

class BuyPreowned extends Component {

    buyNew2 = async () => {
        const { accounts, contract } = this.props.parentState;
        console.log(contract);
        //const hex = '0x'+Eth.Buffer
        // Stores a given value, 5 by default.
        //await contract.methods.make2().send({from: accounts[0]})
        await contract.methods.buyVendor(accounts[0], 6675, 2, 'poster show', 11).send({from: accounts[0], value: 1000000000000000000}).then();
    };
    getDetails2 = async () => {
        const { contract } = this.props.parentState;
        const uri = await  contract.methods.ticketDetails(6675).call(function (err, res) {
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
                <button onClick={this.buyNew2}>Buy a new ticket from the vendor for 1 eth</button>
                <button onClick={this.getDetails2}>Get your QR code</button>
                <div>The stored value is: {this.props.parentState.storageValue}</div>
            </div>
        );
    }
}

export default BuyPreowned;
