# Wordmasher API

The Golang API for Wordmasher.

Features:  

- A Go-Gin powered HTTP Layer  
- `urfave/cli` CLI controls
- `gorm.io` database ORM layer  
- `gorilla/ws` websocket layer  


## Dev Env

Clone the repository, install deps, build the project:

```bash
$ git clone git@github.com:/chazapp/wordmasher
...
$ cd wordmasher/server
wordmasher/server$ go mod tidy

wordmasher/server$ go build

wordmasher/server$ ./server
NAME:
   wordmash-api - An API for the WordMash Application

USAGE:
   wordmash-api [global options] command [command options]

COMMANDS:
   run      Run the API server
   help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h  show help
```

Run a Postgres database in a Docker container. Mount the sample dataset as volume

```bash
wordmasher/server$ docker run --name postgres \
                    -e POSTGRES_DB=wordmasher \
                    -e POSTGRES_USER=user \
                    -e POSTGRES_PASSWORD=foobar \
                    -v ./dataset-small.txt:/tmp/dataset.txt \
                    -p 5432:5432 \
                    -d  postgres:16
...
```

Run the API server. This will migrate the database schemas:

```bash
wordmasher/server$ ./server run --port 8080 --dbHost 127.0.0.1 --dbUser user --dbPassword foobar --dbName wordmasher --allowedOrigins http://localhost:3000
<server startup>
...
```  
  
Import the dataset in Postgres:

```bash
$ docker exec -it postgres /bin/bash
root@6934dc1ef90d:/# psql -U user -d wordmasher
psql (16.0 (Debian 16.0-1.pgdg120+1))
Type "help" for help.

wordmash=# \d
             List of relations
 Schema |     Name      |   Type   | Owner 
--------+---------------+----------+-------
 public | scores        | table    | user
 public | scores_id_seq | sequence | user
 public | words         | table    | user
 public | words_id_seq  | sequence | user
(4 rows)

wordmash=# COPY words(word) FROM '/tmp/dataset.txt';
COPY 20
```

  
Test the game with [Insomnia](https://insomnia.rest) WebSocket testing tool over at `ws://localhost:8080/ws`

![image](https://github.com/chazapp/wordmasher/assets/15686688/c1c3f2c2-1c7c-4633-ab84-62ecc7b0ce0c)  
