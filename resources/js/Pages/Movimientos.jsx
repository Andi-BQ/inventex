import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { ArrowDownUp, Plus, Search, Package, ArrowUpRight, User, Clock } from 'lucide-react'

export default function Movimientos({ movimientos }) {
    const [search, setSearch] = useState('')
    const [tipoFilter, setTipoFilter] = useState('todos')
    const data = movimientos?.data ?? []
    const pagination = movimientos?.pagination ?? {}

    const searchMov = () => {
        router.get('/movimientos', { search, tipo: tipoFilter }, { preserveState: true, preserveScroll: true })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Movimientos" />

            <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Movimientos</h1>
                    <p className="text-xs text-hm-400 dark:text-gray-500">Historial de entradas y salidas</p>
                </div>
                <Link href="/movimientos/crear" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                    <Plus className="w-3.5 h-3.5" /> Nuevo
                </Link>
            </div>

            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-3 mb-3 shadow-hm">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hm-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchMov()}
                            placeholder="Buscar por producto..."
                            className="w-full pl-9 pr-3 py-2 rounded-full bg-hm-100/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
                    </div>
                    <div className="flex gap-1">
                        {['todos', 'entrada', 'salida'].map(t => (
                            <button key={t} onClick={() => { setTipoFilter(t); router.get('/movimientos', { tipo: t, search }, { preserveState: true }) }}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                                    tipoFilter === t
                                        ? t === 'entrada' ? 'bg-emerald-500 text-white shadow-sm' : t === 'salida' ? 'bg-red-500 text-white shadow-sm' : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                                        : 'bg-hm-100/60 dark:bg-slate-800/30 text-hm-500 dark:text-gray-400 hover:bg-hm-200 dark:hover:bg-slate-700/30'
                                }`}>
                                {t === 'todos' ? 'Todos' : t === 'entrada' ? 'Entradas' : 'Salidas'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 overflow-hidden shadow-hm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5">
                                <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Fecha</th>
                                <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Tipo</th>
                                <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Producto</th>
                                <th className="text-right px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Cantidad</th>
                                <th className="text-right px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Stock Ant.</th>
                                <th className="text-right px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Stock Nuevo</th>
                                <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Usuario</th>
                                <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Motivo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.02]">
                            {data.length > 0 ? data.map((m) => (
                                <tr key={m.id} className="group hover:bg-hm-50/30 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-[10px] text-hm-500 dark:text-gray-400">
                                            <Clock className="w-2.5 h-2.5" />
                                            {m.created_at ? new Date(m.created_at).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-bold ${
                                            m.tipo === 'entrada'
                                                ? 'bg-emerald-subtle dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30'
                                                : 'bg-rose-subtle dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-900/30'
                                        }`}>
                                            <ArrowDownUp className="w-2.5 h-2.5" /> {m.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{m.producto_nombre || m.producto?.nombre || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`text-xs font-bold ${m.tipo === 'entrada' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {m.tipo === 'entrada' ? '+' : '-'}{m.cantidad}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-hm-500 dark:text-gray-400 font-mono">{m.stock_anterior ?? '-'}</td>
                                    <td className="px-4 py-3 text-right text-xs font-bold text-gray-900 dark:text-gray-100 font-mono">{m.stock_nuevo ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-[10px] text-hm-500 dark:text-gray-400">
                                            <User className="w-2.5 h-2.5" /> {m.usuario_nombre || m.usuario?.nombre_completo || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[10px] text-hm-400 dark:text-gray-500 max-w-[120px] truncate">
                                        {m.motivo || <span className="italic opacity-50">—</span>}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-10 text-center">
                                        <ArrowDownUp className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                        <p className="text-xs text-hm-400 dark:text-gray-500 mb-2">No hay movimientos registrados</p>
                                        <Link href="/movimientos/crear" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-semibold">
                                            <Plus className="w-3 h-3" /> Registrar movimiento
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination?.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">
                        <p className="text-[9px] text-hm-400">Mostrando {data.length} de {pagination.total}</p>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                <Link key={page} href={`/movimientos?page=${page}`}
                                    className={`w-7 h-7 flex items-center justify-center rounded-full text-[9px] font-semibold transition-all ${
                                        page === pagination.page ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-premium' : 'text-hm-500 dark:text-gray-400 hover:bg-hm-100 dark:hover:bg-slate-800/40'
                                    }`}>{page}</Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}
