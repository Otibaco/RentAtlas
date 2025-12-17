db.users.insertMany([
  {
    email: "admin@company.com",
    password: "$2a$12$XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    role: "ADMIN",
    enabled: true
  },
  {
    email: "staff@company.com",
    password: "$2a$12$YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
    role: "STAFF",
    enabled: true
  }
])
// Add more initial data as needed
