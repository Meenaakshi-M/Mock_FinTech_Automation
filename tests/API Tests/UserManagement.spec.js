import {test, expect} from '@playwright/test';
import { createUser } from '../testData/UserData';

//I assume all your backend APIs unless its a internal server error returns 400 status code

// Generate unique test data using User Data Factory
const newUser = createUser();

const baseURL =  process.env.API_BASE_URL;

var userid;


test('Create User', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, { params: { name: newUser.name, email: newUser.email, accountType: newUser.accountType }
  });
  expect(response.status()).toBe(201);
  expect(response.responseTime()).toBeLessThan(500);
  

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');

  userid = user.id;
});

test('Create User - Failed', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, {
    params: { email: 'Jim' }
  });
  expect(response.status()).toBe(400);
  

  const user = await response.json();
  expect(user).toHaveProperty('error');
});

// Get User Details Tests

test('Get User Details', async ({request}) => {
  const response = await request.get(`${baseURL}/users/:${userid}`
   );
  expect(response.status()).toBe(200);
  expect(response.responseTime()).toBeLessThan(500);
  

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');
});

test('Get User - Bad Request', async ({request}) => {
  const response = await request.get(`${baseURL}/users/:${userid}`, {params:
     { city: 'Berkeley' }
  });
  expect(response.status()).toBe(400);
  

  const user = await response.json();
  expect(user).toHaveProperty('error');
});

// Update User Tests

test('Update User', async ({request}) => {
  const response = await request.put(`${baseURL}/users/:${userid}`, { params:
    { email: 'test@example.com', accountType: 'checking' }
  });
  expect(response.status()).toBe(200);
  expect(response.responseTime()).toBeLessThan(500);
  

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');
});

test('Update User - Failed', async ({request}) => {
  const response = await request.put(`${baseURL}/users/:${userid}`, {params:
   { type: 'savings' }
  });
  expect(response.status()).toBe(400);
  
  const user = await response.json();
  expect(user).toHaveProperty('error');
});

// Delete User Tests

test('Delete User', async ({request}) => {
    const response = await request.delete(`${baseURL}/users/:${userid}`);
    expect(response.status()).toBe(204);
    expect(response.responseTime()).toBeLessThan(500);
});

test('Delete User - Failed', async ({request}) => {
  const response = await request.delete(`${baseURL}/users/AA1`);
  expect(response.status()).toBe(400);
  

  const user = await response.json();
  expect(user).toHaveProperty('error');
});

