import {test, expect } from '@playwright/test';
import { createTransaction } from '../testData/TransactionData';

const baseURL =  process.env.UI_BASE_URL;

// Generate unique test data using Transaction Data Factory
const newTransaction = createTransaction();

test.describe('Transaction Creation Tests', () => {
    test('Successful Transaction Creation', async ({ page }) => {
        await page.goto(`https://${baseURL}/create-transaction`);
        await page.fill('#sending-user', newTransaction.sendingUserEmail);
        await page.fill('#receiving-user', newTransaction.receivingUserEmail);
        await page.fill('#amount', newTransaction.amount.toString());
        await page.click('#submitButton'); 
        await expect(page.locator('#successMessage')).toHaveText('Transaction created successfully!');
    });

    test('Transaction Creation with Insufficient Funds', async ({ page }) => {
        await page.goto(`https://${baseURL}/create-transaction`);
        await page.fill('#sending-user', newTransaction.sendingUserEmail);
        await page.fill('#receiving-user', newTransaction.receivingUserEmail);
        await page.fill('#amount', '1000000'); // Excessive amount
        await page.click('#submitButton'); 
        await expect(page.locator('#errorMessage')).toHaveText('Insufficient funds for this transaction.');


    });
});