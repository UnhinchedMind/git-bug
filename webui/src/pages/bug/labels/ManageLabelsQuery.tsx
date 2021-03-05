import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { useGetLabelsQuery } from './ManageLabelsQuery.generated';
import ManageLabelsUI from './ManageLabelsUI';

const LabelQuery: React.FC<any> = () => {
  const { loading, error, data } = useGetLabelsQuery();
  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  if (!data?.repository?.validLabels.nodes) return <p>404.</p>;
  return <ManageLabelsUI queriedlabels={data.repository.validLabels.nodes} />;
};

export default LabelQuery;
