// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { BrokerClient } from "../../client/http/Broker";
import MailIcon from '@mui/icons-material/Mail'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Box } from "@mui/material"
import broker from '../../ui/assets/images/broker.png'
import isologotipo from '../../ui/assets/images/isologotipo.png'
import check_circle from '../../ui/assets/images/check_circle.svg';


interface RegisterPageProps {
    navigateTo: (page: "login") => void;
}

interface FormData {
  nombre: string
  apellido: string
  email: string
  contrasena: string
  confirmarContrasena: string
  nombreEmpresa?: string
}

type AccountType = 'personal' | 'empresa'

export const Register: React.FC<RegisterPageProps> = ({ navigateTo }) => {
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      confirmarContrasena: '',
      nombreEmpresa: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [aceptoTerminos, setAceptoTerminos] = useState(false)
    const [accountType, setAccountType] = useState<AccountType>('personal')
    const [showSuccessModal, setShowSuccessModal] = useState(false)
  
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
        console.log(response)
        if (response) {
            setShowSuccessModal(true)
            //navigateTo("login");
        } else {
            setError("Error registering user");
        }
    } catch (err) {
        setError("An unexpected error occurred");
    }
    }

    const handleLoginClick = () => {
      setShowSuccessModal(false)
      navigateTo('login')
    }
  
    const iconStyle = { color: '#a3a3a3' }
  
    return (
      <div className="flex min-h-screen bg-cover bg-center bg-background">
        <div className="flex-1 flex items-center justify-end">
          <div className="flex flex-col min-h-screen">
            <div className="w-full max-w-md px-8 py-4 bg-white shadow-md">
              <div className="flex items-center justify-center mb-4">
                <img src={broker} width={91}/>
              </div>
              <h2 className="font-inter text-2xl font-bold text-center text-gray-800 mb-6">Portal de Inversionistas</h2>
              <p className="text-center text-gray-600 mb-2">¡Te damos la bienvenida!</p>
              <p className="text-xs text-gray-600 mb-4">Por favor, completa los siguientes datos para poder crear tu cuenta.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setAccountType('personal')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    accountType === 'personal'
                      ? 'bg-white text-blue-700 font-bold'
                      : 'bg-white text-blue-700'
                  } border border-blue-500 hover:bg-blue-50 transition-colors duration-200`}
                >
                  Crear cuenta personal
                </button>
                <button
                  onClick={() => setAccountType('empresa')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    accountType === 'empresa'
                      ? 'bg-white text-blue-700 font-bold'
                      : 'bg-white text-blue-700'
                  } border border-blue-500 hover:bg-blue-50 transition-colors duration-200`}
                >
                  Crear cuenta empresa
                </button>
              </div>
                {accountType === 'empresa' && (
                <div className="relative">
                  <input
                    type="text"
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleInputChange}
                    className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-[#2B2964] peer"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="nombreEmpresa" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Nombre legal de la empresa</label>
                </div>
              )}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
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
                        className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
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
                    value={formData.contrasena}
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
                <p className="text-xs text-gray-500">Debe contener al menos una mayúscula, una minúscula, un número y 8 caracteres.</p>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleInputChange}
                    className="block w-full px-3 pt-6 pb-1 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terminos" className="ml-2 block text-sm text-gray-900">
                    Declaro que soy mayor de edad y acepto los <a href="#" className="text-blue-600 hover:text-blue-500">términos y condiciones</a> de Wbuild.
                  </label>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full max-w-[108px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Registrarse
                  </button>
                </div>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Iniciar sesión</a>
              </p>
            </div>
            <div className="w-full max-w-md p-4 bg-gray-400">
              <div className="flex items-center justify-center">
                <div className="mr-4 text-x1">By</div>
                <img src={isologotipo} width={85}/>
              </div>
            </div>
          </div>
          <Dialog
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          maxWidth={false}
          PaperProps={{
            style: {
              maxWidth: '412px',
              maxHeight: '712px',
              width: '100%',
              height: '100%',
            },
          }}
        >
          <DialogContent className="flex flex-col items-center justify-center p-6">
          <Box
                component="img"
                src={check_circle}
                alt="Check"
                sx={{ width: '100%', maxWidth: 192, mb: 4 }}
              />
            <DialogTitle className="text-2xl font-bold text-center">¡Te registraste!</DialogTitle>
            <DialogContentText className="text-center max-w-[306px] mb-6">
              ¡Felicidades, ya eres parte de Wbuild! Te enviamos un mail a tu casilla de correo para que puedas verificar tu cuenta e invertir con nosotros.
            </DialogContentText>
            <button
              onClick={handleLoginClick}
              className="w-full max-w-[166px] h-[38px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
            >
              Iniciar Sesión
            </button>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    )
};
