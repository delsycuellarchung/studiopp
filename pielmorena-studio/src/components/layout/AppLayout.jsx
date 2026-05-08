import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function InicioIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 10.5V20h13v-9.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 20v-6h5v6" />
    </svg>
  )
}

function ServiciosIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}

function ReservasIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 16 2 2 4-4" />
    </svg>
  )
}

function SalirIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0-3-3m3 3H9" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  )
}

function AppLayout() {
  const navigate = useNavigate()

  const menuItems = [
    {
      title: 'Inicio',
      path: '/dashboard',
      icon: <InicioIcon />,
    },
    {
      title: 'Servicios',
      path: '/servicios',
      icon: <ServiciosIcon />,
    },
    {
      title: 'Reservas',
      path: '/reservas',
      icon: <ReservasIcon />,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-black">
      <header className="sticky top-0 z-40 border-b border-[#d4af37]/20 bg-black/95 text-white shadow-xl shadow-black/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] sm:flex">
              <SparkIcon />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d4af37]">
                Panel administrativo
              </p>

              <h1 className="font-brand truncate text-3xl font-black leading-none text-white">
                Piel Morena
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d4af37]/45 bg-[#d4af37]/10 px-4 py-3 text-sm font-black text-[#d4af37] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#d4af37] hover:text-black active:scale-95"
          >
            <SalirIcon />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-40 pt-5 sm:px-6 lg:px-10">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#d4af37]/20 bg-black/95 px-3 pb-4 pt-3 shadow-2xl shadow-black backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex min-h-[78px] flex-col items-center justify-center overflow-hidden rounded-[1.4rem] border text-center transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-xl shadow-[#d4af37]/25'
                    : 'border-white/10 bg-white/[0.06] text-white/65 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 hover:text-[#d4af37]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`mb-1 flex h-9 w-9 items-center justify-center rounded-2xl transition ${
                      isActive
                        ? 'bg-black/10 text-black'
                        : 'bg-white/5 text-white/75 group-hover:text-[#d4af37]'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <span className="text-[11px] font-black">
                    {item.title}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-2 h-1 w-8 rounded-full bg-black/35" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default AppLayout