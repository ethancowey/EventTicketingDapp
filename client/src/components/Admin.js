import React, { Component } from "react";

//import "./App.css";

class Admin extends Component {

    addEvent = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(document.getElementById("name").value + document.getElementById("seats").value);
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
        await ticketContract.methods.addEvent(document.getElementById("name").value, document.getElementById("seats").value, false).send({from: accounts[0]});
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
        await ticketContract.methods.eventDetails(6).call(function (err, res) {
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
    newScanner = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(document.getElementById("scannerAddress").value);

        await ticketContract.methods.addScanner(document.getElementById("scannerAddress").value).send({from: accounts[0]});
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
                <label>On presale</label>
                <input type="bool" name="On presale" id="presale"/>
                <button onClick={this.addEvent}>Add new event</button>
                <h2>End a presale</h2>
                <label>Event ID to end presale</label>
                <input type="number" name="end presale" id="endPresale"/>
                <button onClick={this.finishPresale}>Add new event</button>
                <h2>Add a new scanner</h2>
                <label>Address of new scanner</label>
                <input type="string" name="scanner" id="scannerAddress"/>
                <button onClick={this.newScanner}>Add new event</button>
            </div>
        );
    }
}

export default Admin;
