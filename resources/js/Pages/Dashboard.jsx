import { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Package, AlertTriangle, TrendingUp, DollarSign, ArrowUpRight, Clock, User } from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend,
} from 'recharts'

const chartColors = {
    primary: '#0ea5e9',
    primaryDark: '#38bdf8',
    secondary: '#6366f1',
    secondaryDark: '#818cf8',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    grid: '#e5e7eb',
    gridDark: '#374151',
    text: '#6b7280',
    textDark: '#9ca3af',
    axis: '#d1d5db',
    axisDark: '#4b5563',
}

const categoricalColors = [
    '#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
]

function formatCurrency(value) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(value)
}

function useDarkMode() {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'))
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])
    return isDark
}

function ChartTooltip({ active, payload, label, format = 'currency' }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-hm-900 rounded-xl shadow-hm-lg dark:shadow-premium-dark border border-gray-100 dark:border-white/5 px-3.5 py-2.5 text-xs">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} className="text-gray-500 dark:text-gray-400">
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
                    {entry.name}: <span className="font-medium text-gray-800 dark:text-gray-200">
                        {format === 'currency' ? formatCurrency(entry.value) : entry.value}
                    </span>
                </p>
            ))}
        </div>
    )
}

function TopProductosTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    const row = payload[0]?.payload
    return (
        <div className="bg-white dark:bg-hm-900 rounded-xl shadow-hm-lg dark:shadow-premium-dark border border-gray-100 dark:border-white/5 px-3.5 py-2.5 text-xs max-w-[200px]">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{row?.nombre}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Código: <span className="font-medium text-gray-800 dark:text-gray-200">{row?.codigo || '—'}</span></p>
            <p className="text-gray-500 dark:text-gray-400">Unidades: <span className="font-medium text-gray-800 dark:text-gray-200">{row?.total_unidades}</span></p>
            <p className="text-gray-500 dark:text-gray-400">Ingreso: <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(row?.total_ingreso || 0)}</span></p>
            <p className="text-gray-500 dark:text-gray-400">Transacciones: <span className="font-medium text-gray-800 dark:text-gray-200">{row?.num_transacciones}</span></p>
        </div>
    )
}

