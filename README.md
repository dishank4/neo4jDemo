# neo4jDemo

This is for testing of neo4j.

step
1. install neo4j
2. clone repo.
3. npm install
4. node --harmony  index.js 

we have implemented apis that are listed below

1. http://localhost:5050/addUser
for parent node
method :- POST
Request
{
  "name":"dishank",
  "role":"ios"
}

for add chield to parent node

Request
{
  "name":"brijesh",
  "parent":"dishank",
  "role":"ios"
}

2.http://localhost:5050/deleteUser
method :- POST
Request

{
  "name":"pushp"
}

3.http://localhost:5050/getChieldByUser
method :- POST
Request

{
  "name":"dishank"
}
