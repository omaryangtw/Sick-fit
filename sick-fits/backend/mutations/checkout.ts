import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { Session } from '../types';

interface Arguments {
  token: string;
}

export default async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure current user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must signed in');
  }
  // 2. Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: `
      id
      name
      email
      cart{
        id
        quantity
        product{
          name
          price
          description
          id
          photo{
            id
            image{
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });
  console.log(user);

  // 3. Calculate the total price for the order
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(
    (tally: number, cartItem: CartItemCreateInput) =>
      tally + cartItem.quantity * cartItem.product.price,
    0
  );
  console.log(amount);

  // 4. Create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  console.log(charge);

  // 5. Convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };
    return orderItem;
  });
  console.log(orderItems);

  // 6. Create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
    resolveFields: false,
  });
  console.log(order);

  // 7. Clear cart item
  const cartItemIds = cartItems.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });
  return order;
}
