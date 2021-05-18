import { QuotedString } from 'src/domain/Query';

it('tests empty string', () => {
  const result = new QuotedString(``).toString();
  expect(result).toEqual(``);
});

it('tests empty quoted string', () => {
  const result = new QuotedString(`""`).toString();
  expect(result).toEqual(`""`);
});

it('should NOT quote single word', () => {
  const result = new QuotedString(`abc`).toString();
  expect(result).toEqual(`abc`);
});

it('should quote multiple words separated by spaces', () => {
  const result = new QuotedString(`abc  abc`).toString();
  expect(result).toEqual(`"abc  abc"`);
});

it('should quote multiple words separated by tab', () => {
  const result = new QuotedString(`abc\tabc`).toString();
  expect(result).toEqual(`"abc\tabc"`);
});

it('should quote multiple words (with quotes) separated by spaces', () => {
  const result = new QuotedString(`"abc"  abc`).toString();
  expect(result).toEqual(`""abc"  abc"`);
});

it('should requote empty quoted string with double quotes', () => {
  const result = new QuotedString(`''`).toString();
  expect(result).toEqual(`""`);
});

it('should requote single quoted word with double quotes', () => {
  const result = new QuotedString(`'abc'`).toString();
  expect(result).toEqual(`"abc"`);
});

it('should requote single quoted words with double quotes', () => {
  const result = new QuotedString(`'abc\tabc'`).toString();
  expect(result).toEqual(`"abc\tabc"`);
});

it('should requote multiple words and containing single quotes, with double quotes', () => {
  const result = new QuotedString(`'abc'  abc`).toString();
  expect(result).toEqual(`"'abc'  abc"`);
});
