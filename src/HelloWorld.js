import React from "react";
import Name from "./Name";

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Luca",
        };
    }

    componentDidMount() {
        // here we do our axios request to the server, as mounted in Vue
        // we also update state here, and we do it as follow
        this.setState(
            {
                first: "vanilla",
            },
            () => console.log("this.state", this.state) // just doing it since setState is async and if we dont put the console.log in a callback we would still see state.first = Luca.
        );
    }

    handleClick() {
        console.log("handleClick is running!");
        this.setState({
            // if we don´t use an arrow function in onClick, this wiil be undefined
            first: "ziggy",
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Hello {this.state.first}</h1>
                <p onClick={() => this.handleClick()}>I am a tag</p>
                <Name first={this.state.first} />
            </div>
        );
    }
}
