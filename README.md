# Microservicio de NestJS

Este repositorio contiene un microservicio desarrollado con NestJS.

## Requisitos previos

Antes de ejecutar el microservicio de NestJS, asegúrate de tener instalados los siguientes componentes:

- Docker: [Descargar e instalar Docker](https://www.docker.com/get-started)
- Node.js: [Descargar e instalar Node.js](https://nodejs.org)

## Ejecutar el microservicio de NestJS localmente

Puedes ejecutar el microservicio de NestJS de dos formas: utilizando Docker Compose o configurando las variables de entorno manualmente.

### Opción 1: Ejecutar con Docker Compose

1. Asegúrate de tener el archivo `docker-compose.yml` en el directorio raíz del proyecto.

2. Abre una terminal y navega hasta el directorio raíz del proyecto donde se encuentra el archivo `docker-compose.yml`.

3. Abre el archivo `docker-compose.yml` y encuentra la sección `environment` dentro del servicio `micro-product-app`. Define los valores de las variables de entorno requeridas directamente en el archivo `docker-compose.yml`. Por ejemplo:

   ```yaml
   environment:
     - AWS_ACCESS_KEY_ID=your-access-key
     - AWS_SECRET_ACCESS_KEY=your-secret-access-key
     - DB_DIALECT=postgres
     - DB_DRIVER=postgres
     - DB_HOST=db
     - DB_NAME=my-database
     - DB_PASSWORD=db-password
     - DB_PORT=5432
     - DB_USERNAME=db-username
     - ENCRYPTION_KEY_SECRET=encryption-key
     - MICRO_SERVICE_URL=http://microservice-url
     - S3_BUCKET_NAME=my-bucket
   
Asegurarse de reemplazar los valores de ejemplo con los valores correctos para tu aplicación y base de datos.

4. Ejecuta el siguiente comando para construir las imágenes y ejecutar los contenedores:

```bash
    docker-compose up
```

### Opción 2: Ejecutar localmente con variables de entorno

1. Asegúrate de tener el archivo .env en el directorio raíz del proyecto.

2. Abre el archivo .env y define los valores de las variables de entorno requeridas. Por ejemplo:

```yaml
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   DB_DIALECT=postgres
   DB_DRIVER=postgres
   DB_HOST=localhost
   DB_NAME=my-database
   DB_PASSWORD=db-password
   DB_PORT=5432
   DB_USERNAME=db-username
   ENCRYPTION_KEY_SECRET=encryption-key
   MICRO_SERVICE_URL=http://microservice-url
   S3_BUCKET_NAME=my-bucket
```
Asegúrate de reemplazar los valores de ejemplo con los valores correctos para tu aplicación y base de datos.

3. Abre una terminal y navega hasta el directorio raíz del proyecto donde se encuentra el archivo package.json.

4. Ejecuta los siguientes comandos en secuencia:

```
npm install
npm run build
npm run start:dev
```

### Ejecutar pruebas con Jest

1. Abre una terminal y navega hasta el directorio raíz del proyecto donde se encuentra el archivo package.json.


2. Ejecuta el siguiente comando para ejecutar las pruebas con Jest:

```
npm run test
```
