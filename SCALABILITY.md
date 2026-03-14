# Scalability & Deployment Note

## Architectural Decisions for Scalability

This application was designed with horizontal scalability in mind. The current architecture can handle significant load increases by following these practices:

### 1. Stateless Authentication
By utilizing JWTs (JSON Web Tokens), the backend services do not need to store session state in memory or a database. This means any incoming request can be routed to any instance of the FastAPI application behind a load balancer without "sticky sessions."

### 2. Asynchronous I/O
The choice of **FastAPI**, **Motor** (Async MongoDB Driver), and **Beanie** (Async ODM) ensures the application is fully non-blocking. This allows a single Python process to efficiently handle thousands of concurrent requests, especially I/O-bound operations like database queries or network requests.

### 3. Database Scaling
MongoDB natively supports high availability (Replica Sets) and horizontal scaling (Sharding). As the `Tasks` collection grows, it can be sharded based on the `owner_id` to distribute data across multiple physical clusters.

## Future Deployment & Enhancements

To deploy this application for extreme scalability (millions of users), the following steps would be taken:

1. **Containerization:** Wrap the backend and frontend in Docker containers using `Dockerfile` and orchestrate them with Kubernetes or AWS ECS. This allows for auto-scaling nodes under CPU/Memory pressure.
2. **Caching Layer:** Introduce Redis to cache frequent read-heavy requests (e.g., fetching a user's profile or reading unchanged tasks) to reduce database load.
3. **Database Indexing:** Ensure compound indexes cover queries across `owner_id` + `status` or `priority`.
4. **Rate Limiting (Redis):** While the app can handle a lot, using Redis-backed rate limiting protects the API from abuse or brute-force attacks across all instances.
5. **CDN for Frontend:** The React SPA (Single Page Application) built via Vite would be hosted globally on a CDN (e.g., Cloudflare, AWS CloudFront, or Vercel), separating static asset delivery completely from the API servers.
