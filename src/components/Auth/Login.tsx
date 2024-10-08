// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { BrokerClient } from "../../client/http/Broker";
import broker from '../../ui/assets/images/broker.png'
import MailIcon from '@mui/icons-material/Mail'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Text } from '../../ui/components/primitives/Text'
import isologotipo from '../../ui/assets/images/isologotipo.png'

interface LoginPageProps {
    navigateTo: (page: "dashboard") => void;
}

interface FormLogin {
  email: string
  contrasena: string
}

export const Login: React.FC<LoginPageProps> = ({ navigateTo }) => {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [aceptoTerminos, setAceptoTerminos] = useState(false);
    const [formLogin, setFormLogin] = useState<FormLogin>({
      email: '',
      contrasena: '',
    })

    const iconStyle = { color: '#a3a3a3' }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormLogin(prevData => ({
        ...prevData,
        [name]: value,
      }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const client = new BrokerClient();
        const response = await client.loginUser(formLogin.email, formLogin.contrasena);
        if (response) {
            navigateTo("dashboard");
        } else {
            setError("Error registering user");
        }
    } catch (err) {
        setError("An unexpected error occurred");
    }
    }

    return (
      <div className="flex min-h-screen bg-cover bg-center bg-background">
      <div className="flex-1 flex items-center justify-end">
        <div className="flex flex-col min-h-screen shadow-md ">
          <div className="w-full max-w-md p-8 bg-white flex-grow justify-center">
            <div className="flex items-center justify-center mb-4">
              <img src={broker} width={91}/>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Portal de Inversionistas</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formLogin.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  placeholder=" "
                  required
                />
                <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Email</label>
                <MailIcon className="absolute right-3 top-1/2 transform -translate-y-1/2" style={iconStyle} />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  value={formLogin.contrasena}
                  onChange={handleInputChange}
                  className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
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
              <div className="flex items-center">
                <Text >
                </Text>
                  <p className="ml-2 block text-sm text-gray-900"><a href="#" className="text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a></p>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-[108px] flex justify-center py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-[Roboto]"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              ¿No tienes una cuenta? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Registrate</a>
            </p>
          </div>
          <div className="w-full max-w-md p-4 bg-gray-400">
                <div className="flex items-center justify-center">
                  <div className="mr-4 text-x1">By</div>
                  <img src={isologotipo} width={85}/>
                </div>
          </div>
        </div>
      </div>
    </div>
    );
};
