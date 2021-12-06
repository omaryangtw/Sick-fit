import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { CURRENT_USER_QUERY } from './User';

const DELETE_FROM_CART_MUTATION = gql`
  mutation DELETE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

// evict deleted item from cache
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function DeleteFromCart({ id }) {
  const [deleteFromCart, { loading }] = useMutation(DELETE_FROM_CART_MUTATION, {
    variables: {
      id,
    },
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    update,
    /* 
    optimisticResponse: {
      deleteCartItem: {
        __typename: 'CartItem',
        id,
      },
    },
     */
  });
  return (
    <BigButton disabled={loading} type="button" onClick={deleteFromCart}>
      &times;
    </BigButton>
  );
}

DeleteFromCart.propTypes = {
  id: PropTypes.string,
};
