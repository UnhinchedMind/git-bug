import React, { useEffect, useRef, useState } from 'react';

import { IconButton } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import CheckIcon from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';

import { Color } from '../../../gqlTypes';
import { useListLabelsQuery } from '../../list/ListLabels.generated';
import { BugFragment } from '../Bug.generated';

import { useSetLabelMutation } from './SetLabel.generated';

type DropdownTuple = [string, string, Color];

type FilterDropdownProps = {
  children: React.ReactNode;
  dropdown: DropdownTuple[];
  icon?: React.ComponentType<SvgIconProps>;
  hasFilter?: boolean;
  itemActive: (key: string) => boolean;
  onClose: (selectedItems: string[]) => void;
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
  labelcolor: {
    width: '15px',
    height: '15px',
    display: 'flex',
    backgroundColor: 'blue',
    borderRadius: '0.25rem',
    marginRight: '5px',
    marginLeft: '3px',
  },
  labelsheader: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const _rgb = (color: Color) =>
  'rgb(' + color.R + ',' + color.G + ',' + color.B + ')';

// Create a style object from the label RGB colors
const createStyle = (color: Color) => ({
  backgroundColor: _rgb(color),
  borderBottomColor: darken(_rgb(color), 0.2),
});

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

  const clickCreateLabel = (name: string) => {
    console.log('create ' + name);
  };

  return (
    <>
      <div className={classes.labelsheader}>
        Labels
        <IconButton
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className={classes.element}
        >
          <SettingsIcon fontSize={'small'} />
        </IconButton>
      </div>

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
          const selectedLabels = dropdown
            .map(([key]) => (itemActive(key) ? key : ''))
            .filter((entry) => entry !== '');
          onClose(selectedLabels);
        }}
        onExited={() => setFilter('')}
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
          .sort(function (x, y) {
            // true values first
            return itemActive(x[1]) === itemActive(y[1]) ? 0 : x ? -1 : 1;
          })
          .filter((d) => d[1].toLowerCase().includes(filter.toLowerCase()))
          .map(([key, value, color]) => (
            <MenuItem
              onClick={() => {
                toggleLabel(key, itemActive(key));
              }}
              key={key}
              className={itemActive(key) ? classes.itemActive : undefined}
            >
              {itemActive(key) ? <CheckIcon fontSize={'small'} /> : null}
              <div
                className={classes.labelcolor}
                style={createStyle(color)}
              ></div>
              {value}
            </MenuItem>
          ))}
        {filter !== '' &&
          dropdown.filter((d) => d[1].toLowerCase() === filter.toLowerCase())
            .length <= 0 && (
            <MenuItem onClick={() => clickCreateLabel(filter)}>
              Create new label '{filter}'
            </MenuItem>
          )}
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
  const [selectedLabels, setSelectedLabels] = useState(
    bug.labels.map((l) => l.name)
  );
  const bugLabelNames = bug.labels.map((l) => l.name);

  function toggleLabel(key: string, active: boolean) {
    console.log(key + ' |' + active);
    const labels: string[] = active
      ? selectedLabels.filter((label) => label !== key)
      : selectedLabels.concat([key]);
    console.log('changed selection ' + labels);
    setSelectedLabels(labels);
    /*setLabelMutation({
      variables: {
        input: {
          prefix: bug.id,
          added: active ? [] : [key],
          Removed: active ? [key] : [],
        },
      },
    }).catch((e) => console.log(e));*/
  }

  function diff(oldState: string[], newState: string[]) {
    const added = newState.filter((x) => !oldState.includes(x));
    const removed = oldState.filter((x) => !newState.includes(x));
    console.log('added: ' + added);
    console.log('removed: ' + removed);
    return {
      added: added,
      removed: removed,
    };
  }

  const changeBugLabels = (selectedLabels: string[]) => {
    console.log('selected: ' + selectedLabels);
    const labels = diff(bugLabelNames, selectedLabels);
    setLabelMutation({
      variables: {
        input: {
          prefix: bug.id,
          added: labels.added,
          Removed: labels.removed,
        },
      },
    }).catch((e) => console.log(e));
  };

  function isActive(key: string) {
    return selectedLabels.includes(key);
    //return bugLabelNames.includes(key);
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
      node.color,
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
