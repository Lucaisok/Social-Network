import React from "react";
import axios from "./axios";
import Logo from "./home";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Chat from "./chat";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // first: "",
            // last: "",
            // imageUrl: "",
            // bio: "",
            uploaderIsVisible: false,
        };
        this.updateBio = this.updateBio.bind(this);
        this.uploaderMethod = this.uploaderMethod.bind(this);
    }

    async componentDidMount() {
        try {
            const { data } = await axios.get("/user");
            console.log("data from server: ", data);
            this.setState({
                first: data.first,
                last: data.last,
                imageUrl: data.imageurl,
                bio: data.bio,
            });
        } catch (err) {
            console.log(err);
        }
    }

    toggleModal() {
        console.log("toggle is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible, //much better than true!
        });
    }

    uploaderMethod(image) {
        console.log("Im running in App!!! and my argument is: ", image);
        this.setState({
            imageUrl: image,
            uploaderIsVisible: false,
        });
    }

    updateBio(bio) {
        console.log("I am running in App and my argument is: ", bio);
        this.setState({
            bio: bio,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    {/* <Link to="/">
                        <Logo />
                    </Link> */}
                    <Link to={"/"}>
                        <img className="logo" src={this.state.imageUrl} />
                    </Link>
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                toggleModal={() => this.toggleModal()}
                                bio={this.state.bio}
                                updateBio={(bio) => this.updateBio(bio)}
                                uploaderIsVisible={this.state.uploaderIsVisible}
                                uploaderMethod={(image) =>
                                    this.uploaderMethod(image)
                                }
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    ></Route>
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    ></Route>
                    <Route path="/users" component={FindPeople}></Route>
                    <Route path="/friends" component={Friends}></Route>
                    <Route path="/chat" component={Chat} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
