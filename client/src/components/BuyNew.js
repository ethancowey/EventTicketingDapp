import React, { Component } from "react";

//import "./App.css";

class BuyNew extends Component {
    state = { ticketsAvailable: []}
    componentDidMount = async () => {
        const { ticketContract, accounts} = this.props.parentState;
        console.log(accounts);
        let id =1;
        let tickets = [];
        while(id !== 0){
            const currentTicket = await ticketContract.methods.eventDetails(id).call(function (err, res) {
                if (err) {
                    console.log("An error occured", err)
                    return
                }
                console.log("The name is244: ", res.eventID);
                //this.setState({qrcode: res});
                return res
                //this.setState({ storageValue: res });
            });
            if (currentTicket.eventID == 0){
                id = 0;
                break;
            }
            else {
                console.log(currentTicket.data);
                id++;
            }
            tickets.push(currentTicket);
        }
        console.log(tickets);
        this.setState({ticketsAvailable: tickets});
    };


    render() {
        const listItems = this.state.ticketsAvailable.map((link) =>
            <button key={link.eventID}>Buy ticket for {link.eventName}</button>
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

export default BuyNew;
