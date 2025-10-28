I have used Javascript with Playwright as the test automation framework for both API and UI tests. 

**Automation Folder Structure**
- tests/ 
    - tests/API Tests - Contains API test files. 
    - tests/UI Tests - Contains UI test files.
    - tests/Environments - Contains environment specific configuration details like URL, API Key
    - tests/testData - Contains test data factory for user and transaction data
    - utils

**Assumptions**
1. For all error scenarios, the backend APIs return 400 status code
2. Based on the email discussion, I have assumed that there is no application specific authorization/authentication
3. All API calls need API Keys
4. For API failure scenarios, I'm assuming error messages can be sent either in JSON format or as a string in request body. So, I only log the response and not look for specific error messages other than status code


**External Libraries used**
* dotenv - Used for handling configuration for different environments
* faker - Used to generate unique test data that can be used across UI and API tests

**Helper Functions**
* Function to log API Response object
* Custom assertion function to check if returned status code is part of an array of status codes

**How to Run**

Use the following commands to run the tests:
* `NODE_ENV=dev npm run test` (or) `NODE_ENV=dev npx playwright test`
* You can also set `NODE_ENV` as an environement variable and then run `npm run test` (or) `npx playwright test`

**My Mock Frontend**
* Home Page 
    * Displays company name. It has a 'Register User' button and 'Create Transaction' button
    * It also has a Current Users and Recent Transactions section
    * Clicking on the 'Register User' button will take you to "http://localhost:8080/register-user.html"
    * Clicking on the 'Financial Transaction' button will take you to "http://localhost:8080/create-transaction.html"

* User Registration Page
    * This page has a Register New User title followed by a form to enter 'name', 'email address' and 'Account Type'
    * Once the user details are entered you can click on the 'Create User' button
    
* Transaction Creation Page
    * This page has a Create a New Transaction title followed by a form to enter 'Sender User', 'Recipient User', 'Amount' and 'Type'(Transaction Type)
    * Once all reuired details are entered, you can click on the submit button to complete the creation of a transaction

