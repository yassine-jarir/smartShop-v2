import React from 'react';

test('App component exists', () => {
  // Simple test to verify the app module can be loaded
  const App = require('./App').default;
  expect(App).toBeDefined();
});
