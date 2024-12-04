**📋 Descripción del Proyecto**  
El Sistema de Gestión de Tareas es una herramienta diseñada para optimizar la organización, asignación y seguimiento de tareas dentro de proyectos. Los usuarios pueden gestionar transacciones, administrar maestros y controlar los roles de los usuarios (ADMIN y USER), asegurando un acceso adecuado según los permisos establecidos. Este proyecto utiliza tecnologías avanzadas como Next.js, TypeScript, Tailwind CSS, Prisma, GraphQL y Supabase.

**🚀 Funcionalidades Principales:**

**🔐 Autenticación de Usuarios**  
Acceso seguro mediante inicio de sesión. Roles diferenciados: ADMIN y USER.

**📊 Gestión de Proyectos y Tareas (ADMIN)**  
Creación y gestión de proyectos. Asignación de tareas a los responsables dentro de cada proyecto. Modificación, reasignación y eliminación de proyectos y tareas. Acceso a un panel de análisis con representaciones gráficas: Estado de los proyectos (progreso, tareas pendientes y completadas).

**👥 Gestión de Usuarios (ADMIN)**  
Visualización y edición de información de usuarios. Cambiar roles entre ADMIN o USER. Eliminación y creación de usuarios.

**👤 Funcionalidades para Usuarios (USER)**  
Acceso exclusivo a proyectos y tareas asignadas. Cambio de estado de las tareas a los siguientes estados: "Pendiente", "En progreso" y "Completada".

**📈 Analítica (ADMIN)**  
Gráficas interactivas que muestran: Progreso general por proyecto. Distribución de tareas según su estado.

**💳 Gestión de Transacciones**  
Registro y seguimiento de movimientos relacionados con los usuarios. Historial detallado de las acciones realizadas dentro del sistema.

**🧭 Barra de Navegación**  
Navega fácilmente entre las secciones principales del sistema:  
- Gestión de usuarios (solo ADMIN).  
- Análisis de datos (para ADMIN y USER).  
- Gestión de Proyectos (para ADMIN y USER).

**🛠️ Tecnologías Usadas**  
- **Frontend:** Next.js  
- **Lenguaje:** TypeScript  
- **Estilos:** Tailwind CSS  
- **ORM:** Prisma  
- **Base de Datos:** Supabase  
- **API:** GraphQL con Apollo Server v4  
- **Gestión de Paquetes:** Yarn

**📦 Instrucciones de Configuración**

1️⃣ **Clonar el Repositorio**  

git clone <URL_DEL_REPOSITORIO> 
cd <NOMBRE_DEL_PROYECTO>

2️⃣ **Instalar Dependencias**

yarn install

3️⃣ **Configurar la Base de Datos**

Crea una base de datos en Supabase y configura la variable de entorno DATABASE_URL en un archivo .env:

DATABASE_URL=tu_string_de_conexion

4️⃣ **Ejecutar Migraciones**

Inicializa las tablas de la base de datos:

npx prisma migrate dev --name migracion-inicial

5️⃣ **Iniciar el Servidor**

yarn dev

Accede a la aplicación en: http://localhost:3000
