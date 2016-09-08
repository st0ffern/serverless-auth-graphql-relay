# serverless-jwt-auth-example
Serverless with MongoDB, with user functions (create, login, forgot)

For educational purposes.

###FYI: AWS Lambda is slow!
Please note that running a GraphQL or any form for API on a AWS lambda server will not work well.
Why? 
Well responstimes are between 1000ms and 2000ms, concurrent requests with same post data will be shorter as they are cached.
