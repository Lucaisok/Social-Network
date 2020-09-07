import React from "react";

class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <img
                    className="logo"
                    src="/images/logo_transparent.png"
                    alt="Logo"
                />
            </>
        );
    }
}

export default Logo;
