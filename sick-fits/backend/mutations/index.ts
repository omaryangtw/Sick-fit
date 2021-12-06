import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkout from './checkout';

export const extendGraphqlSchema = graphQLSchemaExtension({
  // typeDefs
  typeDefs: `
    type Mutation {
      addToCart(productId: ID): CartItem
      checkout(token: String!): Order
    }
  `,
  // resolvers
  resolvers: {
    Mutation: {
      addToCart,
      checkout,
    },
  },
});
