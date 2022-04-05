import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LayersIcon from '@material-ui/icons/Layers';
import BuildIcon from '@material-ui/icons/Build';
import InsertChartIcon from '@material-ui/icons/InsertChart';

export const links = [
  { name: 'Workspaces', href: "/dsp/console/workspaces", icon: <LayersIcon />},
  { name: 'Deployments', href: '/dsp/console/applications', icon: <DashboardIcon />},
  { name: 'Instances', href: '/dsp/console/instances', icon: <BuildIcon />},
  { name: 'Monitoring', href: '/dsp/console/monitoring', icon: <InsertChartIcon/>}
]
