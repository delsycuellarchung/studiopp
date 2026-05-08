import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabaseClient'

function LoginPage() {
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [intentoLogin, setIntentoLogin] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  const devBypass = import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true'
  const devAdminEmail = (import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@pielmorena').toLowerCase()

  const validarCorreo = (valor) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
  }

  const passwordRules = {
    minimo: password.length >= 3,
  }

  const passwordClienteFuerte = passwordRules.minimo

  const correoInvalido =
    intentoLogin &&
    (!correo.trim() || (!validarCorreo(correo) && !(devBypass && correo.trim().toLowerCase() === devAdminEmail)))

  const passwordInvalido = intentoLogin && !password.trim()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIntentoLogin(true)
    setErrorGeneral('')

    if (!correo.trim()) {
      setErrorGeneral('Debe ingresar su correo electrónico.')
      return
    }

    // Permitir el correo de bypass de desarrollo aunque no sea un email "válido"
    if (!validarCorreo(correo) && !(devBypass && correo.trim().toLowerCase() === devAdminEmail)) {
      setErrorGeneral('Debe ingresar un correo electrónico válido.')
      return
    }

    if (!password.trim()) {
      setErrorGeneral('Debe ingresar su contraseña.')
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo.trim().toLowerCase(),
      password,
    })

    if (error) {
      // Si está habilitado el bypass de admin en desarrollo, permitir acceso localmente
      const devBypass = import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true'
      const devAdminEmail = (import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@pielmorena').toLowerCase()
      if (devBypass && correo.trim().toLowerCase() === devAdminEmail) {
        // eslint-disable-next-line no-console
        console.warn('Dev admin bypass enabled — permitting local admin login')
        navigate('/dashboard')
        return
      }

      setErrorGeneral(error.message || 'Error al iniciar sesión')
      return
    }

    // Verificar si es admin mediante la función RPC es_admin()
    try {
      const { data: isAdmin, error: rpcError } = await supabase.rpc('es_admin')
      if (rpcError) {
        navigate('/dashboard')
        return
      }

      const adminFlag = Array.isArray(isAdmin) ? isAdmin[0] : isAdmin
      if (adminFlag) navigate('/dashboard')
      else navigate('/reservar')
    } catch (err) {
      navigate('/dashboard')
    }
  }

  const inputBase =
    'w-full rounded-2xl border bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:bg-white/15'

  const inputNormal = 'border-white/10 focus:border-[#d4af37]'

  const inputError = 'border-red-400 focus:border-red-400 bg-red-500/10'

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-studio.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.25),transparent_35%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <h1 className="leading-none tracking-tight">
              <span className="font-brand block text-5xl font-bold text-white sm:text-6xl lg:text-8xl">
                Piel Morena
              </span>

              <span className="font-modern mt-3 block text-4xl font-extrabold uppercase tracking-[0.18em] text-[#d4af37] sm:text-5xl lg:text-7xl">
                Studio
              </span>
            </h1>
          </div>

          <div className="mx-auto w-full max-w-md lg:ml-auto">
            {import.meta.env.DEV && !supabaseConfigured && (
              <div className="mb-4 rounded-md bg-red-600/10 border border-red-500/30 px-3 py-2 text-sm text-red-200">
                Supabase no configurado en el cliente (import.meta.env no tiene las vars).
              </div>
            )}
            <form
              onSubmit={handleLogin}
              className="rounded-[2rem] border border-[#d4af37]/35 bg-black/45 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
            >
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4af37]/70 bg-white/10 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-9 w-9 text-[#d4af37]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3.75c-3.866 0-7 3.134-7 7v2.5c0 3.866 3.134 7 7 7s7-3.134 7-7v-2.5c0-3.866-3.134-7-7-7Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.75 11.5h6.5M9.5 15h5"
                    />
                  </svg>
                </div>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  Bienvenida
                </h2>

                <p className="mt-2 text-sm text-white/55">
                  Ingresa tus credenciales para acceder al sistema.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-left text-sm font-medium text-white/80">
                    Correo electrónico
                  </label>

                  <input
                    type="text"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={`${inputBase} ${
                      correoInvalido ? inputError : inputNormal
                    }`}
                  />

                  {correoInvalido && (
                    <p className="mt-2 text-xs text-red-300">
                      Ingrese un correo electrónico válido.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-left text-sm font-medium text-white/80">
                    Contraseña
                  </label>

                  <div className="relative">
                    <input
                      type={mostrarPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su contraseña"
                      className={`${inputBase} pr-12 ${
                        passwordInvalido ? inputError : inputNormal
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 transition hover:text-[#d4af37]"
                      aria-label={
                        mostrarPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      {mostrarPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.88 4.24A9.77 9.77 0 0112 4c5.5 0 9 5 9 8a7.18 7.18 0 01-1.67 3.94"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.11 6.11C4.17 7.47 3 9.68 3 12c0 3 3.5 8 9 8a9.77 9.77 0 004.01-.85"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12s3.5-7 9.75-7 9.75 7 9.75 7-3.5 7-9.75 7-9.75-7-9.75-7Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15a3 3 0 100-6 3 3 0 000 6Z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="mb-2 text-xs font-semibold text-white/65">
                        Requisitos de contraseña:
                      </p>

                      <div className="grid gap-1 text-xs">
                        <p
                          className={
                            passwordRules.minimo ? 'text-[#d4af37]' : 'text-red-300'
                          }
                        >
                          {passwordRules.minimo ? '✓' : '•'} Mínimo 3 caracteres
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {errorGeneral && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorGeneral}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#d4af37] px-6 py-3.5 font-bold text-black shadow-lg shadow-[#d4af37]/20 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Ingresar al sistema
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage