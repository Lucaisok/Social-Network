import React from "react";

export default function ProfilePic({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "/images/deafult.jpg";
    return (
        <div>
            <img
                className="profilePic"
                onClick={toggleModal}
                src={imageUrl}
                alt={first + " " + last}
            />
        </div>
    );
}
