import {test, expect} from '@playwright/test';
import { createUser } from '../testData/UserData';

const baseURL =  process.env.UI_BASE_URL;

// Generate unique test data using User Data Factory
const newUser = createUser();

// UI Tests for User Registration
test.describe('User Registration Tests', () => {
  test('Successful User Registration', async ({ page }) => {
    // Navigate to home page and click on registration link
    await page.goto(`${baseURL}`);
    await page.locator('id=user-register').click();
    await expect(page).toHaveURL(`${baseURL}/register-user`);
    
    // Fill user registration form with valid data
    await page.fill('#user-name', newUser.name);
    await page.fill('#user-email', newUser.email);
    await page.fill('#user-account-type', newUser.accountType);

    await page.click('#submit');

    // Verify successful registration
    await expect(page.locator('#successMessage')).toHaveText('Registration successful!');
  });

  test('User Registration with Existing Email', async ({ page }) => {
    await page.goto(`${baseURL}/register-user`);

    await page.fill('#user-name', 'Jane Doe');
    await page.fill('#user-email', 'testuser@ab.net'); // Existing email
    await page.fill('#user-account-type', 'Premium');

    await page.click('#submit');

    // Verify error message for existing email
    await expect(page.locator('#errorMessage')).toHaveText('Email already exists.');
  });

  test('User Registration with Invalid Email Format', async ({ page }) => {
    await page.goto(`${baseURL}/register-user`);

    await page.fill('#user-name', 'Alice Smith');
    await page.fill('#user-email', 'ab.com'); // Invalid email
    await page.fill('#user-account-type', 'Premium');

    await page.click('#submit');

    // Verify error message for invalid email format
    await expect(page.locator('#errorMessage')).toHaveText('Please enter a valid email address.');
  });
});
