const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const {
  getDataUsers,
  getAddress,
  getOrders,
  getProducts,
  addUser,
  addAddress,
  addOrder,
} = require('../store/initDB');

const UsersType = new GraphQLObjectType({
  name: 'Users',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    address: {
      type: new GraphQLList(AddressType),
      resolve: async (parent, args) => {
        const address = await getAddress();
        return address.filter(({ userId }) => userId === parent.userId);
      },
    },
    orders: {
      type: new GraphQLList(OrdersType),
      resolve: async (parent, args) => {
        const orders = await getOrders();
        return orders.filter(({ userId }) => userId === parent.userId);
      },
    },
  }),
});

const ProductsType = new GraphQLObjectType({
  name: 'Products',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
    image: { type: GraphQLString },
  }),
});

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    id: { type: GraphQLID },
    number: { type: GraphQLInt },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLInt },
    userId: { type: GraphQLID },
  }),
});

const OrdersType = new GraphQLObjectType({
  name: 'Orders',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    totalht: { type: GraphQLInt },
    userId: { type: GraphQLID },
    products: {
      type: new GraphQLList(ProductsType),
      resolve: async (parent, args) => {
        const products = await getProducts();
        return products;
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UsersType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        number: { type: GraphQLInt },
        street: { type: GraphQLString },
        zipCode: { type: GraphQLInt },
        city: { type: GraphQLString },
        date: { type: GraphQLString },
      },

      resolve: async (parent, args) => {
        console.log('Add', args);
        const user = await addUser({
          name: args.name,
          password: args.password,
        });
        const address = await addAddress({
          userId: user.id,
          number: args.number,
          street: args.street,
          zipCode: args.zipCode,
          city: args.city,
        });
        return user;
      },
    },
  },
  // addProduct: {
  //   type: ProductType,
  //   èargs: {
  //     title: { type: GraphQLString },
  //     description: { type: GraphQLString },
  //     price: { type: GraphQLInt },
  //     image: { type: GraphQLString },
  //   },
  //   resolve: async (parent, args) => {
  //     const product = await addProduct({
  //       title: args.title,
  //       description: args.description,
  //     });
  //   },
  // },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UsersType),

      resolve: async (parent, args) => {
        try {
          const users = await getDataUsers();
          return users;
        } catch (e) {
          console.error(e);
        }
      },
    },
    // products: {
    //   type: new GraphQLList(ProductsType),
    //   resolve: async (parent, args) => {
    //     const products = await getProducts();
    //     return products;
    //   },
    // },
    // orders: {
    //   type: new GraphQLList(OrdersType),
    //   resolve: async (parent, args) => {
    //     const orders = await getOrders();
    //     return orders;
    //   },
    // },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
