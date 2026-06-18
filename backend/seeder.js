require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Product } = require('./models');

const PRODUCTS = [
  // Electronics
  { name: 'Apple iPhone 15 Pro', description: 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.', price: 79999, category: 'Electronics', brand: 'Apple', stock: 50, rating: 4.8, numReviews: 230, isFeatured: true, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500' },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Flagship Android phone with 200MP camera and S Pen support.', price: 69999, category: 'Electronics', brand: 'Samsung', stock: 40, rating: 4.7, numReviews: 185, isFeatured: true, image: 'https://images.unsplash.com/photo-1706439091900-a7fe8adcdf26?w=500' },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling with exceptional sound quality.', price: 22999, category: 'Electronics', brand: 'Sony', stock: 75, rating: 4.9, numReviews: 412, isFeatured: true, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500' },
  { name: 'MacBook Air M3', description: '15-inch MacBook Air with M3 chip — blazing fast, fanless design.', price: 114900, category: 'Electronics', brand: 'Apple', stock: 30, rating: 4.9, numReviews: 98, isFeatured: true, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
  { name: 'iPad Pro 12.9"', description: 'Supercharged by M2 chip with Liquid Retina XDR display.', price: 89900, category: 'Electronics', brand: 'Apple', stock: 25, rating: 4.8, numReviews: 67, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
  { name: 'Dell XPS 15 Laptop', description: 'Premium laptop with OLED display, Intel Core i9 and RTX 4070.', price: 159999, category: 'Electronics', brand: 'Dell', stock: 15, rating: 4.6, numReviews: 55, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500' },

  // Fashion
  { name: 'Nike Air Max 270', description: 'Lifestyle shoe with large Max Air unit for all-day comfort.', price: 7995, category: 'Fashion', brand: 'Nike', stock: 120, rating: 4.5, numReviews: 340, isFeatured: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { name: 'Levi\'s 511 Slim Jeans', description: 'Classic slim fit jeans in premium stretch denim.', price: 3499, category: 'Fashion', brand: 'Levi\'s', stock: 200, rating: 4.4, numReviews: 520, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
  { name: 'Ray-Ban Aviator Classic', description: 'Iconic polarized sunglasses with gold frame and green lenses.', price: 6490, category: 'Fashion', brand: 'Ray-Ban', stock: 80, rating: 4.7, numReviews: 290, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500' },
  { name: 'Adidas Ultraboost 22', description: 'Running shoes with responsive BOOST cushioning.', price: 8999, category: 'Fashion', brand: 'Adidas', stock: 90, rating: 4.6, numReviews: 210, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500' },

  // Home & Kitchen
  { name: 'Instant Pot Duo 7-in-1', description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, and more.', price: 8999, category: 'Home & Kitchen', brand: 'Instant Pot', stock: 60, rating: 4.8, numReviews: 1200, isFeatured: true, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500' },
  { name: 'Dyson V15 Detect Vacuum', description: 'Cordless vacuum with laser dust detection and HEPA filtration.', price: 49999, category: 'Home & Kitchen', brand: 'Dyson', stock: 20, rating: 4.7, numReviews: 88, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500' },
  { name: 'Nespresso Vertuo Coffee Machine', description: 'Premium coffee machine with centrifusion extraction technology.', price: 12999, category: 'Home & Kitchen', brand: 'Nespresso', stock: 45, rating: 4.6, numReviews: 320, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' },

  // Books
  { name: 'Atomic Habits - James Clear', description: 'An easy and proven way to build good habits and break bad ones.', price: 499, category: 'Books', brand: 'Penguin', stock: 300, rating: 4.9, numReviews: 2400, isFeatured: true, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500' },
  { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', price: 399, category: 'Books', brand: 'Harriman House', stock: 250, rating: 4.8, numReviews: 1800, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500' },

  // Sports
  { name: 'Yoga Mat Pro', description: 'Non-slip, eco-friendly yoga mat with alignment lines — 6mm thick.', price: 1299, category: 'Sports', brand: 'Liforme', stock: 150, rating: 4.5, numReviews: 380, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500' },
  { name: 'Fitbit Charge 6', description: 'Advanced fitness tracker with GPS, heart rate, and sleep tracking.', price: 14999, category: 'Sports', brand: 'Fitbit', stock: 70, rating: 4.4, numReviews: 165, isFeatured: true, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500' },

  // Beauty
  { name: 'The Ordinary Hyaluronic Acid', description: 'Hydration support formula with HA of three molecular weights.', price: 699, category: 'Beauty', brand: 'The Ordinary', stock: 500, rating: 4.6, numReviews: 890, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500' },
  { name: 'Philips Lumea IPL Hair Removal', description: 'Permanent hair removal device with SenseIQ technology.', price: 29999, category: 'Beauty', brand: 'Philips', stock: 35, rating: 4.3, numReviews: 125, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500' },

  // Toys
  { name: 'LEGO Technic Bugatti Chiron', description: '3,599-piece LEGO Technic set with working W16 engine and gearbox.', price: 17999, category: 'Toys', brand: 'LEGO', stock: 25, rating: 4.9, numReviews: 310, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500' },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅  DB connected and synced.');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@shopnow.com' },
      defaults: { name: 'Admin User', email: 'admin@shopnow.com', password: adminPassword, role: 'admin' },
    });
    console.log(adminCreated ? '✅  Admin user created.' : '✅  Admin user already exists.');

    // Create demo customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const [customer, customerCreated] = await User.findOrCreate({
      where: { email: 'customer@shopnow.com' },
      defaults: { name: 'Demo Customer', email: 'customer@shopnow.com', password: customerPassword, role: 'customer' },
    });
    console.log(customerCreated ? '✅  Customer user created.' : '✅  Customer user already exists.');

    // Seed products
    let created = 0;
    for (const p of PRODUCTS) {
      const [, wasCreated] = await Product.findOrCreate({ where: { name: p.name }, defaults: p });
      if (wasCreated) created++;
    }
    console.log(`✅  ${created} products seeded (${PRODUCTS.length - created} already existed).`);

    console.log('\n🎉  Seeding complete!');
    console.log('   Admin    → admin@shopnow.com / admin123');
    console.log('   Customer → customer@shopnow.com / customer123');
    process.exit(0);
  } catch (error) {
    console.error('❌  Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
