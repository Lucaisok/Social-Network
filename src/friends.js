import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiverFriendsAndWannabes,
    acceptFriendRequest,
    endFriendship,
} from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(
                (friendsAndWannabes) => friendsAndWannabes.accepted == true
            )
    );
    console.log("DDDD", friends);

    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(
                (friendsAndWannabes) => friendsAndWannabes.accepted == false
            )
    );
    console.log("JJJ", wannabes);

    useEffect(() => {
        dispatch(receiverFriendsAndWannabes());
    }, []);

    return (
        <div>
            <h1>Friends</h1>
            <div className="mostRecent">
                {friends &&
                    friends.map((elem, idx) => {
                        return (
                            <div key={idx}>
                                <Link to={`/user/${elem.id}`}>
                                    <img
                                        src={elem.imageurl}
                                        alt={elem.first + " " + elem.last}
                                    />
                                </Link>
                                <h4>{elem.first + " " + elem.last}</h4>
                                <button
                                    onClick={() =>
                                        dispatch(endFriendship(elem.id))
                                    }
                                >
                                    End Friendship
                                </button>
                            </div>
                        );
                    })}
            </div>
            <h1>Wannabes</h1>
            <div className=" mostRecent">
                {wannabes &&
                    wannabes.map((elem, idx) => {
                        return (
                            <div key={idx} className="friends">
                                <Link to={`/user/${elem.id}`}>
                                    <img
                                        src={elem.imageurl}
                                        alt={elem.first + " " + elem.last}
                                    />
                                </Link>
                                <h4>{elem.first + " " + elem.last}</h4>
                                <button
                                    onClick={() =>
                                        dispatch(acceptFriendRequest(elem.id))
                                    }
                                >
                                    Accept Friendship
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
