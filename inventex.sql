-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-06-2026 a las 02:33:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventex`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `icono` varchar(50) NOT NULL DEFAULT 'Package',
  `color` varchar(7) NOT NULL DEFAULT '#2563eb',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `icono`, `color`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Lácteos y Huevos', 'Productos lácteos, huevos y derivados refrigerados', 'Milk', '#f472b6', 1, '2026-06-17 04:04:10', '2026-06-17 04:04:10'),
(2, 'Snacks y Golosinas', 'Botanas, dulces, chocolates y frutos secos', 'Candy', '#eab308', 1, '2026-06-17 04:04:10', '2026-06-17 04:04:10'),
(3, 'Cuidado Personal', 'Higiene personal, cosméticos y cuidado de la piel', 'Sparkles', '#a855f7', 1, '2026-06-17 04:04:10', '2026-06-17 04:04:10'),
(4, 'Mascotas', 'Alimento y accesorios para perros y gatos', 'Cat', '#f97316', 1, '2026-06-17 04:04:10', '2026-06-17 04:04:10'),
(5, 'Cocina y Hogar', 'Utensilios de cocina, organización y limpieza del hogar', 'Home', '#06b6d4', 1, '2026-06-17 04:04:10', '2026-06-17 04:04:10'),
(6, 'Ferretería', 'Herramientas eléctricas, manuales y accesorios', 'Hammer', '#dc2626', 1, '2026-06-17 04:04:10', '2026-06-17 04:04:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuraciones`
--

CREATE TABLE `configuraciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `clave` varchar(150) NOT NULL,
  `valor` text DEFAULT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_categorias_table', 1),
(5, '0001_01_01_000004_create_proveedores_table', 1),
(6, '0001_01_01_000005_create_productos_table', 1),
(7, '0001_01_01_000006_create_movimientos_inventario_table', 1),
(8, '0001_01_01_000007_create_notificaciones_table', 1),
(9, '2026_06_16_040140_create_personal_access_tokens_table', 1),
(10, '2026_06_16_051645_add_precios_momento_to_movimientos_inventario_table', 1),
(11, '2026_06_16_120000_alter_movimientos_inventario_foreign_key', 1),
(12, '2026_06_16_130000_create_configuraciones_table', 1),
(13, '2026_06_16_130001_add_configuraciones_to_users_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` enum('entrada','salida','ajuste') NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `stock_anterior` int(11) NOT NULL,
  `stock_nuevo` int(11) NOT NULL,
  `precio_compra_momento` decimal(10,2) DEFAULT NULL,
  `precio_venta_momento` decimal(10,2) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `movimientos_inventario`
--

