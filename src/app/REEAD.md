src/
├── app/
│   └── api/
│       └── users/
│           ├── route.ts       ← CRUD general (GET todos, POST)
│           └── [id]/
│               └── route.ts   ← Operaciones sobre 1 user (GET, PUT, DELETE)
├── lib/
│   └── mongodb.ts             ← Conexión con MongoDB


{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",         // o "editor", etc.
  "createdAt": ISODate
}
