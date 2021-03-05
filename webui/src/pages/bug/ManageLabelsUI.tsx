import React, { useState } from 'react';

import { Chip } from '@material-ui/core';
import { common } from '@material-ui/core/colors';
import { getContrastRatio } from '@material-ui/core/styles/colorManipulator';

import { Color } from 'src/gqlTypes';

type Props = {
  queriedlabels: any;
};

function ManageLabelsUI({ queriedlabels }: Props) {
  let [searchInput, setSearch] = useState('');
  let [isExisting, setIsExisting] = useState(false);
  let [labels, setLabels] = useState(
    queriedlabels.map((l: any) => {
      return {
        name: l.name,
        R: l.color.R,
        G: l.color.G,
        B: l.color.B,
      };
    })
  );

  const onChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearch(event.target.value);
    testIfExisting(event.target.value.toString());
  };
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  function testIfExisting(input: string) {
    const tmp = labels.filter((l: any) => {
      return l.name.trim().toLowerCase() === input.trim().toLowerCase();
    });
    if (tmp.length > 0) setIsExisting(true);
    else setIsExisting(false);
    console.log(isExisting);
  }
  function searchLabel(labels: string[], search: string): Array<any> {
    if (search === '') return labels;
    return labels.filter((l: any) =>
      l.name.trim().toLowerCase().includes(search.trim().toLowerCase())
    );
  }
  function getLabellist() {
    const _rgb = (color: Color) =>
      'rgb(' + color.R + ',' + color.G + ',' + color.B + ')';

    // Minimum contrast between the background and the text color
    const contrastThreshold = 2.5;
    // Guess the text color based on the background color
    const getTextColor = (background: string) =>
      getContrastRatio(background, common.white) >= contrastThreshold
        ? common.white // White on dark backgrounds
        : common.black; // And black on light ones

    const labelslist = searchLabel(labels, searchInput);

    let list = labelslist.map((label) => {
      const labelcolor: Color = {
        R: label.R,
        G: label.G,
        B: label.B,
      };
      const style = {
        backgroundColor: _rgb(labelcolor),
        color: getTextColor(_rgb(labelcolor)),
      };
      return (
        <div>
          <Chip label={label.name} onDelete={handleDelete} style={style} />
        </div>
      );
    });
    if (!isExisting)
      list.push(
        <div>
          <p>Create new label "{searchInput}"</p>
        </div>
      );
    return list;
  }

  return (
    <div>
      <div>
        <p>Apply labels to this issue</p>
      </div>
      <div>
        <input type="text" value={searchInput} onChange={onChange} />
      </div>
      <div>{getLabellist()}</div>
    </div>
  );
}

export default ManageLabelsUI;
