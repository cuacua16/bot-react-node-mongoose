# Back

### Componentes necesarios:
- **Node.js (recomendado versión 22)**
- **MongoDB**
- **npm**

### Librerías utilizadas
- Express
- Mongoose
- node-cron
- winston
- Jest
- Supertest

## Instalación proyecto

1. **Clonar repositorio en tu máquina local**
   ```bash
   git clone https://github.com/cuacua16/bot-react-node-mongoose.git
   cd bot-react-node-mongoose
   ```

2. **Instalar dependencias**
   ```bash
   cd back
   npm install
   ```
   
3. **Configurar archivo .env** (basado en .env.example proporcionado)
   ```bash
    cp .env.example .env
   ```
   
4. **Inicializar la base de datos con datos de ejemplo** *(esto se ejecuta automáticamente al correr el proyecto por primera vez si la variable de entorno SEED_DB tiene valor true)*
   ```bash
    npm run init-db
   ```

5. **Correr proyecto en modo desarrollo**
   ```bash
    npm run dev
   ```   

   
### Tests
**Ejecutar los tests**
   ```bash
    npm run test
   ```
**Ejecutar los tests en modo watch**
   ```bash
    npm run test:watch
   ```

### Comandos extra

**Vaciar la base de datos**:
   ```bash
    npm run clear-db
   ```
   
   
### Endpoints disponibles
La API cuenta con los siguientes endpoints para gestionar productos y órdenes

#### **Rutas de productos** (`/api/products`)
| Método | Endpoint             | Descripción                          |
|--------|----------------------|--------------------------------------|
| POST   | `/api/products`      | Crear un nuevo producto.             |
| GET    | `/api/products`      | Obtener productos.                   |
| GET    | `/api/products/:id`  | Obtener un producto por su ID.       |
| PUT    | `/api/products/:id`  | Actualizar un producto por su ID.    |
| DELETE | `/api/products/:id`  | Eliminar un producto por su ID.      |

#### **Rutas de órdenes** (`/api/orders`)
| Método | Endpoint             | Descripción                          |
|--------|----------------------|--------------------------------------|
| POST   | `/api/orders`        | Crear una nueva orden.               |
| GET    | `/api/orders`        | Obtener órdenes.                     |
| GET    | `/api/orders/:id`    | Obtener una orden por su ID.         |
| PUT    | `/api/orders/:id`    | Actualizar una orden por su ID.      |
| DELETE | `/api/orders/:id`    | Eliminar una orden por su ID.        |
