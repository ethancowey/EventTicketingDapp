import React, { Component } from "react";

//import "./App.css";

class Admin extends Component {

    addEvent = async (presale) => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(document.getElementById("name").value + document.getElementById("seats").value);
        console.log(accounts);
        await ticketContract.methods.owner().call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The name is: ", res);
            return res
        });
        await ticketContract.methods.addEvent(document.getElementById("name").value, document.getElementById("seats").value, presale).send({from: accounts[0]});
        await ticketContract.methods.eventDetails(7).call(function (err, res) {
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
    finishPresale = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(document.getElementById("endPresale").value);
        await ticketContract.methods.endPreSale(document.getElementById("endPresale").value).send({from: accounts[0]});
    };
    newScanner = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(document.getElementById("scannerAddress").value);

        await ticketContract.methods.addScanner(document.getElementById("scannerAddress").value).send({from: accounts[0]});
    };
    issueReward = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(document.getElementById("scannerAddress").value);
        //rewardHolder(address user, string memory rewardName)
        await ticketContract.methods.rewardHolder((document.getElementById("receiverAddress").value), document.getElementById("reward").value).send({from: accounts[0]});
    };

    render() {
        return (
            <div className="App">
                <h1>ADMIN VENDOR</h1>
                <p>
                    If your contracts compiled and migrated successfully, below will show
                    a stored value of 5 (by default).
                </p>
                <h2>Add a new event</h2>
                <label>Event Name</label>
                <input type="string" name="event name" id="name"/>
                <label>Seats</label>
                <input type="number" name="seats available" id="seats"/>
                <button onClick={() => this.addEvent(false)}>Add new event (no presale)</button>
                <button onClick={() => this.addEvent(true)}>Add new event (with presale)</button>
                <h2>End a presale</h2>
                <label>Event ID to end presale</label>
                <input type="number" name="end presale" id="endPresale"/>
                <button onClick={this.finishPresale}>End presale for event</button>
                <h2>Add a new scanner</h2>
                <label>Address of new scanner</label>
                <input type="string" name="scanner" id="scannerAddress"/>
                <button onClick={this.newScanner}>Add new scanner</button>
                <h2>Issue a reward</h2>
                <label>Address of receiver</label>
                <input type="string" name="receiver" id="receiverAddress"/>
                <label>Reward name and details</label>
                <input type="string" name="reward" id="reward"/>
                <button onClick={this.issueReward}>Add new scanner</button>
            </div>
        );
    }
}

export default Admin;
