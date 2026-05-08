import { createClient } from '@supabase/supabase-js'

const getEnv = (name) => {
		try {
			if (import.meta && import.meta.env && import.meta.env[name]) {
				return import.meta.env[name]
			}
		} catch (e) {
			// import.meta may not be available in some runtimes; ignore
		}

		if (typeof process !== 'undefined' && process.env && process.env[name]) {
			return process.env[name]
		}

		return undefined
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL')
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY')

const devBypass = (getEnv('VITE_DEV_ADMIN_BYPASS') || getEnv('DEV_ADMIN_BYPASS')) === 'true'
const devAdminEmail = (getEnv('VITE_DEV_ADMIN_EMAIL') || getEnv('DEV_ADMIN_EMAIL') || 'admin@pielmorena').toLowerCase()
	
	if (supabaseUrl && supabaseAnonKey) {
		// mask anon key for logs
		const masked = supabaseAnonKey.length > 8 ? `${supabaseAnonKey.slice(0, 4)}...${supabaseAnonKey.slice(-4)}` : '***'
		// eslint-disable-next-line no-console
		console.info('Supabase config found:', { supabaseUrl, supabaseAnonKey: masked })
	} else {
		// eslint-disable-next-line no-console
		console.warn('Supabase env vars not found or empty:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
	}

let supabase

const makeStub = () => {
	return {
		auth: {
			signInWithPassword: async ({ email }) => {
				if (devBypass && email && email.trim().toLowerCase() === devAdminEmail) {
					return { data: { user: { email: email.trim().toLowerCase() } }, error: null }
				}
				return { data: null, error: new Error('Supabase not configured') }
			},
			signOut: async () => ({ error: new Error('Supabase not configured') }),
			onAuthStateChange: () => ({ data: null }),
		},
		from: () => ({
			select: async () => ({ data: [], error: null }),
			insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
			update: async () => ({ data: null, error: new Error('Supabase not configured') }),
			delete: async () => ({ data: null, error: new Error('Supabase not configured') }),
		}),
		rpc: async () => ({ data: false, error: new Error('Supabase not configured') }),
	}
}

// If dev bypass is enabled, prefer the stub to avoid network calls and allow local admin login
if (devBypass) {
	// eslint-disable-next-line no-console
	console.info('Dev bypass enabled — using local auth stub')
	supabase = makeStub()
} else if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
	console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — Supabase disabled.')
	supabase = makeStub()
}

const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export { supabase, supabaseConfigured }