
# Sistema de Inscripción Académica - Proyecto Final Full Stack 🚀

Este proyecto es una aplicación web integral desarrollada para el curso de Programación Full Stack. El sistema permite la gestión dinámica de materias y horarios, simulando un entorno real de inscripción estudiantil utilizando el **Stack MERN**.

## 🛠️ Stack Tecnológico

* **Frontend:** React.js (Hooks, Context/State)
* **Estilos:** Tailwind CSS
* **Backend:** Node.js & Express
* **Base de Datos:** MongoDB & Mongoose
* **Alertas:** SweetAlert2
* **Cliente HTTP:** Axios

## 📋 Funcionalidades Implementadas

### Módulo del Instructor (Gestión)
* **Creación de Materias:** Registro de unidades curriculares en la base de datos.
* **Gestión de Horarios:** Asignación de bloques de clase (día, hora, aula, sección).
* **Control de Colisiones:** Algoritmo que detecta si un profesor ya tiene una clase asignada en el mismo bloque horario antes de guardar.

### Módulo del Estudiante (Inscripción)
* **Visualización en Tiempo Real:** Carga de la oferta académica disponible desde el backend.
* **Validación de Choques:** El sistema impide al estudiante inscribirse en dos materias que coincidan en día y hora.
* **Generación de Comprobante:** Opción de impresión de registro para confirmación del usuario.

## ⚙️ Configuración del Proyecto

### Requisitos previos
* Node.js instalado.
* Instancia de MongoDB (Local o Atlas).

### Instalación
1. Clonar repositorio y entrar a la carpeta raíz.
2. **Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. **Frontend:**
   ```bash
   cd client
   npm install
   npm start
   ```

---

**Desarrollado por:** Leandra Yanes
**Curso:** Programación Full Stack
**Año:** 2026

---
