import React from 'react'
import { Head, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { BarChart2, TrendingUp, Package, DollarSign, FileText, Download, CalendarDays } from 'lucide-react'

export default function Reportes({ filters = {} }) {
    const today = new Date().toISOString().split('T')[0]
    const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
    const [desde, setDesde] = React.useState(filters.fecha_inicio || monthAgo)
    const [hasta, setHasta] = React.useState(filters.fecha_fin || today)
    const [applied, setApplied] = React.useState(!!filters.fecha_inicio)

    React.useEffect(() => {
        setApplied(!!filters.fecha_inicio)
    }, [filters.fecha_inicio, filters.fecha_fin])

    const aplicarFiltro = () => {
        router.get('/reportes', { fecha_inicio: desde, fecha_fin: hasta }, { preserveState: true })
        setApplied(true)
    }

    const handleExport = (reporte, format) => {
        const params = {}
        if (reporte === 'movimientos') {
            params.desde = desde
            params.hasta = hasta
        }
        const qs = new URLSearchParams(params).toString()
        window.location.href = `/reportes/exportar/${reporte}/${format}${qs ? '?' + qs : ''}`
    }

    const reports = [
        { key: 'movimientos', icon: BarChart2, label: 'Movimientos por período', desc: 'Analiza entradas y salidas en un rango de fechas', gradient: 'from-sky-500 to-indigo-600' },
        { key: 'top-productos', icon: TrendingUp, label: 'Productos más rotados', desc: 'Productos con mayor rotación del inventario', gradient: 'from-emerald-500 to-teal-600' },
        { key: 'valorizacion', icon: Package, label: 'Valorización de inventario', desc: 'Costo total y valor de venta del inventario', gradient: 'from-purple-500 to-pink-600' },
        { key: 'alertas', icon: DollarSign, label: 'Alertas de reposición', desc: 'Productos con stock debajo del mínimo', gradient: 'from-amber-500 to-orange-600' },
    ]

    return (
        <AuthenticatedLayout>
            <Head title="Reportes" />

            <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Reportes</h1>
                <p className="text-xs text-hm-400 dark:text-gray-500">Análisis y exportación de datos del inventario</p>
            </div>

            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 mb-4 shadow-hm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-hm-500 dark:text-gray-400">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span className="font-medium">Período:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
                            className="px-3 py-1.5 rounded-full bg-hm-100/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
                            className="px-3 py-1.5 rounded-full bg-hm-100/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
                    </div>
                    <button onClick={aplicarFiltro} className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-semibold hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                        Aplicar
                    </button>
                    {applied && (
                        <span className="text-[9px] text-sky-600 dark:text-sky-400 font-medium bg-sky-50 dark:bg-sky-900/20 px-2.5 py-1 rounded-full border border-sky-200/40 dark:border-sky-800/30">
                            Filtro activo
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reports.map((r) => (
                    <div key={r.key} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm hover:shadow-hm-md transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-sm`}>
                                <r.icon className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleExport(r.key, 'pdf')} className="px-2.5 py-1 rounded-full bg-hm-100 dark:bg-slate-800/40 text-[8px] font-semibold text-hm-500 dark:text-gray-400 hover:bg-hm-200 dark:hover:bg-slate-700/40 transition-all inline-flex items-center gap-1">
                                    <FileText className="w-2.5 h-2.5" /> PDF
                                </button>
                                <button onClick={() => handleExport(r.key, 'excel')} className="px-2.5 py-1 rounded-full bg-hm-100 dark:bg-slate-800/40 text-[8px] font-semibold text-hm-500 dark:text-gray-400 hover:bg-hm-200 dark:hover:bg-slate-700/40 transition-all inline-flex items-center gap-1">
                                    <Download className="w-2.5 h-2.5" /> Excel
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{r.label}</h3>
                        <p className="text-[10px] text-hm-400 dark:text-gray-500 mt-0.5">{r.desc}</p>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    )
}
