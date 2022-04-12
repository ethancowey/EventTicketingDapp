import React, { Component } from "react";

//import "./App.css";

class Admin extends Component {

    addEvent = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(ticketContract);
        console.log(accounts);
        //const hex = '0x'+Eth.Buffer
        // Stores a given value, 5 by default.
        //await contract.methods.make2().send({from: accounts[0]})
        await ticketContract.methods.owner().call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The name is: ", res);
            //this.setState({qrcode: res});
            return res
            //this.setState({ storageValue: res });
        });
        await ticketContract.methods.addEvent("eventName", 5, false).send({from: accounts[0]});
        await ticketContract.methods.eventDetails(1).call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The name is44: ", res);
            //this.setState({qrcode: res});
            return res
            //this.setState({ storageValue: res });
        });
    };

    render() {
        return (
            <div className="App">
                <h1>ADMIN VENDOR</h1>
                <p>
                    If your contracts compiled and migrated successfully, below will show
                    a stored value of 5 (by default).
                </p>
                <button onClick={this.addEvent}>Buy a new ticket from the vendor for 1 eth</button>
            </div>
        );
    }
}

export default Admin;
