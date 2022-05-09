import React from 'react';
import { makeStyles, } from '@material-ui/core/styles';
import { CardContent, Card } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
      width: '100%',
      marginBottom: '10px',
    },
}));

export default function CardSection({ children }) {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
