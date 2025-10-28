import {test, expect} from '@playwright/test';
import { createUser } from '../testData/UserData';
import { logresponse } from '../utils/helper';
import { StatusCodeToBeOneOf } from '../utils/helper';


// Generate unique test data using User Data Factory
const newUser = createUser();

const baseURL =  process.env.API_BASE_URL;

var userid;


test('Create User', async ({request}) => {
  const response = await request.post(`${baseURL}/users`, { data: { name: newUser.name, email: newUser.email, accountType: newUser.accountType }
  });
  await logresponse(response);
  expect(response.status()).toBe(201);
  

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');

  userid = user.id;
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
  const response = await request.get(`${baseURL}/users/:${userid}`
   );
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
  const response = await request.put(`${baseURL}/users/:${userid}`, { data:
    { email: 'test@example.com', accountType: 'checking' }
  });
  expect(response.status()).toBe(200);

  const user = await response.json();
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('accountType');
});

test('Update User - Failed', async ({request}) => {
  const response = await request.put(`${baseURL}/users/:${userid}`, { data:
   { type: 'savings' }
  });
  StatusCodeToBeOneOf(response, [400, 404]);
  await logresponse(response);
});

// Delete User Tests

test('Delete User', async ({request}) => {
    const response = await request.delete(`${baseURL}/users/:${userid}`);
    expect(response.status()).toBe(204);
});

test('Delete User - Failed', async ({request}) => {
  const response = await request.delete(`${baseURL}/users/AA1`);
  await logresponse(response);
  expect(response.status()).toBe(404);
});

