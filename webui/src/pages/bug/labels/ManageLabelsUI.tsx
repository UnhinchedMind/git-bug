import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';

import { Color } from 'src/gqlTypes';

type Props = {
  labellist: any;
  isLabelSettingsOpen: boolean;
};

function ManageLabelsUI({ labellist, isLabelSettingsOpen }: Props) {
  let [searchInput, setSearch] = useState('');
  let [isExisting, setIsExisting] = useState(false);

  let [labels] = useState(labellist);

  const onSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearch(event.target.value);
    testIfExisting(event.target.value.toString());
  };

  const handleLabelClick = () => {
    console.log('Label in List Clicked');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const clickAddLabel = () => {
    console.log('ADD LABEL' + searchInput);
  };

  //Helperfunction for SearchLabelfunction (to dont be able to add existing labels)
  function testIfExisting(input: string) {
    const tmp = labels.filter((l: any) => {
      return l.name.trim().toLowerCase() === input.trim().toLowerCase();
    });
    tmp.length > 0 ? setIsExisting(true) : setIsExisting(false);
  }

  function searchLabel(labels: any[], search: string): Array<any> {
    if (search === '') return labels;
    return labels.filter((l: any) =>
      l.name.trim().toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  // Construct HTML Elements for all Labels
  function getLabellist() {
    const _rgb = (color: Color) =>
      'rgb(' + color.R + ',' + color.G + ',' + color.B + ')';

    //only display searched labels (or all if no search)
    const labelslist = searchLabel(labels, searchInput);

    let list = labelslist.map((label, index) => {
      const labelcolor: Color = {
        R: label.color.R,
        G: label.color.G,
        B: label.color.B,
      };
      const style = {
        width: '15px',
        height: '15px',
        display: 'flex',
        backgroundColor: _rgb(labelcolor),
        borderRadius: '0.25rem',
        marginRight: '5px',
        marginLeft: '3px',
      };

      if (label.isActive) {
        return (
          <li
            key={index}
            onClick={handleLabelClick}
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
            <CheckIcon fontSize={'small'}></CheckIcon>
            <div className={'labelcolor'} style={style}></div>
            <div className={'labelname'} style={{ width: '100px' }}>
              {' '}
              {label.name}
            </div>
            <CancelIcon
              fontSize={'small'}
              style={{ justifySelf: 'flex-end' }}
            ></CancelIcon>
          </li>
        );
      } else
        return (
          <li
            key={index}
            onClick={handleLabelClick}
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
          style={{
            cursor: 'pointer',
            border: '1px solid black',
          }}
        >
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-around',
            }}
          >
            Create new label "{searchInput}" <AddIcon />
          </p>
        </div>
      );
    return list;
  }

  //Display List of All Labels
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
            onChange={onSearchChange}
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
