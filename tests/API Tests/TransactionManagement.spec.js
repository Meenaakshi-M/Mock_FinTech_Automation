import {test, expect} from '@playwright/test';
import { createTransaction } from '../testData/TransactionData';

//I assume all your backend APIs unless its a internal server error returns 400 status code

// Generate unique test data using Transaction Data Factory
const newTransaction = createTransaction();

const baseURL =  process.env.API_BASE_URL;

var sendingUser;
var recipientUser;
var transactionid;

// First create a user to perform transaction tests on

test('Create User for Transaction Tests', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, { params: { name: 'TransactionUser', email: 'TransactionUser@example.com', accountType: 'savings'}
  });
  if (response.status() == 201) {
      sendingUser = await response.json();
  } else {
    throw new Error('Failed to create user for transaction tests with status ' + response.status());
  }
});

// Create another user for receiving transactions

test('Create Recipient User for Transaction Tests', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, { params: { name: 'RecipientUser', email: 'RecipientUser@example.com', accountType: 'savings'}
  });
  if (response.status() == 201) {
      const recipientUser = await response.json();
  } else {
    throw new Error('Failed to create recipient user for transaction tests with status ' + response.status());
  }
});
// Create Transaction Tests

test('Create Transaction', async ({request}) => {
  const response = await request.post(`${baseURL}/transactions`, { params: 
    { userId: sendingUser.id, amount: newTransaction.amount, Type: newTransaction.type, recipientId: recipientUser.id }
  });
  expect(response.status()).toBe(201);
  expect(response.responseTime()).toBeLessThan(500);

  const transactions = await response.json();
  expect(transactions).toHaveProperty('userId');
  expect(transactions).toHaveProperty('amount');
  expect(transactions).toHaveProperty('Type');
  expect(transactions).toHaveProperty('recipientId');

  transactionid = transactions.id;
});

test('Create Transaction - Failed', async ({request}) => {
  const response = await request.post(`${baseURL}/transactions`, {params:
     { userId: 'ab*' }
  });
  expect(response.status()).toBe(400); 
  

  const transactions = await response.json();
  expect(transactions).toHaveProperty('error');
});

// Get Transaction Details Tests

test('Get User Transactions', async ({request}) => {
  const response = await request.get(`${baseURL}/transactions/:${sendingUser.id}`);
  expect(response.status()).toBe(200);
  expect(response.responseTime()).toBeLessThan(500);
  

  const transactions = await response.json();
  expect(transactions).toHaveLengthGreaterThan(0);  
});

test('Get User Transactions - Bad Request', async ({request}) => {
  const response = await request.get(`${baseURL}/transactions/acb234/`, {params:
    { type: 'ab' }
  });
  expect(response.status()).toBe(400);
  

  const user = await response.json();
  expect(user).toHaveProperty('error');
});

// Update Transaction Tests

test('Update Transaction', async ({request}) => {
  const response = await request.put(`${baseURL}/transactions/:${sendingUser.id}`, { params:
     { amount: 100, Type: 'withdraw', transactionid: transactionid }
  });
  expect(response.status()).toBe(200);
  expect(response.responseTime()).toBeLessThan(500);
  

  const transactions = await response.json();
  expect(transactions).toHaveProperty('userId');
  expect(transactions).toHaveProperty('amount');
  expect(transactions).toHaveProperty('Type');
  expect(transactions).toHaveProperty('recipientId');
});

test('Update Transaction - Failed', async ({request}) => {
  const response = await request.put(`${baseURL}/transactions/:${sendingUser.id}`, { params:
     { transactionid: transactionid, state: 'complete' }
  });
  expect(response.status()).toBe(400); 
  

  const transactions = await response.json();
  expect(transactions).toHaveProperty('error');
});

// Delete Transaction Tests

test('Delete Transaction', async ({request}) => {
  const response = await request.delete(`${baseURL}/transactions/:${sendingUser.id}`, { params:
    { transactionid: transactionid }
  });
  expect(response.status()).toBe(204);
  expect(response.responseTime()).toBeLessThan(500);
});

test('Delete Transaction - Failed', async ({request}) => {
  const response = await request.delete(`${baseURL}/transactions/:${sendingUser.id}`, { params:
    { transactionid: "abc123"}
  });
  expect(response.status()).toBe(400); 
  

  const transactions = await response.json();
  expect(transactions).toHaveProperty('error');
});