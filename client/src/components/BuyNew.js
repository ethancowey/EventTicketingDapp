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
            if(currentTicket.seatsAvailable == 0){
                console.log('no seats');
            }else{
                tickets.push(currentTicket);
            }
        }
        console.log(tickets);
        this.setState({ticketsAvailable: tickets});
    };
    //buyVendor(address to, address marketAddress, uint eventID, uint256 seatNum)
    buyNewT = async (eventID, presale) => {
        const { accounts, ticketContract, marketContract } = this.props.parentState;
        console.log(ticketContract);
        console.log(eventID);
        if(presale){
            await ticketContract.methods.joinPreSale(accounts[0], marketContract._address, eventID, 1).send({from: accounts[0], value: 1000000000000000000}).then();
        }else {
            await ticketContract.methods.buyVendor(accounts[0], marketContract._address, eventID, 1).send({
                from: accounts[0],
                value: 1000000000000000000
            }).then();
        }
    };


    render() {
        const listItems = this.state.ticketsAvailable.map((link) =>
            <button key={link.eventID} onClick={() => this.buyNewT(link.eventID, link.presale)}>Buy ticket for {link.eventName}{link.presale === true && <p>for presale only</p>}</button>
        );
        return (
            <div className="App">
                <h2>Available tickets</h2>
                <ul >
                    {listItems}
                </ul>
            </div>
        );
    }
}

export default BuyNew;
