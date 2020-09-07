import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const messages = useSelector((state) => state && state.messages);
    console.log("here are my last 10 messages: ", messages);

    const keyCheck = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            console.log("our message: ", e.target.value);
            socket.emit("new message", e.target.value);
            e.target.value = "";
        }
    };

    useEffect(() => {
        //this should run every time there is a new chat messagew! (put smt in the empty array)
        console.log("chat hooks component did mount");
        console.log("elementRef= ", elemRef);
        console.log("scroll top: ", elemRef.current.scrollTop);
        console.log("clientHeigth: ", elemRef.current.clientHeigth);
        console.log("scrollHeight: ", elemRef.current.scrollHeigth);

        //scrollop = scrollheigth - clientheigth;
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [messages]);

    return (
        <div className="chatPage">
            <h1 className="chat">The Wall</h1>
            <div className="chat-container" ref={elemRef}>
                {messages &&
                    messages.map((elem, idx) => {
                        return (
                            <div className="chats" key={idx}>
                                <Link to={`/user/${elem.chatter_id}`}>
                                    <img
                                        src={elem.imageurl}
                                        alt={elem.first + "" + elem.last}
                                    />
                                </Link>
                                <p>{elem.first + " " + elem.last + ": "}</p>
                                <p>{elem.msg}</p>
                                <p>{elem.created_at}</p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
