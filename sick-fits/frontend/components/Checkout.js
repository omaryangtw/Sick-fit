import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2 px 2 px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1em;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphqlError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    // 1. Stop the from from submitting and turn the loader on
    e.preventDefault();
    setLoading(true);
    // 2. Start the page transition
    nProgress.start();
    // 3. Create the payment method via stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);
    // 4. Handle errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return; // stop checkout
    }
    // 5. Send the token from step 3 to keystone via a custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log('Finished order');
    console.log(order);
    // 6. Change the page to view the order

    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    // 7. Close the cart
    closeCart();

    // 8. turn the loader off
    setLoading(false);
    nProgress.done();
  }
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p>{error.message}</p>}
      {graphqlError && <p>{graphqlError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
