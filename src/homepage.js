import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="homeContainer">
            <h1>Social Ipa</h1>
            <h2>The first social network for Indian Pale Ale passionates</h2>
            <img className="homeLogo" src="/images/logo_transparent.png" />
            <div className="navBar">
                <Link className="navBar" to={"/register"}>
                    <p>Sign In</p>
                </Link>
                <p className="red">||</p>
                <Link className="navBar" to={"/login"}>
                    <p>Log In</p>
                </Link>
            </div>
            <div id="background-wrap">
                <div className="bubble x1"></div>
                <div className="bubble x2"></div>
                <div className="bubble x3"></div>
                <div className="bubble x4"></div>
                <div className="bubble x5"></div>
                <div className="bubble x6"></div>
                <div className="bubble x7"></div>
                <div className="bubble x8"></div>
                <div className="bubble x9"></div>
                <div className="bubble x10"></div>
            </div>
        </div>
    );
}
