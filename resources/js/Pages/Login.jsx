import { useState, useEffect } from 'react'
import { useForm, Head } from '@inertiajs/react'
import { LayoutDashboard, ShieldCheck, ArrowRight, Lock, Mail, Sun, Moon, Eye, EyeOff } from 'lucide-react'

export default function Login() {
    // 1. Manejo del Tema Claro/Oscuro seguro
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light'
        }
        return 'light'
    })

    // 2. Control visual para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false)

    // 3. FORMULARIO BLINDADO: Cargamos los datos de "Recordar" de forma segura usando funciones flecha
    const { data, setData, post, processing, errors, reset } = useForm({ 
        email: () => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('remembered_email') || ''
            }
            return ''
        }, 
        password: () => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('remembered_password') || ''
            }
            return ''
        }, 
        remember: () => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('remember_me_checked') === 'true'
            }
            return false
        }
    })

    // Guardar el tema cuando cambie
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme)
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const submit = (e) => { 
        e.preventDefault()

        // ACCIÓN LOCAL SEGURA
        if (typeof window !== 'undefined') {
            if (data.remember) {
                localStorage.setItem('remembered_email', data.email)
                localStorage.setItem('remembered_password', data.password)
                localStorage.setItem('remember_me_checked', 'true')
            } else {
                localStorage.removeItem('remembered_email')
                localStorage.removeItem('remembered_password')
                localStorage.removeItem('remember_me_checked')
            }
        }

        post('/login', { 
            onSuccess: () => reset('password') 
        }) 
    }

    return (
        <div className={`fixed inset-0 min-h-screen w-full flex flex-col justify-center items-center p-4 font-sans transition-colors duration-500 z-50 overflow-hidden
            ${theme === 'dark' ? 'bg-[#0b0f19] text-slate-200' : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 text-slate-700'}`}
        >
            <Head title="Iniciar Sesión - INVENTEX" />
            
            {/* GRADIENTES AMBIENTALES */}
            <div className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500
                ${theme === 'dark' ? 'bg-sky-500/10 opacity-100' : 'bg-sky-400/20 opacity-70'}`}></div>
            <div className={`absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500
                ${theme === 'dark' ? 'bg-indigo-600/15 opacity-100' : 'bg-purple-400/20 opacity-60'}`}></div>

            {/* CONTENEDOR CENTRAL */}
            <div className={`w-full max-w-[440px] rounded-3xl border backdrop-blur-xl p-8 relative z-10 transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]
                ${theme === 'dark' 
                    ? 'bg-slate-900/40 border-white/[0.06] hover:border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' 
                    : 'bg-white/70 border-slate-200/80 hover:border-indigo-200/80'}`}
            >
                
                {/* BOTÓN CONMUTADOR DE TEMA */}
                <button 
                    type="button"
                    onClick={toggleTheme}
                    className={`absolute top-6 right-6 p-2.5 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center
                        ${theme === 'dark' 
                            ? 'bg-slate-950/40 border-white/[0.08] text-amber-400 hover:bg-slate-900/80 hover:border-amber-400/50' 
                            : 'bg-slate-50 border-slate-200 text-indigo-600 hover:bg-white hover:border-indigo-400 hover:shadow-sm'}`}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* ENCABEZADO */}
                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-black tracking-wider transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            INVENTEX
                        </h1>
                        <p className="text-[10px] text-sky-500 dark:text-sky-400 font-bold uppercase tracking-widest mt-0.5">Asset Intelligence System</p>
                    </div>
                    <p className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Introduce tus credenciales para acceder al sistema
                    </p>
                </div>

                {/* MENSAJE DE ERROR */}
                {errors.error && (
                    <div className={`mb-5 p-3 rounded-xl border text-xs text-center font-medium
                        ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        {errors.error}
                    </div>
                )}

                {/* FORMULARIO */}
                <form onSubmit={submit} className="space-y-5">
                    
                    {/* CORREO */}
                    <div className="space-y-1.5">
                        <label className={`block text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Correo electrónico
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                            <input 
                                type="email" 
                                name="email"
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition-all outline-none
                                    ${theme === 'dark' 
                                        ? 'border-white/[0.08] bg-slate-950/40 text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400' 
                                        : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white'}`}
                                placeholder="admin@inventex.com" 
                                required
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
                    </div>

                    {/* CONTRASEÑA */}
                    <div className="space-y-1.5">
                        <label className={`block text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors z-10" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password} 
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full pl-11 pr-10 py-3 rounded-xl border text-sm transition-all outline-none
                                    ${theme === 'dark' 
                                        ? 'border-white/[0.08] bg-slate-950/40 text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400' 
                                        : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white'}`}
                                placeholder="••••••••" 
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>}
                    </div>

                    {/* CHECKBOX RECORDAR */}
                    <div className="flex items-center pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                            <input 
                                type="checkbox" 
                                name="remember"
                                checked={data.remember} 
                                onChange={(e) => setData('remember', e.target.checked)}
                                className={`rounded w-4 h-4 transition-colors cursor-pointer
                                    ${theme === 'dark' 
                                        ? 'border-white/[0.1] bg-slate-950 text-sky-500 focus:ring-sky-500/30' 
                                        : 'border-slate-300 bg-slate-50 text-indigo-600 focus:ring-indigo-500/30'}`} 
                            />
                            <span className={`text-xs transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-200
                                ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                Mantener sesión iniciada
                            </span>
                        </label>
                    </div>

                    {/* BOTÓN INGRESAR */}
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 focus:ring-2 focus:ring-sky-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                Autenticando...
                            </span>
                        ) : (
                            <>
                                <span>Ingresar al panel</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* BANNER INFORMATIVO */}
                    <div className={`p-3 rounded-xl border flex items-start gap-2.5 backdrop-blur-sm
                        ${theme === 'dark' ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-indigo-50/40 border-indigo-100/70'}`}>
                        <ShieldCheck className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                        <p className={`text-[11px] leading-normal ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Entorno seguro. Monitoreo y auditoría de activos corporativos en tiempo real.
                        </p>
                    </div>

                    {/* ACCESOS DEMO */}
                    <div className={`pt-4 border-t grid grid-cols-2 gap-2 text-[10px]
                        ${theme === 'dark' ? 'border-white/[0.05]' : 'border-slate-100'}`}>
                        <button 
                            type="button"
                            onClick={() => { setData(d => ({ ...d, email: 'admin@inventex.com', password: 'Admin123!' })) }}
                            className={`p-2 rounded-lg border text-left cursor-pointer transition-transform active:scale-95 ${theme === 'dark' ? 'bg-slate-950/40 border-white/[0.03]' : 'bg-slate-50 border-slate-200/60'}`}
                        >
                            <span className="block font-bold text-sky-500 dark:text-sky-400 uppercase text-[8px] tracking-wider mb-0.5">Admin</span>
                            <span className={`block truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>admin@inventex.com</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setData(d => ({ ...d, email: 'maria@inventex.com', password: 'Empleado123!' })) }}
                            className={`p-2 rounded-lg border text-left cursor-pointer transition-transform active:scale-95 ${theme === 'dark' ? 'bg-slate-950/40 border-white/[0.03]' : 'bg-slate-50 border-slate-200/60'}`}
                        >
                            <span className="block font-bold text-purple-500 dark:text-purple-400 uppercase text-[8px] tracking-wider mb-0.5">Empleado</span>
                            <span className={`block truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>maria@inventex.com</span>
                        </button>
                    </div>

                </form>
            </div>

            {/* FOOTER */}
            <p className={`text-[10px] mt-8 relative z-10 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                © 2026 INVENTEX. Todos los derechos reservados.
            </p>
        </div>
    )
}