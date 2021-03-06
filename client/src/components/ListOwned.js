import React, { Component } from "react";

class ListOwned extends Component {
    state = { ticketsOwned: [], qrcode: 0}
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
        console.log(Object.keys(tickets).length);
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
        console.log('here');
        console.log(ticketsDetails);
        this.setState({ticketsOwned: ticketsDetails});
    };
    listItem = async (ticketID) => {
        const { accounts, ticketContract, marketContract } = this.props.parentState;
        console.log(ticketContract._address);
        console.log(marketContract._address);
        //Allow market to sell on your behalf
        await ticketContract.methods.setApprovalForAll(marketContract._address, true).send({from: accounts[0]}).then();
        await marketContract.methods.createMarketItem(ticketContract._address, ticketID, 1).send({from: accounts[0], value: 10}).then();
    };

    render() {
        const listItems = this.state.ticketsOwned.map((link) =>
            <button key={link.ticketID} onClick={() => this.listItem(link.ticketID)}>List ticket for {link.eventName} Ticket ID: {link.ticketID} for 1 ETH</button>
        );
        return (
            <div className="App">
                <h2>Available tickets to list for sale</h2>
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }
}

export default ListOwned;
