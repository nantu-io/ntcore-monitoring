import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import BaseLayout from '../baseLayout';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = (theme) => ({

});

class Monitoring extends Component {
    render() {
        return (
            <BaseLayout index={0}>
                 <MuiAlert elevation={6} variant="filled" severity="success" style={{width: '100%', height: '70'}}>
                    Deployments section is available in NTCore Open Source.
                </MuiAlert> 
            </BaseLayout>
        )
    }
}

export default withStyles(useStyles)(Monitoring)