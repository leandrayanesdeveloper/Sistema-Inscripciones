import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUpStudent from "./components/SignUpStudent";
import SignUpProfessor from "./components/SignUpProfessor";
import StudentDashboard from "./components/StudentDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";

const withCredentials = true;
// Esto es para que el navegador envíe las cookies automáticamente en cada solicitud, lo cual es necesario para mantener la sesión activa después del login.

function App() {
  const [user, setUser] = useState(null);
  const [pantallaActual, setPantallaActual] = useState("home");
  const [rolSeleccionado, setRolSeleccionado] = useState("estudiante");

  // Esta función centraliza la apertura de Login/Registro con el rol correcto
  const abrirPortal = (pantalla, rol) => {
    setRolSeleccionado(rol);
    setPantallaActual(pantalla);
  };

  // 1. VISTA CUANDO EL USUARIO ESTÁ LOGUEADO
  if (user) {
    return (
      <div className="min-h-screen">
        <nav className="bg-indigo-900 p-4 text-white flex justify-between shadow-md">
          <span className="font-bold tracking-tight">
            UDC - Gestión Académica
          </span>
          <button
            onClick={() => {
              setUser(null);
              setPantallaActual("home");
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-sm transition font-bold shadow-sm"
          >
            Cerrar Sesión 🚪
          </button>
        </nav>

        {/* Usamos 'usuario' o 'user'*/}
        {user.rol === "profesor" ? (
          <ProfessorDashboard
            usuario={user}
            alCerrarSesion={() => setUser(null)}
          />
        ) : (
          <StudentDashboard
            usuario={user}
            alCerrarSesion={() => setUser(null)}
          />
        )}
      </div>
    );
  }

  // 2. VISTA DE NAVEGACIÓN
  return (
    <div className="min-h-screen bg-gray-100">
      {pantallaActual === "home" && (
        <Home
          abrirLogin={(rol) => abrirPortal("login", rol)}
          irARegistro={(rol) => abrirPortal("signup", rol)}
        />
      )}

      {pantallaActual === "login" && (
        <Login
          onLogin={setUser}
          irAHome={() => setPantallaActual("home")}
          irARegistro={() => setPantallaActual("signup")}
          rolPredefinido={rolSeleccionado}
        />
      )}

      {pantallaActual === "signup" && (
        <>
          {rolSeleccionado === "estudiante" ? (
            <SignUpStudent
              irALogin={() => setPantallaActual("login")}
              alFinalizar={() => setPantallaActual("home")}
            />
          ) : (
            <SignUpProfessor
              irALogin={() => setPantallaActual("login")}
              alFinalizar={() => setPantallaActual("home")}
            />
          )}
        </>
      )}
      <footer className="bg-white p-4 text-center">
        <p className="text-sm text-gray-400 mt-1">
          Desarrollado por{" "}
          <a
            href="https://github.com/leandrayanesdeveloper"
            className="text-indigo-300 hover:text-indigo-400"
          >
            Leandra Yanes
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
