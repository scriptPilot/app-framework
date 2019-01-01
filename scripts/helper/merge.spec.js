const merge = require('./merge');

describe('scripts/helper/merge.js', () => {
  test('should merge two objects', () => {
    expect(merge({ a: 1, b: 2 }, { c: 3, d: 4 })).toEqual({
      a: 1, b: 2, c: 3, d: 4,
    });
  });
  test('should overwrite left with right value', () => {
    expect(merge({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
  });
  test('should concat arrays', () => {
    expect(merge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [1, 2, 3, 4] });
  });
  test('should work recursively', () => {
    expect(merge({ a: { a1: 1, a2: 2 }, b: { b1: 1, b2: 2 } }, { b: { b3: 3 }, c: { c1: 1 } }))
      .toEqual({ a: { a1: 1, a2: 2 }, b: { b1: 1, b2: 2, b3: 3 }, c: { c1: 1 } });
  });
});
