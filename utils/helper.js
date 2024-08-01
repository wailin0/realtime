const jwt = require("jsonwebtoken");
const {jwtSecretKey, jwtExpTime, graphqlApi} = require("./config");

const createHasuraJWT = (userId, role) => {
    return jwt.sign({
        "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": role,
            "x-hasura-allowed-roles": [role],
            "x-hasura-user-id": userId,
        },
        user_id: userId,
        role
    }, jwtSecretKey, {expiresIn: jwtExpTime});
}


export function generateDriverId(driverId) {
    // Convert the string ID to an integer
    let numericId = parseInt(driverId, 10);

    // Increment the numeric ID by one
    numericId += 1;

    // Convert the numeric ID back to a string with leading zeros
    return numericId.toString().padStart(driverId.length, '0');
}



const fetchGraphqlApi = async (query, variables) => {
    try {
        const response = await fetch(graphqlApi, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": "joypuppy"
            },
            body: JSON.stringify({
                query,
                variables
            }),
        })
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

function generateInvoiceNumber() {
    const currentYear = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit random number
    const invoiceNumber = `INV/${currentYear}/${randomPart}`;
    return invoiceNumber;
}

function generateOrderNumber() {
    const currentYear = new Date().getFullYear();
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = randomPart
    return orderNumber;
}

function generateQuotationNumber() {
    const currentYear = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit random number
    const quotationNumber = `QUO/${currentYear}/${randomPart}`;
    return quotationNumber;
}





module.exports = {
    createHasuraJWT,
    fetchGraphqlApi,
    generateQuotationNumber,
    generateInvoiceNumber,
    generateDriverId,
    generateOrderNumber
}
