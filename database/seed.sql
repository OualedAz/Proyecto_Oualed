-- ============================================================
-- gesCasesRurals - Datos de Ejemplo (Seed)
-- Contraseña para todos: Test1234! (hash bcrypt)
-- ============================================================

USE `gescasesrurals`;

-- USUARIOS (hash de "Test1234!" con bcrypt cost 10)
INSERT INTO `usuarios` (`nombre`, `apellidos`, `email`, `telefono`, `password`, `rol`, `estado`) VALUES
('Jordi',     'Puigdomènech Masó',    'admin@gescasesrurals.com',    '972123456', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin',   'activo'),
('Montserrat','Puigdomènech Fontana', 'montse@gescasesrurals.com',   '972123457', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin',   'activo'),
('Joan',      'Garcia Roca',          'joan@email.com',              '600111222', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'activo'),
('Maria',     'Pérez Soler',          'maria@email.com',             '611333444', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'activo'),
('Pere',      'Sala Martínez',        'pere@email.com',              '622555666', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'activo'),
('Anna',      'López Vidal',          'anna@email.com',              '633777888', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'activo'),
('Carles',    'Fernández Pou',        'carles@email.com',            '644999111', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'activo'),
('Núria',     'Bosch Torrent',        'nuria@email.com',             '655222333', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'activo'),
('Marc',      'Riera Puig',           'marc@email.com',              '666444555', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'inactivo'),
('Laura',     'Mas Brugada',          'laura@email.com',             '677555666', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'cliente', 'bloqueado');

-- CASAS RURALES
INSERT INTO `casas` (`nombre`, `descripcion`, `capacidad`, `precio`, `num_habitaciones`, `num_banos`, `metros`, `servicios`, `estado`) VALUES
('Can Noguer',
 'Acogedora masía del siglo XVIII completamente restaurada, rodeada de bosque de robles centenarios. Dispone de chimenea, cocina equipada y jardín privado con barbacoa. Perfecta para familias que buscan la paz de la naturaleza.',
 6, 85.00, 3, 2, 130, 'WiFi,Barbacoa,Jardín,Parking,Cocina equipada,Chimenea,TV,Lavadora', 'activa'),

('Can Alzina',
 'Encantadora casa de piedra situada al pie de la montaña, con vistas espectaculares al valle. Ideal para parejas y familias pequeñas. Dispone de terraza con vistas panorámicas.',
 4, 65.00, 2, 1, 90, 'WiFi,Terraza,Parking,Cocina equipada,TV,Calefacción', 'activa'),

('Can Puigdomènech',
 'La joya del complejo. Gran masía señorial con piscina privada, jardín de verano, sala de juegos y zona BBQ. Perfecta para celebraciones familiares y reuniones de amigos.',
 10, 150.00, 4, 3, 250, 'WiFi,Piscina privada,Barbacoa,Jardín,Parking,Cocina industrial,TV grande,Sala de juegos,Terraza,Lavadora', 'activa'),

('Can Roure',
 'Rústica y auténtica casa rural con todo el encanto de la ruralía catalana. Dispone de huerto orgánico que los huéspedes pueden disfrutar. Experiencia rural única.',
 8, 95.00, 4, 2, 180, 'WiFi,Huerto orgánico,Animales de granja,Cocina de leña,Horno de pan,Barbacoa,Parking', 'activa'),

('Can Oliveres',
 'Lujosa casa rural con spa interior (jacuzzi y sauna), habitación principal de lujo y todas las comodidades de un hotel de 4 estrellas en un entorno natural privilegiado.',
 12, 200.00, 5, 4, 320, 'WiFi,Spa,Jacuzzi,Sauna,Piscina exterior,Barbacoa,Jardín,Parking,Cocina equipada,TV,Lavadora,Minibar', 'activa'),

('La Barraca del Riu',
 'Acogedora y económica opción junto al río, con acceso directo para pescar o bañarse. Sin pretensiones pero con todo lo necesario para una estancia confortable y desconectada.',
 4, 55.00, 2, 1, 75, 'WiFi,Acceso al río,Terraza,Parking,Cocina básica,Barbacoa', 'activa');

-- RESERVAS
INSERT INTO `reservas` (`usuario_id`, `casa_id`, `fecha_entrada`, `fecha_salida`, `num_personas`, `precio_total`, `estado`, `observaciones`, `fecha_reserva`, `fecha_gestion`) VALUES
(3, 1, '2026-07-10', '2026-07-15', 5, 425.00, 'aceptada',   'Aniversario de boda',           '2026-06-01 09:00:00', '2026-06-02 10:30:00'),
(4, 2, '2026-07-20', '2026-07-22', 2, 130.00, 'aceptada',   'Escapada romántica',             '2026-06-05 14:00:00', '2026-06-06 09:00:00'),
(5, 3, '2026-08-01', '2026-08-08', 9, 1050.00,'aceptada',   'Reunión familiar anual',         '2026-06-10 11:00:00', '2026-06-11 08:30:00'),
(6, 4, '2026-08-15', '2026-08-18', 6, 285.00, 'aceptada',   NULL,                             '2026-06-15 20:00:00', '2026-06-16 11:00:00'),
(3, 5, '2026-09-01', '2026-09-05', 8, 800.00, 'aceptada',   'Celebración de graduación',      '2026-06-20 16:00:00', '2026-06-21 09:00:00'),
(4, 1, '2026-08-10', '2026-08-17', 6, 595.00, 'aceptada',   'Vacaciones de verano',           '2026-06-22 10:00:00', '2026-06-23 09:15:00'),
(5, 6, '2026-07-01', '2026-07-04', 3, 165.00, 'aceptada',   'Fin de semana de senderismo',    '2026-06-01 12:00:00', '2026-06-02 08:00:00'),
(8, 3, '2026-09-10', '2026-09-17', 10,1050.00,'aceptada',   'Fiesta 40 años',                 '2026-06-15 09:00:00', '2026-06-16 10:00:00'),
(3, 2, '2026-08-20', '2026-08-23', 2, 195.00, 'pendiente',  'Escapada romántica',             '2026-06-03 19:00:00', NULL),
(6, 4, '2026-09-01', '2026-09-07', 7, 570.00, 'pendiente',  'Nos encanta Can Roure',          '2026-06-04 08:30:00', NULL),
(7, 5, '2026-10-05', '2026-10-10', 10,1000.00,'pendiente',  'Celebración de empresa',         '2026-06-04 11:00:00', NULL),
(5, 1, '2026-07-10', '2026-07-15', 4, 425.00, 'rechazada',  NULL,                             '2026-05-18 16:00:00', '2026-05-19 09:00:00'),
(6, 2, '2026-06-20', '2026-06-22', 2, 130.00, 'rechazada',  NULL,                             '2026-06-01 10:00:00', '2026-06-02 08:30:00'),
(7, 3, '2026-07-15', '2026-07-20', 8, 750.00, 'cancelada',  'Cancelo por motivos personales', '2026-05-25 20:00:00', NULL),
(8, 6, '2026-07-05', '2026-07-07', 3, 110.00, 'cancelada',  NULL,                             '2026-06-01 09:00:00', NULL);

-- NOTIFICACIONES
INSERT INTO `notificaciones` (`usuario_id`, `mensaje`, `tipo`, `leida`) VALUES
(3, 'Tu reserva en Can Noguer ha sido aceptada. ¡Nos vemos pronto!', 'reserva_aceptada', 1),
(4, 'Tu reserva en Can Alzina ha sido aceptada.', 'reserva_aceptada', 1),
(3, 'Tienes una nueva reserva pendiente de revisión en Can Alzina.', 'nueva_reserva', 0),
(1, 'Nueva reserva recibida de Joan Garcia para Can Alzina.', 'nueva_reserva', 0),
(1, 'Nueva reserva recibida de Anna López para Can Roure.', 'nueva_reserva', 0),
(1, 'Nueva reserva recibida de Carles Fernández para Can Oliveres.', 'nueva_reserva', 0);
