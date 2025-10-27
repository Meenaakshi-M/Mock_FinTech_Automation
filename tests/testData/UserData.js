import { faker } from '@faker-js/faker';

// This library helps generate unique user data that can be used across UI and API tests 
export function createUser(overrides = {}) {
    const name = faker.person.fullName();
    const email = faker.internet.email({ name, provider: 'testinc.com' });
    const accountType = faker.helpers.arrayElement(['standard', 'premium', 'checking', 'savings']);

    return {
        name: name,
        email: email,
        accountType: accountType,
        ...overrides
    };
}