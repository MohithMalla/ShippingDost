-- 1. Seed Warehouses (Adding your local Vizag Hub)
INSERT INTO warehouse (name, lat, lng) VALUES ('BLR_Warehouse', 12.99999, 37.923273);
INSERT INTO warehouse (name, lat, lng) VALUES ('MUMB_Warehouse', 11.99999, 27.923273);
INSERT INTO warehouse (name, lat, lng) VALUES ('DEL_Warehouse', 28.7041, 77.1025);
INSERT INTO warehouse (name, lat, lng) VALUES ('HYD_Warehouse', 17.3850, 78.4867);
-- Added: Local Jumbotail Vizag Hub (Gajuwaka)
INSERT INTO warehouse (name, lat, lng) VALUES ('VIZAG_Warehouse', 17.6896, 83.2085); 

-- 2. Seed Kirana Stores (Adding your Elamanchili Store)
INSERT INTO customer (name, phone, lat, lng, tier) VALUES ('Shree Kirana', '9847000000', 11.232, 23.445, 'GOLD');
INSERT INTO customer (name, phone, lat, lng, tier) VALUES ('Andheri Mart', '9101000000', 17.232, 33.445, 'SILVER');
-- Added: Your Elamanchili Store
INSERT INTO customer (name, phone, lat, lng, tier) VALUES ('Elamanchili Mart', '9988776655', 17.5524, 82.8550, 'GOLD');

-- 3. Seed Sellers (Adding a local Vizag Seller)
INSERT INTO seller (name, lat, lng) VALUES ('Nestle Seller', 12.5, 37.5);
INSERT INTO seller (name, lat, lng) VALUES ('Rice Supplier', 13.0, 38.0);
-- Added: Local Seller in Vizag
INSERT INTO seller (name, lat, lng) VALUES ('Vizag Wholesale', 17.7, 83.2);

-- 4. Seed Products
INSERT INTO product (name, weight, category) VALUES ('Maggie 500g', 0.5, 'PERISHABLE');
INSERT INTO product (name, weight, category) VALUES ('Rice Bag 10Kg', 10.0, 'REGULAR');