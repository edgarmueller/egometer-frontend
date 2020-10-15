import React from 'react';
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";
import { logout } from '../../actions';

const hasValidToken = token => {
    if (!token) {
        return false;
    }
    const decoded = jwtDecode(token);
    return decoded.exp > new Date().getTime() / 1000;
}

class PeriodicAuthCheck extends React.Component {
    constructor(props) {
        super(props)
        // interval in seconds
        this.interval = 10
    }

    authCheck = (loginPath) => () => {
        const { token, logout } = this.props;
        if (!hasValidToken(token)) {
            if (window.location.hash !== `#${loginPath}`) {
                logout(loginPath);
            }
        }
    }

    componentDidMount() {
        const { loginPath, logout } = this.props;
        this.authCheck(loginPath)();
        this.interval = setInterval(this.authCheck(loginPath), this.interval * 1000, loginPath, logout)
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

const mapDispatchToProps = dispatch => {
    return {
        logout: (loginPath) => dispatch(logout(loginPath))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicAuthCheck)