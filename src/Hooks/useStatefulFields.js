//My own hooks
import React, { useState } from "react";

export function useStatefulFields() {
    //the name of the function must start with use
    const [values, setValues] = useState({});

    const handleChange = (e) => {
        setValues({
            ...values, //first copy the old state
            [e.target.name]: e.target.value, // then add the new one
        });
    };

    return [values, handleChange];
}

//spread operator

var obj = {
    name: "Luca",
};

var newObj = {
    ...obj, //this equals to-> name: "Luca"
    lastName: "Tomarelli",
};

//end spread
