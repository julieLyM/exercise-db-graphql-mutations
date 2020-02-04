const { Pool } = require('pg');
let client = null;

const pool = new Pool({
  user: 'julix',
  host: 'localhost',
  database: 'julix',
  password: 'secret',
  port: 4000,
});

async function initClient() {
  client = await pool.connect();

  return client;
}

const clearDatabase = async client => {
  try {
    const tables = [
      'users',
      'address',
      'products',
      'orders',
      'orders_products',
    ];

    await Promise.all(tables.map(table => client.query(`DROP TABLE ${table}`)));
  } catch (e) {
    console.error('Error in clear');
  }
};

const createTablesDb = async () => {
  await client.query(
    `CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, password VARCHAR(30))`
  );
  await pool.query(
    `CREATE TABLE address (id SERIAL PRIMARY KEY, number INT, street TEXT, city TEXT, zipCode INT, userId VARCHAR(30))`
  );
  await pool.query(
    `CREATE TABLE products (id SERIAL PRIMARY KEY, title TEXT, description TEXT, price INT, image VARCHAR(30))`
  );
  await pool.query(
    `CREATE TABLE orders (id SERIAL PRIMARY KEY, date TIMESTAMP, totalht INT, userId VARCHAR(30) )`
  );
  await pool.query(
    `CREATE TABLE orders_products (id SERIAL PRIMARY KEY, order_id SERIAL, product_id SERIAL )`
  );
  return client;
};

const insertUsers = async client => {
  const users = [
    { id: 1, name: 'julix', password: 'secret' },
    { id: 2, name: 'rebibix', password: 'secret' },
    { id: 3, name: 'melanix', password: 'secret' },
    { id: 4, name: 'jonix', password: 'secret' },
  ];

  try {
    await Promise.all(
      users.map(({ name, password }) =>
        client.query(
          `INSERT INTO users (name, password) VALUES ('${name}', '${password}')`
        )
      )
    );
  } catch (e) {
    console.error('Error in insert user', e);
  }
};

const insertAddress = async client => {
  const address = [
    {
      id: 1,
      number: 345,
      street: 'rue de stackerine',
      city: 'Sarcelles',
      zipCode: 95200,
      userId: 1,
    },
    {
      id: 2,
      number: 123,
      street: 'rue de stackerine',
      city: 'Sarcelles',
      zipCode: 95200,
      userId: 2,
    },
    {
      id: 3,
      number: 789,
      street: 'rue de stackerine',
      city: 'Sarcelles',
      zipCode: 95200,
      userId: 2,
    },
  ];

  try {
    await Promise.all(
      address.map(({ number, street, city, zipCode, userId }) =>
        client.query(
          `INSERT INTO address (number,street, city, zipCode , userId) VALUES (${number}, '${street}','${city}',${zipCode}, ${userId})`
        )
      )
    );
  } catch (e) {
    console.error(e);
  }
};

const insertProducts = async client => {
  const products = [
    {
      id: 1,
      title: 'cup',
      description: 'small size purple',
      price: 8,
      image: 'http://www.hello.com/1',
    },
    {
      id: 2,
      title: 'bottle',
      description: 'size 1 liter',
      price: 4,
      image: 'http://www.hello.com/1',
    },
    {
      id: 3,
      title: 'spoon',
      description: 'big spoon for soup',
      price: 5,
      image: 'http://www.hello.com/1',
    },
    {
      id: 4,
      title: 'knife',
      description: 'in silver and very good quality',
      price: 9,
      image: 'http://www.hello.com/1',
    },
    {
      id: 5,
      title: 'fork',
      description: 'in silver ',
      price: 7,
      image: 'http://www.hello.com/1',
    },
  ];

  try {
    await Promise.all(
      products.map(({ title, description, price, image }) =>
        client.query(
          `INSERT INTO products (title, description, price, image) VALUES ('${title}','${description}',${price},'${image}')`
        )
      )
    );
  } catch (e) {
    console.error(e);
  }
};

const insertOrders = async client => {
  const orders = [
    { id: 12, date: '12/01/2020', totalht: 12, userId: 1 },
    { id: 16, date: '12/01/2020', totalht: 32, userId: 2 },
    { id: 19, date: '12/01/2020', totalht: 16, userId: 3 },
  ];

  try {
    await Promise.all(
      orders.map(({ date, totalht, userId }) =>
        client.query(
          `INSERT INTO orders (date, totalht, userId) VALUES ('${date}', ${totalht},${userId})`
        )
      )
    );
  } catch (e) {
    console.error(e);
  }
};

const insertOrderId = async client => {
  const orders_products = [
    { order_id: 12, product_id: 1 },
    { order_id: 16, product_id: 2 },
    { order_id: 19, product_id: 4 },
  ];

  try {
    await Promise.all(
      orders_products.map(({ order_id, product_id }) =>
        client.query(
          `INSERT INTO orders_products (order_id, product_id) VALUES (${order_id},${product_id})`
        )
      )
    );
  } catch (e) {
    console.error(e);
  }
};

async function getDataUsers() {
  // const client = await pool.connect();
  const { rows: users } = await client.query('SELECT * FROM users');
  return users;
}

async function getAddress() {
  // const client = await pool.connect();
  const { rows: address } = await client.query('SELECT * FROM address');
  return address;
}

async function getOrders() {
  // const client = await pool.connect();
  const { rows: orders } = await client.query('SELECT * FROM orders');
  return orders;
}

// async function orderProductsList() {
//   const client = await pool.connect()
//   const {rows: orders}= await client.query('SELECT * FROM order INNER JOIN ')
// }

async function getProducts() {
  // const client = await pool.connect();
  const { rows: products } = await client.query('SELECT * FROM products');
  return products;
}

async function addUser({ name, password }) {
  // const client = await pool.connect();
  const { rows: users } = await client.query(
    `INSERT INTO users (name,password) VALUES ('${name}','${password}') RETURNING *`
  );
  return users[0];
}

async function addAddress({ number, street, zipCode, city, userId }) {
  // const client = await pool.connect();
  const { rows: address } = await client.query(
    `INSERT INTO address (number,street,zipCode, city, userId) VALUES (${number},'${street}',${zipCode},'${city}', ${userId}) RETURNING *`
  );
  return address[0];
}

async function addOrder({ date, totalht, userId }) {
  // const client = await pool.connect();
  const { rows: orders } = await client.query(
    `INSERT INTO orders (date, totalht, userId) VALUES (${date},${totalht},${userId}) RETURNING *`
  );
  return orders[0];
}

const insertDataInDatabase = async client => {
  await insertUsers(client);
  await insertAddress(client);
  await insertProducts(client);
  await insertOrders(client);
  await insertOrderId(client);
};

async function initializeDB() {
  const client = await initClient();
  await clearDatabase(client);

  await createTablesDb(client);
  await insertDataInDatabase(client);
}

initializeDB();

module.exports = {
  getDataUsers,
  getAddress,
  getOrders,
  getProducts,
  addUser,
  addAddress,
  addOrder,
};
