import { useState, useEffect, useRef } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import toast from 'react-hot-toast'
import {
    LayoutDashboard, Package, Tags, Truck, ArrowLeftRight, Users,
    BarChart3, UserCircle, LogOut, Bell, Search, Menu, X,
    ChevronDown, ShieldCheck, Sun, Moon, Settings, CheckCheck,
    ArrowRight, Clock,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['administrador', 'empleado'] },
    { name: 'Productos',  href: '/productos',   icon: Package,         roles: ['administrador', 'empleado'] },
    { name: 'Categorías', href: '/categorias',  icon: Tags,           roles: ['administrador', 'empleado'] },
    { name: 'Proveedores',href: '/proveedores', icon: Truck,          roles: ['administrador', 'empleado'] },
    { name: 'Movimientos',href: '/movimientos', icon: ArrowLeftRight, roles: ['administrador', 'empleado'] },
    { name: 'Usuarios',  href: '/usuarios',    icon: Users,          roles: ['administrador'] },
    { name: 'Reportes',  href: '/reportes',    icon: BarChart3,      roles: ['administrador'] },
]

export default function AuthenticatedLayout({ children }) {
    const { auth, flash } = usePage().props
    const user = auth?.user
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifs, setNotifs] = useState([])
    const [notifCount, setNotifCount] = useState(0)
    const [searchVal, setSearchVal] = useState('')
    const notifRef = useRef(null)
    const userRef  = useRef(null)

    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', darkMode)
        localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    useEffect(() => {
        if (auth?.user?.tema) {
            const shouldBeDark = auth.user.tema === 'dark'
            setDarkMode(shouldBeDark)
            document.documentElement.classList.toggle('dark', shouldBeDark)
            localStorage.setItem('theme', auth.user.tema)
        }
    }, [auth?.user?.tema])

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { position: 'bottom-right' })
        if (flash?.error)   toast.error(flash.error,   { position: 'bottom-right' })
    }, [flash])

    useEffect(() => {
        fetch('/api/notificaciones/no-leidas', { headers: { 'Accept': 'application/json' } })
            .then(r => r.json())
            .then(d => { setNotifs(d.data ?? []); setNotifCount(d.total ?? 0) })
            .catch(() => {})
    }, [])

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
            if (userRef.current  && !userRef.current.contains(e.target))  setUserMenuOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const toggleDark = () => setDarkMode(p => !p)

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchVal.trim()) {
            router.get('/productos', { search: searchVal.trim() }, { preserveState: false })
            setSearchVal('')
        }
    }

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content

    const markAllRead = async () => {
        try {
            const res = await fetch('/api/notificaciones/leidas-todas', {
                method: 'PATCH',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf() },
            })
            if (res.ok) { setNotifs([]); setNotifCount(0) }
        } catch {}
    }

    const deleteNotif = async (id) => {
        try {
            const res = await fetch(`/api/notificaciones/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf() },
            })
            if (res.ok) {
                setNotifs(p => p.filter(n => n.id !== id))
                setNotifCount(p => Math.max(0, p - 1))
            }
        } catch {}
    }

    const markRead = async (id) => {
        try {
            const res = await fetch(`/api/notificaciones/${id}/leida`, {
                method: 'PATCH',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf() },
            })
            if (res.ok) {
                setNotifs(p => p.filter(n => n.id !== id))
                setNotifCount(p => Math.max(0, p - 1))
            }
        } catch {}
    }

    const currentPath = window.location.pathname

    function NavItem({ item }) {
        if (item.roles && !item.roles.includes(user?.rol)) return null
        const isActive = currentPath === item.href ||
            (item.href !== '/dashboard' && currentPath.startsWith(item.href))
        return (
            <Link
                href={item.href}
                className={`nav-pill flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                        ? 'nav-pill-active text-sky-700 dark:text-sky-300'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                <item.icon className={`w-4.5 h-4.5 ${
                    isActive ? 'text-sky-500 dark:text-sky-400' : 'text-gray-400 dark:text-gray-500'
                } transition-colors`} />
                <span className="text-[13px]">{item.name}</span>
                {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
                )}
            </Link>
        )
    }

    const userName   = user?.nombre_completo || 'Usuario'
    const userInitial = userName.charAt(0).toUpperCase()
    const userEmail  = user?.email || ''
    const userRol    = user?.rol || ''

    return (
        <div className="h-screen flex bg-hm-50 dark:bg-hm-950 overflow-hidden">

            {/* ── OVERLAY MÓVIL ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── SIDEBAR: SIEMPRE fixed, NUNCA static ── */}
            {/*
                Solución al Bug 3.3 (Colapso del Layout):
                - 'fixed' permanente evita el salto de posicionamiento entre static/fixed.
                - En lg+ siempre visible (translate-x-0).
                - En móvil se oculta con -translate-x-full y se muestra vía sidebarOpen.
                - z-40 para que quede debajo del header sticky (z-30 queda debajo).
            */}
            <aside className={`
                fixed top-0 left-0 z-40 h-full w-60 p-4 glass-sidebar
                flex flex-col
                transform transition-all duration-300 ease-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
            `}>
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-premium transition-transform group-hover:scale-105">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">INVENTEX</h2>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">ERP Inventario</p>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
                    {navigation.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </nav>

                <div className="flex-shrink-0 mt-auto pt-3 space-y-1.5">
                    <Link href="/configuracion" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5 transition-all">
                        <Settings className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
                        <span className="text-[13px]">Configuración</span>
                    </Link>
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-100/60 dark:border-white/5">
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-hm-950 animate-pulse-soft" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate">Sistema</p>
                                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">100% operativo</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-medium">Servicios activos</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN AREA: margen izquierdo compensatorio en desktop ── */}
            {/*
                lg:ml-60 compensa el ancho del sidebar fixed (w-60 = 15rem = 240px).
                En móvil (menor a lg) el margen es 0 porque el sidebar está oculto.
                El header sticky funciona correctamente porque su contenedor padre
                tiene overflow-y-auto y position relative.
            */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
                <header className="sticky top-0 z-30 glass border-b border-gray-100/60 dark:border-white/5 flex-shrink-0">
                    <div className="flex items-center justify-between px-5 h-14">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                                <Menu className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
                            </button>
                            <div className="hidden md:flex relative flex-1 max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchVal}
                                    onChange={e => setSearchVal(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder="Buscar..."
                                    className="w-full pl-9 pr-3 py-1.5 rounded-full bg-hm-100/60 dark:bg-slate-800/40 border border-transparent focus:border-sky-400/30 focus:ring-2 focus:ring-sky-400/20 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button onClick={toggleDark} className="p-2 rounded-full hover:bg-hm-100/50 dark:hover:bg-white/5 transition-colors" title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
                                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-500" />}
                            </button>

                            <div className="relative" ref={notifRef}>
                                <button onClick={() => setNotifOpen(p => !p)} className="relative p-2 rounded-full hover:bg-hm-100/50 dark:hover:bg-white/5 transition-colors">
                                    <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    {notifCount > 0 && (
                                        <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-[8px] font-bold ring-2 ring-white dark:ring-hm-950 animate-scale-in">
                                            {notifCount > 9 ? '9+' : notifCount}
                                        </span>
                                    )}
                                </button>
                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-hm-900 rounded-2xl shadow-hm-lg dark:shadow-premium-dark border border-gray-100 dark:border-white/5 p-1.5 z-50 animate-scale-in">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 dark:border-white/5 mb-1">
                                            <h3 className="text-[11px] font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                                            {notifCount > 0 && (
                                                <button onClick={markAllRead} className="flex items-center gap-1 text-[9px] text-sky-600 dark:text-sky-400 font-medium">
                                                    <CheckCheck className="w-3 h-3" /> Marcar todas
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-72 overflow-y-auto space-y-0.5">
                                            {notifs.length > 0 ? (
                                                notifs.slice(0, 8).map(n => (
                                                    <div key={n.id} className="group relative flex items-start gap-3 p-2.5 rounded-xl hover:bg-hm-50 dark:hover:bg-white/[0.03] transition-colors">
                                                        <button onClick={() => markRead(n.id)} className="flex items-start gap-3 flex-1 min-w-0 text-left">
                                                            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.tipo === 'stock_bajo' || n.tipo === 'stock_critico' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate">{n.titulo}</p>
                                                                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                                                                <p className="text-[8px] text-gray-400 dark:text-gray-600 mt-1 flex items-center gap-1">
                                                                    <Clock className="w-2 h-2" />
                                                                    {n.created_at ? new Date(n.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                                                                </p>
                                                            </div>
                                                        </button>
                                                        <button onClick={() => deleteNotif(n.id)} className="absolute top-1.5 right-1.5 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all" title="Eliminar notificación">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center">
                                                    <Bell className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Sin notificaciones</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={userRef}>
                                <button onClick={() => setUserMenuOpen(p => !p)} className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-hm-100/50 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                        {userInitial}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300 leading-tight truncate max-w-[80px]">{userName}</p>
                                    </div>
                                    <ChevronDown className={`w-3 h-3 text-gray-400 hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-hm-900 rounded-2xl shadow-hm-lg dark:shadow-premium-dark border border-gray-100 dark:border-white/5 p-1.5 z-50 animate-scale-in">
                                        <div className="px-3 py-2 border-b border-gray-50 dark:border-white/5 mb-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
                                            <p className="text-[9px] text-gray-500 dark:text-gray-300 truncate">{userEmail}</p>
                                        </div>
                                        <Link href="/perfil" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:bg-hm-50 dark:hover:bg-white/[0.03] transition-colors" onClick={() => setUserMenuOpen(false)}>
                                            <UserCircle className="w-3.5 h-3.5" /> Mi Perfil
                                        </Link>
                                        <Link href="/configuracion" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:bg-hm-50 dark:hover:bg-white/[0.03] transition-colors" onClick={() => setUserMenuOpen(false)}>
                                            <Settings className="w-3.5 h-3.5" /> Configuración
                                        </Link>
                                        <div className="border-t border-gray-50 dark:border-white/5 mt-1 pt-1">
                                            <form method="POST" action="/logout" onSubmit={(e) => {
                                                e.preventDefault()
                                                fetch('/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content } })
                                                    .then(() => window.location.href = '/login')
                                            }}>
                                                <button type="submit" className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                                    <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-5 page-enter">
                    {children}
                </main>
            </div>
        </div>
    )
}
