import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

import { LightSwitch } from '../../components/Themer';
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
  greenButton: {
    backgroundColor: '#2ea44fd9',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2ea44f',
    },
  },
}));

function Header() {
  const classes = useStyles();

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
          <CurrentIdentity />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
}

export default Header;
