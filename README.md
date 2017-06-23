# Development

Requirement:
* [Docker](https://store.docker.com/search?offering=community&q=&type=edition)
* [node+npm 6 or newer](https://nodejs.org/en/download/)

To run locally:
```sh
docker-compose up
```
The first time it'll download Docker containers and install some npm dependencies, that will take a while, further runs will be a lot faster.

This starts both node (with nodemon for automatic restarts when source files change) and CouchDB.

To run linter and unit tests:
```sh
npm test
```

# Overview

The application uses ES6 (aka ES2015), Express.js and CouchDB. Source files are in `src/*.js`, split between `lib` (business logic, DB access) and `routes` (http endpoints), test files in `test/*.js`.

Existing code matches to the airbnb-base ESLint preset. New code should do the same (`npm test` passes).

CouchDB DBs and views are created when the application starts. The result can be viewed and updated using CouchDB's admin interface: http://localhost:5984/_utils/

Unit test use Mocha (test runner), Chai (assertions) and Sinon (mocking). HTTP endpoints are tested using `superagent`, while the underlying modules are mocked with Sinon, to avoid network activity in unit tests.

# Task

Add two new endpoints, using the response format outlined below. One for a DNS check, one for monitoring this check. For both, add unit tests (using Mocha/Chai/Sinon), mocking all network requests.

You can use `GET /v1/profiles` as a reference for implementation and tests.

## GET /v1/dns/check/:hostname

* For a given hostname, like `ape-eco.ru` (passed as the last part of the path), check if the DNS record points to the same IP address as `lb.sloppy.io` (use DNS lookups).
* Return the result as a JSON response, with `{ match: boolean }`, where `match` is `true` if the IPs match, otherwise `false`.
* Whenever this endpoint is called: Store the hostname, the boolean result, and the current date+time (timestamp) in CouchDB, in the `lookups` DB.

## GET /v1/dns/monitor

* In the `lookups` DB, write a view that lists all hostnames that didn't match, ordered by date (oldest first).
* Return the list as JSON when calling this endpoint. Figure out a good format.


# JSON response format

## Success

Successful requests are sent with HTTP status 200. They contain a JSON body similar to errors (see below):

```json
{
    "status": "success",
    "message": "Project xyz started",
    "data": "[details]"
}
```

`status` and `message` are always present, `data` is optional. For requests retrieving information, the information will be in the `data` property.

## Errors

All non 404 errors are logged.

All errors with information will be sent to the client. The error messages have all the same format:

```json
{
    "status": "error",
    "message": "Project with id mein-projekt-13666 could not be found",
    "reason": "some more details"
}
```

`status` and `message` are always present, `reason` is optional.
