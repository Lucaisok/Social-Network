// all of our action creator functions goes here
import axios from "./axios";

export async function receiverFriendsAndWannabes() {
    const { data } = await axios.get("/friends.json");
    console.log("data in actions.js received from server: ", data);
    return {
        type: "RECEIVE_FRIENDS",
        friendsAndWannabes: data,
    };
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post(`/accept-friend-request/${id}`);
    console.log("data in action.js: ", data);
    return {
        type: "ACCEPT_FRIENDSHIP",
        id,
    };
}

export async function endFriendship(id) {
    const { data } = await axios.post(`/end-friendship/${id}`);
    console.log("data in action.js: ", data);
    return {
        type: "END_FRIENDSHIP",
        id,
    };
}

export function getWall(messages) {
    return {
        type: "GET_WALL",
        messages,
    };
}

export function addMsg(msg) {
    return {
        type: "ADD_MSG",
        msg,
    };
}
