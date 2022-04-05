import React from 'react';
import BaseLayout from '../../baseLayout';
import { Container, Tabs, Tab, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import MonitorOverviewTab from './overview';

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
    const { match: {params} } = props;
    const workspaceId = params.id;

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <BaseLayout>
            <Container>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Overview" {...a11yProps(0)} />
                        <Tab label="Performance" {...a11yProps(1)} />
                        <Tab label="Drift" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <MonitorOverviewTab workspaceId={workspaceId}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
            </Container>
        </BaseLayout>
    );
}
