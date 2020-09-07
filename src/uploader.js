import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("props in uploader: ", props);
    }
    componentDidMount() {
        console.log("Uploader mounted");
    }

    async handleChange(e) {
        e.preventDefault();
        console.log("smt happens");
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        try {
            const { data } = await axios.post("/upload", formData);
            console.log(data[0].imageurl);
            this.props.uploaderMethod(data[0].imageurl);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <>
                <div className="uploader">
                    {/* <p onClick={this.props.toggleModal}>X</p> */}
                    <h2>Upload Profile Image</h2>
                    <form>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="file"
                            name="file"
                            accept="image/*"
                        />
                    </form>
                </div>
            </>
        );
    }
}
