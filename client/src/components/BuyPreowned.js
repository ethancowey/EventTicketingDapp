import React, { Component } from "react";


class BuyPreowned extends Component {
    state = { ticketsForSale: []}
    componentDidMount = async () => {
        const { marketContract} = this.props.parentState;
        const listings = await marketContract.methods.fetchMarketItems().call(function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("The balance is: ", res);
            return res;
            //this.setState({ storageValue: res });
        });
        this.setState({ticketsForSale: listings});
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
            <button key={link.tokenId} onClick={() => this.buyPre(link.tokenId)}>Buy ticket for {link.tokenId}</button>
        );
        return (
            <div className="App">
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }
}

export default BuyPreowned;
