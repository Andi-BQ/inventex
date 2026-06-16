import { Head, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CrearMovimiento({ productos }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        producto_id: '',
        tipo: 'entrada',
        cantidad: 1,
        motivo: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/movimientos', {
            onSuccess: () => {
                toast.success('Movimiento registrado')
                reset()
            },
            onError: () => {},
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Nuevo Movimiento" />
            <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-4">
                    <a href="/movimientos" className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-gray-700/50 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-hm-400" />
                    </a>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Nuevo Movimiento</h1>
                        <p className="text-xs text-hm-400 dark:text-gray-400">Registrar entrada o salida de inventario</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Producto *</label>
                            <select name="producto_id" value={data.producto_id} onChange={e => setData('producto_id', e.target.value)} required
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs">
                                <option value="">Seleccionar producto</option>
                                {productos?.map(p => <option key={p.id} value={p.id}>{p.codigo} - {p.nombre} (Stock: {p.stock_actual})</option>)}
                            </select>
                            {errors.producto_id && <p className="text-xs text-rose-500 mt-1">{errors.producto_id}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Tipo *</label>
                            <div className="flex gap-2">
                                {['entrada', 'salida'].map(t => (
                                    <button key={t} type="button" onClick={() => setData('tipo', t)}
                                        className={`flex-1 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                                            data.tipo === t
                                                ? t === 'entrada' ? 'bg-emerald-500 text-white shadow-premium' : 'bg-red-500 text-white shadow-premium'
                                                : 'bg-hm-100/60 dark:bg-gray-900/50 text-hm-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                        }`}>
                                        {t === 'entrada' ? 'Entrada' : 'Salida'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Cantidad *</label>
                            <input type="number" name="cantidad" value={data.cantidad} onChange={e => setData('cantidad', e.target.value)} required min="1"
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.cantidad && <p className="text-xs text-rose-500 mt-1">{errors.cantidad}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Motivo</label>
                            <textarea name="motivo" value={data.motivo} onChange={e => setData('motivo', e.target.value)} rows={2}
                                placeholder="Ej: Venta, reposición, ajuste..."
                                className="w-full px-3 py-2 rounded-xl bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                            <Save className="w-3.5 h-3.5" />
                            {processing ? 'Guardando...' : 'Registrar'}
                        </button>
                        <a href="/movimientos" className="px-4 py-2 rounded-full bg-hm-100 dark:bg-gray-700/50 text-hm-600 dark:text-gray-400 text-xs font-medium hover:bg-hm-200 dark:hover:bg-gray-700 transition-colors">Cancelar</a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}