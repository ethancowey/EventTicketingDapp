import React, { Component } from "react";

//import "./App.css";

class Scan extends Component {
    componentDidMount = async () => {
        //Check has role
        //const { ticketContract, accounts} = this.props.parentState;
        //await ticketContract.methods.hasRole("SCANNER_ROLE", accounts[0]).call(function (err, res) {
          //  if (err) {
            //    console.log("An error occured", err)
              //  return
            //}
            //console.log("The balance is: ", res);
            //return res;
            //this.setState({ storageValue: res });
        //});

    };
    //Scan ticket
    scanTicket = async () => {
        const { ticketContract, accounts} = this.props.parentState;

        await ticketContract.methods.scanTicket(document.getElementById("ticket").value, document.getElementById("event").value).send({from: accounts[0]}).catch((
            error =>{
                alert("You are not the scanner or ticket is Invalid" + error)
            })
        );
    };

    render() {
        return (
            <div className="App">
                <ul>
                </ul>
                <h2>Scan tickets</h2>
                <label>Ticket ID</label>
                <input type="number" name="event name" id="ticket"/>
                <label>Event ID</label>
                <input type="number" name="seats available" id="event"/>
                <button onClick={()=>this.scanTicket()}>Scan a  ticket</button>
            </div>
        );
    }
}

export default Scan;
