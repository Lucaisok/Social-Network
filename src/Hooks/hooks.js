import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useStateFulFields } from "./useStatefulFields";
import { useAuthSubmit } from "./useAuthSubmit";
import { useAuthSubmit } from "./useAuthSubmit";

function sayHello() {
    const [greetee, setGreetee] = useState("hello"); //hello is the default value
    const [country, setCountry] = useState("");
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                "https://flame-egg.glitch.me/?q=" + country
            ); //incremental search!
            setCountries(data);
            console.log("countries: ", countries);
        })();
        // = to componentDidMount but run every time I update state, not only when the component mounts.
        console.log("greetee: ", greetee);
        console.log("country: ", country);
    }, [country]); //but if we pass an empty array as a second argument, useEffect will act as pure componentDidMount, not changing every time but will run just when the comp mounts. If I pass country to the array, use effect will ran every time country changes, but not when greetee changes.

    const handleChange = (e) => {
        console.log(e.target.value);
        setGreetee(e.target.value); // = to setState for greetee, so here we set a new value to greetee
    };

    const handleCountryChange = (e) => {
        console.log(e.target.value);
        setCountry(e.target.value);
    };

    return (
        <div>
            <h1>{greetee} Vanilla</h1>
            <input onChange={handleChange} />
            <input
                onChange={handleCountryChange}
                placeholder="Enter a Country"
            />
            {countries.map((elem, idx) => {
                return <p key={idx}>{elem}</p>; //idx and key is not necessary, just a react thing, if there is not u just get a warning
            })}
        </div>
    );
}

//lets use our own hook on another function
function Login() {
    const [values, handleChange] = useStateFulFields();
    const [error, handleClick] = useAuthSubmit("/login", values);
    return (
        <div>
            {error && <p>Ops...smt went wrong</p>}
            <input name="email" onChange={handleChange} />
            <input name="password" onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
        </div>
    );
}

function Registration() {
    const [values, handleChange] = useStateFulFields();
    const [error, handleClick] = useAuthSubmit("/registration", values);
    return (
        <div>
            {error && <p>Ops...smt went wrong</p>}
            <input name="first" onChange={handleChange} />
            <input name="last" onChange={handleChange} />
            <input name="email" onChange={handleChange} />
            <input name="password" onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
        </div>
    );
}
//thats really faster with hooks!
