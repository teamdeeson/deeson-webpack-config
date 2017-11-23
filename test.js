const config = require('./index');

test('snapshot config', () => {
  expect(config).toMatchSnapshot();
});
