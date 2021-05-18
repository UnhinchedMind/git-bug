import Parse from 'src/domain/Query';

it('should parse an empty query', () => {
  let query = Parse("");
  expect(query).toEqual({});
});

//it('should parse status filter', () => {
//  let query = Parse("status:open");
//  expect(query).toEqual({status: "open"});
//});
//
//it('should parse multiple status filters', () => {
//  let query = Parse("status:open status:closed");
//  expect(query).toEqual({status: "open"});
//});
//
