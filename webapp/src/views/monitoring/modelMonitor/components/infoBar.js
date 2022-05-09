import 'date-fns';
import React from 'react';
import { makeStyles, } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%'
  },
  infoElement: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoElementTitle: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  infoElementValue: {
    fontSize: '14px',
    fontWeight: 'light'
  },
}));

// metrics: [...{title, value}]
export default function MaterialUIPickers({ metrics }) {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <Box className={classes.infoElement}>
          <Typography variant="p" className={classes.infoElementTitle}>
            Type
          </Typography>
          <Typography variant="p" className={classes.infoElementValue}>
            Logistic Regression
          </Typography>
        </Box>
        <Box className={classes.infoElement}>
          <Typography variant="p" className={classes.infoElementTitle}>
            Version
          </Typography>
          <Typography variant="p" className={classes.infoElementValue}>
            1
          </Typography>
        </Box>
        <Box className={classes.infoElement}>
          <Typography variant="p" className={classes.infoElementTitle}>
            Release date
          </Typography>
          <Typography variant="p" className={classes.infoElementValue}>
            9/3/2021 10:32:18AM
          </Typography>
        </Box>
      </div>
  );
}