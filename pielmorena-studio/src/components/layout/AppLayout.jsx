import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function DashboardIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z" />
    </svg>
  )
}

function ClientesIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 1 0-8 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8.5a3 3 0 0 1 0 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 20a5.5 5.5 0 0 0-3.5-5.1" />
    </svg>
  )
}

function ServiciosIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l1 5H7l1-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9h10l1 11H6L7 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 16h4" />
    </svg>
  )
}

function ReservasIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3M17 3v3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8h15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v12A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 14 2 2 4-5" />
    </svg>
  )
}

function AppLayout() {
  const navigate = useNavigate()

  const menuItems = [
    { title: 'Inicio', path: '/dashboard', icon: <DashboardIcon /> },
    { title: 'Clientes', path: '/clientes', icon: <ClientesIcon /> },
    { title: 'Servicios', path: '/servicios', icon: <ServiciosIcon /> },
    { title: 'Reservas', path: '/reservas', icon: <ReservasIcon /> },
  ]

  return (
    <div className="min-h-screen bg-[#f7f3ea] pb-24">
      <header className="sticky top-0 z-30 border-b border-[#d4af37]/20 bg-black/95 px-4 py-4 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d4af37]">
              Panel administrativo
            </p>
            <h1 className="font-brand text-2xl font-bold leading-none text-white">
              Piel Morena
            </h1>
          </div>

          <button
            onClick={() => navigate('/')}
            className="rounded-xl border border-[#d4af37]/50 px-3 py-2 text-xs font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-10">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#d4af37]/20 bg-black/95 px-3 py-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex aspect-square flex-col items-center justify-center rounded-2xl border text-center transition ${
                  isActive
                    ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-[#d4af37]/60 hover:text-[#d4af37]'
                }`
              }
            >
              {item.icon}
              <span className="mt-1 text-[10px] font-bold">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default AppLayout