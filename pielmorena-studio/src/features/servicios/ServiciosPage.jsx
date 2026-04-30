import { useState } from 'react'

function ServiciosPage() {
  const [servicios, setServicios] = useState([
    {
      id: 1,
      nombre: 'Manicure semipermanente',
      descripcion: 'Esmaltado semipermanente con acabado elegante.',
      precio: 120,
      duracion_minutos: 60,
      activo: true,
    },
    {
      id: 2,
      nombre: 'Uñas acrílicas',
      descripcion: 'Extensión de uñas con diseño personalizado.',
      precio: 200,
      duracion_minutos: 90,
      activo: true,
    },
    {
      id: 3,
      nombre: 'Maquillaje social',
      descripcion: 'Maquillaje para eventos, cenas o sesiones.',
      precio: 250,
      duracion_minutos: 60,
      activo: true,
    },
  ])

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion_minutos: '',
    activo: true,
  })

  const [editandoId, setEditandoId] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      duracion_minutos: '',
      activo: true,
    })
    setEditandoId(null)
  }

  const guardarServicio = (e) => {
    e.preventDefault()

    if (!form.nombre.trim()) return
    if (!form.precio || Number(form.precio) < 0) return
    if (!form.duracion_minutos || Number(form.duracion_minutos) <= 0) return

    const servicioData = {
      ...form,
      precio: Number(form.precio),
      duracion_minutos: Number(form.duracion_minutos),
    }

    if (editandoId) {
      setServicios(
        servicios.map((servicio) =>
          servicio.id === editandoId ? { ...servicio, ...servicioData } : servicio
        )
      )
    } else {
      setServicios([
        {
          id: Date.now(),
          ...servicioData,
        },
        ...servicios,
      ])
    }

    limpiarFormulario()
  }

  const editarServicio = (servicio) => {
    setEditandoId(servicio.id)
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      duracion_minutos: servicio.duracion_minutos,
      activo: servicio.activo,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cambiarEstado = (id) => {
    setServicios(
      servicios.map((servicio) =>
        servicio.id === id ? { ...servicio, activo: !servicio.activo } : servicio
      )
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[#d4af37]/30 bg-black p-5 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d4af37]">
          Catálogo
        </p>

        <h2 className="font-brand mt-2 text-3xl font-bold">
          Servicios
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/65">
          Administra los servicios, precios y duración de atención.
        </p>
      </div>

      <form
        onSubmit={guardarServicio}
        className="rounded-[2rem] border border-[#d4af37]/25 bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-bold text-black">
          {editandoId ? 'Editar servicio' : 'Nuevo servicio'}
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del servicio"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio en Bs"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <input
            type="number"
            name="duracion_minutos"
            value={form.duracion_minutos}
            onChange={handleChange}
            placeholder="Duración en minutos"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37] md:col-span-2"
          />

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del servicio"
            rows="3"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37] md:col-span-2"
          />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-black">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            className="h-4 w-4 accent-[#d4af37]"
          />
          Servicio activo
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-black px-5 py-3 font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black">
            {editandoId ? 'Actualizar servicio' : 'Registrar servicio'}
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
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="rounded-[2rem] border border-[#d4af37]/20 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-bold text-black">
                  {servicio.nombre}
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                  Bs {servicio.precio} · {servicio.duracion_minutos} min
                </p>

                {servicio.descripcion && (
                  <p className="mt-2 text-sm text-gray-500">
                    {servicio.descripcion}
                  </p>
                )}

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    servicio.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {servicio.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editarServicio(servicio)}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
                >
                  Editar
                </button>

                <button
                  onClick={() => cambiarEstado(servicio.id)}
                  className="rounded-xl border border-black/15 px-4 py-2 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                >
                  {servicio.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServiciosPage