### Domain in Use
Prepend **https://mvslages.com/v1/** to all endpoints.

### Backend DB Schema
##### *Patients* Table
```
Patients:
    patientId : id(11) AUTO
    name : varchar(100)
    dateOfBirth : datetime
```

### API Endpoints
##### `POST: /query`
Route used to send an INSERT query to the backend.
- `query` param: Query that will be sent. Must be an INSERT query following SQL syntax.
- Returns a dictionary with the confirmation if the query was executed, and also with the query executed back.
- Returns a Forbidden Error (403) if invalid query type such as SELECT, UPDATE, DROP, etc.
- Returns a Bad Request Error (402) if request is missing data or is an invalid SQL query.
###### Request Example 1:
- Req: `/query`
- Req body:
```json
{
    "query": "INSERT INTO Patients (name, dateOfBirth)
              VALUES('Jane Doe', '1999-01-01')"
}
```
- Res:
```json
{
    "status": "success",
    "code": 201,
    "data": {
        "query": "INSERT INTO Patients (name, dateOfBirth)
                  VALUES('Jane Doe', '1999-01-01')"
    }
}
```
###### Request Example 2:
- Req: `/query`
- Req body:
```json
{
    "query": "DROP TABLE Patients"
}
```
```json
{
    "status": "error",
    "code": 403,
    "data": "Forbidden query."
}
```

##### `GET: /query`
Route used to send a SELECT query to the backend.
- `query` param: Query that will be sent. Must be a SELECT query following SQL syntax.
- Returns a dictionary with the confirmation if the query was executed, and also with the query executed back.
- Returns a Forbidden Error (403) if invalid query type such as INSERT, UPDATE, DROP, etc.
- Returns a Bad Request Error (402) if request is missing data or is an invalid SQL query.
###### Request Example 1:
- Req: `/query/?query=SELECT name, dateOfBirth FROM Patients;`
- Res:
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "query": "SELECT * FROM Patients;",
        "result": [
          { patientId: 1, name: 'Jane Doe', dateOfBirth: '1990-01-01T00:00:00.000Z' },
          { patientId: 2, name: 'Bob Rob', dateOfBirth: '1985-05-12T00:00:00.000Z' }
        ]
    }
}
```
###### Request Example 2:
- Req: `/query/?query=DROP TABLE Patients`
```json
{
    "status": "error",
    "code": 403,
    "data": "Forbidden query."
}
```

### Generic API Response Structure
##### On Success
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "key1": "value1",
        "key2": "value2"
    }
}
```
##### On Error
```json
{
    "status": "error",
    "code": 400,
    "data": "Error message."
}
```