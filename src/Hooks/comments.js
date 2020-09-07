import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Comments(props) {
    const [comments, setComments] = useState([]);
    const [textArea, setTextArea] = useState();
    let id = props.id;

    useEffect(() => {
        (async () => {
            if (id) {
                const { data } = await axios.get(`/comments/${id}`);
                console.log("comments data received from server: ", data);
                setComments(data);
                console.log("NOT", comments);
            } else {
                const { data } = await axios.get("/comment");
                console.log(data);
                setComments(data);
                console.log("WHAT", comments);
            }
        })();
    });

    const handleChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
        setTextArea({ [e.target.name]: e.target.value });
    };

    const keyChange = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.value = "";
            if (id) {
                try {
                    const { data } = await axios.post(
                        `/addComment/${id}`,
                        textArea
                    );
                    console.log("data from server posting comments: ", data);
                } catch (err) {
                    console.log(err);
                }
            } else {
                try {
                    const { data } = await axios.post(`/addComment`, textArea);
                    console.log(data);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    return (
        <div className="commentSection">
            <div className="commentContainer">
                <h2>My Wall</h2>
                {comments.map((elem, idx) => {
                    return (
                        <div key={idx} className="comment">
                            <img src={elem.imageurl} />
                            <p>{elem.first + " " + elem.last}</p>
                            <p>{elem.comment}</p>
                            <p>{elem.created_at}</p>
                        </div>
                    );
                })}
            </div>
            <form>
                <textarea
                    name="comment"
                    onChange={handleChange}
                    onKeyDown={keyChange}
                    placeholder="Add a comment here"
                ></textarea>
            </form>
        </div>
    );
}
