# INFORME DE AUDITORÍA INTEGRAL, MODELADO DE DATOS Y PLAN DE MITIGACIÓN: ERP INVENTEX

**Fecha de Emisión:** Junio de 2026
**Clasificación:** Confidencial / Auditoría Interna de Sistemas
**Preparado para:** Dirección de Tecnología y Comité de Arquitectura de Software

---

## 1. RESUMEN EJECUTIVO

El presente informe documenta los resultados de la auditoría integral de software y arquitectura de datos practicada sobre el sistema INVENTEX — ERP de Gestión de Inventarios — durante el ciclo de revisión de Junio de 2026. La auditoría abarcó las tres capas del ecosistema: motor de persistencia (MySQL/Laravel Migrations), capa de dominio y servicio (Laravel 11, Eloquent ORM), y capa de presentación (Inertia.js v3 con React 19 y Tailwind CSS v4). Se examinaron la totalidad de las migraciones, modelos Eloquent, controladores, servicios, middleware de autorización, requests de validación, layouts frontend, páginas Inertia, y el enrutamiento SPA. El propósito central fue identificar desviaciones de diseño, vulnerabilidades de integridad referencial, cuellos de botella de rendimiento, bugs activos en producción, y brechas funcionales entre la interfaz expuesta y la lógica de backend realmente implementada.

El sistema INVENTEX implementa un esquema híbrido de siete tablas transaccionales (users, categorias, proveedores, productos, movimientos_inventario, notificaciones, más las tablas del framework Laravel como sessions, cache, jobs y personal_access_tokens). Se identificaron cuatro bugs críticos en producción (formularios CRUD congelados, ruptura del flujo SPA por respuestas JSON planas, colapso del layout estructural con superposición del menú lateral, y falla de persistencia en credenciales de acceso por doble hashing de contraseñas), tres deficiencias estructurales en la capa de base de datos (falta de índices compuestos para consultas de reporting, ausencia de SoftDeletes en entidades transaccionales, uso de ENUM en lugar de tablas catálogo para tipos de movimiento), y un conjunto completo de opciones de configuración que existen exclusivamente como "fachada" en el frontend sin respaldo en la capa de persistencia. Las secciones siguientes desglosan cada hallazgo con su análisis de causa raíz, especificación técnica detallada y hoja de ruta de remediación priorizada.

---

## 2. AUDITORÍA DE LA BASE DE DATOS Y CAPA DE PERSISTENCIA (ELOCUENT)

### 2.1 Integridad Referencial y Llaves Foráneas

El diseño actual define siete restricciones de integridad referencial distribuidas en cuatro tablas hija. A continuación se evalúa cada una:

**productos.categoria_id → categorias.id:**
- Migración: `$table->foreignId('categoria_id')->nullable()->constrained('categorias')->nullOnDelete();`
- Comportamiento: Al eliminar una categoría, los productos asociados quedan con `categoria_id = NULL`.
- Evaluación: **Correcto**. Ningún producto debe desaparecer porque su categoría se elimine. La política de `NULL` es la más segura para este caso de uso.

**productos.proveedor_id → proveedores.id:**
- Migración: `$table->foreignId('proveedor_id')->nullable()->constrained('proveedores')->nullOnDelete();`
- Comportamiento: Al eliminar un proveedor, `proveedor_id` pasa a `NULL`.
- Evaluación: **Correcto**. Misma lógica que categorías. Históricamente los productos deben conservarse.

**movimientos_inventario.producto_id → productos.id:**
- Migración: `$table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();`
- Comportamiento: Al eliminar un producto, todos sus movimientos de inventario se eliminan en cascada.
- Evaluación: **CRÍTICO — RIESGO DE PÉRDIDA DE AUDITORÍA**. Si se elimina un producto que tuvo movimientos históricos, se pierde el rastro de auditoría de ese producto. Debería usarse `restrictOnDelete()` (negar la eliminación si hay movimientos) o `SoftDeletes` en productos. Para reportes financieros y fiscales, la traza de movimientos es inamovible.

**movimientos_inventario.usuario_id → users.id:**
- Migración: `$table->foreignId('usuario_id')->constrained('users')->restrictOnDelete();`
- Comportamiento: Impide eliminar un usuario que tenga movimientos registrados.
- Evaluación: **Correcto en intención, pero incompleto en implementación**. El controlador `UsuarioController::inertiaDestroy` fue recientemente parcheado para verificar `$user->movimientos()->exists()` y retornar un error amigable antes de intentar el DELETE, lo cual evita el error SQLSTATE[23000] que antes se lanzaba como excepción no manejada (500 Internal Server Error). La restricción a nivel BD es la salvaguarda final, pero debería acompañarse de una verificación de `notificaciones()` también, dado que `notificaciones.usuario_id` tiene `cascadeOnDelete()`, y eliminar un usuario arrastraría sus notificaciones sin control.

**notificaciones.usuario_id → users.id:**
- Migración: `$table->foreignId('usuario_id')->nullable()->constrained('users')->cascadeOnDelete();`
- Comportamiento: Al eliminar un usuario, sus notificaciones se eliminan.
- Evaluación: **Aceptable**. Las notificaciones son datos efímeros. La política `NULL` no aplica aquí porque no tiene sentido una notificación sin usuario dueño.

