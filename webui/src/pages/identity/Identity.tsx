import React from 'react';

import { Link, Paper, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

import { IdentityFragment } from '../../components/CurrentIdentity/IdentityFragment.generated';

import BugList from './BugList';

const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: 1000,
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  content: {
    padding: theme.spacing(0.5, 2, 2, 2),
    wordWrap: 'break-word',
  },
  large: {
    width: 200,
    height: 200,
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  heading: {
    marginTop: theme.spacing(3),
  },
  header: {
    ...theme.typography.h4,
  },
  infoIcon: {
    verticalAlign: 'bottom',
  },
}));

type Props = {
  identity: IdentityFragment;
};
const Identity = ({ identity }: Props) => {
  const classes = useStyles();
  const user = identity;

  return (
    <main className={classes.main}>
      <Paper elevation={3} className={classes.content}>
        <Grid spacing={2} container direction="row" alignItems="flex-start">
          <Grid className={classes.heading} item xs={3}>
            <Avatar
              src={user?.avatarUrl ? user.avatarUrl : undefined}
              className={classes.large}
            >
              {user?.displayName.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item>
            <h1 className={classes.header}>
              {user?.displayName ? user?.displayName : 'none'}
            </h1>
            <Typography variant="h5" component="h2">
              Your account
            </Typography>
            <Typography variant="subtitle2" component="h2">
              Name: {user?.name ? user?.name : '---'}
            </Typography>
            <Typography variant="subtitle2" component="h3">
              Id (truncated): {user?.humanId ? user?.humanId : '---'}
              <InfoIcon
                fontSize={'small'}
                titleAccess={user?.id ? user?.id : '---'}
                className={classes.infoIcon}
              />
            </Typography>
            <Typography variant="subtitle2" component="h3">
              Login: {user?.login ? user?.login : '---'}
            </Typography>
            {user?.email && (
              <Typography
                variant="subtitle2"
                component="h3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <MailOutlineIcon />
                <Link href={'mailto:' + user?.email} color={'inherit'} />
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Typography variant="h5" component="h2">
              Bugs authored by {user?.displayName}
            </Typography>
            <BugList humanId={user?.humanId ? user?.humanId : ''} />
          </Grid>
        </Grid>
      </Paper>
    </main>
  );
};

export default Identity;
