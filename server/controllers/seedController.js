const db = require("../config/db");

const seedDatabase = (req, res) => {
  // Demo Products
  const products = [
    {
      name: "Royal Heritage Bridal Lehenga",
      description: "Exquisite hand-embroidered silk bridal lehenga with Zardozi work and matching dupatta.",
      price: 250000.00,
      original_price: 320000.00,
      category: "Wedding Dresses",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
      stock: 5,
      rating: 4.9,
    },
    {
      name: "Bridal Pearl & Emerald Necklace Set",
      description: "24k gold-plated Kundan necklace set encrusted with real freshwater pearls and emerald droplets.",
      price: 45000.00,
      original_price: 58000.00,
      category: "Jewelry",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      stock: 12,
      rating: 4.8,
    },
    {
      name: "Luxury Velvet Floral Stage Decoration Set",
      description: "Complete stage decor setup with artificial rose arches, velvet draping, and LED chandeliers.",
      price: 180000.00,
      original_price: 220000.00,
      category: "Decoration",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      stock: 8,
      rating: 4.9,
    },
    {
      name: "Custom Gold Foil Wedding Invitations (Pack of 100)",
      description: "Premium acrylic invitation cards printed with metallic gold foil and custom wax seals.",
      price: 28000.00,
      original_price: 35000.00,
      category: "Invitations",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      stock: 25,
      rating: 4.7,
    },
    {
      name: "Professional HD Bridal Makeup Palette Kit",
      description: "All-in-one waterproof bridal makeup collection suitable for HD photography & evening events.",
      price: 18500.00,
      original_price: 24000.00,
      category: "Makeup",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      stock: 15,
      rating: 4.8,
    },
    {
      name: "Embroidered Silk Groom Sherwani",
      description: "Tailored ivory silk sherwani featuring subtle dabka embroidery and velvet shawl.",
      price: 135000.00,
      original_price: 165000.00,
      category: "Wedding Dresses",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      stock: 6,
      rating: 4.9,
    },
    {
      name: "Handcrafted Bridal Khussa Shoes",
      description: "Traditional genuine leather khussas embellished with zardozi beads and pearls.",
      price: 8500.00,
      original_price: 11000.00,
      category: "Wedding Shoes",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      stock: 20,
      rating: 4.7,
    },
    {
      name: "Organic Henna / Mehndi Cone Gift Box (12 Cones)",
      description: "100% natural organic Rajasthani henna cones with dark stain guarantee.",
      price: 3500.00,
      original_price: 4500.00,
      category: "Mehndi",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      stock: 50,
      rating: 4.9,
    }
  ];

  // Insert seed products
  db.query("SELECT COUNT(*) AS count FROM products", (err, resCount) => {
    if (!err && resCount[0].count === 0) {
      products.forEach((p) => {
        db.query(
          `INSERT INTO products (name, description, price, original_price, category, image, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.description, p.price, p.original_price, p.category, p.image, p.stock, p.rating]
        );
      });
    }
  });

  // Seed sample Vendor Profiles if empty
  db.query("SELECT COUNT(*) AS count FROM vendor_profiles", (vErr, vCount) => {
    if (!vErr && vCount[0].count === 0) {
      const sampleVendors = [
        ["Elegant Moments Photography", "Cinematic wedding photography, drone coverage, and signature photo albums.", "03001234567", "info@elegantmoments.com", "Gulberg III", "Lahore", 8, "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80", 4.9, 42],
        ["Grand Imperial Marquee", "Luxurious air-conditioned marquee accommodating up to 1500 guests with valet parking.", "03119876543", "booking@grandimperial.com", "DHA Phase 6", "Lahore", 12, "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", 4.8, 56],
        ["Glamour by Sana Makeup Studio", "Celebrity bridal makeup artist specializing in HD airbrush & traditional bridal looks.", "03225554433", "sana@glamourmakeup.com", "F-7 Markaz", "Islamabad", 6, "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80", 4.9, 38],
        ["Royal Banquet Catering", "Authentic Mughlai, Continental, and live BBQ catering services for grand weddings.", "03334441122", "events@royalcatering.com", "Clifton Phase 5", "Karachi", 15, "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80", 4.7, 64]
      ];

      sampleVendors.forEach((v) => {
        db.query(
          `INSERT INTO vendor_profiles (business_name, description, phone, email, address, city, experience_years, profile_image, rating, total_reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          v
        );
      });
    }
  });

  return res.status(200).json({ success: true, message: "Database seeded with initial wedding products & vendors." });
};

module.exports = { seedDatabase };