**Hallazgos de integridad referencial adicionales:**
- No existe una restricción FK entre `movimientos_inventario` y la tabla de precios históricos (no existe tabla separada, los precios se almacenan como columnas `decimal` dentro de la misma fila de movimiento). Esto es correcto para un modelo de auditoría (snapshot del precio en el momento del movimiento), pero introduce redundancia: el `precio_compra` y `precio_venta` actuales del producto pueden desincronizarse de los valores históricos. Esto se considera un feature, no un bug.
- La tabla `categorias` no tiene FK a sí misma (no soporta jerarquía padres/hijos). Esto es aceptable para un sistema ERP de inventario simple, pero limita la escalabilidad si se requieren subcategorías en el futuro.
- La tabla `productos` no tiene FK a `users` (no hay campo `creado_por` o `actualizado_por`). Esto impide rastrear quién creó o modificó cada producto. Se recomienda agregar campos `nullable foreignId` con `nullOnDelete` para trazabilidad.

### 2.2 Indexación e Índices de Rendimiento

Se examinó la cobertura de índices en cada tabla contra los patrones de consulta observados en los controladores y servicios:

| Tabla | Índices Existentes | Consultas Reales | Brecha |
|---|---|---|---|
| `users` | `rol`, `activo` | Búsquedas por `email` (login, unique), filtros por `rol+activo` | Falta `INDEX(email)` (aunque UNIQUE ya incluye índice implícito). OK. |
| `categorias` | `nombre`, `activo` | `ORDER BY nombre`, `WHERE activo=true` | Cubierto. |
| `proveedores` | `nombre`, `activo` | `ORDER BY nombre`, `WHERE activo=true`, búsqueda LIKE por `nombre, ruc, contacto` | Las búsquedas LIKE con wildcard izquierdo (`%{$term}%`) no pueden usar índice B-tree. Se recomienda índice FULLTEXT en `(nombre, ruc, contacto)` si el volumen supera 10K registros. |
| `productos` | `codigo` (UNIQUE), `nombre`, `activo`, `(stock_actual, stock_minimo)` | Filtros por `categoria_id`, `proveedor_id`, búsqueda LIKE en `nombre, codigo`, compuesto `stock_actual <= stock_minimo` | **Faltan índices individuales o compuestos en `categoria_id` y `proveedor_id`**. El dashboard ejecuta `SUM(CASE WHEN stock_actual <= stock_minimo...)` sin índice útil. El índice compuesto `(stock_actual, stock_minimo)` es correcto para la alerta de bajo stock. |
| `movimientos_inventario` | `(producto_id, created_at)`, `(usuario_id, created_at)`, `(tipo, created_at)` | Filtros por rango de fechas, agrupaciones por `DATE(created_at)`, JOINs con productos y usuarios | Cobertura excelente. Sin embargo, los reportes que hacen `WHERE tipo='salida' AND MONTH(created_at)=X` se benefician del índice `(tipo, created_at)`. |
| `notificaciones` | `(usuario_id, leida)`, `tipo` | `WHERE usuario_id=X AND leida=false ORDER BY created_at DESC LIMIT 20` | Cubierto. |

**Sintaxis para agregar índices faltantes en una migración futura:**

```php
// products table
$table->index('categoria_id');
$table->index('proveedor_id');
$table->fullText(['nombre', 'codigo', 'descripcion'], 'productos_fulltext');

// proveedores table
$table->fullText(['nombre', 'ruc', 'contacto'], 'proveedores_fulltext');
```

**Recomendación adicional:** Agregar un índice compuesto en `movimientos_inventario(created_at, tipo, cantidad)` para acelerar las consultas de agregación del dashboard:

```php
$table->index(['created_at', 'tipo', 'cantidad'], 'movimientos_aggregation_idx');
```

### 2.3 Tipos de Datos y Consistencia

**Campos monetarios:**
- `productos.precio_compra` → `decimal(10,2)` — **Correcto**. Los tipos `float` o `double` habrían introducido errores de redondeo en operaciones de valorización de inventario.
- `productos.precio_venta` → `decimal(10,2)` — **Correcto**.
- `movimientos_inventario.precio_compra_momento` → `decimal(10,2)` — **Correcto**.
- `movimientos_inventario.precio_venta_momento` → `decimal(10,2)` — **Correcto**.

**Campos de estado:**
- `activo` en `users`, `categorias`, `proveedores`, `productos` → `boolean` con default `true`. **Correcto**. El cast Eloquent `'activo' => 'boolean'` garantiza coerción a `true`/`false` en el lado de PHP.
- `notificaciones.leida` → `boolean` con default `false`. **Correcto**.

**ENUM vs Tabla Catálogo:**
- `movimientos_inventario.tipo` → `ENUM('entrada', 'salida', 'ajuste')`. **RIESGO DE MANTENIMIENTO**. MySQL/MariaDB soporta ENUM como tipo nativo, pero:
  1. Agregar un nuevo tipo (ej: `'transferencia'`) requiere `ALTER TABLE`, bloqueando la tabla en producción.
  2. PostgreSQL no soporta ENUM sin extensión `CREATE TYPE`.
  3. El framework Laravel no tiene un sistema de migración nativo para modificar ENUMs (requiere `DB::statement` con sintaxis raw).
  4. **Solución:** Migrar a una tabla `tipos_movimiento` con FK desde `movimientos_inventario.tipo_id`.

**Cadenas de caracteres:**
- `email` → `varchar(150)` en `users` con UNIQUE. Correcto.
- `avatar_url` → `varchar(500)` nullable. Márgen adecuado para URLs largas de servicios cloud (S3, Cloudinary).
- `codigo` (productos) → `varchar(50)` UNIQUE. Correcto. Se recomienda evitar `string` sin límite explícito; aquí se define correctamente.
- `password` → `string` (implícitamente `varchar(255)` por Laravel). Suficiente para bcrypt (60 chars) y futuros algoritmos como Argon2.

**Campos de auditoría temporal:**
- `timestamps()` presente en todas las tablas transaccionales. **Correcto**.
- `ultimo_login` → `datetime` nullable en `users`. **Correcto**, pero se recomienda incluir también `deleted_at` (SoftDeletes).

---