INSERT INTO `movimientos_inventario` (`id`, `producto_id`, `usuario_id`, `tipo`, `cantidad`, `stock_anterior`, `stock_nuevo`, `precio_compra_momento`, `precio_venta_momento`, `motivo`, `referencia`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'entrada', 200, 0, 200, 3.80, 5.50, 'Compra a proveedor', 'OC-2026-001', NULL, '2026-05-19 14:00:58', NULL),
(2, 2, 2, 'entrada', 60, 0, 60, 6.50, 9.90, 'Compra a proveedor', 'OC-2026-001', NULL, '2026-05-19 14:10:15', NULL),
(3, 5, 2, 'entrada', 30, 0, 30, 11.00, 16.50, 'Compra a proveedor', 'OC-2026-001', NULL, '2026-05-19 14:20:28', NULL),
(4, 6, 2, 'entrada', 250, 0, 250, 3.20, 5.00, 'Compra a proveedor', 'OC-2026-002', NULL, '2026-05-20 16:00:54', NULL),
(5, 7, 2, 'entrada', 180, 0, 180, 1.90, 3.20, 'Compra a proveedor', 'OC-2026-002', NULL, '2026-05-20 16:15:54', NULL),
(6, 14, 2, 'entrada', 250, 0, 250, 3.50, 5.90, 'Compra a proveedor', 'OC-2026-003', NULL, '2026-05-21 13:30:08', NULL),
(7, 24, 3, 'entrada', 12, 0, 12, 85.00, 139.00, 'Compra a proveedor', 'OC-2026-003', NULL, '2026-05-21 14:00:05', NULL),
(8, 3, 2, 'entrada', 40, 0, 40, 8.20, 12.50, 'Compra a proveedor', 'OC-2026-004', NULL, '2026-05-25 15:00:45', NULL),
(9, 4, 2, 'entrada', 80, 0, 80, 5.00, 7.80, 'Compra a proveedor', 'OC-2026-004', NULL, '2026-05-25 15:15:07', NULL),
(10, 8, 2, 'entrada', 50, 0, 50, 7.00, 11.50, 'Compra a proveedor', 'OC-2026-005', NULL, '2026-05-27 19:00:03', NULL),
(11, 1, 3, 'salida', 20, 200, 180, 3.80, 5.50, 'Venta', 'V-2026-001', NULL, '2026-05-28 16:30:27', NULL),
(12, 6, 3, 'salida', 40, 250, 210, 3.20, 5.00, 'Venta', 'V-2026-002', NULL, '2026-05-28 20:00:05', NULL),
(13, 7, 2, 'salida', 30, 180, 150, 1.90, 3.20, 'Venta al por mayor', 'V-2026-003', NULL, '2026-05-29 15:45:03', NULL),
(14, 11, 2, 'entrada', 70, 0, 70, 12.00, 19.90, 'Compra a proveedor', 'OC-2026-006', NULL, '2026-06-01 14:30:37', NULL),
(15, 12, 2, 'entrada', 150, 0, 150, 4.80, 7.50, 'Compra a proveedor', 'OC-2026-006', NULL, '2026-06-01 15:00:13', NULL),
(16, 16, 2, 'entrada', 30, 0, 30, 55.00, 79.00, 'Compra a proveedor', 'OC-2026-007', NULL, '2026-06-02 16:00:59', NULL),
(17, 17, 2, 'entrada', 15, 0, 15, 42.00, 62.00, 'Compra a proveedor', 'OC-2026-007', NULL, '2026-06-02 16:15:50', NULL),
(18, 18, 2, 'entrada', 60, 0, 60, 8.00, 13.00, 'Compra a proveedor', 'OC-2026-008', NULL, '2026-06-03 13:00:31', NULL),
(19, 2, 3, 'salida', 15, 60, 45, 6.50, 9.90, 'Venta', 'V-2026-004', NULL, '2026-06-07 15:00:23', NULL),
(20, 3, 3, 'salida', 12, 40, 28, 8.20, 12.50, 'Venta', 'V-2026-005', NULL, '2026-06-07 20:20:50', NULL),
(21, 4, 2, 'salida', 18, 80, 62, 5.00, 7.80, 'Venta', 'V-2026-006', NULL, '2026-06-08 21:00:28', NULL),
(22, 10, 3, 'salida', 20, 20, 0, 9.00, 14.00, 'Venta al por mayor', 'V-2026-007', NULL, '2026-06-09 16:10:42', NULL),
(23, 9, 3, 'entrada', 100, 0, 100, 4.50, 7.00, 'Compra a proveedor', 'OC-2026-010', NULL, '2026-06-09 14:00:10', NULL),
(24, 14, 2, 'salida', 50, 250, 200, 3.50, 5.90, 'Venta al por mayor', 'V-2026-008', NULL, '2026-06-10 19:30:32', NULL),
(25, 5, 3, 'salida', 26, 30, 4, 11.00, 16.50, 'Venta al por mayor', 'V-2026-009', NULL, '2026-06-11 14:45:17', NULL),
(26, 8, 2, 'salida', 15, 50, 35, 7.00, 11.50, 'Venta', 'V-2026-010', NULL, '2026-06-12 15:15:59', NULL),
(27, 11, 3, 'salida', 15, 70, 55, 12.00, 19.90, 'Venta', 'V-2026-011', NULL, '2026-06-13 21:00:17', NULL),
(28, 12, 3, 'salida', 30, 150, 120, 4.80, 7.50, 'Venta', 'V-2026-012', NULL, '2026-06-13 21:30:42', NULL),
(29, 23, 2, 'entrada', 15, 0, 15, 15.00, 24.00, 'Compra a proveedor', 'OC-2026-011', NULL, '2026-06-14 15:00:26', NULL),
(30, 13, 3, 'salida', 18, 25, 7, 9.50, 15.00, 'Venta', 'V-2026-013', NULL, '2026-06-14 20:10:54', NULL),
(31, 15, 2, 'entrada', 30, 0, 30, 22.00, 34.00, 'Compra a proveedor', 'OC-2026-012', NULL, '2026-06-15 14:00:39', NULL),
(32, 23, 3, 'salida', 15, 15, 0, 15.00, 24.00, 'Venta al por mayor', 'V-2026-014', NULL, '2026-06-15 19:20:32', NULL),
(33, 16, 3, 'salida', 8, 30, 22, 55.00, 79.00, 'Venta', 'V-2026-015', NULL, '2026-06-16 14:05:17', NULL),
(34, 18, 2, 'salida', 20, 60, 40, 8.00, 13.00, 'Venta', 'V-2026-016', NULL, '2026-06-16 15:30:37', NULL),
(35, 9, 2, 'salida', 12, 100, 88, 4.50, 7.00, 'Venta', 'V-2026-019', NULL, '2026-06-16 21:45:54', NULL),
(36, 25, 2, 'entrada', 10, 0, 10, 32.00, 52.00, 'Compra a proveedor', 'OC-2026-014', NULL, '2026-06-16 13:00:18', NULL),
(37, 26, 2, 'entrada', 15, 0, 15, 18.00, 29.00, 'Compra a proveedor', 'OC-2026-014', NULL, '2026-06-16 13:15:21', NULL),
(38, 24, 3, 'salida', 4, 12, 8, 85.00, 139.00, 'Venta', 'V-2026-020', NULL, '2026-06-16 22:00:27', NULL),
(39, 25, 3, 'salida', 7, 10, 3, 32.00, 52.00, 'Venta', 'V-2026-022', NULL, '2026-06-16 22:45:44', NULL),
(40, 26, 3, 'salida', 3, 15, 12, 18.00, 29.00, 'Venta', 'V-2026-023', NULL, '2026-06-16 23:00:57', NULL),
(41, 13, 2, 'entrada', 25, 0, 25, 9.50, 15.00, 'Ajuste de inventario', 'AJ-2026-001', NULL, '2026-06-13 13:00:39', NULL),
(42, 10, 2, 'entrada', 20, 0, 20, 9.00, 14.00, 'Ajuste de inventario', 'AJ-2026-002', NULL, '2026-06-08 14:00:22', NULL),
(43, 15, 3, 'salida', 15, 30, 15, 22.00, 34.00, 'Venta', 'V-2026-024', NULL, '2026-06-16 23:30:54', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tipo` enum('stock_bajo','movimiento','sistema','alerta') NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario_id`, `tipo`, `titulo`, `mensaje`, `leida`, `created_at`, `updated_at`) VALUES
(1, 1, 'sistema', 'Sistema INVENTEX iniciado', 'Sistema actualizado correctamente. Versión 2.0.0', 1, '2026-05-20 04:04:12', '2026-05-21 04:04:12'),
(2, 1, 'movimiento', 'Compra registrada: OC-2026-001', 'Se registró compra de Leche Entera, Yogurt Natural y Huevos por S/ 1,183.00', 1, '2026-05-20 04:04:12', '2026-05-20 04:04:12'),
(3, 1, 'movimiento', 'Compra registrada: OC-2026-002', 'Se registraron 430 unidades de snacks y galletas', 1, '2026-05-21 04:04:12', '2026-05-21 04:04:12'),
(4, 1, 'sistema', 'Reporte semanal disponible', 'El reporte de movimientos de la semana ya está disponible.', 1, '2026-05-24 04:04:12', '2026-05-24 04:04:12'),
(5, 1, 'stock_bajo', 'Stock crítico: Huevos de Granja x30', 'Quedan 4 cajas (mínimo 20). Reposición urgente.', 0, '2026-06-12 04:04:12', '2026-06-12 04:04:12'),
(6, 1, 'stock_bajo', 'Stock agotado: Mix Frutos Secos 200g', 'Producto agotado. 0 unidades en stock.', 0, '2026-06-10 04:04:12', '2026-06-10 04:04:12'),
(7, 1, 'stock_bajo', 'Stock bajo: Desodorante Spray 150ml', 'Quedan 7 unidades (mínimo 15).', 0, '2026-06-15 04:04:12', '2026-06-15 04:04:12'),
(8, 1, 'stock_bajo', 'Stock agotado: Filtro de Agua Repuesto', 'Producto agotado. 0 unidades en stock.', 0, '2026-06-16 04:04:12', '2026-06-16 04:04:12'),
(9, 1, 'stock_bajo', 'Stock bajo: Sierra Manual Profesional', 'Quedan 3 unidades (mínimo 5).', 0, '2026-06-17 04:04:12', '2026-06-17 04:04:12'),
(10, 1, 'movimiento', 'Venta registrada: V-2026-015', 'Se vendieron 8 bolsas de Alimento Perro Adulto por S/ 632.00.', 0, '2026-06-17 04:04:12', '2026-06-17 04:04:12'),
(11, 1, 'movimiento', 'Venta registrada: V-2026-016', 'Se vendieron 20 bolsas de Arena Sanitaria por S/ 260.00.', 0, '2026-06-17 04:04:12', '2026-06-17 04:04:12'),
(12, 1, 'movimiento', 'Nueva compra: OC-2026-014', 'Se registró compra de Sierra Manual y Cautín de Soldadura.', 0, '2026-06-17 04:04:12', '2026-06-17 04:04:12'),
(13, 1, 'movimiento', 'Ajuste: AJ-2026-001', 'Se ajustó inventario de Desodorante Spray (+25 unidades).', 0, '2026-06-14 04:04:12', '2026-06-14 04:04:12'),
(14, 1, 'sistema', 'Backup completado', 'Copia de seguridad diaria realizada con éxito.', 0, '2026-06-16 04:04:12', '2026-06-16 04:04:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_compra` decimal(10,2) NOT NULL DEFAULT 0.00,
  `precio_venta` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock_actual` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 5,
  `unidad_medida` varchar(30) NOT NULL DEFAULT 'unidad',
  `imagen_url` varchar(500) DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED DEFAULT NULL,
  `proveedor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `codigo`, `nombre`, `descripcion`, `precio_compra`, `precio_venta`, `stock_actual`, `stock_minimo`, `unidad_medida`, `imagen_url`, `categoria_id`, `proveedor_id`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'LEC-001', 'Leche Entera 1L', 'Leche fresca pasteurizada, bolsa 1 litro', 3.80, 5.50, 180, 30, 'unidad', NULL, 1, 1, 1, NULL, NULL),
