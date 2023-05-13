**Endpoints**

The following endpoints are available:

- **POST /participants/add** - adds a participant to the database.
- **GET /participants** - returns a list of all participants.
- **GET /participants/details** - returns a list of all participants' personal details.
- **GET /participants/details/deleted** - returns a list of all deleted participants' personal details.
- **GET /participants/details/:email** - returns the personal details of a single participant.
- **GET /participants/work/:email** - returns the work details of a single participant.
- **GET /participants/home/:email** - returns the work details of a single participant.
- **DELETE /participants/:email** - delete a single participant (soft delete).
- **PUT /participants/:email** - update a single participant.

**Validation**

The API includes three functions for validating email addresses, dates, and objects with empty properties. 

**Responses**

Responses to valid requests include a status and a data property, which contains the results of the request. In the case of an error, a status and a message are sent instead.

**Object Design**
{
    "personal": {
        "email": "test@test.com",
        "first_name": "f_name",
        "last_name": "l_name",
        "dob": "1998/12/01"
    },
    "work": {
        "company_name": "cname",
        "salary": "100000",
        "currency": "USD"
    },
    "home": {
        "country": "UK",
        "ciry": "London"
    },
    "active": true
}
