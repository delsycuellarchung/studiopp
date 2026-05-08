import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function ReservasPage() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('activas')

  useEffect(() => {
    fetchReservas()
  }, [])

  async function fetchReservas() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .order('fecha_reserva', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (error) {
        console.error('Error fetching reservas from Supabase:', error)
        return
      }

      setReservas(data || [])
    } catch (err) {
      console.error('Unexpected error fetching reservas:', err)
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstado = async (id, estado) => {
    try {
      const { error } = await supabase
        .from('reservas')
        .update({ estado })
        .eq('id', id)

      if (error) {
        console.error('Error updating reserva estado:', error)
        return
      }

      await fetchReservas()
    } catch (err) {
      console.error('Unexpected error updating estado:', err)
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'

    try {
      return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-BO', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return fecha
    }
  }

  const formatearHora = (hora) => {
    if (!hora) return 'Sin hora'
    return hora.slice(0, 5)
  }

  const esReservaActualOFutura = (fechaReserva) => {
    try {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      const fecha = new Date(`${fechaReserva}T00:00:00`)
      fecha.setHours(0, 0, 0, 0)

      return fecha >= hoy
    } catch {
      return true
    }
  }

  const colorEstado = (estado) => {
    const estilos = {
      pendiente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      confirmada: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      completada: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
      cancelada: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    }

    return estilos[estado] || 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
  }

  const textoEstado = (estado) => {
    const estados = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      completada: 'Completada',
      cancelada: 'Cancelada',
    }

    return estados[estado] || estado
  }

  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      const texto = `${reserva.cliente || ''} ${reserva.servicio || ''} ${reserva.fecha_reserva || ''} ${reserva.hora_inicio || ''}`
        .toLowerCase()

      const coincideBusqueda = texto.includes(busqueda.toLowerCase())

      let coincideEstado = true

      if (filtroEstado === 'activas') {
        coincideEstado =
          ['pendiente', 'confirmada'].includes(reserva.estado) &&
          esReservaActualOFutura(reserva.fecha_reserva)
      } else if (filtroEstado !== 'todas') {
        coincideEstado = reserva.estado === filtroEstado
      }

      return coincideBusqueda && coincideEstado
    })
  }, [reservas, busqueda, filtroEstado])

  const resumen = useMemo(() => {
    const activas = reservas.filter(
      (r) =>
        ['pendiente', 'confirmada'].includes(r.estado) &&
        esReservaActualOFutura(r.fecha_reserva)
    ).length

    const pendientes = reservas.filter((r) => r.estado === 'pendiente').length
    const confirmadas = reservas.filter((r) => r.estado === 'confirmada').length
    const completadas = reservas.filter((r) => r.estado === 'completada').length

    return {
      activas,
      pendientes,
      confirmadas,
      completadas,
    }
  }, [reservas])

  return (
    <section className="min-h-screen space-y-6 pb-40">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/30 bg-black p-6 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#d4af37]">
            Agenda
          </p>

          <h2 className="font-brand mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Reservas
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            Organiza las citas de tus clientas, confirma horarios y controla el estado de cada reserva.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.7rem] border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
            Activas
          </p>
          <h3 className="mt-2 text-3xl font-black text-black">{resumen.activas}</h3>
          <p className="mt-1 text-sm text-gray-500">Próximas reservas</p>
        </div>

        <div className="rounded-[1.7rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-600">
            Pendientes
          </p>
          <h3 className="mt-2 text-3xl font-black text-amber-700">{resumen.pendientes}</h3>
          <p className="mt-1 text-sm text-amber-700/70">Por confirmar</p>
        </div>

        <div className="rounded-[1.7rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Confirmadas
          </p>
          <h3 className="mt-2 text-3xl font-black text-emerald-700">{resumen.confirmadas}</h3>
          <p className="mt-1 text-sm text-emerald-700/70">Listas para atender</p>
        </div>

        <div className="rounded-[1.7rem] border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            Completadas
          </p>
          <h3 className="mt-2 text-3xl font-black text-blue-700">{resumen.completadas}</h3>
          <p className="mt-1 text-sm text-blue-700/70">Servicios finalizados</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#d4af37]/20 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-black">Listado de reservas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Busca por cliente, servicio, fecha o cambia el estado de la cita.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar reserva..."
              className="w-full rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] sm:w-64"
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-bold text-black outline-none transition focus:border-[#d4af37]"
            >
              <option value="activas">Activas</option>
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {loading && (
            <div className="rounded-[1.5rem] border border-black/5 bg-[#f7f3ea] p-8 text-center">
              <p className="font-bold text-black">Cargando reservas...</p>
              <p className="mt-1 text-sm text-gray-500">Espera un momento.</p>
            </div>
          )}

          {!loading && reservasFiltradas.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-[#d4af37]/50 bg-[#f7f3ea] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#d4af37]">
                <CalendarIcon />
              </div>

              <h4 className="mt-4 text-lg font-black text-black">No hay reservas para mostrar</h4>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Cambia el filtro o revisa si existen reservas registradas por las clientas.
              </p>
            </div>
          )}

          {!loading &&
            reservasFiltradas.map((reserva) => (
              <article
                key={reserva.id}
                className="group overflow-hidden rounded-[1.7rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:shadow-xl"
              >
                <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
                  <div className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-[#d4af37] shadow-lg">
                          <UserIcon />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xl font-black text-black">
                              {reserva.cliente || 'Cliente sin nombre'}
                            </h4>

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${colorEstado(
                                reserva.estado
                              )}`}
                            >
                              {textoEstado(reserva.estado)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-gray-600">
                            {reserva.servicio || 'Servicio no especificado'}
                          </p>

                          {reserva.notas && (
                            <p className="mt-3 max-w-2xl rounded-2xl bg-[#f7f3ea] px-4 py-3 text-sm leading-6 text-gray-600">
                              {reserva.notas}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[#f7f3ea] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                          Fecha
                        </p>
                        <p className="mt-1 font-black text-black">
                          {formatearFecha(reserva.fecha_reserva)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f3ea] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                          Hora
                        </p>
                        <p className="mt-1 font-black text-black">
                          {formatearHora(reserva.hora_inicio)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f3ea] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                          Total
                        </p>
                        <p className="mt-1 font-black text-black">
                          Bs {reserva.precio_final || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 bg-[#fbfaf6] p-5 lg:flex lg:min-w-64 lg:flex-col lg:justify-center lg:border-l lg:border-t-0">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      Cambiar estado
                    </label>

                    <select
                      value={reserva.estado || 'pendiente'}
                      onChange={(e) => cambiarEstado(reserva.id, e.target.value)}
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black text-black outline-none transition focus:border-[#d4af37]"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => cambiarEstado(reserva.id, 'confirmada')}
                      disabled={reserva.estado === 'confirmada'}
                      className="mt-3 w-full rounded-2xl bg-black px-4 py-3 text-sm font-black text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Confirmar reserva
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default ReservasPage