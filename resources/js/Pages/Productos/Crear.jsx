import { Head, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CrearProducto({ producto, categorias, proveedores }) {
    const isEditing = !!producto
    const { data, setData, post, put, processing, errors } = useForm({
        codigo: producto?.codigo || '',
        nombre: producto?.nombre || '',
        descripcion: producto?.descripcion || '',
        categoria_id: producto?.categoria_id || '',
        proveedor_id: producto?.proveedor_id || '',
        precio_compra: producto?.precio_compra || '',
        precio_venta: producto?.precio_venta || '',
        stock_actual: producto?.stock_actual ?? 0,
        stock_minimo: producto?.stock_minimo ?? 5,
        unidad_medida: producto?.unidad_medida || 'unidad',
        activo: producto?.activo ?? true,
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const options = {
            onSuccess: () => toast.success(isEditing ? 'Producto actualizado' : 'Producto creado'),
            onError: () => {},
        }
        isEditing ? put(`/productos/${producto.id}`, options) : post('/productos', options)
    }

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Editar Producto' : 'Nuevo Producto'} />
            <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                    <a href="/productos" className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-gray-700/50 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-hm-400" />
                    </a>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
                        <p className="text-xs text-hm-400 dark:text-gray-400">{isEditing ? `Editando: ${producto.nombre}` : 'Ingresa los datos del nuevo producto'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Nombre *</label>
                            <input type="text" name="nombre" value={data.nombre} onChange={e => setData('nombre', e.target.value)} required
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.nombre && <p className="text-xs text-rose-500 mt-1">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Código *</label>
                            <input type="text" name="codigo" value={data.codigo} onChange={e => setData('codigo', e.target.value)} required
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.codigo && <p className="text-xs text-rose-500 mt-1">{errors.codigo}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Unidad</label>
                            <select name="unidad_medida" value={data.unidad_medida} onChange={e => setData('unidad_medida', e.target.value)}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs">
                                <option value="unidad">Unidad</option>
                                <option value="kg">Kg</option>
                                <option value="g">Gramo</option>
                                <option value="l">Litro</option>
                                <option value="ml">Ml</option>
                                <option value="caja">Caja</option>
                                <option value="pack">Pack</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Categoría</label>
                            <select name="categoria_id" value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs">
                                <option value="">Sin categoría</option>
                                {categorias?.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Proveedor</label>
                            <select name="proveedor_id" value={data.proveedor_id} onChange={e => setData('proveedor_id', e.target.value)}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs">
                                <option value="">Sin proveedor</option>
                                {proveedores?.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Descripción</label>
                            <textarea name="descripcion" value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} rows={2}
                                className="w-full px-3 py-2 rounded-xl bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Precio Compra *</label>
                            <input type="number" name="precio_compra" value={data.precio_compra} onChange={e => setData('precio_compra', e.target.value)} step="0.01"
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.precio_compra && <p className="text-xs text-rose-500 mt-1">{errors.precio_compra}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Precio Venta *</label>
                            <input type="number" name="precio_venta" value={data.precio_venta} onChange={e => setData('precio_venta', e.target.value)} required step="0.01"
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.precio_venta && <p className="text-xs text-rose-500 mt-1">{errors.precio_venta}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Stock Actual</label>
                            <input type="number" name="stock_actual" value={data.stock_actual} onChange={e => setData('stock_actual', e.target.value)}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Stock Mínimo *</label>
                            <input type="number" name="stock_minimo" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.stock_minimo && <p className="text-xs text-rose-500 mt-1">{errors.stock_minimo}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="activo" checked={data.activo} onChange={e => setData('activo', e.target.checked)} id="activo"
                                className="rounded border-gray-300 dark:border-gray-600 text-sky-500 focus:ring-sky-500" />
                            <label htmlFor="activo" className="text-[10px] font-medium text-hm-600 dark:text-gray-400">Activo</label>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                            <Save className="w-3.5 h-3.5" />
                            {processing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto')}
                        </button>
                        <a href="/productos" className="px-4 py-2 rounded-full bg-hm-100 dark:bg-gray-700/50 text-hm-600 dark:text-gray-400 text-xs font-medium hover:bg-hm-200 dark:hover:bg-gray-700 transition-colors">Cancelar</a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}