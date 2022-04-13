import React, { Component } from "react";

//import "./App.css";

class Owned extends Component {
    state = { ticketsOwned: []}
    componentDidMount = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        const numTickets = await ticketContract.methods.balanceOf(accounts[0]).call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The balance is: ", res);
            return res;
            //this.setState({ storageValue: res });
        })
        let id =0;
        let tickets = [];
        while(id < numTickets){
            const ticketIDs = await ticketContract.methods.tokenOfOwnerByIndex(accounts[0], id).call(function (err, res) {
                if (err) {
                    console.log("An error occured", err)
                    return
                }
                console.log("The balance is: ", res);
                return res;
                //this.setState({ storageValue: res });
            })
            console.log(ticketIDs);
            id++;
            tickets.push(ticketIDs);
        }
        console.log(tickets);
        let ticketsDetails = []
        for(let i = 0; i< tickets.length; i++){
            const ticketDetail = await ticketContract.methods.ticketDetails(tickets[i]).call(function (err, res) {
                if (err) {
                    console.log("An error occured", err)
                    return
                }
                console.log("The balance is: ", res);
                res.ticketID = tickets[i];
                return res;
                //this.setState({ storageValue: res });
            })
            ticketsDetails.push(ticketDetail);

        }
        console.log(ticketsDetails);
        this.setState({ticketsOwned: ticketsDetails});
    };
    //buyVendor(address to, address marketAddress, uint eventID, uint256 seatNum)
    generateQR = async (eventID) => {
        console.log(eventID);
        };


    render() {
        const listItems = this.state.ticketsOwned.map((link) =>
            <button key={link.ticketID} onClick={() => this.generateQR(link.eventID)}>Buy ticket for {link.eventName}</button>
        );
        return (
            <div className="App">
                <ul>
                    {listItems}
                </ul>
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
                <button onClick={this.buyTicket}>Add new event</button>
            </div>
        );
    }
}

export default Owned;
