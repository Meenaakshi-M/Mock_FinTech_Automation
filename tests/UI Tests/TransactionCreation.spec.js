import {test, expect } from '@playwright/test';
import { createTransaction } from '../testData/TransactionData';

const baseURL =  process.env.UI_BASE_URL;

// Generate unique test data using Transaction Data Factory
const newTransaction = createTransaction();

test.describe('Transaction Creation Tests', () => {
    test('Successful Transaction Creation', async ({ page }) => {
        console.log(newTransaction);
        await page.goto(`${baseURL}/create-transaction`);
        await page.fill('#sender-id', newTransaction.sendingUserEmail);
        await page.fill('#recipient-id', newTransaction.receivingUserEmail);
        await page.fill('#amount', newTransaction.amount.toString());
        await page.selectOption('#type', newTransaction.type);
        await page.click('#submit'); 
        await expect(page.locator('#successMessage')).toHaveText('Transaction created successfully!');
    });

    test('Transaction Creation with Insufficient Funds', async ({ page }) => {
        await page.goto(`${baseURL}/create-transaction`);
        await page.fill('#sender-id', newTransaction.sendingUserEmail);
        await page.fill('#recipient-id', newTransaction.receivingUserEmail);
        await page.fill('#amount', '1000000'); // Excessive amount
        await page.click('#submit'); 
        await expect(page.locator('#errorMessage')).toHaveText('Insufficient funds for this transaction.');
    });
});