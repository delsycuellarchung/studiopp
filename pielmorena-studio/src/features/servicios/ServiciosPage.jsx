import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from '../../lib/supabaseClient'

function ServiciosPage() {
  const [servicios, setServicios] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    activo: true,
    horarios: [],
    _horario_inicio: '',
    _horario_fin: '',
    imageFile: null,
    imageUrl: '',
  })

  useEffect(() => {
    fetchServicios()
  }, [])

  async function fetchServicios() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching servicios:', error)
        return
      }

      setServicios(data || [])
    } catch (err) {
      console.error('Unexpected error fetching servicios:', err)
    } finally {
      setLoading(false)
    }
  }

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
      activo: true,
      horarios: [],
      _horario_inicio: '',
      _horario_fin: '',
      imageFile: null,
      imageUrl: '',
    })

    setEditandoId(null)
  }

  const agregarHorario = () => {
    const inicio = form._horario_inicio
    const fin = form._horario_fin

    if (!inicio || !fin) return

    const slot = `${inicio}-${fin}`

    if ((form.horarios || []).includes(slot)) return

    setForm({
      ...form,
      horarios: [...(form.horarios || []), slot],
      _horario_inicio: '',
      _horario_fin: '',
    })
  }

  const quitarHorario = (index) => {
    setForm({
      ...form,
      horarios: form.horarios.filter((_, i) => i !== index),
    })
  }

  const guardarServicio = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim()) {
      alert('Debes ingresar el nombre del servicio.')
      return
    }

    if (!form.precio || Number(form.precio) < 0) {
      alert('Debes ingresar un precio válido.')
      return
    }

    try {
      setGuardando(true)

      const servicioData = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        activo: !!form.activo,
        horarios: Array.isArray(form.horarios) ? form.horarios : [],
      }

      if (form.imageFile) {
        if (supabaseConfigured && supabase.storage) {
          try {
            const bucket = 'servicios'
            const filePath = `images/${Date.now()}_${form.imageFile.name}`

            const { error: uploadError } = await supabase.storage
              .from(bucket)
              .upload(filePath, form.imageFile)

            if (uploadError) {
              console.error('Error uploading image to storage:', uploadError)
            } else {
              const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
              servicioData.image_url = data?.publicUrl || ''
            }
          } catch (err) {
            console.error('Unexpected storage error:', err)
          }
        } else {
          console.warn('Supabase storage not configured — image not uploaded')
        }
      }

      if (editandoId) {
        const { error } = await supabase
          .from('servicios')
          .update(servicioData)
          .eq('id', editandoId)

        if (error) {
          console.error('Error updating servicio:', error)
          return
        }
      } else {
        const { error } = await supabase.from('servicios').insert([servicioData])

        if (error) {
          console.error('Error inserting servicio:', error)
          return
        }
      }

      await fetchServicios()
      limpiarFormulario()
    } catch (err) {
      console.error('Unexpected error saving servicio:', err)
    } finally {
      setGuardando(false)
    }
  }

  const editarServicio = (servicio) => {
    setEditandoId(servicio.id)

    setForm({
      nombre: servicio.nombre || '',
      descripcion: servicio.descripcion || '',
      precio: servicio.precio || '',
      activo: servicio.activo ?? true,
      horarios: servicio.horarios || [],
      _horario_inicio: '',
      _horario_fin: '',
      imageFile: null,
      imageUrl: servicio.image_url || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cambiarEstado = async (id) => {
    try {
      const servicio = servicios.find((s) => s.id === id)
      if (!servicio) return

      const { error } = await supabase
        .from('servicios')
        .update({ activo: !servicio.activo })
        .eq('id', id)

      if (error) {
        console.error('Error toggling activo:', error)
        return
      }

      await fetchServicios()
    } catch (err) {
      console.error('Unexpected error toggling activo:', err)
    }
  }

  const eliminarServicio = async (id) => {
    const confirmar = confirm('¿Eliminar servicio? Esta acción no se puede deshacer.')
    if (!confirmar) return

    try {
      const { error } = await supabase.from('servicios').delete().eq('id', id)

      if (error) {
        console.error('Error deleting servicio:', error)
        return
      }

      await fetchServicios()
    } catch (err) {
      console.error('Unexpected error deleting servicio:', err)
    }
  }

  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((servicio) => {
      const texto = `${servicio.nombre || ''} ${servicio.descripcion || ''}`
        .toLowerCase()

      const coincideBusqueda = texto.includes(busqueda.toLowerCase())

      let coincideEstado = true

      if (filtroEstado === 'activos') {
        coincideEstado = servicio.activo === true
      }

      if (filtroEstado === 'inactivos') {
        coincideEstado = servicio.activo === false
      }

      return coincideBusqueda && coincideEstado
    })
  }, [servicios, busqueda, filtroEstado])

  const resumen = useMemo(() => {
    return {
      total: servicios.length,
      activos: servicios.filter((s) => s.activo).length,
      inactivos: servicios.filter((s) => !s.activo).length,
    }
  }, [servicios])

  return (
    <section className="min-h-screen space-y-6 pb-40">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/30 bg-black p-6 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#d4af37]">
            Catálogo
          </p>

          <h2 className="font-brand mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Servicios
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            Administra servicios, precios, horarios, imágenes y disponibilidad para Piel Morena Studio.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.7rem] border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
            Total
          </p>
          <h3 className="mt-2 text-3xl font-black text-black">{resumen.total}</h3>
          <p className="mt-1 text-sm text-gray-500">Servicios registrados</p>
        </div>

        <div className="rounded-[1.7rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Activos
          </p>
          <h3 className="mt-2 text-3xl font-black text-emerald-700">{resumen.activos}</h3>
          <p className="mt-1 text-sm text-emerald-700/70">Disponibles para reservar</p>
        </div>

        <div className="rounded-[1.7rem] border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
            Inactivos
          </p>
          <h3 className="mt-2 text-3xl font-black text-red-700">{resumen.inactivos}</h3>
          <p className="mt-1 text-sm text-red-700/70">Ocultos o pausados</p>
        </div>
      </div>

      <form
        onSubmit={guardarServicio}
        className="overflow-hidden rounded-[2rem] border border-[#d4af37]/25 bg-white shadow-sm"
      >
        <div className="border-b border-black/5 bg-[#fbfaf6] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b8952d]">
                {editandoId ? 'Modo edición' : 'Nuevo registro'}
              </p>

              <h3 className="mt-2 text-2xl font-black text-black">
                {editandoId ? 'Editar servicio' : 'Crear nuevo servicio'}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Completa los datos principales del servicio.
              </p>
            </div>

            {editandoId && (
              <span className="inline-flex w-fit rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-wide text-[#d4af37]">
                Editando
              </span>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-black">
                Nombre del servicio
              </label>

              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Uñas acrílicas"
                className="w-full rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">
                Precio
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">
                  Bs
                </span>

                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 pl-11 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] focus:bg-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">
                Horarios disponibles
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="time"
                  name="_horario_inicio"
                  value={form._horario_inicio}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] focus:bg-white"
                />

                <input
                  type="time"
                  name="_horario_fin"
                  value={form._horario_fin}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] focus:bg-white"
                />

                <button
                  type="button"
                  onClick={agregarHorario}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d4af37] px-5 py-3 text-sm font-black text-black shadow-lg shadow-[#d4af37]/20 transition hover:-translate-y-0.5 hover:bg-black hover:text-[#d4af37] active:scale-95"
                >
                  <PlusIcon />
                  Añadir
                </button>
              </div>

              {(form.horarios || []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.horarios.map((h, idx) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#fbfaf6] px-4 py-2 text-xs font-black text-black"
                    >
                      {h}

                      <button
                        type="button"
                        onClick={() => quitarHorario(idx)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">
                Imagen del servicio
              </label>

              <div className="rounded-2xl border border-dashed border-[#d4af37]/40 bg-[#f7f3ea] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black sm:w-fit">
                    <ImageIcon />
                    Seleccionar imagen

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null

                        if (file) {
                          const url = URL.createObjectURL(file)

                          setForm({
                            ...form,
                            imageFile: file,
                            imageUrl: url,
                          })
                        } else {
                          setForm({
                            ...form,
                            imageFile: null,
                            imageUrl: '',
                          })
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    {form.imageUrl ? (
                      <>
                        <img
                          src={form.imageUrl}
                          alt="Preview"
                          className="h-16 w-16 rounded-2xl border border-black/10 object-cover"
                        />

                        <div>
                          <p className="text-sm font-black text-black">
                            Imagen seleccionada
                          </p>
                          <p className="text-xs text-gray-500">
                            Se guardará al registrar el servicio.
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Puedes subir una imagen opcional para mostrar el servicio.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">
                Descripción
              </label>

              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe brevemente el servicio..."
                rows="4"
                className="w-full resize-none rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] focus:bg-white"
              />
            </div>
          </div>

          <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 py-3 text-sm font-black text-black">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="h-5 w-5 accent-[#d4af37]"
            />
            Servicio activo
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-black text-[#d4af37] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#d4af37] hover:text-black hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SaveIcon />
              {guardando
                ? 'Guardando...'
                : editandoId
                  ? 'Actualizar servicio'
                  : 'Registrar servicio'}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-black hover:text-white active:scale-95"
              >
                <CloseIcon />
                Cancelar edición
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="rounded-[2rem] border border-[#d4af37]/20 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-black">Servicios registrados</h3>
            <p className="mt-1 text-sm text-gray-500">
              Busca, edita, activa, desactiva o elimina servicios.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar servicio..."
              className="w-full rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-semibold text-black outline-none transition focus:border-[#d4af37] sm:w-64"
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-2xl border border-black/10 bg-[#f7f3ea] px-4 py-3 text-sm font-black text-black outline-none transition focus:border-[#d4af37]"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {loading && (
            <div className="rounded-[1.5rem] border border-black/5 bg-[#f7f3ea] p-8 text-center">
              <p className="font-black text-black">Cargando servicios...</p>
              <p className="mt-1 text-sm text-gray-500">Espera un momento.</p>
            </div>
          )}

          {!loading && serviciosFiltrados.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-[#d4af37]/50 bg-[#f7f3ea] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#d4af37]">
                <HeartIcon />
              </div>

              <h4 className="mt-4 text-lg font-black text-black">
                No hay servicios para mostrar
              </h4>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Cambia el filtro o registra un nuevo servicio.
              </p>
            </div>
          )}

          {!loading &&
            serviciosFiltrados.map((servicio) => (
              <article
                key={servicio.id}
                className="group overflow-hidden rounded-[1.7rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:shadow-xl"
              >
                <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
                  <div className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#f7f3ea]">
                        {servicio.image_url ? (
                          <img
                            src={servicio.image_url}
                            alt={servicio.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-black text-[#d4af37]">
                            <HeartIcon />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xl font-black text-black">
                            {servicio.nombre}
                          </h4>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ring-1 ${
                              servicio.activo
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                : 'bg-red-50 text-red-700 ring-red-200'
                            }`}
                          >
                            {servicio.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>

                        <p className="mt-1 text-lg font-black text-[#b8952d]">
                          Bs {servicio.precio}
                        </p>

                        {servicio.descripcion && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            {servicio.descripcion}
                          </p>
                        )}

                        {servicio.horarios && servicio.horarios.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {servicio.horarios.map((h) => (
                              <span
                                key={h}
                                className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ea] px-3 py-1 text-xs font-black text-black"
                              >
                                <ClockIcon />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 bg-[#fbfaf6] p-5 lg:flex lg:min-w-72 lg:flex-col lg:justify-center lg:border-l lg:border-t-0">
                    <div className="grid gap-2">
                      <button
                        type="button"
                        onClick={() => editarServicio(servicio)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-[#d4af37] shadow-lg shadow-black/10 transition hover:bg-[#d4af37] hover:text-black active:scale-95"
                      >
                        <EditIcon />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => cambiarEstado(servicio.id)}
                        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition active:scale-95 ${
                          servicio.activo
                            ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white'
                            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {servicio.activo ? <PauseIcon /> : <CheckIcon />}
                        {servicio.activo ? 'Desactivar' : 'Activar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarServicio(servicio.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white active:scale-95"
                      >
                        <TrashIcon />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}
export default ServiciosPage