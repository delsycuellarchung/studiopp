import { useState } from 'react'

function ClientesPage() {
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre_completo: 'María Fernanda Rojas',
      telefono: '70000000',
      correo: 'maria@email.com',
      activo: true,
      notas: 'Prefiere tonos nude y atención por la tarde.',
    },
    {
      id: 2,
      nombre_completo: 'Camila Vargas',
      telefono: '75555555',
      correo: '',
      activo: true,
      notas: 'Cliente frecuente para uñas acrílicas.',
    },
  ])

  const [form, setForm] = useState({
    nombre_completo: '',
    telefono: '',
    correo: '',
    notas: '',
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
      nombre_completo: '',
      telefono: '',
      correo: '',
      notas: '',
      activo: true,
    })
    setEditandoId(null)
  }

  const guardarCliente = (e) => {
    e.preventDefault()

    if (!form.nombre_completo.trim()) return

    if (editandoId) {
      setClientes(
        clientes.map((cliente) =>
          cliente.id === editandoId ? { ...cliente, ...form } : cliente
        )
      )
    } else {
      setClientes([
        {
          id: Date.now(),
          ...form,
        },
        ...clientes,
      ])
    }

    limpiarFormulario()
  }

  const editarCliente = (cliente) => {
    setEditandoId(cliente.id)
    setForm({
      nombre_completo: cliente.nombre_completo,
      telefono: cliente.telefono,
      correo: cliente.correo,
      notas: cliente.notas,
      activo: cliente.activo,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cambiarEstado = (id) => {
    setClientes(
      clientes.map((cliente) =>
        cliente.id === id ? { ...cliente, activo: !cliente.activo } : cliente
      )
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[#d4af37]/30 bg-black p-5 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d4af37]">
          Gestión
        </p>

        <h2 className="font-brand mt-2 text-3xl font-bold">
          Clientes
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/65">
          Registra y administra la información de las clientas del estudio.
        </p>
      </div>

      <form
        onSubmit={guardarCliente}
        className="rounded-[2rem] border border-[#d4af37]/25 bg-white p-5 shadow-sm"
      >
        <h3 className="text-lg font-bold text-black">
          {editandoId ? 'Editar cliente' : 'Nuevo cliente'}
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            name="nombre_completo"
            value={form.nombre_completo}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37]"
          />

          <input
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 outline-none focus:border-[#d4af37] md:col-span-2"
          />

          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Notas, preferencias o alergias"
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
          Cliente activo
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-black px-5 py-3 font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black">
            {editandoId ? 'Actualizar cliente' : 'Registrar cliente'}
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
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="rounded-[2rem] border border-[#d4af37]/20 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-bold text-black">
                  {cliente.nombre_completo}
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                  {cliente.telefono || 'Sin teléfono'} · {cliente.correo || 'Sin correo'}
                </p>

                {cliente.notas && (
                  <p className="mt-2 text-sm text-gray-500">
                    {cliente.notas}
                  </p>
                )}

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    cliente.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {cliente.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editarCliente(cliente)}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
                >
                  Editar
                </button>

                <button
                  onClick={() => cambiarEstado(cliente.id)}
                  className="rounded-xl border border-black/15 px-4 py-2 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                >
                  {cliente.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ClientesPage