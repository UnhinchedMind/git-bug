import React, { useEffect, useState } from 'react';

function searchLabel(labels: string[], search: string): Array<any> {
  if (search === '') return labels;
  return labels.filter((l: string) =>
    l.toLowerCase().includes(search.toLocaleLowerCase())
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
} */

type Props = {
  queriedlabels: any;
};

function ManageLabelsUI({ queriedlabels }: Props) {
  let [searchInput, setSearch] = useState('');
  let [labels, setLabels] = useState(
    queriedlabels.map((l: any) => {
      return l.name;
    })
  );

  const onChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearch(event.target.value);
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
    const labelslist = searchLabel(labels, searchInput);
    return labelslist.map((label) => {
      return (
        <div>
          <p>{label}</p>
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
