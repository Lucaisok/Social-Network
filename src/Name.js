import React from "react";

// export default function Name(props) {
//     console.log("props: ", props);
//     return <p>Welcome! {props.first}</p>;
// }

export default class Name extends React.Component {
    constructor(props) {
        // props equally to state of HelloWorld
        super(props);
    }
    render() {
        return <p>Welcome {this.props.first}</p>;
    }
}
