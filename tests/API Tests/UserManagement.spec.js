import {test, expect} from '@playwright/test';
import { createUser } from '../testData/UserData';
import { logresponse } from '../utils/helper';
import { StatusCodeToBeOneOf } from '../utils/helper';

const baseURL =  process.env.API_BASE_URL;


test('Create User', async ({request}) => {
  const newUser = createUser();
  const response = await request.post(`${baseURL}/users`, { data: { name: newUser.name, email: newUser.email, accountType: newUser.accountType }
  });
  await logresponse(response);
  expect(response.status()).toBe(201);
  

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');
});

test('Create User - Failed', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, {
    data: { email: 'Jim' }
  });
  await logresponse(response);
  expect(response.status()).toBe(400)
  ;
});

// Get User Details Tests

test('Get User Details', async ({request}) => {
  const newUser = createUser();
  const postResponse = await request.post(`${baseURL}/users`, { data: { name: newUser.name, email: newUser.email, accountType: newUser.accountType }
  });
  await logresponse(postResponse);
  expect(postResponse.status()).toBe(201);

  const createdBody = await postResponse.json();
  const userId = createdBody.id;

  const response = await request.get(`${baseURL}/users/` + userId);
  console.log('Getting User ID within Get Call: ' + userId);
  await logresponse(response);
  expect(response.status()).toBe(200);
  
  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');
});

test('Get User - Bad Request', async ({request}) => {
  const response = await request.get(`${baseURL}/users/AA1`, {data:
     { city: 'Berkeley' }
  });
  // Using helper function to check possible status codes and logging API response
  StatusCodeToBeOneOf(response, [400, 404]);
  await logresponse(response);
});

// Update User Tests

test('Update User', async ({request}) => {
  const newUser = createUser();
  const postResponse = await request.post(`${baseURL}/users`, { data: { name: newUser.name, email: newUser.email, accountType: newUser.accountType }
  });
  await logresponse(postResponse);
  expect(postResponse.status()).toBe(201);

  const createdBody = await postResponse.json();
  const userId = createdBody.id;
  const response = await request.put(`${baseURL}/users/` + userId, { data:
    { email: 'test@example.com', accountType: 'checking' }
  });
  await logresponse(response);
  expect(response.status()).toBe(200);

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');
});

test('Update User - Failed', async ({request}) => {
  const response = await request.put(`${baseURL}/users/AA12`, { data:
   { type: 'savings' }
  });
  StatusCodeToBeOneOf(response, [400, 404]);
  await logresponse(response);
});

// Delete User Tests

test('Delete User', async ({request}) => {
  const newUser = createUser();
  const postResponse = await request.post(`${baseURL}/users`, { data: { name: newUser.name, email: newUser.email, accountType: newUser.accountType }
  });
  await logresponse(postResponse);
  expect(postResponse.status()).toBe(201);

  const createdBody = await postResponse.json();
  const userId = createdBody.id;
  const response = await request.delete(`${baseURL}/users/` + userId);
  await logresponse(response);
  expect(response.status()).toBe(204);
});

test('Delete User - Failed', async ({request}) => {
  const response = await request.delete(`${baseURL}/users/AA1`);
  await logresponse(response);
  expect(response.status()).toBe(404);
});