## 3. DIAGNÓSTICO DE ERRORES CRÍTICOS (SÍNTOMAS Y CAUSAS RAÍZ)

### Bug 3.1: Bloqueo Silencioso en Formularios CRUD (Editar/Actualizar)

**A) Síntoma en la Interfaz:**
El usuario completa el formulario de edición (Usuario, Producto o Categoría), hace clic en "Actualizar" o "Guardar", el botón muestra un breve estado de carga o permanece inactivo, pero no ocurre ninguna de las siguientes situaciones esperadas: (1) redirección a la página de listado, (2) mensaje de éxito/error, (3) actualización visible en la base de datos. El formulario se "congela" sin feedback al usuario.

**B) Causa Raíz Técnica:**
Las implementaciones originales de los formularios CRUD utilizaban `useState` para el estado local del formulario y `router.put()` (o `router.post()`) de Inertia.js para el envío asíncrono. El flujo de error fallaba en tres puntos específicos:

1. **Validación servidor → cliente:** Cuando el controlador retornaba una respuesta HTTP 422 (ValidationException), Inertia.js interceptaba la respuesta y colocaba los errores en el objeto `errors` del componente. Sin embargo, los componentes originales no estaban estructurados para recibir `errors` como prop de Inertia, porque Inertia.js v3 inyecta los errores de validación como una prop automática `errors` en el componente de página renderizado tras el redirect fallido. Pero si el formulario no era una página Inertia (sino un componente hijo dentro de la página), los errores no se propagaban a menos que se usara `useForm()` que expone `errors` directamente.

2. **Falta de manejo de `onError`:** Las implementaciones previas no definían el callback `onError` en la llamada `router.put()`, o lo definían vacío. La ausencia del callback causaba que los errores 422 se tragaran silenciosamente: Inertia no lanzaba excepción visible, no mostraba notificación, y el formulario simplemente no avanzaba.

3. **Stale closure en callbacks:** Los handlers de envío capturaban `data` del estado local mediante closures que no se actualizaban en re-renderizados, causando que se enviaran datos vacíos o desactualizados al servidor. El servidor respondía con 422 por campos requeridos vacíos, pero el `onError` vacío impedía cualquier feedback.

**C) Solución de Ingeniería:**
Se reemplazó el patrón `useState` + `router.put()` por el hook `useForm()` de `@inertiajs/react` en las cinco páginas de creación/edición:
- `Productos/Crear.jsx`
- `Categorias/Crear.jsx`
- `Proveedores/Crear.jsx`
- `Usuarios/Crear.jsx`
- `Movimientos/Crear.jsx`

`useForm()` enlaza automáticamente:
- El estado del formulario con `setData('field', value)`.
- Los errores de validación servidor con `errors.field`.
- El estado `processing` que deshabilita el botón durante el envío.
- Los callbacks `onSuccess` y `onError` tipados.

Además, se agregó renderizado condicional por campo: `{errors.nombre && <p className="text-rose-500">{errors.nombre}</p>}` para visualizar errores in-situ. Esto remplaza el comportamiento anterior donde los errores 422 eran invisibles y el formulario se congelaba sin explicación.

### Bug 3.2: Ruptura del Flujo SPA por Respuestas JSON Planas

**A) Síntoma en la Interfaz:**
Al intentar marcar notificaciones como leídas (desde el dropdown en el header), o al ejecutar ciertas acciones sobre entidades, el sistema interrumpe abruptamente la navegación SPA y muestra en la consola del navegador: *"All Inertia requests must receive a valid Inertia response"*. La aplicación se detiene y requiere recarga manual.

**B) Causa Raíz Técnica:**
Inertia.js funciona interceptando todas las peticiones `router.*()` y esperando que el servidor responda con cabeceras HTTP específicas: `X-Inertia: true`, `X-Inertia-Version`, y un cuerpo JSON que contiene `component`, `props`, `url`, etc. Si un endpoint es invocado mediante `router.get()`, `router.post()`, `router.put()` o `router.delete()` de Inertia, pero el controlador de Laravel retorna una respuesta JSON plana (ej: `response()->json(['data' => ...])`) en lugar de un redirect Inertia (ej: `redirect('/ruta')->with(...)`), entonces Inertia recibe un JSON sin las cabeceras `X-Inertia` y arroja el error fatal.

En el código examinado, el `AuthenticatedLayout.jsx` implementa notificaciones mediante `fetch()` nativo (no `router.*`), lo cual es correcto y no debería activar la intercepción de Inertia. Sin embargo, se identificaron dos puntos de falla:

1. **La ruta `/api/notificaciones/{id}/leida` usa `PATCH`**, y en `web.php` no está definida una ruta PATCH para el endpoint web. La línea `Route::patch('/notificaciones/{id}/leida', ...)` está dentro del grupo `api`, pero si alguien invoca `router.patch()` (de Inertia) a esa URL, el backend responde con `response()->json()` (porque `NotificacionController::marcarLeida` es un método de API que retorna JSON), y eso rompe el SPA.

2. **El componente `Perfil.jsx` usa `router.put()`** para enviar el cambio de contraseña a `/perfil/password`. El controlador `AuthController::cambiarPassword` verifica `$request->expectsJson()` y retorna `response()->json()` si es true, o `back()->with()` si es false. Inertia envía la cabecera `X-Requested-With: XMLHttpRequest` y `Accept: application/json`, lo cual hace que `$request->expectsJson()` retorne `true`, y por tanto el controlador devuelve JSON plano. Esto activa el error de Inertia.

**C) Solución de Ingeniería:**
Para `/perfil/password`, se debe modificar `AuthController::cambiarPassword` para que siempre retorne una respuesta Inertia cuando la petición provenga de Inertia. La solución recomendada es:

