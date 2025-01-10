import React, { useState, useContext } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import InputField from './inputField/InputField';
import ErrorMessage from './errormessage/ErrorMessage';
import AuthButton from './authButton/AuthButton';
import ToggleButton from './toggleButton/ToggleButton';
import styles from './css/Login.module.css';
import { PiEyesFill } from "react-icons/pi";
import { TbEyeOff } from "react-icons/tb";
import { AuthContext } from "../../context/authcontext";
import Swal from 'sweetalert2';

const auth = getAuth();

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'nombre') setNombre(value);
    else if (name === 'telefono') setTelefono(value);
    else if (name === 'direccion') setDireccion(value);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      const userRef = doc(db, "Usuarios", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userFromDb = userSnap.data();
        const fullUserData = {
          uid: userCredential.user.uid,
          email: userEmail,
          nombre: userFromDb.nombre || "Usuario",
          telefono: userFromDb.telefono || '',
          direccion: userFromDb.direccion || '',
        };

        login(fullUserData);
        localStorage.setItem("user", JSON.stringify(fullUserData));

        setError(null);
        if (userEmail === 'admin@elgalponcito.com') {
          navigate('/admin');
        } else {
          navigate('/clients');
        }
      } else {
        setError('El usuario no existe en la colección Usuarios.');
      }
    } catch (err) {
      setError('Error al iniciar sesión, error en el usuario o contraseña');
    }
  };

  const handleRegister = async () => {
    if (!nombre || !telefono || !direccion || !email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Validación de la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 7 caracteres, letras y números.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Usuarios", user.uid), {
        email: user.email,
        nombre,
        telefono,
        direccion,
        createdAt: new Date(),
      });

      // Mostrar alerta de bienvenida
      Swal.fire({
        title: '¡Bienvenido al Galponcito!',
        text: 'Tu registro ha sido exitoso.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Limpiar los campos
        setNombre('');
        setTelefono('');
        setDireccion('');
        setEmail('');
        setPassword('');
        setError(null);
        navigate('/clients');
      });

    } catch (err) {
      setError('Error al registrarse, intente nuevamente.');
    }
  };

  return (
    <div className={styles.fondoContainer}>
      <div className={styles.loginForm}>
        <h1>{isRegister ? 'Registro' : 'Iniciar Sesión'}</h1>
        <ErrorMessage error={error} className={styles.errorMessage} />

        {isRegister && (
          <>
            <InputField name="nombre" value={nombre} onChange={handleInputChange} placeholder="Nombre o Apodo" className={styles.inputField} />
            <InputField name="telefono" value={telefono} onChange={handleInputChange} placeholder="Número de Teléfono" className={styles.inputField} />
            <InputField name="direccion" value={direccion} onChange={handleInputChange} placeholder="Dirección" className={styles.inputField} />
          </>
        )}

        <InputField name="email" value={email} onChange={handleInputChange} placeholder="Correo" type="email" className={styles.inputField} />

        <div className={styles.passwordContainer}>
          <div className={styles.passwordInputWrapper}>
            <InputField
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="7 caracteres Letras y Numeros"
              type={passwordVisible ? 'text' : 'password'}
              className={styles.inputField}
            />
            <button
              type="button"
              className={styles.togglePasswordButton}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ?  <PiEyesFill /> : <TbEyeOff /> }
            </button>
          </div>
        </div>

        <AuthButton onClick={isRegister ? handleRegister : handleLogin} text={isRegister ? 'Registrarse' : 'Iniciar Sesión'} className={styles.authButton} />

        <ToggleButton onClick={() => setIsRegister(!isRegister)} text={isRegister ? '¿Ya tienes cuenta? ¡Inicia sesión!' : '¿No tienes cuenta? Regístrate gratis!'} className={styles.toggleButton} />
      </div>
    </div>
  );
};

export default Login;