const kpiConfig = [
    { label: 'Total Productos', key: 'total_productos', icon: Package, gradient: 'from-sky-500 to-indigo-600', link: '/productos', desc: 'Artículos en catálogo' },
    { label: 'Stock Bajo', key: 'productos_bajo_stock', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600', link: '/productos?estado_stock=bajo', desc: 'Requieren reposición' },
    { label: 'Mov. Hoy', key: 'movimientos_hoy', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600', link: '/movimientos', desc: 'Entradas y salidas' },
    { label: 'Valor Invent.', key: 'valor_inventario', icon: DollarSign, gradient: 'from-purple-500 to-pink-600', link: '/productos', desc: 'Valor total en stock', format: true },
]

export default function Dashboard({ stats, actividadReciente, alertasStock, ventasSemana, topProductos, distribucionCategorias }) {
    const dark = useDarkMode()
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
    const dateFormatted = new Date().toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const gridStroke = dark ? chartColors.gridDark : chartColors.grid
    const tickStroke = dark ? chartColors.textDark : chartColors.text
    const axisStroke = dark ? chartColors.axisDark : chartColors.axis
    const areaGradientId = 'salesGradient'
    const barFill = dark ? chartColors.primaryDark : chartColors.primary

    const noSalesData = !ventasSemana?.length || ventasSemana.every(d => d.total_venta === 0)
    const noTopProducts = !topProductos?.length
    const noCategoryData = !distribucionCategorias?.length

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
                {kpiConfig.map((kpi) => {
                    const raw = Number(stats?.[kpi.key] ?? 0)
                    const value = kpi.format ? formatCurrency(raw) : raw.toLocaleString('es-PE')
                    const Icon = kpi.icon
                    return (
                        <button key={kpi.key} onClick={() => router.get(kpi.link)}
                            className={`kpi-card bg-gradient-to-br ${kpi.gradient} text-left w-full`}>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] font-medium tracking-wide uppercase opacity-80">{kpi.label}</span>
                                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-xl font-bold tracking-tight">{value}</p>
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
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-sky-500" />
                            Tendencia de Ventas (Semana)
                        </h2>
                        {ventasSemana && (
                            <span className="text-[9px] text-gray-400 dark:text-gray-500">
                                Total: {formatCurrency(ventasSemana.reduce((a, d) => a + d.total_venta, 0))}
                            </span>
                        )}
                    </div>
                    {noSalesData ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                            <TrendingUp className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-xs font-medium">Sin ventas esta semana</p>
                            <p className="text-[10px] mt-1">Los datos aparecerán cuando registres salidas de inventario</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={ventasSemana} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: tickStroke }} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} />
                                <YAxis tick={{ fontSize: 10, fill: tickStroke }} axisLine={false} tickLine={false}
                                    tickFormatter={(v) => v >= 1000 ? `S/${(v / 1000).toFixed(1)}k` : `S/${v}`} />
                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: chartColors.primary, strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="total_venta" name="Ventas" stroke={chartColors.primary} strokeWidth={2.5}
                                    fill={`url(#${areaGradientId})`} activeDot={{ r: 5, strokeWidth: 0, fill: chartColors.primary }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            Top 5 Productos más Vendidos
                        </h2>
                        {topProductos && (
                            <span className="text-[9px] text-gray-400 dark:text-gray-500">
                                {topProductos.reduce((a, d) => a + d.total_unidades, 0)} unid.
                            </span>
                        )}
                    </div>
                    {noTopProducts ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                            <Package className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-xs font-medium">Sin datos de ventas</p>
                            <p className="text-[10px] mt-1">Los productos más vendidos aparecerán aquí</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topProductos} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: tickStroke }} axisLine={{ stroke: axisStroke }} tickLine={false} />
                                <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10, fill: tickStroke }} axisLine={false} tickLine={false}
                                    width={100} tickFormatter={(v) => v.length > 14 ? v.slice(0, 14) + '…' : v} />
                                <Tooltip content={<TopProductosTooltip />} cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                                <Bar dataKey="total_unidades" name="Unidades" radius={[0, 6, 6, 0]} fill={barFill} maxBarSize={24}
                                    label={{ position: 'right', fontSize: 10, fill: tickStroke, formatter: (v) => `${v} unid.` }} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Distribución por Categoría
                        </h2>
                    </div>
                    {noCategoryData ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                            <Package className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-xs font-medium">Sin categorías</p>
                            <p className="text-[10px] mt-1">Crea categorías y asigna productos</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={distribucionCategorias} dataKey="total_productos" nameKey="nombre"
                                        cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}
                                        stroke="none">
                                        {distribucionCategorias.map((entry, i) => (
                                            <Cell key={entry.id} fill={entry.color || categoricalColors[i % categoricalColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null
                                        const d = payload[0].payload
                                        return (
                                            <div className="bg-white dark:bg-hm-900 rounded-xl shadow-hm-lg dark:shadow-premium-dark border border-gray-100 dark:border-white/5 px-3.5 py-2.5 text-xs">
                                                <p className="font-semibold text-gray-900 dark:text-white">{d.nombre}</p>
                                                <p className="text-gray-500 dark:text-gray-400 mt-1">Productos: <span className="font-medium text-gray-800 dark:text-gray-200">{d.total_productos}</span></p>
                                                <p className="text-gray-500 dark:text-gray-400">Valor: <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(d.valor_inventario)}</span></p>
                                            </div>
                                        )
                                    }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
                                {distribucionCategorias.map((entry, i) => (
                                    <div key={entry.id} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || categoricalColors[i % categoricalColors.length] }} />
                                        <span className="text-[9px] text-gray-500 dark:text-gray-400">{entry.nombre}</span>
                                        <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">{entry.total_productos}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-sky-500" />
                            Últimos Movimientos
                        </h2>
                        <Link href="/movimientos" className="text-[9px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 bg-sky-subtle dark:bg-sky-900/10 px-2.5 py-1 rounded-full">
                            Ver todo <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                    </div>
                    {actividadReciente?.length > 0 ? (
                        <div className="overflow-x-auto -mx-1">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/5">
                                        <th className="text-left text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2 pr-3">Producto</th>
                                        <th className="text-left text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2 pr-3">Tipo</th>
                                        <th className="text-right text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2 pr-3">Cantidad</th>
                                        <th className="text-right text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2 pr-3">Usuario</th>
                                        <th className="text-right text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actividadReciente.slice(0, 5).map((mov) => (
                                        <tr key={mov.id} className="border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="py-2.5 pr-3">
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{mov.producto_nombre || 'Producto #' + mov.producto_id}</span>
                                            </td>
                                            <td className="py-2.5 pr-3">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
                                                    mov.tipo === 'entrada'
                                                        ? 'bg-emerald-subtle dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-rose-subtle dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                }`}>
                                                    {mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 pr-3 text-right font-semibold text-gray-800 dark:text-gray-200">{mov.cantidad}</td>
                                            <td className="py-2.5 pr-3 text-right text-gray-400 dark:text-gray-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <User className="w-2.5 h-2.5" />
                                                    {mov.usuario_nombre || 'Sistema'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-right text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                {mov.created_at ? new Date(mov.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
        </AuthenticatedLayout>
    )
}
