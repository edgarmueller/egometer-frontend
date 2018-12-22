import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import red from '@material-ui/core/colors/red';
import ErrorIcon from '@material-ui/icons/Error';
import Ionicon from "react-ionicons";
import Radium from "radium";
import { Link } from "react-router-dom";

import { logo } from '../../common/styles';

export const RadiumLink = Radium(Link);

const styles = {
    logo
}

class DefaultErrorBoundary extends React.Component {
    state = {
        isError: false
    }

    static getDerivedStateFromError() {
        return { isError : true };
    }

    render() {
        const { isError } = this.state;
        const { children, classes } = this.props;
        return isError ? 
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', paddingTop: '2em' }}>
                <RadiumLink className={classes.logo} to="/">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <Ionicon icon="md-flash" />
                    egometer
                  </div>
                </RadiumLink>
                <h1 style={{ color: red[500]}}>
                    We are sorry, but something went wrong :(
                </h1>
                <ErrorIcon style={{ color: red[500], fontSize: 50 }} />
                <Typography variant='body1'>Please try again later</Typography>
            </div> : children
    }
}

export default withStyles(styles)(DefaultErrorBoundary)