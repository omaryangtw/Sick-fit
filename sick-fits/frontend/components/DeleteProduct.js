import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

// evict the deleted item out of cache
function update(cache, payload) {
  console.log(payload);
  console.log('running the update fn after delete');
  cache.evict(cache.identify(payload.data.deleteProduct));
}

const DeleteProduct = ({ id, children }) => {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  });
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Sure to delete?')) {
          console.log('delete');
          deleteProduct(id).catch((err) => alert(err.message));
        } else {
          console.log('cancel');
        }
      }}
    >
      {children}
    </button>
  );
};

export default DeleteProduct;
