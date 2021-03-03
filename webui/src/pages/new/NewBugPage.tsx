import React, { FormEvent, useState } from 'react';

import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';

import CommentInput from '../../components/CommentInput/CommentInput';

import { useNewBugMutation } from './NewBug.generated';

/**
 * Css in JS styles
 */
const useStyles = makeStyles((theme: Theme) => ({
  main: {
    maxWidth: 800,
    margin: 'auto',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    overflow: 'hidden',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  greenButton: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

/**
 * Form to create a new issue
 */
function NewBugPage() {
  const [newBug, { loading, error }] = useNewBugMutation();
  const [issueTitle, setIssueTitle] = useState('');
  const [issueComment, setIssueComment] = useState('');
  const classes = useStyles();
  let issueTitleInput: any;

  function submitNewIssue(e: FormEvent) {
    e.preventDefault();
    if (!isFormValid()) return;
    newBug({
      variables: {
        input: {
          title: issueTitle,
          message: issueComment,
        },
      },
    });
    issueTitleInput.value = '';
  }

  function isFormValid() {
    return issueTitle.length > 0 && issueComment.length > 0 ? true : false;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <Paper className={classes.main}>
      <form className={classes.form} onSubmit={submitNewIssue}>
        <TextField
          inputRef={(node) => {
            issueTitleInput = node;
          }}
          label="Title"
          variant="outlined"
          fullWidth
          margin="dense"
          onChange={(event: any) => setIssueTitle(event.target.value)}
        />
        <CommentInput
          loading={false}
          onChange={(comment: string) => setIssueComment(comment)}
        />
        <div className={classes.actions}>
          <Button
            className={classes.greenButton}
            variant="contained"
            type="submit"
            disabled={isFormValid() ? false : true}
          >
            Submit new issue
          </Button>
        </div>
      </form>
    </Paper>
  );
}

export default NewBugPage;