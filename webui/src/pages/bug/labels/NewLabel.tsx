import React from 'react';

import { Chip } from '@material-ui/core';
import { common } from '@material-ui/core/colors';
import {
  darken,
  getContrastRatio,
} from '@material-ui/core/styles/colorManipulator';

import { LabelFragment } from '../../../components/fragments.generated';
import { Color } from '../../../gqlTypes';

const _rgb = (color: Color) =>
  'rgb(' + color.R + ',' + color.G + ',' + color.B + ')';

// Minimum contrast between the background and the text color
const contrastThreshold = 2.5;
// Guess the text color based on the background color
const getTextColor = (background: string) =>
  getContrastRatio(background, common.white) >= contrastThreshold
    ? common.white // White on dark backgrounds
    : common.black; // And black on light ones

// Create a style object from the label RGB colors
const createStyle = (color: Color) => ({
  backgroundColor: _rgb(color),
  color: getTextColor(_rgb(color)),
  borderBottomColor: darken(_rgb(color), 0.2),
});

const handleDelete = () => {
  console.info('You clicked the delete icon.');
};

type Props = { label: LabelFragment };
function NewLabel({ label }: Props) {
  return (
    <div>
      <Chip
        label={label.name}
        style={createStyle(label.color)}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default NewLabel;
