import React, { useState } from 'react';
import moment from 'moment';
import { Row, Col, Grid, IconButton } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { DateRangePicker, Input, ButtonToolbar, ButtonGroup, Button } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';

export default function MaterialUIPickers(props) {
  const { workspaceId, onDateTimeRangeChange, onRefresh } = props;
  const [ dateTimeRange, setDateTimeRange ] = useState([]);
  
  const info = `Workspace ID: ${workspaceId}`
  return (
    <Grid fluid style={{padding: 0, marginBottom: 10}}>
      <Row>
        <Col xs={8} sm={8} md={8}>
          <Input readonly value={info} />
        </Col>
        <Col xs={6} sm={6} md={6}>
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
            }}/>
        </Col>
        <Col>
          <ButtonToolbar>
            <ButtonGroup size="sm">
              <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}} 
                      onClick={() => onDateTimeRangeChange([moment().subtract(1, 'hours').toDate(), moment().toDate()])}>1H</Button>
              <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                      onClick={() => onDateTimeRangeChange([moment().subtract(6, 'hours').toDate(), moment().toDate()])}>6H</Button>
              <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                      onClick={() => onDateTimeRangeChange([moment().subtract(1, 'days').toDate(), moment().toDate()])}>1D</Button>
              <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                      onClick={() => onDateTimeRangeChange([moment().subtract(1, 'weeks').toDate(), moment().toDate()])}>1W</Button>
              <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                      onClick={() => onDateTimeRangeChange([moment().subtract(1, 'months').toDate(), moment().toDate()])}>1M</Button>
              <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                      onClick={() => onDateTimeRangeChange([moment().subtract(3, 'months').toDate(), moment().toDate()])}>3M</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col xs={1} style={{paddingLeft: 0}}>
            <IconButton style={{marginTop: 1, marginLeft: 3, padding: 5, border: '1px solid #E8E8E8', background: 'white'}}
                onClick={onRefresh}
                size="lg"
                icon={<ReloadIcon/>}/>
        </Col>
      </Row>
  </Grid>
  );
}