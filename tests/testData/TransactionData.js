import { faker } from '@faker-js/faker';

export function createTransaction(overrides = {}) {
    const sendingUserName = faker.person.fullName();
    const receivingUserName = faker.person.fullName();
    const sendingUserEmail = faker.internet.email({ sendingUserName, provider: 'testinc.com' });
    const receivingUserEmail = faker.internet.email({ receivingUserName, provider: 'testinc.com' });
    const amount = faker.number.float({ min: 10, max: 10000, precision: 0.01 });
    const type = faker.helpers.arrayElement(['deposit', 'withdraw', 'transfer']);
    return {
        sendingUserEmail: sendingUserEmail,
        receivingUserEmail: receivingUserEmail,
        amount: amount,
        type: type,
        ...overrides
    };
}