import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

export class ShowMessageDialog extends React.Component {

    render() {

        const {
            open,
            onClose,
            title,
            text
        } = this.props;

        return (
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-schema-title"
                aria-describedby="alert-schema-description"
            >
                <DialogTitle id="alert-schema-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}