(2, 'LEC-002', 'Yogurt Natural 1Kg', 'Yogurt natural sin azúcar, envase 1 kilogramo', 6.50, 9.90, 45, 12, 'unidad', NULL, 1, 1, 1, NULL, NULL),
(3, 'LEC-003', 'Queso Fresco 500g', 'Queso fresco pasteurizado, bloque 500 gramos', 8.20, 12.50, 28, 10, 'unidad', NULL, 1, 1, 1, NULL, NULL),
(4, 'LEC-004', 'Mantequilla 250g', 'Mantequilla de crema de leche, barra 250 gramos', 5.00, 7.80, 62, 15, 'unidad', NULL, 1, 2, 1, NULL, NULL),
(5, 'LEC-005', 'Huevos de Granja x30', 'Huevos de gallina libres de jaula, caja 30 unidades', 11.00, 16.50, 4, 20, 'caja', NULL, 1, 1, 1, NULL, NULL),
(6, 'SNC-001', 'Papas Fritas 150g', 'Papas fritas sabor original, bolsa 150 gramos', 3.20, 5.00, 210, 40, 'unidad', NULL, 2, 1, 1, NULL, NULL),
(7, 'SNC-002', 'Galletas de Soda x4', 'Galletas de soda livianas, paquete 4 unidades', 1.90, 3.20, 150, 30, 'paquete', NULL, 2, 1, 1, NULL, NULL),
(8, 'SNC-003', 'Chocolate 70% Cacao 100g', 'Chocolate oscuro 70% cacao, tableta 100 gramos', 7.00, 11.50, 35, 15, 'unidad', NULL, 2, 2, 1, NULL, NULL),
(9, 'SNC-004', 'Chicles Menta x50', 'Chicles de menta sin azúcar, frasco 50 unidades', 4.50, 7.00, 88, 20, 'frasco', NULL, 2, 2, 1, NULL, NULL),
(10, 'SNC-005', 'Mix Frutos Secos 200g', 'Mezcla de almendras, nueces y pasas, bolsa 200 gramos', 9.00, 14.00, 0, 10, 'unidad', NULL, 2, 1, 1, NULL, NULL),
(11, 'CUI-001', 'Shampoo Reparador 400ml', 'Shampoo para cabello dañado, botella 400 ml', 12.00, 19.90, 55, 10, 'unidad', NULL, 3, 2, 1, NULL, NULL),
(12, 'CUI-002', 'Jabón Líquido 250ml', 'Jabón líquido antibacterial, botella 250 ml', 4.80, 7.50, 120, 25, 'unidad', NULL, 3, 2, 1, NULL, NULL),
(13, 'CUI-003', 'Desodorante Spray 150ml', 'Desodorante en spray protección 48h, 150 ml', 9.50, 15.00, 7, 15, 'unidad', NULL, 3, 2, 1, NULL, NULL),
(14, 'CUI-004', 'Crema Dental 120g', 'Pasta dental blanqueadora con flúor, tubo 120 gramos', 3.50, 5.90, 200, 30, 'unidad', NULL, 3, 2, 1, NULL, NULL),
(15, 'CUI-005', 'Protector Solar 200ml', 'Protector solar FPS 50 resistente al agua, 200 ml', 22.00, 34.00, 15, 8, 'unidad', NULL, 3, 2, 1, NULL, NULL),
(16, 'MAS-001', 'Alimento Perro Adulto 15Kg', 'Alimento balanceado para perro adulto, bolsa 15 kilogramos', 55.00, 79.00, 22, 5, 'bolsa', NULL, 4, 3, 1, NULL, NULL),
(17, 'MAS-002', 'Alimento Gato Esterilizado 7Kg mas', 'Alimento para gato esterilizado, bolsa 7 kilogramos', 42.00, 62.00, 10, 4, 'bolsa', NULL, 4, 3, 1, NULL, '2026-06-17 04:33:50'),
(18, 'MAS-003', 'Arena Sanitaria Gato 5Kg', 'Arena sanitaria aglomerante para gato, bolsa 5 kilogramos', 8.00, 13.00, 40, 10, 'bolsa', NULL, 4, 3, 1, NULL, NULL),
(19, 'MAS-004', 'Snacks Perro Premiun 250g', 'Snacks naturales para perro, bolsa 250 gramos', 6.50, 10.00, 33, 8, 'unidad', NULL, 4, 3, 1, NULL, NULL),
(20, 'COC-001', 'Sartén Antiadherente 28cm', 'Sartén de aluminio con recubrimiento antiadherente, 28 cm', 28.00, 45.00, 14, 6, 'unidad', NULL, 5, 4, 1, NULL, NULL),
(21, 'COC-002', 'Juego Cubiertos x24', 'Juego de cubiertos de acero inoxidable, 24 piezas', 35.00, 55.00, 5, 5, 'juego', NULL, 5, 4, 1, NULL, NULL),
(22, 'COC-003', 'Bolsas de Basura x50', 'Bolsas para basura resistentes 60 litros, paquete 50 unidades', 4.20, 6.80, 75, 20, 'paquete', NULL, 5, 4, 1, NULL, NULL),
(23, 'COC-004', 'Filtro de Agua Repuesto', 'Cartucho filtrante para jarra purificadora, repuesto estándar', 15.00, 24.00, 0, 10, 'unidad', NULL, 5, 4, 1, NULL, NULL),
(24, 'FER-001', 'Taladro Eléctrico 600W', 'Taladro percutor 600W con mandril sin llave, 13mm', 85.00, 139.00, 8, 4, 'unidad', NULL, 6, 4, 1, NULL, NULL),
(25, 'FER-002', 'Sierra Manual Profesional', 'Sierra de arco profesional con hoja bimetal 12 pulgadas', 32.00, 52.00, 3, 5, 'unidad', NULL, 6, 4, 1, NULL, NULL),
(26, 'FER-003', 'Cautín de Soldadura 30W', 'Cautín para soldadura eléctrica 30W con punta de repuesto', 18.00, 29.00, 12, 5, 'unidad', NULL, 6, 4, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `contacto` varchar(150) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `sitio_web` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `contacto`, `telefono`, `email`, `direccion`, `ruc`, `sitio_web`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Comercializadora Andina S.A.C.', 'Ana Torres', '+51 998 111 222', 'ventas@comercializadoraandina.pe', 'Av. La Marina 340, Pueblo Libre, Lima', '20111222333', 'https://comercializadoraandina.pe', 1, '2026-06-17 04:04:11', '2026-06-17 04:04:11'),
(2, 'Importaciones del Pacífico S.A.', 'Diego Lumbreras', '+51 997 654 000', 'compras@importpacifico.com', 'Jr. Amazonas 567, Miraflores, Lima', '20444555222', 'https://importpacifico.com', 1, '2026-06-17 04:04:11', '2026-06-17 04:04:11'),
(3, 'Distribuidora Pets & Co E.I.R.L', 'Carmen Flores', '+51 996 333 444', 'pedidos@petsandco.pe', 'Calle Los Olivos 123, San Isidro, Lima', '20777888999', NULL, 1, '2026-06-17 04:04:11', '2026-06-17 04:40:15'),
(4, 'Industrial del Hogar S.A.', 'Ricardo Guerra', '+51 995 222 111', 'info@industrialhogar.com', 'Carretera Central Km 14, Ate, Lima', '20333444555', 'https://industrialhogar.com', 1, '2026-06-17 04:04:11', '2026-06-17 04:04:11'),
(5, 'Continental', 'Continet.com', '999 999 999', 'cusco@continental.edu.pe', 'cusco', NULL, NULL, 1, '2026-06-17 05:21:35', '2026-06-17 05:21:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'empleado',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `avatar_url` varchar(500) DEFAULT NULL,
  `tema` varchar(20) NOT NULL DEFAULT 'light',
  `preferencias_notificaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferencias_notificaciones`)),
  `ultimo_login` datetime DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre_completo`, `email`, `password`, `rol`, `activo`, `avatar_url`, `tema`, `preferencias_notificaciones`, `ultimo_login`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Carlos Mendoza', 'admin@inventex.com', '$2y$12$Ov8r.MKIBUz7l4oSByXWNOClvT4YEvlgV7yDtrWt.vanQVGU5az2W', 'administrador', 1, 'https://i.pravatar.cc/150?img=12', 'light', NULL, '2026-06-16 23:36:46', NULL, '2026-06-17 03:42:50', '2026-06-17 04:37:06'),
(2, 'María García', 'maria@inventex.com', '$2y$12$frlyKr.UBNcXr47R6Y3VkuQyEcQ9frMDw7/s8IOGByPwmMLOv1Md6', 'empleado', 1, 'https://i.pravatar.cc/150?img=47', 'light', NULL, NULL, NULL, '2026-06-17 03:42:50', '2026-06-17 03:42:50'),
(3, 'Juan Pérez', 'juan@inventex.com', '$2y$12$9ZyV6Lhl57BSDw2f8t29je6vpWE9ig3Hlx9X68HKME89Dw/tRh1Ky', 'empleado', 1, 'https://i.pravatar.cc/150?img=33', 'light', NULL, NULL, NULL, '2026-06-17 03:42:50', '2026-06-17 03:42:50');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categorias_nombre_unique` (`nombre`),
  ADD KEY `categorias_nombre_index` (`nombre`),
  ADD KEY `categorias_activo_index` (`activo`);

