-- Insert mock listings data for all categories
INSERT INTO listings (title, description, price, category, location, contact_email, image_url) VALUES

-- Vehicles
('2018 Honda Civic', 'Well-maintained Honda Civic with low mileage. Great fuel economy and reliable transportation.', 18500.00, 'vehicles', 'San Francisco, CA', 'john.doe@email.com', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'),
('2020 Ford F-150', 'Powerful pickup truck perfect for work and recreation. Excellent condition with all maintenance records.', 32000.00, 'vehicles', 'Austin, TX', 'mike.wilson@email.com', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'),
('2019 Tesla Model 3', 'Electric vehicle with autopilot features. Clean title, single owner, garage kept.', 28000.00, 'vehicles', 'Los Angeles, CA', 'sarah.tech@email.com', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'),

-- Property Rentals
('Cozy 2BR Apartment', 'Beautiful apartment in downtown area with modern amenities. Pet-friendly building with gym access.', 2200.00, 'property-rentals', 'Seattle, WA', 'landlord.properties@email.com', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'),
('Studio Loft', 'Spacious studio with high ceilings and exposed brick. Perfect for young professionals.', 1800.00, 'property-rentals', 'Portland, OR', 'city.rentals@email.com', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'),
('3BR House with Yard', 'Family-friendly house with large backyard and garage. Great neighborhood with good schools.', 3500.00, 'property-rentals', 'Denver, CO', 'family.homes@email.com', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'),

-- Apparel
('Designer Leather Jacket', 'Genuine leather jacket from premium brand. Size Medium, barely worn. Perfect for fall/winter.', 180.00, 'apparel', 'New York, NY', 'fashion.lover@email.com', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop'),
('Vintage Denim Collection', 'Collection of vintage Levi''s jeans in various sizes. Great condition, authentic vintage pieces.', 120.00, 'apparel', 'Chicago, IL', 'vintage.collector@email.com', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop'),
('Running Shoes Nike', 'Brand new Nike running shoes, size 10. Never worn, still in original box with tags.', 85.00, 'apparel', 'Miami, FL', 'sneaker.head@email.com', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'),

-- Electronics
('iPhone 14 Pro', 'Unlocked iPhone 14 Pro in excellent condition. Includes original charger and case.', 750.00, 'electronics', 'San Jose, CA', 'tech.seller@email.com', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop'),
('Gaming Laptop', 'High-performance gaming laptop with RTX graphics. Perfect for gaming and content creation.', 1200.00, 'electronics', 'Phoenix, AZ', 'gamer.pro@email.com', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop'),
('4K Smart TV', '55-inch 4K Smart TV with HDR support. Excellent picture quality, barely used.', 450.00, 'electronics', 'Las Vegas, NV', 'home.theater@email.com', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'),

-- Entertainment
('Electric Guitar', 'Fender Stratocaster electric guitar with amplifier. Great for beginners or experienced players.', 380.00, 'entertainment', 'Nashville, TN', 'music.maker@email.com', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'),
('Board Game Collection', 'Large collection of modern board games including Settlers of Catan, Ticket to Ride, and more.', 150.00, 'entertainment', 'Boston, MA', 'board.gamer@email.com', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop'),
('Vinyl Record Collection', 'Rare vinyl records from the 70s and 80s. Includes classic rock and jazz albums in mint condition.', 280.00, 'entertainment', 'Detroit, MI', 'vinyl.collector@email.com', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'),

-- Family
('Baby Stroller', 'Lightweight baby stroller with multiple recline positions. Easy to fold and transport.', 120.00, 'family', 'Orlando, FL', 'new.parents@email.com', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop'),
('Kids Bike', 'Children''s bicycle with training wheels. Perfect for ages 4-7, adjustable seat height.', 65.00, 'family', 'San Diego, CA', 'family.fun@email.com', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'),
('High Chair', 'Adjustable high chair for toddlers. Easy to clean with removable tray and safety harness.', 45.00, 'family', 'Atlanta, GA', 'baby.gear@email.com', 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&h=600&fit=crop'),

-- Free Stuff
('Moving Boxes', 'Free moving boxes in various sizes. Clean and sturdy, perfect for your next move.', 0.00, 'free-stuff', 'Houston, TX', 'free.giver@email.com', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'),
('Plant Cuttings', 'Free plant cuttings from my garden. Various succulents and houseplants available.', 0.00, 'free-stuff', 'Sacramento, CA', 'plant.lover@email.com', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop'),
('Old Magazines', 'Collection of magazines from 2020-2022. Various topics including home decor and cooking.', 0.00, 'free-stuff', 'Minneapolis, MN', 'magazine.reader@email.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'),

-- Garden & Outdoor
('Patio Furniture Set', 'Complete outdoor dining set with table and 6 chairs. Weather-resistant and comfortable.', 320.00, 'garden-outdoor', 'Tampa, FL', 'outdoor.living@email.com', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop'),
('Garden Tools', 'Complete set of garden tools including shovels, rakes, and pruning shears. Barely used.', 85.00, 'garden-outdoor', 'Portland, OR', 'green.thumb@email.com', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop'),
('BBQ Grill', 'Gas BBQ grill with side burner. Perfect for backyard cookouts and family gatherings.', 180.00, 'garden-outdoor', 'Kansas City, MO', 'grill.master@email.com', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop'),

-- Hobbies
('Art Supplies', 'Professional art supplies including paints, brushes, and canvases. Perfect for aspiring artists.', 95.00, 'hobbies', 'Santa Fe, NM', 'artist.supplies@email.com', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'),
('Photography Equipment', 'DSLR camera with multiple lenses and accessories. Great for photography enthusiasts.', 650.00, 'hobbies', 'San Francisco, CA', 'photo.pro@email.com', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'),
('Craft Supplies', 'Large collection of crafting materials including yarn, fabric, and sewing supplies.', 75.00, 'hobbies', 'Asheville, NC', 'craft.lover@email.com', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=600&fit=crop'),

-- Home Goods
('Dining Table Set', 'Beautiful wooden dining table with 4 matching chairs. Perfect for small dining rooms.', 280.00, 'home-goods', 'Richmond, VA', 'home.decorator@email.com', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
('Area Rug', 'Large Persian-style area rug in excellent condition. Adds warmth and style to any room.', 150.00, 'home-goods', 'Charleston, SC', 'interior.design@email.com', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
('Kitchen Appliances', 'Set of small kitchen appliances including blender, toaster, and coffee maker. All in working order.', 120.00, 'home-goods', 'Nashville, TN', 'kitchen.chef@email.com', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'),

-- Home Improvement
('Power Tools', 'Collection of power tools including drill, saw, and sanders. Perfect for DIY projects.', 220.00, 'home-improvement', 'Dallas, TX', 'diy.builder@email.com', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop'),
('Paint Supplies', 'Various paint colors and supplies for interior painting. Includes brushes and rollers.', 65.00, 'home-improvement', 'Phoenix, AZ', 'home.painter@email.com', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop'),
('Tile Collection', 'Leftover ceramic tiles from bathroom renovation. Various colors and patterns available.', 45.00, 'home-improvement', 'Albuquerque, NM', 'tile.installer@email.com', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'),

-- Home Sales
('3BR Colonial House', 'Beautiful colonial home with updated kitchen and bathrooms. Great neighborhood with good schools.', 485000.00, 'home-sales', 'Raleigh, NC', 'real.estate.agent@email.com', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'),
('Modern Condo', 'Luxury condo with city views and modern amenities. Perfect for urban professionals.', 320000.00, 'home-sales', 'Austin, TX', 'condo.seller@email.com', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'),
('Starter Home', 'Perfect starter home for first-time buyers. Move-in ready with recent updates.', 185000.00, 'home-sales', 'Oklahoma City, OK', 'first.home@email.com', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'),

-- Musical Instruments
('Piano Keyboard', '88-key digital piano with weighted keys. Perfect for learning or professional use.', 450.00, 'musical-instruments', 'New Orleans, LA', 'piano.player@email.com', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop'),
('Drum Set', 'Complete drum set with cymbals and hardware. Great for beginners or experienced drummers.', 380.00, 'musical-instruments', 'Memphis, TN', 'drum.beats@email.com', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'),
('Acoustic Guitar', 'Beautiful acoustic guitar with case. Perfect tone and comfortable to play.', 220.00, 'musical-instruments', 'Austin, TX', 'guitar.strings@email.com', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'),

-- Office Supplies
('Office Desk', 'Large executive desk with drawers. Perfect for home office or professional workspace.', 180.00, 'office-supplies', 'Charlotte, NC', 'office.worker@email.com', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
('Ergonomic Chair', 'Comfortable office chair with lumbar support. Adjustable height and armrests.', 120.00, 'office-supplies', 'Indianapolis, IN', 'desk.job@email.com', 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop'),
('Filing Cabinet', 'Metal filing cabinet with lock. Perfect for organizing important documents.', 65.00, 'office-supplies', 'Columbus, OH', 'organized.office@email.com', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'),

-- Pet Supplies
('Dog Crate', 'Large dog crate suitable for medium to large breeds. Foldable and easy to transport.', 85.00, 'pet-supplies', 'San Antonio, TX', 'dog.lover@email.com', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop'),
('Cat Tree', 'Multi-level cat tree with scratching posts and hiding spots. Perfect for indoor cats.', 95.00, 'pet-supplies', 'Jacksonville, FL', 'cat.parent@email.com', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=600&fit=crop'),
('Fish Tank Setup', 'Complete aquarium setup with filter, heater, and decorations. Perfect for tropical fish.', 120.00, 'pet-supplies', 'Fort Worth, TX', 'fish.keeper@email.com', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),

-- Sporting Goods
('Mountain Bike', 'High-quality mountain bike with 21 speeds. Perfect for trail riding and outdoor adventures.', 320.00, 'sporting-goods', 'Boulder, CO', 'mountain.rider@email.com', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'),
('Golf Clubs', 'Complete set of golf clubs with bag. Perfect for beginners or intermediate players.', 180.00, 'sporting-goods', 'Scottsdale, AZ', 'golf.pro@email.com', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop'),
('Kayak', 'Single-person kayak with paddle. Great for lakes and calm rivers. Lightweight and stable.', 280.00, 'sporting-goods', 'Lake Tahoe, CA', 'water.sports@email.com', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'),

-- Toys & Games
('LEGO Collection', 'Large collection of LEGO sets and loose pieces. Perfect for creative building projects.', 150.00, 'toys-games', 'Madison, WI', 'lego.builder@email.com', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=600&fit=crop'),
('Video Game Console', 'Gaming console with controllers and popular games. Perfect for family entertainment.', 220.00, 'toys-games', 'Milwaukee, WI', 'video.gamer@email.com', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop'),
('Dollhouse', 'Beautiful wooden dollhouse with furniture. Perfect for imaginative play and decoration.', 85.00, 'toys-games', 'Des Moines, IA', 'toy.collector@email.com', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=600&fit=crop');
