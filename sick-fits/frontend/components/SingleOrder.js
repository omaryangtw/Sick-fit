import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import DisplayError from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import OrderStyles from './styles/OrderStyles';
import formatMoney from '../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      total
      items {
        name
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
        price
        quantity
      }
    }
  }
`;
export default function SingleOrder({ id }) {
  const { loading, data, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { Order } = data;
  console.log(Order);
  return (
    <OrderStyles>
      <p>
        <span>Order Id:</span>
        <span>{Order.id}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(Order.total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>
          {Order.items.reduce((tally, item) => tally + item.quantity, 0)}
        </span>
      </p>
      <div className="items">
        {Order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.name} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
