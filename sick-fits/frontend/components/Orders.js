import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import DisplayError from './ErrorMessage';
import { useUser } from './User';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    allOrders {
      id
      total
      items {
        quantity
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4em;
`;

function countItemInOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function Orders() {
  const me = useUser();
  if (!me) return null;
  const { loading, data, error } = useQuery(ALL_ORDERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error}>{error.message}</DisplayError>;
  const { allOrders } = data;
  console.log(allOrders);
  return (
    <div>
      <Head> Orders ({allOrders.length}) </Head>
      <h2>
        You have {allOrders.length} Order{allOrders.length > 1 ? 's' : ''}{' '}
      </h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles>
            <Link href={`/order/${order.id}`}>
              <div className="order-meta">
                <p>
                  {' '}
                  {countItemInOrder(order)} Item
                  {countItemInOrder(order) > 1 ? 's' : ''}{' '}
                </p>
                <p>{formatMoney(order.total)}</p>
              </div>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
