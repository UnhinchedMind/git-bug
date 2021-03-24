import React, { useEffect, useRef, useState } from 'react';

import { IconButton } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';

import { useListLabelsQuery } from '../../list/ListLabels.generated';
import { BugFragment } from '../Bug.generated';

import { useSetLabelMutation } from './SetLabel.generated';

type DropdownTuple = [string, string];

type FilterDropdownProps = {
  children: React.ReactNode;
  dropdown: DropdownTuple[];
  icon?: React.ComponentType<SvgIconProps>;
  hasFilter?: boolean;
  itemActive: (key: string) => boolean;
  onClose: () => void;
  toggleLabel: (key: string, active: boolean) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const CustomTextField = withStyles((theme) => ({
  root: {
    margin: '0 8px 12px 8px',
    '& label.Mui-focused': {
      margin: '0 2px',
      color: theme.palette.text.secondary,
    },
    '& .MuiInput-underline::before': {
      borderBottomColor: theme.palette.divider,
    },
    '& .MuiInput-underline::after': {
      borderBottomColor: theme.palette.divider,
    },
  },
}))(TextField);

const ITEM_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  element: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 1),
    fontWeight: 400,
    textDecoration: 'none',
    display: 'flex',
    background: 'none',
    border: 'none',
  },
  itemActive: {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  icon: {
    paddingRight: theme.spacing(0.5),
  },
}));

function FilterDropdown({
  children,
  dropdown,
  icon: Icon,
  hasFilter,
  itemActive,
  onClose,
  toggleLabel,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLButtonElement>(null);
  const classes = useStyles({ active: false });

  useEffect(() => {
    searchRef && searchRef.current && searchRef.current.focus();
  }, [filter]);

  return (
    <>
      Labels
      <IconButton
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={classes.element}
      >
        <SettingsIcon fontSize={'small'} />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        ref={searchRef}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={open}
        onClose={() => {
          setOpen(false);
          onClose();
        }}
        anchorEl={buttonRef.current}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '25ch',
          },
        }}
      >
        {hasFilter && (
          <CustomTextField
            onChange={(e) => {
              const { value } = e.target;
              setFilter(value);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            value={filter}
            label={`Filter ${children}`}
          />
        )}
        {dropdown
          .filter((d) => d[1].toLowerCase().includes(filter.toLowerCase()))
          .map(([key, value]) => (
            <MenuItem
              onClick={() => {
                toggleLabel(key, itemActive(key));
              }}
              key={key}
              className={itemActive(key) ? classes.itemActive : undefined}
            >
              {value}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}

type Props = {
  bug: BugFragment;
};
function LabelMenu({ bug }: Props) {
  const { data: labelsData } = useListLabelsQuery();
  const [setLabelMutation] = useSetLabelMutation();
  const [selectedLabels, selectLabel] = useState([]);

  function toggleLabel(key: string, active: boolean) {
    console.log(key + ' |' + active);
  }

  const changeBugLabels = () => {
    /*setLabelMutation({
      variables: {
        input: {
          prefix: bug.id,
          added: add,
          Removed: remove,
        },
      },
    }).catch((e) => console.log(e)); */
  };

  const bugLabels = bug.labels;
  const bugLabelNames = bugLabels.map((l) => l.name);

  function isActive(key: string) {
    return bugLabelNames.includes(key);
  }

  let labels: any = [];
  if (
    labelsData?.repository &&
    labelsData.repository.validLabels &&
    labelsData.repository.validLabels.nodes
  ) {
    labels = labelsData.repository.validLabels.nodes.map((node) => [
      node.name,
      node.name,
    ]);
  }

  return (
    <FilterDropdown
      onClose={changeBugLabels}
      itemActive={isActive}
      toggleLabel={toggleLabel}
      dropdown={labels}
      hasFilter
    >
      Labels
    </FilterDropdown>
  );
}

export default LabelMenu;
