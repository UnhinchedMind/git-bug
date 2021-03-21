import React from 'react';

import { CircularProgress } from '@material-ui/core';

import { ChangeLabelInput } from '../../../gqlTypes';

import { useGetLabelsQuery } from './ManageLabelsQuery.generated';

type Props = {
  input: ChangeLabelInput;
};
const SetLabelMutation: React.FC<Props> = ({ input }) => {
  const { loading, error, data } = useGetLabelsQuery();
  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  if (!data?.repository?.validLabels.nodes) return <p>404.</p>;

  return <p></p>;
};

export default SetLabelMutation;
