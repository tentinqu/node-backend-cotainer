# Scotch.io Node API — Dockerized

This is a Dockerized version of the original [Scotch.io Node API tutorial](https://github.com/scotch-io/node-api), with one important update:

> **MongoDB no longer works** — the original database at `novus.modulusmongo.net` is no longer available.

This version is intended for demonstration purposes (API structure, containerization, routing) **without requiring a working MongoDB connection**.

---

## Project Overview

This REST API was originally built to demonstrate basic CRUD operations using Node.js, Express, and MongoDB.

In this containerized version:

- The `/api` endpoint works and returns a welcome message
- All MongoDB-dependent routes (like `/api/bears`) are non-functional due to lack of database connectivity
- No database setup is required for this demo

---

## Quick Start with Docker

### Build the Image

```bash
docker build -t scotch-api .
```
## Run the Container

```bash
docker run -p 8080:8080 --rm scotch-api
Visit: http://localhost:8080/api
```

Working Endpoints
Method	Endpoint	Response
GET	/api	{ "message": "hooray! welcome to our api!" }

Non-Functional / Broken Endpoints
Method	Endpoint	Status	Reason
GET	/api/bears	Returns []	No connection to MongoDB
POST, PUT, DELETE	/api/bears	Fail silently	No database to persist data

Note: You may see MongoDB connection errors in the logs. This is expected.

## Cleanup
When you're done testing, remove the container and image:

```bash
# Stop and remove the running container
docker rm -f $(docker ps -q --filter ancestor=scotch-api)
```

## Remove the image
```bash
docker rmi scotch-api
```
## Optional: Add Your Own MongoDB
To make the API fully functional:

Set up a local MongoDB instance or container

Update the MongoDB connection string in server.js

Rebuild and rerun the Docker container

## Credits
Based on the Scotch.io Node API tutorial

Dockerized and documented for clarity and modernization

## License
This project is provided as-is for educational and demonstration purposes.
