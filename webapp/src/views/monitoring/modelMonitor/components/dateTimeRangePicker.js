import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { makeStyles, } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  datePicker: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    padding: 0
  }
}));

export default function DateTimeRangePicker({ onStartDateChange, onEndDateChange, defaultStartDate, defaultEndDate }) {
  const [startDate, setStartDate] = React.useState(defaultStartDate ?? new Date());
  const [endDate, setEndDate] = React.useState(defaultEndDate ?? new Date());
  const classes = useStyles();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (onStartDateChange) onStartDateChange(date);
  };

  const handleEndDateChange = (date) => {
      setEndDate(date);
      if (onEndDateChange) onEndDateChange(date);
  }

  return (
      <div className={classes.root}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.datePicker}>
              <KeyboardDateTimePicker
                margin="normal"
                id="date-time-picker-start"
                label="Start Time"
                value={startDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date time',
                }}
              />
              <KeyboardDateTimePicker
                margin="normal"
                id="date-time-picker-end"
                label="End Time"
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date time',
                }}
              />
            </div>
          </MuiPickersUtilsProvider>
      </div>
  );
}