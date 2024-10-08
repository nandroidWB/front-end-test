import React, { useState } from 'react'
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import CatalogIcon from "@mui/icons-material/ViewModuleRounded"
import InvestmentsIcon from "@mui/icons-material/InsightsRounded"
import SupportIcon from "@mui/icons-material/SupportAgentRounded"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TransfersIcon from "@mui/icons-material/CachedRounded"
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';



interface NavItem {
  icon: React.ReactNode
  label: string
  path: string
  page: string
}

const navItems: NavItem[] = [
  { icon: <HomeRoundedIcon  />, label: 'Inicio', path: '/', page: "dashboard" },
  { icon: <CatalogIcon  />, label: 'Catálogo', path: '/catalogo', page: "catalog" },
  { icon: <InvestmentsIcon  />, label: 'Inversiones', path: '/inversiones', page: "dashboard" },
  { icon: <TransfersIcon  />, label: 'Movimientos', path: '/movimientos', page: "dashboard" },
  { icon: <InfoOutlinedIcon  />, label: 'FAQ', path: '/faq', page: "dashboard" },
  { icon: <SupportIcon  />, label: 'Soporte', path: '/soporte', page: "dashboard" },
]

interface DashboardLayoutProps {
  children?: React.ReactNode
  navigateTo: (page: string) => void;
}

export default function Dashboard({ children,navigateTo }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside 
        className={`bg-[#f7f7f7] text-white transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`font-bold text-xl ${isSidebarCollapsed ? 'hidden' : 'block'}`}></h1>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-full text-[#585858] transition-colors duration-200"
          >
            {isSidebarCollapsed ? <KeyboardDoubleArrowRightOutlinedIcon /> : <KeyboardDoubleArrowLeftOutlinedIcon  />}
          </button>
        </div>
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#"
                  onClick={()=>{
                    setCurrentPage(item.page);
                    navigateTo(item.page);
                }}
                  className={`flex items-center p-4 hover:bg-[#11133f] hover:text-[#f7f7f7] transition-colors duration-200 ${
                    item.label === 'Inicio' ? 'bg-[#11133f] text-white' : 'bg-[#f7f7f7] text-[#585858]'
                  }`}
                >
                  {item.icon}
                  <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 text-sm text-gray-400">
          {isSidebarCollapsed ? null : 'Powered by ©Briken'}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Hola, Lucas</h2>
            <p className="text-gray-600">Tu portafolio</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-[#22C55E] text-white rounded-full w-8 h-8 flex items-center justify-center">
              5
            </div>
            <div className="bg-[#14123E] text-white rounded-full w-8 h-8 flex items-center justify-center">
              JM
            </div>
            <span className="text-gray-700">Lucas Pérez</span>
          </div>
        </header>

        {currentPage === "dashboard" /* Portfolio summary */ && (
            <>
                <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2">Aquí aparecerán los datos de tus inversiones y movimientos a medida que uses tu cuenta.</p>
            <div className="flex space-x-4">
                <div className="bg-[#14123E] text-white p-4 rounded-lg flex-1">
                <p className="text-sm mb-1">Valor total invertido</p>
                <h3 className="text-2xl font-bold">$0</h3>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg flex-1">
                <p className="text-sm text-gray-600 mb-1">No tienes saldo</p>
                <h3 className="text-2xl font-bold text-gray-800">$0</h3>
                </div>
            </div>
                </div>
                <div className="flex space-x-4 mb-8">
                <button
                    className="px-6 py-2 bg-[#14123E] text-white rounded-md hover:bg-[#1E1B4B] transition-colors duration-200"
                >
                    Reinvertir
                </button>
                <button
                    className="px-6 py-2 border border-[#14123E] text-[#14123E] rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                    Retirar
                </button>
                </div>
            </>
        )}

        {/* Page content */}
        {children}
      </main>
    </div>
  )
}