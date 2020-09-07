import * as io from "socket.io-client";
import { getWall, addMsg } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("most recents messages", (messages) => {
            store.dispatch(getWall(messages));
        });

        socket.on("addChatMsg", (msg) => {
            console.log(
                `got a ${msg} from the client, here I should start my redux process`
            );
            store.dispatch(addMsg(msg));
        });
    }
};
