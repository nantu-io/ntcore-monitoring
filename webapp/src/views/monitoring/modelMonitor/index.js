import React from 'react';
import BaseLayout from '../../baseLayout';
import { Box } from '@material-ui/core';
import ServiceMetrics from './serviceMetrics';
import LogEventsDisplay from './logging';
import CustomMetrics from './customMetrics'
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

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
              <Tab label="Custom" value="2" />
            </TabList>
          </Box>
          <TabPanel value="0" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <ServiceMetrics workspaceId={workspaceId}/>
          </TabPanel>
          <TabPanel value="1" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <LogEventsDisplay workspaceId={workspaceId}/>
          </TabPanel>
          <TabPanel value="2" style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16}}>
            <CustomMetrics workspaceId={workspaceId}/>
          </TabPanel>
        </TabContext>
      </Box>
    </BaseLayout>
  );
}
