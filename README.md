
# Sistema de Inscripción Académica - Proyecto Final Full Stack 🚀

Este proyecto es una aplicación web integral desarrollada para el curso de Programación Full Stack. El sistema permite la gestión dinámica de materias y horarios, simulando un entorno real de inscripción estudiantil utilizando el **Stack MERN**.

## 🛠️ Stack Tecnológico

* **Frontend:** React.js 
* **Estilos:** Tailwind CSS
* **Backend:** Node.js & Express
* **Base de Datos:** MongoDB & Mongoose
* **Alertas:** SweetAlert2
* **Cliente HTTP:** Axios

## 🚀 Arquitectura del Proyecto

El sistema destaca por su transición de una lógica relacional a un modelo **NoSQL**, utilizando una **incrustación limitada** en MongoDB. Esto permite que los datos de inscripción se guarden directamente dentro del documento del estudiante, optimizando la velocidad de consulta y eliminando la necesidad de múltiples peticiones al servidor.

### Estructura de Carpetas
Es fundamental entender la disposición del código para su correcta ejecución:
*   **Raíz (Root):** Contiene el servidor **Backend** (Node.js/Express), modelos de Mongoose y controladores. No existe una carpeta llamada "backend" por separado.
*   **Carpeta `/frontend`:** Contiene la aplicación de **React** (Vite), con todos los componentes de la interfaz de usuario.

---

## 🛠️ Instalación y Configuración

Para poner en marcha el proyecto, debes instalar las dependencias en ambos entornos:

### 1. Configuración del Backend (Desde la Raíz)
Instala las librerías necesarias para el servidor, la base de datos y la seguridad (Bcrypt, JWT, Mongoose):
```bash
npm install
```

### 2. Configuración del Frontend
Navega a la carpeta del cliente e instala las dependencias de la interfaz (React, Axios, SweetAlert2):
```bash
cd frontend
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz con las siguientes claves:
*   `MONGO_URI`: Tu cadena de conexión a MongoDB Atlas.
*   `ACCESS_TOKEN_SECRET`: Clave secreta para la generación de tokens JWT.

---

## 🌟 Funcionalidades Clave

### Para Estudiantes
*   **Agrupación de Materias:** El sistema agrupa automáticamente las secciones por su `codigo_materia` para que el alumno elija entre diferentes profesores en un solo contenedor.
*   **Resolución de Conflictos:** El frontend detecta en tiempo real si una materia choca en **día y hora** con otra ya seleccionada, impidiendo el registro duplicado.
*   **Comprobante PDF:** Generación de un recibo de inscripción formal con opción de impresión directa.

### Para Profesores
*   **Gestión de Carga:** Permite crear materias, definir bloques de horarios, aulas y cupos máximos.
*   **Validación de Choques:** El sistema verifica que el docente no asigne dos clases en el mismo rango de horario.
*   **Listas de Estudiantes:** Visualización de los alumnos inscritos por sección.

---

## 🔒 Seguridad y Lógica Técnica

*   **Autenticación:** Implementada mediante **JSON Web Tokens (JWT)** almacenados en cookies seguras (`httpOnly`) para prevenir ataques XSS.
*   **Roles y Permisos:** Uso del middleware `userExtractor` para proteger rutas. Solo los profesores pueden crear materias, y solo los estudiantes pueden inscribirlas.
*   **Validación de Datos:** Los formularios de registro (`Signup`) cuentan con validaciones **Regex** para garantizar que la cédula, el correo y la contraseña cumplan con los estándares de seguridad.
*   **Persistencia:** El sistema utiliza `.populate()` para transformar los IDs de las bases de datos en información legible (nombres de profesores y materias) en el dashboard.

---

## 💻 Comandos de Ejecución

1.  **Iniciar Backend (Raíz):** `npm run dev`
2.  **Iniciar Frontend:** `cd frontend && npm run dev`

Este sistema representa una solución moderna a la gestión educativa, priorizando la integridad de los datos y la facilidad de uso para la comunidad académica.


**Desarrollado por:** Leandra Yanes
**Curso:** Programación Full Stack
**Año:** 2026

---
