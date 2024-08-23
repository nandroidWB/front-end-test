// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { BrokerClient } from "../../client/http/Broker";
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

interface RegisterPageProps {
    navigateTo: (page: "login") => void;
}

interface FormData {
  nombre: string
  apellido: string
  email: string
  contrasena: string
  confirmarContrasena: string
}

export const Register: React.FC<RegisterPageProps> = ({ navigateTo }) => {
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      confirmarContrasena: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [aceptoTerminos, setAceptoTerminos] = useState(false)
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }))
    }
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      console.log(formData)
      try {
        const client = new BrokerClient();
        const response = await client.registerUser(formData.email, formData.contrasena);
        if (response) {
            navigateTo("login");
        } else {
            setError("Error registering user");
        }
    } catch (err) {
        setError("An unexpected error occurred");
    }
    }
  
    const iconStyle = { color: '#a3a3a3' }
  
    return (
      <div className="flex min-h-screen bg-cover bg-center bg-background">
        <div className="flex-1 flex items-center justify-end">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-8">
              <svg className="w-10 h-10 text-emerald-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="text-2xl font-bold text-gray-800">Wbuild</span>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Portal de Inversionistas</h2>
            <p className="text-center text-gray-600 mb-8">¡Te damos la bienvenida!</p>
            <p className="text-sm text-gray-600 mb-6">Por favor, completa los siguientes datos para poder crear tu cuenta.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 peer"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="nombre" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Nombre</label>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 peer"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="apellido" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Apellido</label>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 peer"
                  placeholder=" "
                  required
                />
                <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Email</label>
                <MailOutlineIcon className="absolute right-3 top-1/2 transform -translate-y-1/2" style={iconStyle} />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 peer"
                  placeholder=" "
                  required
                />
                <label htmlFor="contrasena" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Contraseña</label>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon style={iconStyle} /> : <VisibilityIcon style={iconStyle} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Debe contener al menos una mayúscula, una minúscula, un número y 8 caracteres.</p>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleInputChange}
                  className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 peer"
                  placeholder=" "
                  required
                />
                <label htmlFor="confirmarContrasena" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Confirmar contraseña</label>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOffIcon style={iconStyle} /> : <VisibilityIcon style={iconStyle} />}
                </button>
              </div>
              <div className="flex items-center">
                <input
                  id="terminos"
                  name="terminos"
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terminos" className="ml-2 block text-sm text-gray-900">
                  Declaro que soy mayor de edad y acepto los <a href="#" className="text-emerald-600 hover:text-emerald-500">términos y condiciones</a> de Wbuild.
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-[108px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Registrarse
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta? <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Iniciar sesión</a>
            </p>
          </div>
        </div>
      </div>
    )
};
