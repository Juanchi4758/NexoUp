# 🚀 Guía de Instalación - NEXOVENTIS

Sistema completo de gestión para PYMES - Preparado para Supabase y Vercel

---

## 📋 Resumen del Sistema

NEXOVENTIS es un sistema completo de gestión empresarial que incluye:

- ✅ **Gestión de Inventario** - Control completo de productos, stock, precios, proveedores y fechas de vencimiento
- ✅ **Sistema de Ventas (POS)** - Punto de venta con descuento automático de inventario
- ✅ **Gestión de Clientes y Fiados** - Control de créditos, límites y pagos
- ✅ **Sistema de Alertas** - Notificaciones automáticas de stock bajo, vencimientos y deudas
- ✅ **Autenticación de Usuarios** - Sistema completo con roles (Admin/Empleado)
- ✅ **Dashboard en Tiempo Real** - Estadísticas y reportes visuales
- ✅ **Diseño Optimizado** - Interfaz moderna y accesible para adultos mayores

---

## 🎯 Modo Actual: DEMO (Datos Mock)

El sistema **actualmente funciona con datos de prueba** almacenados en localStorage del navegador.

- ✅ **Puedes probar TODAS las funcionalidades inmediatamente**
- ✅ **No requiere configuración de base de datos para demostración**
- ⚠️ **Los datos se borran al limpiar el navegador**

**Usuario por defecto:**
- Email: `admin@nexoventis.com`
- Contraseña: `admin123`

---

## 🔄 Migración a Producción con Supabase

Para usar el sistema en producción con base de datos real, sigue estos pasos:

