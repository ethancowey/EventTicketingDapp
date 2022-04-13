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
        await ticketContract.methods.addEvent(document.getElementById("name").value, document.getElementById("seats").value, document.getElementById("presale").value).send({from: accounts[0]});
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
            </div>
        );
    }
}

export default Admin;
