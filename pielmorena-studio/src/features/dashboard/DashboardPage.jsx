import { Link } from 'react-router-dom'

function ClientesIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 1 0-8 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8.5a3 3 0 0 1 0 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 20a5.5 5.5 0 0 0-3.5-5.1" />
    </svg>
  )
}

function ServiciosIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l1 5H7l1-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9h10l1 11H6L7 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 16h4" />
    </svg>
  )
}

function ReservasIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3M17 3v3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8h15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v12A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 14 2 2 4-5" />
    </svg>
  )
}

function BloqueosIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5l14 14" />
    </svg>
  )
}

function DashboardPage() {
  const items = [
    { title: 'Clientes', subtitle: 'Registrar y consultar clientes', to: '/clientes', icon: <ClientesIcon /> },
    { title: 'Servicios', subtitle: 'Gestionar precios y duración', to: '/servicios', icon: <ServiciosIcon /> },
    { title: 'Reservas', subtitle: 'Ver y organizar citas', to: '/reservas', icon: <ReservasIcon /> },
    { title: 'Bloqueos', subtitle: 'Bloquear horarios ocupados', to: '/bloqueos', icon: <BloqueosIcon /> },
  ]

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[#d4af37]/30 bg-black p-5 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d4af37]">
          Bienvenido
        </p>

        <h2 className="font-brand mt-2 text-3xl font-bold">
          Panel de control
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/65">
          Administra clientes, servicios y reservas de Piel Morena Studio.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group rounded-[1.6rem] border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#d4af37] transition group-hover:bg-[#d4af37] group-hover:text-black">
              {item.icon}
            </div>

            <h3 className="text-base font-extrabold text-black">
              {item.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {item.subtitle}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-[2rem] border border-[#d4af37]/25 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-black">Resumen de hoy</h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#f7f3ea] p-4">
            <p className="text-2xl font-black text-black">0</p>
            <p className="text-xs text-gray-500">Reservas hoy</p>
          </div>

          <div className="rounded-2xl bg-[#f7f3ea] p-4">
            <p className="text-2xl font-black text-black">0</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage