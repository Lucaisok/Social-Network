export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        state = Object.assign({}, state, {
            friendsAndWannabes: action.friendsAndWannabes,
        });
    }
    if (action.type == "ACCEPT_FRIENDSHIP") {
        state = Object.assign({}, state, {
            friendsAndWannabes: state.friendsAndWannabes.map(
                (friendsAndWannabe) => {
                    if (friendsAndWannabe.id != action.id) {
                        return friendsAndWannabe;
                    } else {
                        return {
                            ...friendsAndWannabe,
                            accepted: true,
                        };
                    }
                }
            ),
        });
    }
    if (action.type == "END_FRIENDSHIP") {
        state = Object.assign({}, state, {
            friendsAndWannabes: state.friendsAndWannabes.filter(
                (friendsAndWannabe) => friendsAndWannabe.id != action.id
            ),
        });
    }
    if (action.type == "GET_WALL") {
        state = {
            ...state,
            messages: action.messages,
        };
    }
    if (action.type == "ADD_MSG") {
        state = {
            ...state,
            messages: [...state.messages, action.msg],
        };
    }
    console.log("ZZZ", state);
    return state;
}

//... (SPREAD OPERATOR)
// makes clones of Objs and arrays
//we can add new props to these clones

// OBJ
// var obj = {
//     name: "Luca",
// };
// var newObj = {
//     ...obj,
//     last: "Tomarelli",
// };

// ARRAY
// var arr = [10, 20, 30];
// var newArr = [0, ...arr, 40];

// USEFUL ARRAY METHODS

//MAP
//useful for cloning / changing each element or finding one specific element and change it
// is a loop and returns a new array

//FILTER
//useful for removing things from the array
// is a loop and returns a new array

//CONCAT
//useful for merging two arrays togheter (but you can use the spread operator for it)
// is not a loop but returns a new array
