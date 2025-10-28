export async function logresponse(response) {
    console.log(response);
    console.log(`Response Status: ${response.status()}`);
    const responseBody = await response.text();
    console.log(`Response Body: ${responseBody}`);
}

export function StatusCodeToBeOneOf(response, expectedStatusCodes) {
    const receivedStatusCode = response.status();
    if (!expectedStatusCodes.includes(receivedStatusCode)) {
        throw new Error(`Expected status code to be one of ${expectedStatusCodes}, but received ${receivedStatusCode}`);
    }
}



