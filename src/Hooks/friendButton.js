import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("Send Friend Request");
    let id = props.id;
    useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                `/initial-friendship-status/${id}`
            );
            console.log("DATA", data);
            if (data === []) {
                setButtonText("Send Friend Request");
            } else if (
                data !== [] &&
                data[0].accepted === false &&
                data[0].sender_id == id
            ) {
                setButtonText("Accept Friend Request");
            } else if (data !== [] && data[0].accepted === true) {
                setButtonText("End Friendship");
            } else if (
                data !== [] &&
                data[0].accepted === false &&
                data[0].sender_id != id
            ) {
                setButtonText("Cancel Friend Request");
                console.log(data, data[0].accepted, data[0].sender_id, id);
            }
        })();
    }, [buttonText]);

    const handleFriendship = () => {
        if (buttonText === "Send Friend Request") {
            (async () => {
                const { data } = await axios.post(`/make-friend-request/${id}`);
                console.log(data);
                setButtonText("Cancel Friend Request");
            })();
        } else if (buttonText === "Cancel Friend Request") {
            (async () => {
                const { data } = await axios.post(
                    `/cancel-friend-request/${id}`
                );
                console.log(data);
                setButtonText("Send Friend Request");
            })();
        } else if (buttonText === "Accept Friend Request") {
            (async () => {
                const { data } = await axios.post(
                    `/accept-friend-request/${id}`
                );
                console.log(data);
                setButtonText("End Friendship");
            })();
        } else if (buttonText === "End Friendship") {
            (async () => {
                const { otherData } = await axios.post(`/end-friendship/${id}`);
                console.log(otherData);
                setButtonText("Send Friend Request");
            })();
        }
    };

    return (
        <div>
            <button onClick={handleFriendship}>{buttonText}</button>
        </div>
    );
}
