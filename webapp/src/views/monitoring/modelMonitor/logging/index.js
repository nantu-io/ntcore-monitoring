import React from 'react';
import TextField from '@material-ui/core/TextField';
import CardLayout from '../components/cardLayout';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        padding: '0px 0px',
    },
    buttonGroup: {
        '& > *': {
            marginTop: theme.spacing(3),
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(1),
        },
    },
    logs: {
        backgroundColor: '#eeeeee',
        whiteSpace: 'nowrap',
    },
    textField: {

    }
}));

export default function LogEventsDisplay() 
{
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CardLayout className={classes.background}>
                <TextField
                    inputProps={{ readOnly: true, disabled: true, style:{fontSize: 15} }}
                    id="logEvents"
                    multiline
                    fullWidth
                    rows={15}
                    value={"2022-05-19 00:19:28  [INFO] Receive 1 prediction request."}
                    variant="outlined"
                    className={classes.textField}/>
            </CardLayout>
        </div>
    )
}