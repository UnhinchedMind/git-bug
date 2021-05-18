/**
 * QuotedString represents a string which will be encapsulated with quotes if
 * the string contains any whitespace.
 * E.g. `abc def` will become `"abc def"` while `abcdef` will stay `abcdef`.
 */
class QuotedString {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    const hasWhitespace = RegExp(/\s+/g).test(this.value);
    const isQuoted = RegExp(/^('.*'|".*")$/).test(this.value);
    const quote = (value: string) => `"${value}"`;
    return (hasWhitespace && !isQuoted) ?  quote(this.value) : this.value;
  }
}

type StatusFilter = "open" | "close";

type Filter = {
  status?: StatusFilter[]
  author?: QuotedString[]
  metaData?: { k: QuotedString; v: QuotedString; } | QuotedString
  actor?: QuotedString[]
  participant?: QuotedString[]
  label?: QuotedString[]
  title?: QuotedString[]
};

type OrderBy = "creation" | "id" | "lastModified"
type OrderDirection = "ascending" | "descending"

type FreetextSearch = string;

type Query = {
  search?: FreetextSearch
  filterBy?: Filter
  orderBy?: OrderBy
  orderDirection?: OrderDirection
};

//let query: Query = {
//  filterBy: {
//    author: [new QuotedString("abc abc")]
//  }
//}
console.log(new QuotedString("abc abc"));

function Parse(query: string): Query {
  return {};
}

export default Parse;
