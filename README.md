HOW TO RUN LOCALLY?
1. Navigate to `certificateLambda` and install the dependencies
2. Rename the `.env.example` to simply `.env`
3. To make the lambda mock AWS calls set the env variable USE_MOCK to true (it is `true` by default).
    This way the lambda won't make real aws calls to s3 and dynamo. If the USE_MOCK is set to `false` the lambda will attempt to make real aws calls.
4. After you've installed the dependencies you can run `npm run start:dev`. This will execute the lambda locally 
    and print in the console what it would try to write in dynamo db.
5. In /example folder there is an example of x509 Certificate(that is in PEM format)

DEMO: https://files.fm/f/2knkcze6rj
The lambda and the cloudformation stack are cloud ready and work in aws. Here is a short demo of how i run the lambda and it created
an entry in dynamo.

LIB I USED FOR READING THE CERT AND SIGNING - https://www.npmjs.com/package/node-forge