```php
// Verificar por cabecera X-Inertia en lugar de expectsJson
if ($request->header('X-Inertia')) {
    return redirect()->back()->with('success', 'Contraseña actualizada correctamente.');
}
return response()->json(['mensaje' => 'Contraseña actualizada correctamente.']);
```

Alternativamente, cambiar el componente `Perfil.jsx` para que use `fetch()` en lugar de `router.put()`, de manera que sea una llamada AJAX estándar no interceptada por Inertia. Dado que el componente ya fue reescrito con `useForm`, la llamada `put('/perfil/password', ...)` usa la maquinaria de Inertia y debe recibir una respuesta Inertia. La solución correcta es modificar el controlador.

Para las notificaciones, se debe agregar una ruta web explícita para PATCH dentro del grupo Inertia, delegando a un nuevo método que retorne redirect en lugar de JSON, o mantener el uso de `fetch()` (que sí funciona porque no envía X-Inertia) y asegurar que ningún desarrollador cambie accidentalmente a `router.patch()`.

### Bug 3.3: Desalineación y Colapso del Layout Estructural (CSS Glitches)

**A) Síntoma en la Interfaz:**
En ciertas resoluciones y navegadores, el menú lateral (sidebar) se superpone sobre las tarjetas del contenido principal, especialmente durante la transición de apertura/cierre en móvil. También se observa un "espacio fantasma" de aproximadamente 240px (equivalente al ancho del sidebar) en la parte superior del área de contenido, que desplaza las tablas y tarjetas hacia abajo, rompiendo la alineación visual.

**B) Causa Raíz Técnica:**
El layout definido en `AuthenticatedLayout.jsx` implementa un sidebar con posicionamiento híbrido:

```jsx
<div className="h-screen flex bg-hm-50 dark:bg-hm-950 overflow-hidden">
    <aside className="fixed top-0 left-0 z-50 h-full w-60 p-4 glass-sidebar
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}">
    </aside>
    <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 glass border-b ...">
        </main>
    </div>
</div>
```

La causa raíz es la combinación de `fixed` (en móvil) y `static` (en desktop) para el sidebar, sin ajustar el margen del contenido principal:

1. **En desktop (lg+):** El sidebar cambia a `lg:static`, lo que lo saca del posicionamiento absoluto y lo coloca en el flujo normal del flex container. El `flex-1` del área principal debería calcular el ancho restante correctamente (100% - 240px). Sin embargo, el sidebar mantiene `p-4` y el header tiene `sticky top-0 z-30`. Cuando el sidebar es estático, la propiedad `sticky` del header funciona respecto al contenedor de scroll principal.
2. **En móvil:** El sidebar es `fixed` con `z-50` y se oculta mediante `-translate-x-full`. Al abrirlo, se superpone al contenido con `z-50` y un overlay `bg-black/20 backdrop-blur-sm`. El contenido no tiene `margin-left` adicional porque el sidebar está fuera del flujo. Correcto.
3. **El "espacio fantasma"** se origina de la clase `p-4 lg:p-5` en el `<main>` combinada con la altura forzada `h-screen` en el contenedor principal. Pero el verdadero problema es que en algunas condiciones el sidebar estático no ocupa espacio en el flex container porque las clases `lg:static lg:z-auto` no se aplican correctamente debido a que `fixed` tiene mayor especificidad en Tailwind que `static` cuando se usan variantes responsivas de manera incorrecta.

Además, la clase `glass-sidebar` aplica `backdrop-filter: blur(24px)` que, combinado con el posicionamiento, puede causar artefactos de renderizado en navegadores basados en Chromium cuando el sidebar está en modo estático y se superponen capas de renderizado.

**C) Solución de Ingeniería:**

1. Reemplazar el patrón híbrido fixed/static por un sidebar siempre fixed con margen compensatorio en el contenido principal:

```jsx
<div className="h-screen flex bg-hm-50 dark:bg-hm-950 overflow-hidden">
    <aside className="fixed top-0 left-0 z-40 h-full w-60 p-4 glass-sidebar
        transform transition-all duration-300 ease-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}">
    </aside>

    <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300
        ${sidebarOpen || window.innerWidth >= 1024 ? 'lg:ml-60' : 'ml-0'}`}>
        ...
    </div>
