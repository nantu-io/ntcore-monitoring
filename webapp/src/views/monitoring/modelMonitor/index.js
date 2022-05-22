import React from 'react';
import BaseLayout from '../../baseLayout';
import { Tabs, Tab, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import MonitorOverviewTab from './overview';
import OutLiersTab from './outliers';
import Performance from './performance';
import ServiceMetrics from './serviceMetrics';
import LogEventsDisplay from './logging';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ModelMonitor(props) {
  const [value, setValue] = React.useState(0);
  const { match: { params } } = props;
  const workspaceId = params.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BaseLayout>
      <div style={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Performance" {...a11yProps(1)} />
            <Tab label="Service Metrics" {...a11yProps(2)} />
            <Tab label="Outliers" {...a11yProps(3)} />
            <Tab label="Data Drifts" {...a11yProps(4)} />
            <Tab label="Logs" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <MonitorOverviewTab workspaceId={workspaceId} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Performance />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ServiceMetrics workspaceId={workspaceId}/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <OutLiersTab />
        </TabPanel>
        <TabPanel value={value} index={4}>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <LogEventsDisplay workspaceId={workspaceId}/>
        </TabPanel>
      </div>
    </BaseLayout>
  );
}