--
-- Indices de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `configuraciones_clave_unique` (`clave`),
  ADD KEY `configuraciones_clave_index` (`clave`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movimientos_inventario_producto_id_created_at_index` (`producto_id`,`created_at`),
  ADD KEY `movimientos_inventario_usuario_id_created_at_index` (`usuario_id`,`created_at`),
  ADD KEY `movimientos_inventario_tipo_created_at_index` (`tipo`,`created_at`),
  ADD KEY `movimientos_aggregation_idx` (`created_at`,`tipo`,`cantidad`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notificaciones_usuario_id_leida_index` (`usuario_id`,`leida`),
  ADD KEY `notificaciones_tipo_index` (`tipo`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productos_codigo_unique` (`codigo`),
  ADD KEY `productos_categoria_id_foreign` (`categoria_id`),
  ADD KEY `productos_proveedor_id_foreign` (`proveedor_id`),
  ADD KEY `productos_codigo_index` (`codigo`),
  ADD KEY `productos_nombre_index` (`nombre`),
  ADD KEY `productos_activo_index` (`activo`),
  ADD KEY `productos_stock_actual_stock_minimo_index` (`stock_actual`,`stock_minimo`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedores_nombre_index` (`nombre`),
  ADD KEY `proveedores_activo_index` (`activo`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_rol_index` (`rol`),
  ADD KEY `users_activo_index` (`activo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `movimientos_inventario_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `movimientos_inventario_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `productos_proveedor_id_foreign` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
