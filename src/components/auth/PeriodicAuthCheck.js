import React from 'react';
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";
import { logout } from '../../actions';

const hasValidToken = token => {
    if (!token) {
        return false;
    }
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now()/1000;
}

class PeriodicAuthCheck extends React.Component {
    constructor(props) {
        super(props)
        // interval in seconds
        this.interval = 60
    }

    authCheck = (loginPath, dispatchAction) => {
        const { token } = this.props;
        if (!hasValidToken(token)) {
            if (token != null && window.location.hash !== `#${loginPath}`) {
                dispatchAction(loginPath)
            }
        }
    }

    componentDidMount() {
        const { loginPath, logout } = this.props;
        this.authCheck(loginPath, logout);
        this.interval = setInterval(this.authCheck, this.interval * 1000, loginPath, logout)
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