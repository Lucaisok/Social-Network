import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [mostRecent, setMostRecent] = useState([]);
    const [searched, setSearched] = useState(" ");

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/users/${searched}.json`);
            setMostRecent(data);
            //setSearched(data);
            console.log("data received from server: ", data);
        })();
    }, [searched]);

    const handleChange = (e) => {
        if (e.target.value === "") {
            setSearched(" ");
        } else {
            setSearched(e.target.value);
        }
    };

    return (
        <div>
            <h1>Find People</h1>
            {mostRecent.map((elem, idx) => {
                return (
                    <div key={idx} className="mostRecent">
                        <Link to={`/user/${elem.id}`}>
                            <img
                                src={elem.imageurl}
                                alt={elem.first + " " + elem.last}
                            />
                        </Link>
                        <h3>{elem.first + " " + elem.last}</h3>
                    </div>
                );
            })}
            <div className="findInput">
                <h3>Looking for someone in particular ?</h3>
                <input
                    onChange={handleChange}
                    name="search"
                    placeholder="enter a name"
                />
            </div>
        </div>
    );
}
