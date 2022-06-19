import React from 'react';
import BaseLayout from '../../baseLayout';
import { Box } from '@material-ui/core';
import ServiceMetrics from './serviceMetrics';
import LogEventsDisplay from './logging';
import PerformanceTab from './performance';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function ModelMonitor(props) 
{
  const [value, setValue] = React.useState("0");
  const { match: { params } } = props;
  const workspaceId = params.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BaseLayout>
      <Box sx={{ width: '100%', typography: 'body' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <TabList onChange={handleChange} aria-label="monitoring options">
              <Tab label="Overview" value="0" />
              <Tab label="Logs" value="1" />
              <Tab label="Data Drifts" value="2" />
              <Tab label="Data Quality" value="3" />
              <Tab label="Custom" value="4" />
            </TabList>
          </Box>
          <TabPanel value="0" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <ServiceMetrics workspaceId={workspaceId}/>
          </TabPanel>
          <TabPanel value="1" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <LogEventsDisplay workspaceId={workspaceId}/>
          </TabPanel>
          <TabPanel value="2" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <PerformanceTab workspaceId={workspaceId}/>
          </TabPanel>
          <TabPanel value="3" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <PerformanceTab workspaceId={workspaceId}/>
          </TabPanel>
          <TabPanel value="4" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <PerformanceTab workspaceId={workspaceId}/>
          </TabPanel>
        </TabContext>
      </Box>
    </BaseLayout>
  );
}
