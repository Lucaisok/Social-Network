import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }
    submit() {
        console.log("about to submit!");
        axios
            .post(
                "/register",
                {
                    first: this.state.first,
                    last: this.state.last,
                    email: this.state.email,
                    password: this.state.password,
                },
                {
                    xsrfCookieName: "mytoken",
                    xsrfHeaderName: "csrf-token",
                }
            )
            .then(({ data }) => {
                console.log("data from server: ", data);
                if (data.success) {
                    //log the user into our app
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log(err));
    }
    render() {
        return (
            <>
                <div className="form">
                    <h1>Welcome!</h1>
                    <h2>
                        In order to join our community you need to register...
                    </h2>
                    {this.state.error && <div>Ops... something went wrong</div>}

                    <input
                        name="first"
                        placeholder="First Name"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        name="last"
                        placeholder="Last Name"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    ></input>

                    <button onClick={() => this.submit()}>Register</button>
                    <p>
                        Already a member? <Link to="/login">Login</Link> here!
                    </p>
                </div>
            </>
        );
    }
}

export default Registration;
