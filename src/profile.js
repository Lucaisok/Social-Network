import React from "react";
import ProfilePic from "./presentational";
import BioEditor from "./bioeditor";
import Uploader from "./uploader";
import { Link } from "react-router-dom";
import axios from "./axios";
import Comments from "./Hooks/comments";

export default function Profile(props) {
    // const id = this.props.match.params.id;
    const logOut = () => {
        axios.get("/logout").then(() => {
            location.replace("/");
        });
    };
    return (
        <div className="profilePage">
            <h1>
                {props.first} {props.last}
            </h1>
            <ProfilePic
                toggleModal={() => props.toggleModal()}
                imageUrl={props.imageUrl}
                first={props.first}
                last={props.last}
            />
            <BioEditor
                bio={props.bio}
                updateBio={(bio) => props.updateBio(bio)}
            />
            <div className="navigation">
                <Link to="/chat">
                    <p>Wall</p>
                </Link>
                <Link to={"/friends"}>
                    <p>Friends</p>
                </Link>
                <Link to={"/users"}>
                    <p>Find People</p>
                </Link>
                <p onClick={logOut}>Log Out</p>
            </div>
            {props.uploaderIsVisible && (
                <Uploader
                    toggleModal={() => props.toggleModal()}
                    uploaderMethod={(image) => props.uploaderMethod(image)}
                />
            )}
            <Comments />
        </div>
    );
}
