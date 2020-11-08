Setup

```
docker-compose -f docker-compose.dev.yml up -d
```

Create test db

```
psql -h 127.0.0.1 -U user your_app_development -p 31027

CREATE DATABASE your_app_test;
```
