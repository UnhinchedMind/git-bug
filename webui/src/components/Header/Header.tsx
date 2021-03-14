import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { fade } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';

import { LightSwitch, ThemeSwitcher } from '../../components/Themer';
import CurrentIdentity from '../CurrentIdentity/CurrentIdentity';

const useStyles = makeStyles((theme) => ({
  offset: {
    ...theme.mixins.toolbar,
  },
  filler: {
    flexGrow: 1,
  },
  appTitle: {
    ...theme.typography.h6,
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  lightSwitch: {
    padding: '0 20px',
  },
  logo: {
    height: '42px',
    marginRight: theme.spacing(2),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  iconButton: {
    color: fade(theme.palette.primary.contrastText, 0.5),
  },
}));

function Header() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(open ? false : true);
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Link to="/" className={classes.appTitle}>
            <img src="/logo.svg" className={classes.logo} alt="git-bug" />
            git-bug
          </Link>
          <div className={classes.filler}></div>
          <div className={classes.lightSwitch}>
            <LightSwitch />
          </div>
          <div className={classes.lightSwitch}>
            <IconButton
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              className={classes.iconButton}
            >
              <SettingsIcon />
            </IconButton>
          </div>
          <CurrentIdentity />
        </Toolbar>
      </AppBar>
      <Drawer open={open} anchor="top">
        <div className={classes.drawerHeader}>
          <h2>Settings</h2>
          <IconButton aria-label="Close settings menu" onClick={toggleDrawer}>
            {<CloseIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListSubheader>
            <h2>Appearance</h2>
          </ListSubheader>
          <ListItem>
            <ThemeSwitcher />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.offset} />
    </>
  );
}

export default Header;
