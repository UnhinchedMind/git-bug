/**
 * QuotedString represents a string which will be encapsulated with quotes if
 * the string contains any whitespace. If the string is already quoted with
 * single quotes '', replace the quotes with double quotes "".
 * E.g. `abc def` will become `"abc def"` while `abcdef` will stay the same
 * `abcdef`, and `'abc def'` will become `"abc def"`.
 */
class QuotedString {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    const hasWhitespace = RegExp(/\s+/g).test(this.value);
    const isSingleQuoted = RegExp(/^'.*'$/).test(this.value);
    const isDoubleQuoted = RegExp(/^".*"$/).test(this.value);
    const isQuoted = isSingleQuoted && isDoubleQuoted;
    const quote = (value: string) => `"${value}"`;
    const requote = (value: string) => value.replace(/^'(.*)'$/g, `"$1"`);
    if (isSingleQuoted) {
      return requote(this.value);
    }
    if (hasWhitespace && !isQuoted) {
      return quote(this.value)
    }
    return this.value;
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

//TODO ApplyFilter, SetFilter, AddFilter, ToggleFilter, ToggleParam, SetParam

function Parse(query: string): Query {
  return {};
}

export default Parse;
export { QuotedString };
