export async function logresponse(response) {
    console.log(response);
    console.log(`Response Status: ${response.status()}`);
    const responseBody = await response.text();
    console.log(`Response Body: ${responseBody}`);
}

