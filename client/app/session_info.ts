let userId: string | undefined = undefined;
let authToken: string | undefined = undefined;

export function login(newUserId: string, newAuthToken: string) {
    if (userId !== undefined || authToken !== undefined) {
        throw Error('Attempt to login while credentials are still valid');
    }

    userId = newUserId;
    authToken = newAuthToken;
}

export function logout() {
    userId = undefined;
    authToken = undefined;
}

export function getUserId() {
    return userId;
}

export function getAuthToken() {
    return authToken;
}