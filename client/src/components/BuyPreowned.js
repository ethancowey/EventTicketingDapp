import React, { Component } from "react";


class BuyPreowned extends Component {
    state = { ticketsForSale: []}
    componentDidMount = async () => {
        const { marketContract, ticketContract} = this.props.parentState;
        const listings = await marketContract.methods.fetchMarketItems().call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The balance is: ", res);
            return res;
            //this.setState({ storageValue: res });
        });
        let object = [];
        for (var key in listings) {
            if (listings.hasOwnProperty(key)) {
                console.log(listings[key].tokenId);
                const eventDetails = await ticketContract.methods.ticketDetails(listings[key].tokenId).call(function (err, res) {
                    if (err) {
                        console.log("An error occured", err)
                        return
                    }
                    console.log("The balance is: ", res);
                    return res;
                    //this.setState({ storageValue: res });
                });
                if(listings[key].itemId == 0 || listings[key] == '0'){
                    console.log('empty entry');
                }else{
                    object.push({tokenId: listings[key].tokenId, itemId: listings[key].itemId, name: eventDetails.eventName});
                }
                //object[key].name = 'hello';
                //object[key] = 'hello';
                //listings.name = 'hello';
            }
        }
        console.log(object);
        this.setState({ticketsForSale: object});
    };
    buyPre = async (ticketID) => {
        const { accounts, ticketContract, marketContract } = this.props.parentState;
        console.log(ticketContract);
        console.log(ticketID);
        await marketContract.methods.createMarketSale(ticketContract._address, ticketID).send({from: accounts[0], value: 1000000000000000000}).then().catch(
            (error) => {alert(error)}
        );
    };

    render() {
        const listItems = this.state.ticketsForSale.map((link) =>
            <button key={link.tokenId} onClick={() => this.buyPre(link.itemId)}>Buy preowned ticket for Event: {link.name} ID: {link.tokenId}</button>
        );
        return (
            <div className="App">
                <h2>Available tickets</h2>
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }
}

export default BuyPreowned;
