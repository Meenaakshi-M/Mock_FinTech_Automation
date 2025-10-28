import {test, expect} from '@playwright/test';
import { createTransaction } from '../testData/TransactionData';
import { logresponse } from '../utils/helper';
import { StatusCodeToBeOneOf } from '../utils/helper';

// Generate unique test data using Transaction Data Factory
const newTransaction = createTransaction();

const baseURL =  process.env.API_BASE_URL;

var sendingUser;
var recipientUser;
var transactionid;

// First create a user to perform transaction tests on

test('Create User for Transaction Tests', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, {data:
    { name: 'TransactionUser', email: 'TransactionUser@example.com', accountType: 'savings'}
  });
  if (response.status() == 201) {
      sendingUser = await response.json();
      console.log('Created user for transaction tests with ID: ' + sendingUser.id);
  } else {
    throw new Error('Failed to create user for transaction tests with status ' + response.status());
  }
});

// Create another user for receiving transactions

test('Create Recipient User for Transaction Tests', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, {data:
    { name: 'RecipientUser', email: 'RecipientUser@example.com', accountType: 'savings'}
  });
  if (response.status() == 201) {
      const recipientUser = await response.json();
  } else {
    throw new Error('Failed to create recipient user for transaction tests with status ' + response.status());
  }
});

// Create Transaction Tests

test('Create Transaction', async ({request}) => {
  const response = await request.post(`${baseURL}/transactions`, { data: 
    { userId: sendingUser.id, amount: newTransaction.amount, Type: newTransaction.type, recipientId: recipientUser.id }
  });
  await logresponse(response);
  expect(response.status()).toBe(201);

  const transactions = await response.json();
  expect(transactions).toHaveProperty('userId');
  expect(transactions).toHaveProperty('amount');
  expect(transactions).toHaveProperty('Type');
  expect(transactions).toHaveProperty('recipientId');

  transactionid = transactions.id;
});

test('Create Transaction - Failed', async ({request}) => {
  const response = await request.post(`${baseURL}/transactions`, { data:
     { userId: 'ab*' }
  });
  expect(response.status()).toBe(400);
  await logresponse(response);
});

// Get Transaction Details Tests

test('Get User Transactions', async ({request}) => {
  const response = await request.get(`${baseURL}/transactions/:${sendingUser.id}`);
  expect(response.status()).toBe(200);
  
  const transactions = await response.json();
  expect(transactions).toHaveLengthGreaterThan(0);  
});

test.only('Get User Transactions - Bad Request', async ({request}) => {
  const response = await request.get(`${baseURL}/transactions/acb234/`, { data:
    { type: 'ab' }
  });
  // Using helper function to check possible status codes and logging API response
  StatusCodeToBeOneOf(response, [400, 404]);
  await logresponse(response);
});

// Update Transaction Tests

test('Update Transaction', async ({request}) => {
  const response = await request.put(`${baseURL}/transactions/:${sendingUser.id}`, { data:
     { amount: 100, Type: 'withdraw', transactionid: transactionid }
  });
  expect(response.status()).toBe(200);

  const transactions = await response.json();
  expect(transactions).toHaveProperty('userId');
  expect(transactions).toHaveProperty('amount');
  expect(transactions).toHaveProperty('Type');
  expect(transactions).toHaveProperty('recipientId');
});

test('Update Transaction - Failed', async ({request}) => {
  const response = await request.put(`${baseURL}/transactions/:${sendingUser.id}`, { data:
     { transactionid: transactionid, state: 'complete' }
  });
  expect(response.status()).toBe(400); 
  await logresponse(response);
});

// Delete Transaction Tests

test('Delete Transaction', async ({request}) => {
  const response = await request.delete(`${baseURL}/transactions/:${sendingUser.id}`, { data:
    { transactionid: transactionid }
  });
  expect(response.status()).toBe(204);
});

test('Delete Transaction - Failed', async ({request}) => {
  const response = await request.delete(`${baseURL}/transactions/:${sendingUser.id}`, { data:
    { transactionid: "abc123"}
  });
  expect(response.status()).toBe(400); 
  await logresponse(response);
});