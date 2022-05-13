import React, { Component } from "react";
import QRCode from "react-qr-code";
import  {geolocated}  from "react-geolocated";

//import "./App.css";

class Owned extends Component {
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
        const date = new Date();
        //console.log(this.props.isGeolocationAvailable);
        //console.log(this.props.coords);
        this.setState({qrcode:"Ticket ID "+ eventID.ticketID + " "+ eventID.eventName +" Time:" +date.getHours() +":"+ date.getMinutes() + " Location " + this.props.coords.longitude + " " + this.props.coords.latitude})
        };


    render() {
        const listItems = this.state.ticketsOwned.map((link) =>
            <button key={link.ticketID} onClick={() => this.generateQR(link)}>Generate QR code for {link.eventName}</button>
        );
        return (
            <div className="App">
                <h2>Your Tickets</h2>
                <ul>
                    {listItems}
                </ul>
                <h2>Event QR code</h2>
                <QRCode value={this.state.qrcode} />
            </div>
        );
    }
}
//export default geolocated()(Owned);
//export default Owned;
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Owned);
