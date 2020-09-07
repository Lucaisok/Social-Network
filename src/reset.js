import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
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
        console.log("About to submit");
        axios
            .post(
                "/reset",
                {
                    email: this.state.resetEmail,
                },
                {
                    xsrfCookieName: "mytoken",
                    xsrfHeaderName: "csrf-token",
                }
            )
            .then(({ data }) => {
                console.log("data from server: ", data);
                if (data.success) {
                    this.setState({
                        step: 2,
                    });
                } else {
                    this.setState({
                        firstError: true,
                    });
                }
            })
            .catch((err) => console.log(err));
    }
    anotherSubmit() {
        console.log("about to submit");
        axios
            .post(
                "/reset/verify",
                {
                    password: this.state.newPassword,
                    code: this.state.code,
                },
                {
                    xsrfCookieName: "mytoken",
                    xsrfHeaderName: "csrf-token",
                }
            )
            .then(({ data }) => {
                console.log("data from server: ", data);
                if (data.success) {
                    this.setState({
                        step: 3,
                    });
                } else {
                    this.setState({
                        secondError: true,
                    });
                }
            })
            .catch((err) => console.log(err));
    }
    getCurrentDisplay() {
        const step = this.state.step; // in the component state set step == 1 as default, then update it in the two post request
        if (step == 1) {
            return (
                <div className="form">
                    <h3>Reset Password</h3>
                    {this.state.firstError && (
                        <div>Ops... seems like you are not registered yet!</div>
                    )}
                    <p>
                        Please enter the email address with wich you registered
                    </p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="email"
                        name="resetEmail"
                        placeholder="Email"
                    />
                    <button onClick={() => this.submit()}>Submit</button>
                </div>
            );
        } else if (step == 2) {
            return (
                <div className="form">
                    <h3>Reset Password</h3>
                    {this.state.secondError && (
                        <div>Ops...the code is wrong</div>
                    )}
                    <p>Please enter the code you received</p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        placeholder="code"
                    />
                    <p>Please enter a new Password</p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="password"
                        name="newPassword"
                        placeholder="password"
                    />
                    <button onClick={() => this.anotherSubmit()}>Submit</button>
                </div>
            );
        } else if (step == 3) {
            return (
                <div>
                    <h3>Reset Password</h3>
                    <h4>Success!</h4>
                    <p>
                        You can now <Link to="/login">log in</Link> with your
                        new password
                    </p>
                </div>
            );
        }
    }
    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}

export default ResetPassword;
