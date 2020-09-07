import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Login extends Component {
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
        console.log("about to submit");
        axios
            .post(
                "/login",
                {
                    email: this.state.logMail,
                    password: this.state.logPass,
                },
                {
                    xsrfCookieName: "mytoken",
                    xsrfHeaderName: "csrf-token",
                }
            )
            .then(({ data }) => {
                console.log("data from server: ", data);
                if (data.success) {
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
            <div className="form">
                <h1>Log In</h1>
                {this.state.error && <div>Ops... something went wrong</div>}
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="email"
                    name="logMail"
                    placeholder="Email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="password"
                    name="logPass"
                    placeholder="Password"
                />
                <button onClick={() => this.submit()}>Log In</button>
                {/* <p>
                    Forgot your Password ? <Link to="/reset">Reset!</Link>
                </p> */}
                <p>
                    Not a memeber yet ? <Link to="/register">Register!</Link>
                </p>
            </div>
        );
    }
}

export default Login;
