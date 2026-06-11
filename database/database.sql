-- ============================================================
-- gesCasesRurals - Base de Datos Completa
-- Motor: MySQL 8.x | Codificación: UTF-8
-- ============================================================

CREATE DATABASE IF NOT EXISTS `gescasesrurals`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `gescasesrurals`;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(150) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  `estado` ENUM('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  INDEX `idx_rol` (`rol`),
  INDEX `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: casas
-- ============================================================
CREATE TABLE IF NOT EXISTS `casas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `capacidad` INT NOT NULL,
  `precio` DECIMAL(8,2) NOT NULL,
  `num_habitaciones` INT NOT NULL DEFAULT 2,
  `num_banos` INT NOT NULL DEFAULT 1,
  `metros` INT DEFAULT NULL,
  `servicios` TEXT DEFAULT NULL,
  `estado` ENUM('activa','inactiva','mantenimiento') NOT NULL DEFAULT 'activa',
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nombre` (`nombre`),
  CONSTRAINT `chk_capacidad` CHECK (`capacidad` > 0),
  CONSTRAINT `chk_precio` CHECK (`precio` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: imagenes_casas
-- ============================================================
CREATE TABLE IF NOT EXISTS `imagenes_casas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `casa_id` INT NOT NULL,
  `ruta` VARCHAR(500) NOT NULL,
  `es_principal` TINYINT(1) NOT NULL DEFAULT 0,
  `orden` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_img_casa` FOREIGN KEY (`casa_id`) REFERENCES `casas`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX `idx_img_casa` (`casa_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: reservas
-- ============================================================
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `casa_id` INT NOT NULL,
  `fecha_entrada` DATE NOT NULL,
  `fecha_salida` DATE NOT NULL,
  `num_personas` INT NOT NULL DEFAULT 1,
  `precio_total` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `estado` ENUM('pendiente','aprobada_pendiente_pago','aceptada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
  `observaciones` TEXT DEFAULT NULL,
  `fecha_reserva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_gestion` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_reserva_casa` FOREIGN KEY (`casa_id`) REFERENCES `casas`(`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `chk_fechas` CHECK (`fecha_salida` > `fecha_entrada`),
  CONSTRAINT `chk_personas` CHECK (`num_personas` > 0),
  INDEX `idx_reserva_usuario` (`usuario_id`),
  INDEX `idx_reserva_casa` (`casa_id`),
  INDEX `idx_reserva_estado` (`estado`),
  INDEX `idx_reserva_fechas` (`casa_id`, `fecha_entrada`, `fecha_salida`, `estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: notificaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `mensaje` TEXT NOT NULL,
  `tipo` VARCHAR(50) DEFAULT 'sistema',
  `leida` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX `idx_notif_usuario` (`usuario_id`),
  INDEX `idx_notif_leida` (`usuario_id`, `leida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: logs_admin
-- ============================================================
CREATE TABLE IF NOT EXISTS `logs_admin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `admin_id` INT NOT NULL,
  `accion` VARCHAR(500) NOT NULL,
  `tabla_afectada` VARCHAR(100) DEFAULT NULL,
  `registro_id` INT DEFAULT NULL,
  `ip` VARCHAR(45) DEFAULT NULL,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `usuarios`(`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX `idx_log_admin` (`admin_id`),
  INDEX `idx_log_fecha` (`fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