</div>
```

2. Alternativa más simple (recomendada): Usar `lg:ml-60` en el `<main>` cuando el sidebar está presente en desktop, manteniendo el sidebar siempre en `fixed`:

```jsx
<aside className="fixed top-0 left-0 z-40 h-full w-60 ... lg:translate-x-0 ..." />
<main className="lg:ml-60 flex-1 ...">
```

3. Aplicar `isolation: isolate` al sidebar y al header para evitar conflictos de stacking context con `backdrop-filter`.

### Bug 3.4: Falla de Persistencia en Credenciales de Acceso

**A) Síntoma en la Interfaz:**
El administrador crea un nuevo usuario o actualiza la contraseña de uno existente. La operación reporta éxito. Sin embargo, el usuario afectado no puede iniciar sesión con la contraseña recién establecida, recibiendo "Credenciales inválidas". Las contraseñas previamente existentes (creadas antes de cierto punto) continúan funcionando.

**B) Causa Raíz Técnica:**
Se identificó una **condición de doble hashing** causada por la interacción entre dos mecanismos:

1. En `UsuarioController::inertiaStore`:
```php
$data['password'] = Hash::make($data['password']);
$user->fill($data)->save();
```

2. En el modelo `User.php`:
```php
protected function casts(): array
{
    return [
        'password' => 'hashed',  // <-- CAST DE HASH AUTOMÁTICO
    ];
}
```

El flujo de doble hashing ocurre así:
- `$data['password'] = Hash::make('MiClave123')` → primera hash: `$2y$12$...abc`
- `$user->fill(['password' => '$2y$12$...abc'])` → El cast `hashed` de Eloquent detecta que se está asignando al atributo `password` y aplica `Hash::make()` nuevamente sobre el valor ya hasheado.
- El valor almacenado en BD es `Hash::make('$2y$12$...abc')` — un hash de un hash.
- Al intentar autenticar, `Hash::check('MiClave123', $storedHash)` hashea `'MiClave123'` una vez y lo compara contra el doble hash, resultando en **falso** siempre.

Las contraseñas existentes antes de agregar el cast `hashed` no se ven afectadas porque nunca pasan por el mutator de nuevo. Pero cualquier creación o actualización posterior genera contraseñas doblemente hasheadas e inservibles.

El cast `hashed` fue introducido en Laravel 10.47+ y está diseñado para **reemplazar** la llamada manual a `Hash::make()`, no para complementarla. Es decir, se debe usar **uno u otro**, no ambos.

**C) Solución de Ingeniería:**

**Opción A (Recomendada): Eliminar `Hash::make()` de los controladores y confiar exclusivamente en el cast `hashed` del modelo.**

Esto requiere modificar:
- `UsuarioController::inertiaStore`: Eliminar `$data['password'] = Hash::make(...)`. El cast se encargará de hashear automáticamente.
- `UsuarioController::inertiaUpdate`: Eliminar el bloque `if (!empty($data['password'])) { $data['password'] = Hash::make(...) }`. El cast se encarga cuando `password` no está vacío.
- `AuthController::cambiarPassword`: Eliminar `Hash::make()` en `$user->update(['password' => Hash::make(...)])`. El cast lo aplica.

**Opción B: Eliminar el cast `hashed` del modelo y mantener `Hash::make()` explícito en todos los controladores.**

Menos elegante pero más explícito. Riesgo de que futuros desarrolladores olviden hashear.

Se recomienda la Opción A porque reduce la superficie de error y sigue el principio de "convention over configuration" de Laravel. Sin embargo, demanda auditar cada punto del código donde se asigna `password` para asegurar que el cast `hashed` no reciba un valor ya hasheado.

---

## 4. AUDITORÍA DE RENDIMIENTO (PERFORMANCE & BOTTLENECKS)

### 4.1 Consultas N+1 Identificadas

Se rastreó el uso de Eloquent en los controladores y servicios para identificar patrones N+1 de carga diferida:

| Ubicación | Consulta | ¿N+1? | Impacto |
|---|---|---|---|
| `DashboardService::getStats()` | `Producto::selectRaw(...)` | No (es agregación SQL pura) | Bajo |
| `DashboardService::getAlertasStock()` | `Producto::with(['categoria', 'proveedor'])...` | No (eager loading correcto) | Bajo |
| `DashboardService::getActividadReciente()` | `Movimiento::with(['producto', 'usuario'])...` | No (eager loading correcto) | Bajo |
| `DashboardService::getTopProductos()` | `Movimiento::selectRaw(...)->with('producto')` | No (eager loading correcto) | Bajo |
| `ProductoService::listar()` | `Producto::with(['categoria', 'proveedor'])...` | No (eager loading correcto) | Bajo |
| `MovimientoController::paginaIndex()` | `Movimiento::with(['producto', 'usuario'])...` | No (eager loading correcto) | Bajo |
| `CategoriaController::paginaIndex()` | `Categoria::withCount('productos')` | No (subquery en COUNT) | Bajo |
| `ProveedorController::paginaIndex()` | `Proveedor::withCount('productos')` | No (subquery en COUNT) | Bajo |
| `Configuracion.jsx` | Solo renderiza `auth.user` de las shared props | No | Bajo |
| Dashboard carga de datos | 5 peticiones separadas al servidor | No (son paralelas, no en serie) | Medio |

**Conclusión:** El equipo ha aplicado correctamente Eager Loading en las consultas principales. No se detectaron patrones N+1 clásicos. Sin embargo, existe un problema de rendimiento diferente: el dashboard realiza 5 viajes de ida y vuelta HTTP (al cargar la página Inertia principal, que ya envía todos los stats embebidos, más las peticiones API adicionales). Esto se optimiza en la Sección 4.3.

### 4.2 Consultas Pesadas y Recomendación de Chunking

Aunque actualmente no hay problemas de N+1, existen dos consultas que pueden degradarse con volúmenes altos de datos:

**Consulta 1 — Exportación de valorización en PDF** (`ReporteController::exportar` con reporte='valorizacion'):
```php
Producto::with('categoria:id,nombre')
    ->where('activo', true)
    ->orderBy('nombre')
    ->limit(2000)
    ->get();
```
Usa `limit(2000)`, lo cual es seguro hasta ~2000 productos. Si el catálogo crece a 10,000 productos, la carga de 10,000 modelos Eloquent en memoria puede exceder el límite de PHP (típicamente 128MB-256MB). Se recomienda usar `chunkById()` para procesamiento iterativo:

```php
Producto::with('categoria:id,nombre')
    ->where('activo', true)
    ->orderBy('nombre')
    ->chunkById(500, function ($productos) use (&$acumulador) {
        $acumulador = array_merge($acumulador, $productos->toArray());
    });
```

**Consulta 2 — Exportación de movimientos en PDF**:
```php
Movimiento::with(['producto:id,codigo,nombre', 'usuario:id,nombre_completo'])
    ->entreFechas($desde, $hasta)
    ->latest()
    ->limit(2000)
    ->get();
