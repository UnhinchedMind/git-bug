type Status = "open" | "close";
type Query = {
  status?: Status
  author?: string
  metaData?: { k: string; v: string; }
  actor?: string;
  participant?: string;
  label?: string;
  title?: string;
};

function FilterByStatus(status: Status, query: Query): Query {
  return { ...query, status: status };
}

export default Query;
export { FilterByStatus };
