import React, { useState } from "react";
import axios from "./axios";
import FriendButton from "./Hooks/friendButton";
import Comments from "./Hooks/comments";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const id = this.props.match.params.id;
        const { data } = await axios.get(`/user/${id}.json`);

        if (data.isSelf) {
            //redirect
            this.props.history.push("/");
        } else {
            this.setState({
                first: data.first,
                last: data.last,
                image: data.imageurl,
                bio: data.bio,
            });
        }
    }
    render() {
        return (
            <div>
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <img
                    className="profilePic"
                    src={this.state.image}
                    alt={this.state.first + " " + this.state.last}
                />
                <p className="otherBio">{this.state.bio}</p>
                <FriendButton
                    className="otherButton"
                    id={this.props.match.params.id}
                />
                <Comments id={this.props.match.params.id} />
            </div>
        );
    }
}
