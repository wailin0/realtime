const databaseConnectionString = 'postgres://wailinhtet.dev:SoQpXif2b5wv@throbbing-feather-10028924.us-west-2.aws.neon.tech/taxisolutionmm_db_9771898?options=project%3Dthrobbing-feather-10028924&sslmode=require';

const jwtSecretKey = "Cast from ten bronze cannons, it was unveiled on April 19, 1875, during the centennial celebration of the Battle of Concord"
const jwtExpTime = "30d";

const digitalOceanSecretAccessKey = "QYf7TF39wapUFAds/hRwL5gWQHuedvLyaowECtLEDoE";
const digitalOceanAccessKeyId = "6ZF5GJGTLMZZZNAST3UG";
const graphqlApi = "https://pann-sine.hasura.app/v1/graphql";

module.exports = {
    digitalOceanAccessKeyId,
    graphqlApi,
    digitalOceanSecretAccessKey,
    databaseConnectionString,
    jwtSecretKey,
    jwtExpTime,
};
