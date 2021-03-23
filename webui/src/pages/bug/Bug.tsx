import React, { useState } from 'react';

import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';

import Label from '../../components/Label';
import Author from 'src/components/Author';
import Date from 'src/components/Date';
import IfLoggedIn from 'src/layout/IfLoggedIn';

import { BugFragment } from './Bug.generated';
import CommentForm from './CommentForm';
import TimelineQuery from './TimelineQuery';
import ManageLabelsQuery from './labels/ManageLabelsQuery';

const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: 1000,
    margin: 'auto',
    marginTop: theme.spacing(4),
  },
  header: {
    marginLeft: theme.spacing(3) + 40,
  },
  title: {
    ...theme.typography.h5,
  },
  id: {
    ...theme.typography.subtitle1,
    marginLeft: theme.spacing(1),
  },
  container: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  timeline: {
    flex: 1,
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    minWidth: 400,
  },
  sidebar: {
    marginTop: theme.spacing(2),
    flex: '0 0 200px',
  },
  sidebarTitle: {
    fontWeight: 'bold',
  },
  labelList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  label: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > *': {
      display: 'block',
    },
  },
  noLabel: {
    ...theme.typography.body2,
  },
  commentForm: {
    marginLeft: 48,
  },
}));

type Props = {
  bug: BugFragment;
};

function Bug({ bug }: Props) {
  let [isLabelSettingsOpen, setIsLabelSettingsOpen] = useState(false);
  const classes = useStyles();

  function clickLabelSettings() {
    isLabelSettingsOpen
      ? setIsLabelSettingsOpen(false)
      : setIsLabelSettingsOpen(true);
  }

  return (
    <main className={classes.main}>
      <div className={classes.header}>
        <span className={classes.title}>{bug.title}</span>
        <span className={classes.id}>{bug.humanId}</span>

        <Typography color={'textSecondary'}>
          <Author author={bug.author} />
          {' opened this bug '}
          <Date date={bug.createdAt} />
        </Typography>
      </div>

      <div className={classes.container}>
        <div className={classes.timeline}>
          <TimelineQuery id={bug.id} />
          <IfLoggedIn>
            {() => (
              <div className={classes.commentForm}>
                <CommentForm bugId={bug.id} />
              </div>
            )}
          </IfLoggedIn>
        </div>
        <div className={classes.sidebar}>
          <span className={classes.sidebarTitle}>
            Labels
            <IconButton onClick={clickLabelSettings}>
              <SettingsIcon fontSize={'small'} />
            </IconButton>
          </span>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {bug.labels.map((label, index) => (
                <Label key={index} label={label} />
              ))}
            </div>

            <ManageLabelsQuery
              bug={bug}
              isLabelSettingsOpen={isLabelSettingsOpen}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Bug;
