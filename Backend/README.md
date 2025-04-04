<p align="center">
  <a href="" rel="noopener">
</p>

<h3 align="center">Almacen PI</h3>

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Runnig](#Run)
- [Endpoints](#endpoints)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a id = "about"></a>

API para la gestión de un almacén, que incluye registro de usuarios, clientes, productos, compras y almacenes.

## 🏁 Getting Started <a id = "getting_started"></a>

Estas instrucciones le permitirán disponer de una copia del proyecto en su equipo local con fines de desarrollo y prueba.

### Prerequisites

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [SQLite3](https://www.sqlite.org/index.html) (Opcional)

### Installing

1. Clona este repositorio:

```bash
git clone https://github.com/TatuninoDev12/prueba-tecnica.git & cd Backend
```

2. Instala las dependencias:

```
npm install
```

3. Configura las variables de entorno:

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

```
JWT_SECRET=your_secret
DB_FILENAME=db.sqlite3
```

4. Ejecuta las migraciones y los seeds para configurar la base de datos:

```
npm run migrate
```

## 🔧 Running <a id = "run"></a>

1. Inicia el servidor:

```javascript
npm start
```

2. El servidor estará disponible en

```
http://localhost:3000
```

# 🎈 Endpoints <a id="endpoints"></a>

### Autenticación

- POST /api/auth/register
  Registra un nuevo usuario.
  Body:

  ```json
  {
    "username": "admin",
    "password": "password",
    "name": "Admin User",
    "phone": "1234567890",
    "bloodType": "O+",
    "role": "admin"
  }
  ```

- POST /api/auth/login
  Inicia sesión y obtiene un token JWT.
  Body:

  ```json
  {
    "username": "admin",
    "password": "password"
  }
  ```

### Clientes

- POST /api/clients
  Crea un nuevo cliente.
  Headers Authorization: Bearer token
  Body:

  ```json
  {
    "name": "John Doe",
    "phone": "555-1234",
    "type": "vip"
  }
  ```

- GET /api/clients
  Obtiene una lista de clientes.
  Headers: Authorization: Bearer token

- PUT /api/clients/:id
  Actualiza un cliente existente.
  Headers: Authorization: Bearer token
  Body:

  ```json
  {
    "type": "vip"
  }
  ```

- DELETE /api/clients/:id
  Elimina un cliente.
  Headers: Authorization: Bearer token

### Artículos

- POST /api/articles
  Crea un nuevo artículo.
  Headers: Authorization: Bearer token
  Body:
  ```json
  {
    "barcode": "123456789",
    "name": "Test Product",
    "manufacturer": "Test Co",
    "price": 29.99,
    "warehouseId": 1,
    "description": "Test Article"
  }
  ```
- GET /api/articles
  Obtiene una lista de artículos.
  Headers: Authorization: Bearer <token>

- PUT /api/articles/:id
  Actualiza un artículo existente.
  Headers: Authorization: Bearer <token>
  Body:

  ```json
  {
    "stock": 150
  }
  ```

  - DELETE /api/articles/:id
    Elimina un artículo.
    Headers: Authorization: Bearer <token>

### Compras

- POST /api/purchases
  Crea una nueva compra.
  Headers: Authorization: Bearer <token>
  Body:

  ```json
  {
    "ClienteId": 1,
    "ArticuloId": 1,
    "units": 5
  }
  ```

- GET /api/purchases
  Obtiene una lista de compras.
  Headers: Authorization: Bearer <token>

- PUT /api/purchases/:id
  Actualiza una compra existente.
  Headers: Authorization: Bearer <token>
  Body:
  ```json
  {
    "units": 15
  }
  ```
- DELETE /api/purchases/:id
  Elimina una compra.
  Headers: Authorization: Bearer <token>

### Almacenes

- POST /api/warehouse
  Crea un nuevo almacén.
  Headers: Authorization: Bearer <token>
  Body:
  ```json
  {
    "name": "Main Warehouse",
    "location": "Test City",
    "manager": "Warehouse Manager"
  }
  ```
- GET /api/warehouse
  Obtiene una lista de almacenes.
  Headers: Authorization: Bearer <token>

- DELETE /api/warehouse/:id
  Elimina un almacén.
  Headers: Authorization: Bearer <token>

### Test

Para ejecutar los test solo debe ejecutar el comando

```bash
npm run test
```

## ⛏️ Built Using <a id = "built_using"></a>

- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Jest](https://jestjs.io/) - Testing

## ✍️ Authors <a id = "authors"></a>

- [@Emir Tactuk](https://github.com/TatuninoDev12) - Developer
