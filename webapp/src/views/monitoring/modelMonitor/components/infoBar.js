import React, { useState } from 'react';
import moment from 'moment';
import 'rsuite/dist/rsuite.min.css';
import { DateRangePicker, IconButton, ButtonToolbar, ButtonGroup, Button } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';

export default function MaterialUIPickers(props) {
  const { onDateTimeRangeChange, onRefresh } = props;
  const [ dateTimeRange, setDateTimeRange ] = useState([]);
  
  return (
    <ButtonToolbar>
      <DateRangePicker
        format="MM/dd/yyyy HH:mm"
        cleanable
        defaultValue={[moment().subtract(1, 'months').toDate(), moment().toDate()]}
        value={dateTimeRange}
        onChange={(range) => { 
          onDateTimeRangeChange(range);
          setDateTimeRange(range);
        }}
        onClean={() => {
          onDateTimeRangeChange([]);
          setDateTimeRange([]);
        }}
        style={{width: 400}}/>
      <ButtonGroup>
          <Button style={{background: "white", border: '1px solid #E8E8E8'}} 
                          onClick={() => onDateTimeRangeChange([moment().subtract(1, 'hours').toDate(), moment().toDate()])}>1H</Button>
          <Button style={{background: "white", border: '1px solid #E8E8E8'}}
                  onClick={() => onDateTimeRangeChange([moment().subtract(6, 'hours').toDate(), moment().toDate()])}>6H</Button>
          <Button style={{background: "white", border: '1px solid #E8E8E8'}}
                  onClick={() => onDateTimeRangeChange([moment().subtract(1, 'days').toDate(), moment().toDate()])}>1D</Button>
          <Button style={{background: "white", border: '1px solid #E8E8E8'}}
                  onClick={() => onDateTimeRangeChange([moment().subtract(1, 'weeks').toDate(), moment().toDate()])}>1W</Button>
          <Button style={{background: "white", border: '1px solid #E8E8E8'}}
                  onClick={() => onDateTimeRangeChange([moment().subtract(1, 'months').toDate(), moment().toDate()])}>1M</Button>
          <Button style={{background: "white", border: '1px solid #E8E8E8'}}
                  onClick={() => onDateTimeRangeChange([moment().subtract(3, 'months').toDate(), moment().toDate()])}>3M</Button>
        </ButtonGroup>
        <IconButton icon={<ReloadIcon />} onClick={onRefresh} appearance="primary" />
      </ButtonToolbar>
  );
}