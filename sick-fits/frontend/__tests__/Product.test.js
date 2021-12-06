import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { CartStateProvider } from '../lib/cartState';

import Product from '../components/Product';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

describe('<Product/>', () => {
  it('renders out the price tag and title', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider>
          <Product product={product} />
        </MockedProvider>
      </CartStateProvider>
    );
    debug();
  });
});
