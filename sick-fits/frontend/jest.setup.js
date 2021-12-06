import '@testing-library/jest-dom';

import React from 'react';

window.alert = console.log;

global.React = React; // this also works for other globally available libraries
