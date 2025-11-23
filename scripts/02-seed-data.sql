-- Seed data for NEXOVENTIS
-- Run after creating tables

-- Insert sample products
INSERT INTO products (name, description, category, current_stock, min_stock, max_stock, unit_price, cost_price, supplier) VALUES
('Coca Cola 2L', 'Bebida gaseosa', 'Bebidas', 24, 10, 50, 35.00, 25.00, 'Coca Cola FEMSA'),
('Pan Blanco', 'Pan de caja blanco', 'Panadería', 8, 15, 30, 42.00, 32.00, 'Bimbo'),
('Leche Entera 1L', 'Leche entera pasteurizada', 'Lácteos', 15, 12, 40, 28.00, 22.00, 'Alpura'),
('Huevo Blanco 12 pzas', 'Docena de huevos blancos', 'Abarrotes', 20, 10, 60, 45.00, 38.00, 'Bachoco'),
('Arroz 1kg', 'Arroz blanco grano largo', 'Abarrotes', 30, 15, 80, 25.00, 18.00, 'Verde Valle'),
('Frijol 1kg', 'Frijol negro', 'Abarrotes', 25, 15, 60, 28.00, 20.00, 'La Costeña'),
('Aceite Vegetal 1L', 'Aceite vegetal comestible', 'Abarrotes', 12, 8, 40, 38.00, 28.00, 'Capullo'),
('Papel Higiénico 4 rollos', 'Papel higiénico doble hoja', 'Limpieza', 18, 10, 50, 35.00, 25.00, 'Suavel'),
('Jabón de tocador', 'Jabón antibacterial', 'Limpieza', 22, 12, 60, 15.00, 10.00, 'Palmolive'),
('Detergente 1kg', 'Detergente en polvo', 'Limpieza', 14, 10, 40, 48.00, 35.00, 'Ariel');

-- Insert sample customers
INSERT INTO customers (name, phone, address, credit_limit, current_debt) VALUES
('María González', '5551234567', 'Calle Principal #123', 500.00, 150.00),
('Juan Pérez', '5559876543', 'Avenida Central #456', 300.00, 280.00),
('Ana Martínez', '5555555555', 'Calle Secundaria #789', 400.00, 120.00),
('Carlos López', '5552223333', 'Boulevard Norte #321', 600.00, 0.00);

-- Insert sample sales
INSERT INTO sales (sale_date, total_amount, payment_method, status) VALUES
(NOW(), 105.00, 'cash', 'completed'),
(NOW() - INTERVAL '1 day', 150.00, 'card', 'completed'),
(NOW() - INTERVAL '2 days', 85.00, 'cash', 'completed');
