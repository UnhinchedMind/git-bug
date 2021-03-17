import React, { useState } from 'react';

import { Chip } from '@material-ui/core';
import { common } from '@material-ui/core/colors';
import { getContrastRatio } from '@material-ui/core/styles/colorManipulator';

import { Color } from 'src/gqlTypes';

type Props = {
  queriedlabels: any;
  isLabelSettingsOpen: boolean;
};

function ManageLabelsUI({ queriedlabels, isLabelSettingsOpen }: Props) {
  let [searchInput, setSearch] = useState('');
  let [isExisting, setIsExisting] = useState(false);

  let [labels] = useState(
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

  const clickAddLabel = () => {
    console.log('ADD LABEL' + searchInput);
  };

  function testIfExisting(input: string) {
    const tmp = labels.filter((l: any) => {
      return l.name.trim().toLowerCase() === input.trim().toLowerCase();
    });
    tmp.length > 0 ? setIsExisting(true) : setIsExisting(false);
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
        width: '15px',
        height: '15px',
        display: 'flex',
        backgroundColor: _rgb(labelcolor),
        color: getTextColor(_rgb(labelcolor)),
        borderRadius: '0.25rem',
        marginRight: '5px',
      };

      return (
        <li
          className={'labelListelem'}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '3px',
            border: '1px solid',
          }}
        >
          <div className={'labelcolor'} style={style} />
          <div className={'labelname'}> {label.name}</div>
        </li>
      );
    });

    if (!isExisting && searchInput !== '')
      list.push(
        <div
          onClick={clickAddLabel}
          style={{ cursor: 'pointer', border: '1px solid black' }}
        >
          <p>Create new label "{searchInput}"</p>
        </div>
      );
    return list;
  }

  if (isLabelSettingsOpen) {
    return (
      <div style={{ border: '1px solid black', padding: '10px' }}>
        <div>
          <p>Apply labels to this issue</p>
        </div>
        <div>
          <input
            type="text"
            value={searchInput}
            onChange={onChange}
            placeholder={'Filter Labels'}
          />
        </div>
        <ul
          style={{
            listStyle: 'none',
            paddingLeft: '0',
          }}
        >
          {getLabellist()}
        </ul>
      </div>
    );
  } else return null;
}

export default ManageLabelsUI;
