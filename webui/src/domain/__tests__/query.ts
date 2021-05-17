import { FilterByStatus } from 'src/domain/Query';

it('StatusFilter should filter by status', () => {
  let query = FilterByStatus("open");
  expect(query).toEqual({"status": "open"});
});

it('StatusFilter should not alter other filters', () => {
  let query = FilterByStatus("open", {"title": "abc"});
  expect(query).toEqual({
    "title": "abc",
    "status": "open"
  });
});
