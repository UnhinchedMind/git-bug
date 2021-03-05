import React, { useEffect, useState } from 'react';

import { Chip, rgbToHex } from '@material-ui/core';
import { common } from '@material-ui/core/colors';
import { getContrastRatio } from '@material-ui/core/styles/colorManipulator';

import { Color } from 'src/gqlTypes';

function searchLabel(labels: string[], search: string): Array<any> {
  if (search === '') return labels;
  return labels.filter((l: any) =>
    l.name.toLowerCase().includes(search.toLocaleLowerCase())
  );
}

/*
function QueryLabels(): Array<any> {
  const { loading, error, data } = useGetLabelsQuery();
  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  if (!data?.repository?.validLabels) return <p>404.</p>;
  let query = !data?.repository?.validLabels.nodes.map((l) => {
    return { name: l.name, R: l.color.R, G: l.color.G, B: l.color.B };
  });
  console.log(query[0].name);
  console.log(query[0].R + ', ' + query[0].G + ', ' + query[0].B);

  return query;
  rgb:
          'rgb(' +
          l.R.toString +
          ',' +
          l.G.toString +
          ',' +
          l.B.toString +
          ')',
} */

type Props = {
  queriedlabels: any;
};

function ManageLabelsUI({ queriedlabels }: Props) {
  let [searchInput, setSearch] = useState('');
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
  };
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  let query = queriedlabels.map((l: any) => {
    return { name: l.name, R: l.color.R, G: l.color.G, B: l.color.B };
  });
  /*   useEffect(() => {
        setLabels(
            query.map((l: any) => {
                return l.name;
            })
        );
    });*/

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
    return labelslist.map((label) => {
      let labelcolor: Color = {
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