```
Igual riesgo de memoria para 2000+ movimientos con relaciones cargadas.

### 4.3 Redundancia de Consultas en el Dashboard

El método `DashboardController::index()` llama a 5 métodos del servicio:
1. `getStats()` → 2 consultas SQL (productos agregados + movimientos de hoy)
2. `getActividadReciente()` → 1 consulta SQL con joins
3. `getAlertasStock()` → 1 consulta SQL con eager loading
4. `getMovimientosSemana()` → 1 consulta SQL agregada por día
5. `getTopProductos()` → 1 consulta SQL con subquery y join

**Total: 6 consultas por carga de dashboard.** Esto es aceptable para un ERP (no es una API pública), pero se recomienda:

1. **Agrupar consultas de stats** en una sola sentencia SQL para reducir el overhead de 2 consultas a 1. De hecho, `getStats()` ya lo hace bien con `selectRaw` para productos y una consulta separada para movimientos de hoy. Se podría unificar en una sola consulta.
2. **Cachear resultados de stats** con `Cache::remember('dashboard_stats', 300, ...)` porque el dashboard se refresca con frecuencia y las cifras agregadas no cambian cada segundo.
3. **Reducir el límite de actividad reciente** de 8 a 5 registros para minimizar transferencia de datos.

### 4.4 Estado de la Configuración de Vite y Bundle Size

El `package.json` revela varias dependencias que afectan el tamaño del bundle:

| Dependencia | Propósito | Tamaño estimado | ¿Optimizable? |
|---|---|---|---|
| `react-hook-form` + `@hookform/resolvers` + `zod` | Validación de formularios | ~35KB gzipped | Sí: no se usa en ningún JSX; todos los formularios usan `useForm` de Inertia |
| `recharts` | Gráficos del dashboard | ~80KB gzipped | Moderado: se usa en Dashboard.jsx |
| `@headlessui/react` | Componentes accesibles | ~25KB gzipped | Sí: no se usa explícitamente en ningún componente |
| `@heroicons/react` | Iconos alternativos | ~30KB gzipped | Sí: todos los iconos son de lucide-react, no de heroicons |
| `lucide-react` | Iconos | ~50KB gzipped (tree-shakeable) | Correcto: se usa extensivamente |
| `date-fns` | Manipulación de fechas | ~20KB gzipped (tree-shakeable) | Correcto: se usa en formateo |
| `clsx` | Clases condicionales | ~1KB gzipped | Correcto |

**Bundle actual:** ~317KB JS + ~97KB CSS (totales comprimidos). Aunque no es crítico para un ERP interno, se recomienda eliminar `react-hook-form`, `@hookform/resolvers`, `zod`, `@headlessui/react`, y `@heroicons/react` si no están siendo utilizados en ningún punto del código. Esto reduciría el bundle en aproximadamente 90KB gzipped (estimado ~28% del JS total).

---

## 5. ANÁLISIS DE BRECHAS (GAP ANALYSIS) Y ESPECIFICACIÓN DE "OPCIONES FANTASMA"

### 5.1 Módulos de Almacén — Borrado Lógico (SoftDeletes) y Toggles

**Estado Actual:** Solo `notificaciones.usuario_id` tiene `cascadeOnDelete()` y el resto de tablas usa `nullOnDelete()` o `restrictOnDelete()`. Ninguna entidad implementa borrado lógico. Cuando se "elimina" un registro (ej: categoría, producto, proveedor), la fila se borra físicamente de la base de datos.

**Especificación Técnica:**

Para implementar SoftDeletes, se debe modificar la migración de cada tabla relevante agregando `softDeletes()`:

```php
// Migración para agregar SoftDeletes
Schema::table('productos', function (Blueprint $table) {
    $table->softDeletes();
});
Schema::table('categorias', function (Blueprint $table) {
    $table->softDeletes();
});
Schema::table('proveedores', function (Blueprint $table) {
    $table->softDeletes();
});
Schema::table('movimientos_inventario', function (Blueprint $table) {
    $table->softDeletes(); // Para auditoría: no se pierde la trazabilidad
});
Schema::table('users', function (Blueprint $table) {
    $table->softDeletes();
});
```

Y en cada modelo, agregar el trait:
```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use SoftDeletes;
    protected $table = 'productos';
    // ...
}
```

**Impacto en Queries Existentes:**
- Todas las consultas `Producto::where(...)` existentes seguirán funcionando porque SoftDeletes agrega `WHERE deleted_at IS NULL` automáticamente.
- Para reportes históricos que necesiten incluir registros eliminados: `Producto::withTrashed()->where(...)`.
- Para restauración: `Producto::withTrashed()->find($id)->restore()`.

**Toggles Activo/Inactivo:**
Actualmente, `activo` es un booleano en cada tabla. Si se implementa SoftDeletes, el flujo de "desactivación" (toggle activo/inactivo) y "eliminación" (SoftDeletes) deben mantenerse como dos operaciones distintas:
- **Desactivar:** Cambia `activo = false`. El registro permanece visible para consultas administrativas pero se oculta de dropdowns y reportes funcionales (los scopes `activo()` ya implementan esto).
- **Eliminar:** Marca `deleted_at` con timestamp. El registro desaparece de todas las consultas excepto `withTrashed()`.

### 5.2 Panel de Configuración — Especificación Técnica para las 5 Pestañas

**Estado Actual:** El componente `Configuracion.jsx` es enteramente una fachada frontend. Las secciones "Notificaciones", "Seguridad", "Apariencia" y "General" almacenan estado en `useState` de React sin persistencia a servidor. La sección "Mi Perfil" permite cambiar contraseña (funcional) pero no modificar nombre, email ni avatar.

**Especificación para cada pestaña:**

**5.2.1 Ajustes Generales**
- **Tabla necesaria:** `configuraciones` con estructura `(id, clave unique, valor, tipo, created_at, updated_at)`.
- **API RESTful:** `GET /api/configuraciones` → lista de pares clave/valor; `PUT /api/configuraciones/{clave}` → actualiza valor.
- **Variables a persistir:**
  - `nombre_sistema` (string, default 'INVENTEX')
  - `moneda_simbolo` (string, default 'S/')
  - `locale` (string, default 'es-PE')
  - `limite_stock_critico` (integer, default 5)
- **Backend:** Servicio `ConfiguracionService` con cache de 1 hora para reducir queries.
- **Frontend:** Formulario con `useForm`, campos editables para administrador, solo lectura para empleado.

**5.2.2 Mi Perfil**
- **Datos editables:** `nombre_completo`, `email`, `avatar_url`.
- **Endpoint:** `PUT /api/perfil` en `AuthController` (o un nuevo `PerfilController`).
- **Validación:** Email único excepto el propio usuario. Avatar como URL o subida de archivo (Multipart).
- **Frontend:** Ya implementado pero read-only. Modificar para que `nombre_completo` y `email` sean campos editables. `avatar_url` como un input file + preview con carga a storage local o S3.

**5.2.3 Notificaciones por Stock Crítico**
- **Tabla necesaria:** Ampliar el modelo de usuario con campos de preferencias, o una tabla `preferencias_notificacion`:
  - `(id, usuario_id FK, tipo_notificacion string, activo boolean, canal string['email','sistema'])`
- **Comportamiento:** Cuando un movimiento dispara la alerta de stock bajo (en `MovimientoController::inertiaStore`), verificar las preferencias del usuario antes de crear la notificación y decidir si enviar email (usando `Mail::queue()`).
- **Fachada actual:** Los toggles en `Configuracion.jsx` (stock_bajo, movimientos, sistema, email) solo modifican estado local de React y no persisten. La implementación requiere:
  1. Migración de tabla.
  2. Seed con valores por defecto para usuarios existentes.
  3. Controlador con CRUD de preferencias.
  4. Integración con sistema de colas (Laravel Jobs) para envío de emails.

**5.2.4 Seguridad/Permisos**
- **Funcionalidad actual:** Solo muestra información de cuenta (rol, email, fechas). El cambio de contraseña funciona correctamente.
- **Mejoras necesarias:**
  - Listado de sesiones activas (token management) usando `personal_access_tokens` con opción de revocación.
  - Log de actividad (nueva tabla `actividad_log`) que registre eventos de seguridad: inicios de sesión, cambios de contraseña, intentos fallidos.
  - Política de contraseñas: mínimo de caracteres, requerimiento de mayúsculas/números/símbolos (configurable desde General).

**5.2.5 Apariencia (Persistencia del Tema)**
- **Estado actual:** El tema (claro/oscuro) se persiste en `localStorage` mediante `useRemember` de Inertia y efecto secundario en `AuthenticatedLayout.jsx`. También hay un toggle duplicado en `Configuracion.jsx` que hace lo mismo pero sin `useRemember`.
- **Problemas técnicos:**
  1. `useRemember` persiste en `localStorage` con clave `theme-preference`, pero el toggle de `Configuracion.jsx` usa `setItem('theme', ...)` con otra clave. Hay inconsistencia de claves aunque funcionalmente operan sobre el mismo `localStorage.theme`.
  2. No hay persistencia en BD del tema. Si un usuario cambia de dispositivo, el tema vuelve a claro (default).
- **Solución recomendada:**
  - Agregar campo `tema` (string: 'light'|'dark'|'system') a la tabla `users`.
  - En el middleware `HandleInertiaRequests`, compartir el tema del usuario como prop.
  - El frontend aplica el tema según: `user.tema ?? localStorage.theme ?? 'light'`.
  - PATCH `/api/perfil/tema` para actualizar.

### 5.3 Módulos Reportes — Estado Actual

Los reportes (Movimientos por período, Top Productos, Valorización, Alertas de Reposición) están completamente implementados con exportación a Excel (Laravel Excel) y PDF (Barryvdh\DomPDF). Las rutas de exportación existen en `routes/web.php:49`. La página Inertia `Reportes.jsx` renderiza los filtros y desencadena la descarga. **No se encontraron bugs funcionales en este módulo.**

Sin embargo, la exportación PDF usa `limit(2000)` que podría fallar con datasets grandes. Ver Sección 4.2.

---

## 6. MATRIZ DE RIESGOS, PRIORIZACIÓN Y HOJA DE RUTA (ROADMAP FASE 2)

### 6.1 Matriz de Riesgos

| ID | Hallazgo | Criticidad | Impacto Técnico | Esfuerzo Estimado | Dependencias |
|---|---|---|---|---|---|
| C-01 | Doble hashing de contraseñas (Bug 3.4) | **Crítica** | Alto — Autenticación rota para nuevos usuarios | 1 hora | Ninguna |
| C-02 | Formularios CRUD sin feedback de error (Bug 3.1) | **Crítica** | Alto — Usuarios no pueden editar registros | 4 horas (completado) | Ninguna |
| C-03 | Ruptura SPA por respuestas JSON planas (Bug 3.2) | **Crítica** | Alto — App se detiene en producción | 2 horas | Controladores |
| C-04 | `cascadeOnDelete` en movimientos por producto delete | **Alta** | Medio — Pérdida de trazabilidad de auditoría | 2 horas | Migración + ProductoController |
| C-05 | Sidebar superposición y ghost space (Bug 3.3) | **Alta** | Medio — Experiencia de usuario degradada | 3 horas | CSS + Layout |
| C-06 | Falta de índices en `categoria_id` y `proveedor_id` | **Alta** | Medio — Degradación con >5000 productos | 1 hora | Migración |
| C-07 | ENUM en `movimientos.tipo` sin capacidad de extensión | **Media** | Bajo — Dificulta agregar nuevos tipos | 3 horas | Migración + Controladores |
| C-08 | SoftDeletes no implementado en entidades transaccionales | **Media** | Medio — Riesgo de pérdida de datos históricos | 6 horas | Migraciones + Modelos |
| C-09 | Panel de Configuración sin backend (fachada) | **Media** | Medio — 4 de 5 secciones inoperativas | 20 horas | Base de datos + API + Frontend |
| C-10 | Dependencias no utilizadas (`react-hook-form`, `zod`, `@headlessui/react`, `@heroicons/react`) | **Baja** | Bajo — ~90KB de bundle innecesario | 1 hora | package.json + limpieza |
| C-11 | Falta de `chunkById` en exportaciones PDF masivas | **Baja** | Bajo — Riesgo de timeout con >2000 registros | 2 horas | ReporteController |
| C-12 | Falta de creación de notificaciones al toggle activo de productos | **Baja** | Bajo — Inconsistencia en el sistema de alertas | 1 hora | MovimientoController |

### 6.2 Hoja de Ruta Fase 2 — Priorización

**Fase 2A — Corrección Inmediata (Semana 1)**
| Orden | ID | Acción | Responsable |
|---|---|---|---|
| 1 | C-01 | Eliminar `Hash::make()` de controladores y confiar en cast `hashed` del modelo User | Backend |
| 2 | C-04 | Cambiar `cascadeOnDelete()` a `restrictOnDelete()` en `movimientos_inventario.producto_id`. Agregar verificación en `ProductoController::inertiaDestroy` | Backend |
| 3 | C-03 | Modificar `AuthController::cambiarPassword` para retornar respuestas Inertia cuando `X-Inertia` esté presente | Backend |
| 4 | C-05 | Reestructurar layout: sidebar fixed permanente con `lg:ml-60` en main | Frontend |

**Fase 2B — Consolidación Estructural (Semana 2-3)**
| Orden | ID | Acción | Responsable |
|---|---|---|---|
| 5 | C-06 | Migración para agregar índices FALTANTES | Backend/DB |
| 6 | C-08 | Migraciones + Models para SoftDeletes en todas las tablas transaccionales | Backend |
| 7 | C-07 | Migrar ENUM a tabla `tipos_movimiento` con FK | Backend/DB |

**Fase 2C — Features Habilitantes (Semanas 4-6)**
| Orden | ID | Acción | Responsable |
|---|---|---|---|
| 8 | C-09 | Implementar backend completo para Configuración (tabla, servicio, controlador, rutas) | Full Stack |
| 9 | C-11 | Refactorizar ReporteController con chunkById y colas asíncronas | Backend |
| 10 | C-10 | Limpiar dependencias no utilizadas | Frontend |

### 6.3 Recomendaciones de Arquitectura

**Middleware de Roles:**
El sistema actual usa `RoleMiddleware` (en `app/Http/Middleware/RoleMiddleware.php`) que verifica el campo `rol` del usuario. Esto es funcional pero primitivo. Se recomienda migrar a un sistema de **permisos por acciones** (no por roles estáticos):

```php
// Ejemplo de gates en App\Providers\AuthServiceProvider
Gate::define('view-reportes', fn (User $user) => $user->rol === 'administrador');
Gate::define('manage-users', fn (User $user) => $user->rol === 'administrador');
Gate::define('create-movimientos', fn (User $user) => in_array($user->rol, ['administrador', 'empleado']));
```

La fachada de middleware en rutas se simplificaría:
```php
Route::middleware(['auth:sanctum', 'can:manage-users'])->group(function () { ... });
```

**Laravel Queues para Procesamiento Asíncrono:**
Las exportaciones de reportes (especialmente PDF) deben desacoplarse en Jobs encolados:

```php
class ExportarReporteJob implements ShouldQueue
{
    public function handle(): void
    {
        // Generar archivo en storage temporal
        // Enviar notificación al usuario con link de descarga
    }
}
```

Esto evitaría timeouts HTTP para reportes con grandes volúmenes de datos y mejoraría la experiencia de usuario (el reporte se genera en segundo plano y se notifica al completarse).

**Caché Distribuida:**
Reemplazar `Cache::remember()` con Redis/Tagged Cache para evitar invalidación manual de `Cache::forget('categorias_activas')` cada vez que se modifica una categoría:

```php
// Opción con tags (Redis requerido)
Cache::tags(['categorias', 'productos'])->remember('categorias_activas', 3600, fn () => ...);

