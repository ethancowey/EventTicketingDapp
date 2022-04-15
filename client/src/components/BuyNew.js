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
    //buyVendor(address to, address marketAddress, uint eventID, uint256 seatNum)
    buyNewT = async (eventID) => {
        const { accounts, ticketContract, marketContract } = this.props.parentState;
        console.log(ticketContract);
        console.log(eventID);
        await ticketContract.methods.buyVendor(accounts[0], marketContract._address, eventID, 1).send({from: accounts[0], value: 1000000000000000000}).then();
    };


    render() {
        const listItems = this.state.ticketsAvailable.map((link) =>
            <button key={link.eventID} onClick={() => this.buyNewT(link.eventID)}>Buy ticket for {link.eventName} For presale {link.presale}</button>
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
            </div>
        );
    }
}

export default BuyNew;