### **Paso 1: Crear Proyecto en Supabase**

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: `nexoventis` (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a tu ubicación
   - **Plan**: Free (suficiente para empezar)
5. Espera 2-3 minutos mientras Supabase crea tu proyecto

---

### **Paso 2: Ejecutar Scripts SQL**

Una vez creado el proyecto, debes crear las tablas en la base de datos:

#### **2.1 - Ir al SQL Editor**

1. En el panel de Supabase, ve a **SQL Editor** (icono </> en el menú lateral)
2. Haz clic en **"New query"**

#### **2.2 - Ejecutar Script de Usuarios**

Copia y pega el contenido del archivo `scripts/00-create-users-table.sql`:

\`\`\`sql
-- Este script crea la tabla de usuarios sin password_hash
-- Las contraseñas se gestionan en auth.users de Supabase
-- También crea un trigger automático para nuevos usuarios
-- Ejecútalo PRIMERO
\`\`\`

- Haz clic en **"Run"** (o presiona Ctrl+Enter)
- Espera el mensaje de confirmación ✅

#### **2.3 - Ejecutar Script de Tablas**

Crea una nueva query y ejecuta `scripts/01-create-tables.sql`:

\`\`\`sql
-- Este script crea todas las tablas del sistema:
-- products, customers, sales, alerts
\`\`\`

- Haz clic en **"Run"**
- Espera el mensaje de confirmación ✅

#### **2.4 - Ejecutar Script de Datos Iniciales (Opcional)**

Si quieres datos de prueba, ejecuta `scripts/02-seed-data.sql`:

\`\`\`sql
-- Este script agrega productos, clientes y ventas de ejemplo
-- Es OPCIONAL - puedes empezar desde cero
\`\`\`

- Haz clic en **"Run"**
- Espera el mensaje de confirmación ✅

#### **2.5 - Crear Usuario Administrador**

**IMPORTANTE**: Ahora usaremos el script mejorado `03-create-admin-user.sql`

Ejecuta el contenido del archivo `scripts/03-create-admin-user.sql`:

\`\`\`sql
-- Este script crea el usuario administrador correctamente
-- Ejecuta todo el contenido del archivo 03-create-admin-user.sql
\`\`\`

**Credenciales por defecto:**
- Email: `admin@nexoventis.com`
- Contraseña: `admin123`

⚠️ **IMPORTANTE**: El script crea automáticamente el usuario con estas credenciales. Después del primer inicio de sesión, deberías cambiar la contraseña desde Supabase Dashboard:

1. Ve a **Authentication** → **Users**
2. Busca `admin@nexoventis.com`
3. Haz clic en los tres puntos (⋮)
4. Selecciona **"Send password reset email"** o cámbiala manualmente

---

### **Paso 3: Obtener las Credenciales de Supabase**

1. Ve a **Project Settings** (icono ⚙️ en el menú lateral)
2. Haz clic en **API** en el submenú
3. Copia los siguientes valores:

   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public key**: Una cadena larga que empieza con `eyJh...`

4. **Guárdalos en un lugar seguro** - los necesitarás en el siguiente paso

---

### **Paso 4: Configurar Variables de Entorno en Vercel**

#### **4.1 - Si estás usando Vercel (Recomendado)**

1. Ve a [https://vercel.com](https://vercel.com)
2. Importa tu proyecto de GitHub
3. Ve a **Project Settings** → **Environment Variables**
4. Agrega estas dos variables:

   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...tu_key_aqui
   \`\`\`

5. Haz clic en **Save**
6. Redeploya el proyecto desde el dashboard de Vercel

#### **4.2 - Si estás desarrollando localmente**

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las variables:

   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...tu_key_aqui
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

3. Reinicia el servidor de desarrollo

---

### **Paso 5: Verificar la Conexión**

1. Inicia sesión con las credenciales del administrador que creaste
2. Ve al módulo de **Inventario**
3. Agrega un producto de prueba
4. Ve a Supabase → **Table Editor** → **products**
5. Deberías ver el producto que acabas de crear ✅

**¡Felicidades! Tu sistema está conectado a Supabase.**

---

## 📦 Estructura de la Base de Datos

### **Tabla: users**
- `id` - UUID (Primary Key)
- `email` - String (Unique)
- `full_name` - String
- `role` - Enum: 'admin' | 'employee'
- `is_active` - Boolean
- `created_at` - Timestamp
- `updated_at` - Timestamp

### **Tabla: products**
- `id` - UUID (Primary Key)
- `name` - String
- `description` - Text
- `barcode` - String (Unique)
- `category` - String
- `unit_price` - Numeric
- `cost_price` - Numeric
- `current_stock` - Integer
- `min_stock` - Integer
- `max_stock` - Integer
- `supplier` - String
- `expiry_date` - Date (Nullable)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### **Tabla: customers**
- `id` - UUID (Primary Key)
- `name` - String
- `phone` - String (Nullable)
- `email` - String (Nullable)
- `address` - Text (Nullable)
- `credit_limit` - Numeric
- `current_debt` - Numeric
- `created_at` - Timestamp
- `updated_at` - Timestamp

### **Tabla: sales**
- `id` - UUID (Primary Key)
- `sale_date` - Timestamp
- `total_amount` - Numeric
- `payment_method` - String
- `customer_id` - UUID (Foreign Key, Nullable)
- `customer_name` - String (Nullable)
- `status` - String
- `created_at` - Timestamp

### **Tabla: alerts**
- `id` - UUID (Primary Key)
- `type` - String
- `severity` - String
- `message` - Text
- `related_id` - String (Nullable)
- `is_read` - Boolean
- `created_at` - Timestamp

---

## 🔒 Seguridad (Row Level Security)

Todos los scripts incluyen políticas RLS (Row Level Security) que:

- ✅ Permiten a usuarios autenticados leer y escribir sus datos
- ✅ Protegen los datos entre diferentes usuarios
- ✅ Previenen acceso no autorizado

**Las políticas están configuradas automáticamente en los scripts SQL.**

---

## 🛠️ Funcionalidades del Sistema

### **1. Dashboard Principal**
- Resumen de ventas del día/mes
- Total de productos en inventario
- Clientes con deuda
- Alertas activas
- Accesos rápidos a todas las funciones

### **2. Gestión de Inventario**
- ➕ Agregar productos (nombre, código de barras, precio, stock, proveedor, etc.)
- ✏️ Editar productos existentes
- 🗑️ Eliminar productos
- 📊 Ajuste de stock (entrada/salida)
- ⚠️ Alertas automáticas de stock bajo
- 📅 Control de fechas de vencimiento

### **3. Sistema de Ventas (POS)**
- 🛒 Carrito de compras interactivo
- 🔍 Búsqueda rápida de productos por nombre o código
- 💳 Múltiples métodos de pago: Efectivo, Tarjeta, Transferencia, Fiado
- 📉 Descuento automático de inventario
- 🧾 Historial de ventas
- 👤 Vinculación con clientes para ventas a crédito

### **4. Gestión de Clientes y Fiados**
- 👥 Registro de clientes con datos completos
- 💰 Límites de crédito personalizados
- 📊 Control de deuda actual
- 💵 Sistema de abonos/pagos
- ⚠️ Alertas de límite de crédito alcanzado

### **5. Sistema de Alertas**
- 🔴 Stock bajo o agotado
- 📅 Productos próximos a vencer (7 días)
- 💳 Clientes cerca del límite de crédito
- 🔔 Panel centralizado de notificaciones

### **6. Gestión de Usuarios**
- 👤 Registro de nuevos usuarios (solo admin)
- 🔐 Roles: Administrador y Empleado
- ✅ Activación/desactivación de usuarios
- 📊 Visualización de todos los usuarios del sistema

---

## 🎨 Características de Diseño

- 📱 **Responsive**: Funciona en móviles, tablets y desktop
- 🌙 **Dark Mode**: Tema oscuro moderno y tecnológico
- ♿ **Accesible**: Optimizado para adultos mayores (botones grandes, texto claro)
- ⚡ **Rápido**: Carga instantánea y transiciones suaves
- 🎯 **Intuitivo**: Navegación simple y clara

---

## 🚨 Solución de Problemas

### **Error: "Supabase credentials not found"**
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que los nombres sean exactos: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Si usas Vercel, redeploya después de agregar las variables

### **Error al iniciar sesión**
- Verifica que hayas ejecutado el script de creación de usuario administrador
- Asegúrate de usar el email y contraseña que configuraste en el script
- Revisa la tabla `auth.users` en Supabase para confirmar que el usuario existe

### **Los datos no se guardan**
- Verifica que la conexión a Supabase esté activa (revisa la consola del navegador)
- Confirma que las políticas RLS estén configuradas correctamente
- Revisa los logs en Supabase → **Logs** → **Postgres Logs**

### **Error: "Row Level Security policy violation"**
- Las políticas RLS están bloqueando el acceso
- Vuelve a ejecutar el script `01-create-tables.sql` para recrear las políticas
- Asegúrate de estar autenticado en la aplicación

---

## 📞 Soporte

Si necesitas ayuda adicional:

1. Revisa esta guía completa
2. Verifica los logs en la consola del navegador (F12 → Console)
3. Verifica los logs de Supabase (Dashboard → Logs)
4. Consulta la documentación oficial:
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Vercel Docs](https://vercel.com/docs)

---

## 📝 Notas Importantes

1. **Backup**: Supabase hace backups automáticos, pero se recomienda exportar datos importantes regularmente
2. **Seguridad**: Cambia las contraseñas por defecto inmediatamente
3. **Escalabilidad**: El plan gratuito de Supabase tiene límites. Revisa los límites en [supabase.com/pricing](https://supabase.com/pricing)
4. **Actualizaciones**: Este sistema está listo para producción pero puede requerir ajustes según tus necesidades específicas

---

## ✅ Checklist de Implementación

Marca cada paso conforme lo completes:

- [ ] Crear proyecto en Supabase
- [ ] Ejecutar script `00-create-users-table.sql`
- [ ] Ejecutar script `01-create-tables.sql`
- [ ] Ejecutar script `02-seed-data.sql` (opcional)
- [ ] Crear usuario administrador con SQL
- [ ] Copiar credenciales de Supabase (URL y Key)
- [ ] Configurar variables de entorno en Vercel
- [ ] Desplegar aplicación
- [ ] Iniciar sesión con usuario administrador
- [ ] Probar creación de producto
- [ ] Verificar datos en Supabase
- [ ] Crear usuarios adicionales desde la interfaz
- [ ] Probar sistema de ventas
- [ ] Verificar alertas automáticas

---

## 🎉 ¡Listo para Usar!

Tu sistema NEXOVENTIS está completamente configurado y listo para gestionar tu negocio.

**Características disponibles:**
- ✅ Gestión completa de inventario
- ✅ Sistema de ventas funcional
- ✅ Control de clientes y créditos
- ✅ Alertas automáticas
- ✅ Múltiples usuarios con roles
- ✅ Base de datos en la nube
- ✅ Acceso desde cualquier dispositivo

**¡Que tengas mucho éxito con tu negocio! 🚀**