// Invalidación por tag
Cache::tags('categorias')->flush();
```

**Pruebas Automatizadas:**
No se encontraron archivos de test en el código base. Se recomienda implementar:
- PHPUnit Feature Tests para cada controlador Inertia (verificar redirecciones y flashes).
- PHPUnit Unit Tests para servicios (`DashboardService`, `ProductoService`, `NotificationService`).
- Laravel Dusk o Playwright para pruebas E2E del flujo CRUD y login.

### 6.4 Conclusión

El sistema INVENTEX presenta una base arquitectónica sólida con buenas prácticas en Eloquent ORM (uso mayoritario de Eager Loading, tipos de datos correctos para campos financieros, índice compuesto en tablas de alta carga). Los bugs críticos identificados (C-01, C-02, C-03, C-04) son corregibles en un sprint de 3-5 días hábiles. Las brechas funcionales en Configuración y la ausencia de SoftDeletes representan deuda técnica que debe abordarse en la Fase 2B/2C para garantizar la madurez del sistema como ERP corporativo. La hoja de ruta propuesta prioriza la corrección de bugs de seguridad y funcionalidad crítica antes de abordar mejoras de arquitectura y nuevas funcionalidades.

---

**Fin del Informe de Auditoría Integral.**

*Documento generado el 16 de Junio de 2026. Clasificación: Confidencial.*
