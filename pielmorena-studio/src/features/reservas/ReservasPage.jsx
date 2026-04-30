import { useState } from 'react'

function ReservasPage() {
  const clientes = [
    { id: 1, nombre_completo: 'María Fernanda Rojas' },
    { id: 2, nombre_completo: 'Camila Vargas' },
    { id: 3, nombre_completo: 'Daniela Suárez' },
  ]

  const servicios = [
    { id: 1, nombre: 'Manicure semipermanente', precio: 120, duracion_minutos: 60 },
    { id: 2, nombre: 'Uñas acrílicas', precio: 200, duracion_minutos: 90 },
    { id: 3, nombre: 'Maquillaje social', precio: 250, duracion_minutos: 60 },
  ]

  const [reservas, setReservas] = useState([
    {
      id: 1,
      cliente_id: 1,
      servicio_id: 2,
      cliente: 'María Fernanda Rojas',
      servicio: 'Uñas acrílicas',
      fecha_reserva: '2026-05-02',
      hora_inicio: '15:00',
      hora_fin: '16:30',
      estado: 'confirmada',
      precio_final: 200,
      notas: 'Quiere diseño dorado elegante.',
    },
    {
      id: 2,
      cliente_id: 2,
      servicio_id: 1,
      cliente: 'Camila Vargas',
      servicio: 'Manicure semipermanente',
      fecha_reserva: '2026-05-03',
      hora_inicio: '10:00',
      hora_fin: '11:00',
      estado: 'pendiente',
      precio_final: 120,
      notas: '',
    },
  ])

  const [form, setForm] = useState({
    cliente_id: '',
    servicio_id: '',
    fecha_reserva: '',
    hora_inicio: '',
    estado: 'pendiente',
    precio_final: '',
    notas: '',
  })

  const [editandoId, setEditandoId] = useState(null)

  const calcularHoraFin = (horaInicio, duracion) => {
    if (!horaInicio || !duracion) return ''

    const [horas, minutos] = horaInicio.split(':').map(Number)
    const fecha = new Date()
    fecha.setHours(horas)
    fecha.setMinutes(minutos + Number(duracion))

    return fecha.toTimeString().slice(0, 5)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'servicio_id') {
      const servicio = servicios.find((s) => s.id === Number(value))

      setForm({
        ...form,
        servicio_id: value,
        precio_final: servicio ? servicio.precio : '',
      })

      return
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const limpiarFormulario = () => {
    setForm({
      cliente_id: '',
      servicio_id: '',
      fecha_reserva: '',
      hora_inicio: '',
      estado: 'pendiente',
      precio_final: '',
      notas: '',
    })
    setEditandoId(null)
  }

  const guardarReserva = (e) => {
    e.preventDefault()

    if (!form.cliente_id || !form.servicio_id || !form.fecha_reserva || !form.hora_inicio) {
      return
    }

    const cliente = clientes.find((c) => c.id === Number(form.cliente_id))
    const servicio = servicios.find((s) => s.id === Number(form.servicio_id))

    const horaFin = calcularHoraFin(form.hora_inicio, servicio.duracion_minutos)

    const reservaData = {
      ...form,
      cliente_id: Number(form.cliente_id),
      servicio_id: Number(form.servicio_id),
      cliente: cliente.nombre_completo,
      servicio: servicio.nombre,
      hora_fin: horaFin,
      precio_final: Number(form.precio_final || servicio.precio),
    }

    if (editandoId) {
      setReservas(
        reservas.map((reserva) =>
          reserva.id === editandoId ? { ...reserva, ...reservaData } : reserva
        )
      )
    } else {
      setReservas([
        {
          id: Date.now(),
          ...reservaData,
        },
        ...reservas,
      ])
    }

    limpiarFormulario()
  }

  const editarReserva = (reserva) => {
    setEditandoId(reserva.id)
    setForm({
      cliente_id: String(reserva.cliente_id),
      servicio_id: String(reserva.servicio_id),
      fecha_reserva: reserva.fecha_reserva,
      hora_inicio: reserva.hora_inicio,
      estado: reserva.estado,
      precio_final: reserva.precio_final,
      notas: reserva.notas,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cambiarEstado = (id, estado) => {
    setReservas(
      reservas.map((reserva) =>
        reserva.id === id ? { ...reserva, estado } : reserva
      )
    )
  }

  const colorEstado = (estado) => {
    if (estado === 'confirmada') return 'bg-green-100 text-green-700'
    if (estado === 'completada') return 'bg-blue-100 text-blue-700'
    if (estado === 'cancelada') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[#d4af37]/30 bg-black p-5 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d4af37]">
          Agenda
        </p>

        <h2 className="font-brand mt-2 text-3xl font-bold">
          Reservas
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/65">
          Organiza citas, horarios, servicios y estados de atención.
        </p>
      </div>

      <form
        onSubmit={guardarReserva}
        className="rounded-[2rem] border border-[#d4af37]/25 bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-bold text-black">
          {editandoId ? 'Editar reserva' : 'Nueva reserva'}
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre_completo}
              </option>
            ))}
          </select>

          <select
            name="servicio_id"
            value={form.servicio_id}
            onChange={handleChange}
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          >
            <option value="">Seleccionar servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre} · Bs {servicio.precio}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fecha_reserva"
            value={form.fecha_reserva}
            onChange={handleChange}
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <input
            type="number"
            name="precio_final"
            value={form.precio_final}
            onChange={handleChange}
            placeholder="Precio final"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Notas de la reserva"
            rows="3"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37] md:col-span-2"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-black px-5 py-3 font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black">
            {editandoId ? 'Actualizar reserva' : 'Registrar reserva'}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-2xl border border-black/20 px-5 py-3 font-bold text-black transition hover:bg-black hover:text-white"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {reservas.map((reserva) => (
          <div
            key={reserva.id}
            className="rounded-[2rem] border border-[#d4af37]/20 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-bold text-black">
                  {reserva.cliente}
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                  {reserva.servicio} · Bs {reserva.precio_final}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {reserva.fecha_reserva} · {reserva.hora_inicio} - {reserva.hora_fin}
                </p>

                {reserva.notas && (
                  <p className="mt-2 text-sm text-gray-500">
                    {reserva.notas}
                  </p>
                )}

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${colorEstado(
                    reserva.estado
                  )}`}
                >
                  {reserva.estado}
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex gap-2">
                  <button
                    onClick={() => editarReserva(reserva)}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
                  >
                    Editar
                  </button>

                  <select
                    value={reserva.estado}
                    onChange={(e) => cambiarEstado(reserva.id, e.target.value)}
                    className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-bold text-black outline-none"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReservasPage