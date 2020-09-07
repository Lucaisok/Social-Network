import React from "react";
import axios from "./axios";

export default class bioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            draft: props.bio,
        };
    }

    changeEditingMode() {
        this.setState({
            editingMode: !this.state.editingMode,
        });
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    async saveBio(e) {
        e.preventDefault();
        console.log("about to save");
        try {
            const { data } = await axios.post("/bio", this.state);
            console.log("data from server: ", data);
            this.setState({
                editingMode: false,
            });
            this.props.updateBio(data);
        } catch (err) {
            console.log(err);
        }
    }

    getCurrentDisplay() {
        if (this.state.editingMode) {
            return (
                <div className="bio">
                    <form>
                        <textarea
                            name="bioArea"
                            rows="10"
                            cols="50"
                            onChange={(e) => this.handleChange(e)}
                        ></textarea>
                        <button onClick={(e) => this.saveBio(e)}>Save</button>
                    </form>
                </div>
            );
        } else if (this.props.bio) {
            return (
                <div className="editBio">
                    <h2>Bio</h2>
                    <p>{this.props.bio}</p>
                    <button onClick={(e) => this.changeEditingMode(e)}>
                        Edit Bio
                    </button>
                </div>
            );
        } else {
            return (
                <div className="bio">
                    <button onClick={() => this.changeEditingMode()}>
                        Add Bio
                    </button>
                </div>
            );
        }
    }
    render() {
        return <>{this.getCurrentDisplay()}</>;
    }
}
