---
publishDate: 2024-04-25T00:00:00Z
author: Matthew Harvey
category: Tutorial

title: 'API Layer: Go, Vercel and Postgres.'
excerpt: 'Creating an API service hosted on Vercel, using Go and Postgres to manage dataflow.'
image: '~/assets/images/go-vercel-postgres/GoVercelPostgres.webp'
tags:
  - go
  - postgres
  - nextjs
  - vercel
  - api
  - neon

metadata:
  canonical: https://mtlh.vercel.app/go-vercel-postgres
---

Feel free to explore the [GitHub repository](https://github.com/mtlh/go-vercel-postgres) for the template project or [live demo](https://go-vercel-postgres.vercel.app/api) for hands-on experience and experimentation.

### Why This Tech?

- **Go:** Golang is known for being performant and efficent. With other drawing points such as being easy to read and a fast learning curve.
- **Neon (Postgres):** Any hosted postgres instance will work for this process but I have chosen to host it on Neon since it is free, other options include CockroachDB, Railway, AWS and many more.
- **Vercel:** Built ontop of AWS services, Vercel is a easy way to build quick applications and trial ideas. They offer a Go runtime where you can directly run functions upon request from the /api routes.

### Walkthrough

Lets look at the /api index route first, since it is a great example of the core endpoint structure you can expand upon. The important points within this file is the handler method is ran
when a http(s) request is made to that endpoint, with the relevant request data being passed and an instance of the response writer as parameters, with the writer being used to return
data back to the browser. We declare a type for the Message being returned to ensure a typesafe response and then assign it to the msg variable. After this it is about transforming
the data via the marshal function and sending it back with attached http headers.

```go
package api
import (
	"encoding/json"
	"net/http"
)

type Message struct {
	Message string            `json:"message"`
	Routes  map[string]string `json:"routes"`
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	msg := Message{
		Message: "Hello!",
		Routes: map[string]string{
			"/api":        "You are here.",
			"/api/dbtest": "Return some test information from a connected postgres db.",
		},
	}
	jsonData, err := json.Marshal(msg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
```

Accessing a db in a cloud environment can be difficult to do, the first point is the use of environment variables. While this isnt strictly prohibited for key values,
it can be easy to forget later when making changes or duplicating code. The code has a series of functions that are packaged in the db name which is accessable from all the api go files.
The InitDB function aims to actually open the direct connection with the credentials returned from GetConnectionString and ensure its valid. Secondly, the function GetDB is repeatedly used in
other files as a reference back to a db variable after the connection is made, across the codebase.

```go
package db
import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)
var db *sql.DB

func InitDB() {
	// Construct connection string from environment variables
	connStr := GetConnectionString()
	// Open database connection
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	// Check if the connection to the database is successful
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
}

func GetDB() *sql.DB {
	return db
}
func GetConnectionString() string {
	return "postgresql://" + os.Getenv("PGUSER") + ":" + os.Getenv("PGPASSWORD") + "@" + os.Getenv("PGHOST") + "/" + os.Getenv("PGDATABASE") + "?sslmode=require"
}
```

Now we have some database functions setup, lets access them in an API endpoint following the same pattern as we did in the original example.

```go
package api
import (
	"encoding/json"
	"go_vercel_test/db"
	"net/http"

	_ "github.com/lib/pq"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func DBTestHandler(w http.ResponseWriter, r *http.Request) {
	db.InitDB()
	defer db.GetDB().Close()
	rows, err := db.GetDB().Query("SELECT id, name FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	// Process query results
	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}
	// Check for errors during row iteration
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Marshal users slice to JSON
	jsonData, err := json.Marshal(users)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Set Content-Type header
	w.Header().Set("Content-Type", "application/json")
	// Write JSON response
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
```

### Try it yourself

You will need a postgres instance setup prior to following the steps below. If you wish to use Neon for the free database instance, [click here](https://neon.tech/).

```bash
# 1. Clone the repo:
git clone https://github.com/mtlh/go-vercel-postgres.git
# 2. Create .env file with the following fields:
PGHOST='hosturl'
PGDATABASE='db'
PGUSER='user'
PGPASSWORD='pass'
# 3. Link to Vercel:
npm -g vercel
vercel --prod
```

Thank you for reading.
