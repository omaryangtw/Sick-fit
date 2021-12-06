import formatMoney from '../lib/formatMoney';

describe('format Money function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(5000000123123)).toEqual('$50,000,001,231.23');
  });
  it('whole dollars', () => {
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(5000000)).toEqual('$50,000');
  });
});
