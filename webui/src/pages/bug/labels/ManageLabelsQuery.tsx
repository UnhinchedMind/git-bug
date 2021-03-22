import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { BugFragment } from '../Bug.generated';

import { useGetLabelsQuery } from './ManageLabelsQuery.generated';
import ManageLabelsUI from './ManageLabelsUI';

type Props = {
  bug: BugFragment;
  isLabelSettingsOpen: boolean;
};

const LabelQuery: React.FC<Props> = ({ isLabelSettingsOpen, bug }) => {
  const { loading, error, data } = useGetLabelsQuery();
  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  if (!data?.repository?.validLabels.nodes) return <p>404.</p>;

  //Extract Values from GraphQL Label Query
  function createLabelArray(ar: Array<any>, isActive: boolean) {
    return ar.map((l: any) => {
      return {
        name: l.name,
        color: {
          R: l.color.R,
          G: l.color.G,
          B: l.color.B,
        },
        isActive: isActive,
      };
    });
  }

  //Labels attached to specific Bug (active Labels)
  const bugLabels = createLabelArray(bug.labels, true);
  //All Queried Labels
  const queriedLabels = createLabelArray(
    data.repository.validLabels.nodes,
    false
  );

  let labellist = bugLabels;

  //(+add every nonactive Label to labellist)
  const bugLabelNames = bugLabels.map((l) => l.name);
  console.log(bugLabelNames);
  console.log(queriedLabels.map((l) => l.name));
  queriedLabels.forEach((l, index) => {
    if (!bugLabelNames.includes(l.name)) {
      labellist.push(l);
    }
  });

  return (
    <ManageLabelsUI
      bug={bug}
      labellist={labellist}
      isLabelSettingsOpen={isLabelSettingsOpen}
    />
  );
};

export default LabelQuery;
