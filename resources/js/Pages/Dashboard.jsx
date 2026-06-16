import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Package, AlertTriangle, TrendingUp, DollarSign, ArrowUpRight, Clock, User } from 'lucide-react'

export default function Dashboard({ stats, actividadReciente, alertasStock, movimientosSemana, topProductos }) {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
    const dateFormatted = new Date().toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const kpis = [
        { label: 'Total Productos', value: stats?.total_productos ?? 0, icon: Package, gradient: 'from-sky-500 to-indigo-600', link: '/productos', desc: 'Artículos en catálogo' },
        { label: 'Stock Bajo', value: stats?.productos_bajo_stock ?? 0, icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600', link: '/productos?estado_stock=bajo', desc: 'Requieren reposición' },
        { label: 'Mov. Hoy', value: stats?.movimientos_hoy ?? 0, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600', link: '/movimientos', desc: 'Entradas y salidas' },
        { label: 'Valor Invent.', value: `$${Number(stats?.valor_inventario ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: DollarSign, gradient: 'from-purple-500 to-pink-600', link: '/productos', desc: 'Valor total en stock' },
    ]

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">INVENTEX</span>
                    </h1>
                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{dateFormatted}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/30 border border-gray-100/60 dark:border-white/5 text-[10px] text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Actualizado</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {kpis.map((kpi) => (
                    <button key={kpi.label} onClick={() => router.get(kpi.link)} className={`kpi-card bg-gradient-to-br ${kpi.gradient} text-left w-full`}>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-medium tracking-wide uppercase opacity-80">{kpi.label}</span>
                                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                                    <kpi.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
                            <p className="text-[9px] mt-0.5 opacity-60 font-medium">{kpi.desc}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[8px] font-semibold hover:bg-white/30 transition-colors">
                                    Ver Detalles <ArrowUpRight className="w-2 h-2" />
                                </span>
                            </div>
                        </div>
                        <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute -top-5 -left-5 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Actividad Reciente */}
                <div className="lg:col-span-2 bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-sky-500" />
                            Actividad Reciente
                        </h2>
                        <Link href="/movimientos" className="text-[9px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 bg-sky-subtle dark:bg-sky-900/10 px-2.5 py-1 rounded-full">
                            Ver todo <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                    </div>
                    <div className="timeline-line space-y-0">
                        {actividadReciente?.length > 0 ? (
                            actividadReciente.slice(0, 6).map((act) => (
                                <div key={act.id} className="relative flex items-start gap-3 py-2 group">
                                    <div className={`relative z-10 mt-0.5 w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-hm-900 transition-transform group-hover:scale-110 ${
                                        act.tipo === 'entrada' ? 'bg-emerald-400' : act.tipo === 'salida' ? 'bg-red-400' : 'bg-amber-400'
                                    }`}>
                                        <div className="w-1 h-1 rounded-full bg-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 pb-1.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{act.producto_nombre || 'Producto'}</p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
                                                        act.tipo === 'entrada' ? 'bg-emerald-subtle dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-subtle dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                    }`}>
                                                        {act.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                                    </span>
                                                    <span>{act.cantidad} unid.</span>
                                                    <User className="w-2.5 h-2.5" />
                                                    <span>{act.usuario_nombre || 'Sistema'}</span>
                                                </p>
                                            </div>
                                            <span className="text-[8px] text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5 whitespace-nowrap">
                                                {act.created_at ? new Date(act.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Package className="w-5 h-5 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                <p className="text-xs text-gray-400 dark:text-gray-500">Sin actividad reciente</p>
                                <Link href="/movimientos/crear" className="inline-flex items-center gap-1 mt-2 text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                                    Registrar movimiento <ArrowUpRight className="w-2.5 h-2.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alertas de Stock */}
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            Alertas de Stock
                        </h2>
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                            (alertasStock?.length ?? 0) > 0 ? 'bg-amber-subtle dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-emerald-subtle dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        }`}>
                            {alertasStock?.length ?? 0} críticas
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        {alertasStock?.length > 0 ? (
                            alertasStock.slice(0, 5).map((alerta) => {
                                const isCritical = Number(alerta.stock_actual) === 0
                                const isWarning = Number(alerta.stock_actual) <= Number(alerta.stock_minimo) * 0.5
                                return (
                                    <button key={alerta.id} onClick={() => router.get(`/productos/${alerta.id}/editar`)}
                                        className={`w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl border transition-all hover:shadow-sm ${
                                            isCritical ? 'bg-rose-subtle dark:bg-red-900/10 border-red-200/60 dark:border-red-900/30' : isWarning ? 'bg-amber-subtle dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-900/30' : 'bg-orange-50/60 dark:bg-orange-900/10 border-orange-200/60 dark:border-orange-900/30'
                                        }`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isCritical ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'}`}>
                                            <Package className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate">{alerta.nombre}</p>
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500">Stock: <span className={`font-semibold ${isCritical ? 'text-red-500' : 'text-amber-500'}`}>{alerta.stock_actual}</span> / mín: {alerta.stock_minimo}</p>
                                        </div>
                                        <div className={`px-1.5 py-0.5 rounded-lg text-[7px] font-bold uppercase ${isCritical ? 'bg-red-200/50 dark:bg-red-900/30 text-red-700' : 'bg-amber-200/50 dark:bg-amber-900/30 text-amber-700'}`}>
                                            {isCritical ? 'Crítico' : 'Bajo'}
                                        </div>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-5 h-5 mx-auto mb-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Todo en orden</p>
                            </div>
                        )}
                    </div>

                    {alertasStock?.length > 5 && (
                        <button onClick={() => router.get('/productos?estado_stock=bajo')} className="flex items-center justify-center gap-1 mt-3 w-full py-2 rounded-full bg-hm-100 dark:bg-slate-800/30 text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium">
                            Ver todas las alertas <ArrowUpRight className="w-2.5 h-2.5" />
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
