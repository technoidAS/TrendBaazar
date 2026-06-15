using System;
using System.Collections.Generic;
using System.Linq;
using ecommerce_backend.Models;

namespace ecommerce_backend.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Auto-create database if it doesn't exist
        context.Database.EnsureCreated();

        // 1. Seed Users
        if (!context.Users.Any())
        {
            var adminUser = new User
            {
                Id = "usr_admin",
                Name = "Admin Manager",
                Phone = "9999999999",
                Role = "admin",
                Email = "admin@trendbaazar.com",
                Avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
                Address = "TrendBaazar Admin HQ, New Delhi, 110001",
                Addresses = new List<AddressBook>
                {
                    new() { Id = "addr_admin_1", Name = "Admin HQ", Phone = "9999999999", Address = "TrendBaazar Admin HQ, New Delhi, 110001" }
                }
            };

            var customerUser = new User
            {
                Id = "usr_1",
                Name = "Alex Trendsetter",
                Phone = "+1 (555) 019-2834",
                Role = "customer",
                Email = "test@trendbaazar.com",
                Avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
                Address = "142 Cyberpunk Ave, Floor 12, Neo City, NC 94012",
                Addresses = new List<AddressBook>
                {
                    new() { Id = "addr_1", Name = "Alex Trendsetter (Home)", Phone = "+1 (555) 019-2834", Address = "142 Cyberpunk Ave, Floor 12, Neo City, NC 94012" },
                    new() { Id = "addr_2", Name = "Alex Office HQ", Phone = "+1 (555) 019-2834", Address = "99 Tech Plaza, Suite 400, Silicon Valley, CA 94025" }
                }
            };

            context.Users.AddRange(adminUser, customerUser);
            context.SaveChanges();
        }

        // 2. Seed Products to reach exact counts: Apparel: 14, Footwear: 9, Gadgets: 22, Accessories: 12 (Total: 57)
        if (!context.Products.Any())
        {
            var products = new List<Product>();

            // --- Base 8 Seed Products ---
            products.Add(new Product
            {
                Id = "prod_1",
                Name = "Quantum Flux Sneakers",
                Price = 9999,
                Category = "footwear",
                Brand = "AeroFlux",
                Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.8,
                ReviewCount = 124,
                Description = "Elevate your stride with the Quantum Flux Sneakers. Engineered with kinetic cushioning, high-traction honeycomb outsoles, and breathable mesh fabric.",
                Features = new List<string> { "Responsive kinetic foam midsole", "Breathable aerodynamic mesh outer" },
                Sizes = new List<string> { "7", "8", "9", "10", "11" },
                Colors = new List<string> { "Electric Purple", "Carbon Black" },
                Stock = 15,
                Featured = true
            });

            products.Add(new Product
            {
                Id = "prod_2",
                Name = "Cyberpunk Techwear Jacket",
                Price = 14500,
                Category = "apparel",
                Brand = "NeoTech",
                Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.6,
                ReviewCount = 98,
                Description = "Designed for the modern urban nomad. This techwear jacket boasts a waterproof, wind-resistant outer shell with integrated tactical utility straps.",
                Features = new List<string> { "Triple-layered waterproof membrane", "Quick-access tactical pockets" },
                Sizes = new List<string> { "S", "M", "L", "XL" },
                Colors = new List<string> { "Neon Matte Black", "Ghost Gray" },
                Stock = 8,
                Featured = true
            });

            products.Add(new Product
            {
                Id = "prod_3",
                Name = "Aether Noise-Canceling Headphones",
                Price = 19999,
                Category = "gadgets",
                Brand = "Aether",
                Image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.9,
                ReviewCount = 231,
                Description = "Immerse yourself in acoustic perfection. Featuring custom-tuned 40mm drivers and premium Hybrid Active Noise Cancellation.",
                Features = new List<string> { "Hybrid Active Noise Cancellation", "Ultra-comfort memory foam earcups" },
                Sizes = new List<string> { "One Size" },
                Colors = new List<string> { "Midnight Ash", "Sunset Copper" },
                Stock = 22,
                Featured = true
            });

            products.Add(new Product
            {
                Id = "prod_4",
                Name = "Chronos Kinetic Smartwatch",
                Price = 15999,
                Category = "gadgets",
                Brand = "Chronos",
                Image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.5,
                ReviewCount = 84,
                Description = "Merge kinetic movement with digital innovation. The Chronos smartwatch monitors heart rate, blood oxygen levels, and sleep.",
                Features = new List<string> { "Always-On AMOLED sapphire display", "7-day battery life on a single charge" },
                Sizes = new List<string> { "40mm", "44mm" },
                Colors = new List<string> { "Liquid Platinum", "Stealth Obsidian" },
                Stock = 12,
                Featured = false
            });

            products.Add(new Product
            {
                Id = "prod_5",
                Name = "Vaporwave Neon Backpack",
                Price = 4999,
                Category = "accessories",
                Brand = "VaporWare",
                Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.7,
                ReviewCount = 63,
                Description = "Add a splash of neon nostalgia to your outfit. Made of light-reactive, color-shifting iridescent vinyl with spacious compartments.",
                Features = new List<string> { "Color-shifting iridescent coating", "Padded laptop sleeve (up to 16 inches)" },
                Sizes = new List<string> { "Standard" },
                Colors = new List<string> { "Neon Holographic" },
                Stock = 20,
                Featured = false
            });

            products.Add(new Product
            {
                Id = "prod_6",
                Name = "Hyperion Leather Boots",
                Price = 12999,
                Category = "footwear",
                Brand = "Zenith",
                Image = "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.4,
                ReviewCount = 42,
                Description = "Rugged build meets elegant tailoring. Hand-crafted from top-grain water-resistant leather with reinforced welt stitching.",
                Features = new List<string> { "Premium top-grain cowhide leather", "Goodyear welted sole constructions" },
                Sizes = new List<string> { "8", "9", "10", "11", "12" },
                Colors = new List<string> { "Cacao Brown", "Midnight Black" },
                Stock = 6,
                Featured = false
            });

            products.Add(new Product
            {
                Id = "prod_7",
                Name = "Spectrum RGB Mechanical Keyboard",
                Price = 8999,
                Category = "gadgets",
                Brand = "Apex",
                Image = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.8,
                ReviewCount = 156,
                Description = "Unlock maximum efficiency and tactile feedback. Transparent hot-swappable mechanical switches with custom dampening.",
                Features = new List<string> { "Hot-swappable linear switches", "Wireless 2.4GHz / Bluetooth 5.0" },
                Sizes = new List<string> { "75% Layout", "Full Layout" },
                Colors = new List<string> { "Frosted Ice", "Cyber Yellow" },
                Stock = 11,
                Featured = true
            });

            products.Add(new Product
            {
                Id = "prod_8",
                Name = "Nebula Oversized Hoodie",
                Price = 5999,
                Category = "apparel",
                Brand = "VaporWare",
                Image = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
                Images = new List<string> { "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80" },
                Rating = 4.7,
                ReviewCount = 112,
                Description = "Indulge in cozy outer space aesthetics. Cosmic swirl print crafted from double-faced loopback heavyweight cotton fleece.",
                Features = new List<string> { "450GSM organic cotton fleece", "Oversized comfort drop-shoulder cut" },
                Sizes = new List<string> { "XS", "S", "M", "L", "XL" },
                Colors = new List<string> { "Galaxy Teal", "Supernova Pink" },
                Stock = 14,
                Featured = true
            });

            // --- Dynamic Padding Mock Catalog Data ---
            var categoryTargets = new Dictionary<string, int>
            {
                { "apparel", 14 },
                { "footwear", 9 },
                { "gadgets", 22 },
                { "accessories", 12 }
            };

            var brands = new[] { "AeroFlux", "NeoTech", "Aether", "VaporWare", "Chronos", "Zenith", "Apex" };

            var mockNames = new Dictionary<string, string[]>
            {
                { "apparel", new[] { "Hyperlight Windbreaker", "Thermal Utility Cargoes", "Stealth Compression Tee", "Phantom Trench Coat", "Glitch Graphic Tee", "Aether Knit Sweater", "Apex Bomber Jacket", "Carbon Trackpants", "Nebula Fleece Vest", "Zenith Parka Hoodie", "Eclipse Linen Shirt", "Nova Active Shorts" } },
                { "footwear", new[] { "Apex Running Shoes", "Nebula Trail Sneakers", "Stealth High-tops", "Vapor Trainer Kicks", "Zenith Slip-ons", "Nova Streetwear Creepers", "Chronos Canvas Lows" } },
                { "gadgets", new[] { "AeroFlux Earbuds", "NeoTech Cyber Mouse", "Apex VR Goggles", "Nebula Smart Band", "Zenith Wireless Speaker", "Chronos Charging Pad", "Quantum Game Controller", "Stealth Keycap Set", "Aether Lap Desk", "Apex USB Hub", "NeoTech Ring Tracker", "Vaporware RGB Pad", "Chronos Desk Mat", "Quantum Webcam HD", "Stealth Microphone", "Nebula Audio Mixer", "Zenith Cable Organizer", "AeroFlux Laptop Stand", "Aether Bluetooth Dongle" } },
                { "accessories", new[] { "Zenith Tech Backpack", "Carbon Cardholder Wallet", "Nebula Polarized Sunglasses", "AeroFlux Snapback Cap", "Stealth Utility Belt", "Chronos Steel Ring", "Apex Travel Pouch", "NeoTech Key Organizer", "Vaporware Wrist Strap", "Aether Leather Cuff", "Quantum Duffle Bag" } }
            };

            var mockImages = new Dictionary<string, string[]>
            {
                { "apparel", new[] { "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1515438040742-147ed2140c5b?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80" } },
                { "footwear", new[] { "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80" } },
                { "gadgets", new[] { "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1622445262465-2481c8573250?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1597484211625-27a9cfdf9742?w=600&auto=format&fit=crop&q=80" } },
                { "accessories", new[] { "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1627124765135-565b50d540cf?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1624222247344-550fb8ec2780?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" } }
            };

            foreach (var category in categoryTargets.Keys)
            {
                var currentCount = products.Count(p => p.Category == category);
                var target = categoryTargets[category];
                var needed = target - currentCount;

                for (int i = 0; i < needed; i++)
                {
                    var name = mockNames[category][i];
                    var image = mockImages[category][i];
                    var brand = brands[i % brands.Length];
                    var price = Math.Round((double)(1500 + (i * 1100) % 18000) / 100) * 100 + 99;

                    var ratingOptions = new[] { 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 };
                    var rating = ratingOptions[(i + category.Length) % ratingOptions.Length];
                    var reviewCount = 15 + (i * 27) % 250;

                    var sizes = category == "apparel"
                        ? new List<string> { "S", "M", "L", "XL" }
                        : (category == "footwear" ? new List<string> { "8", "9", "10", "11" } : new List<string> { "Standard" });

                    products.Add(new Product
                    {
                        Id = $"prod_gen_{category}_{i + 1}",
                        Name = name,
                        Price = price,
                        Category = category,
                        Brand = brand,
                        Image = image,
                        Images = new List<string> { image },
                        Rating = rating,
                        ReviewCount = reviewCount,
                        Description = $"Premium grade {name} engineered with high-tech materials. Made by {brand}.",
                        Features = new List<string> { "High durability tactical construction", "Advanced ergonomic premium finish" },
                        Sizes = sizes,
                        Colors = new List<string> { "Carbon Black", "Neon Teal" },
                        Stock = 5 + (i * 7) % 25,
                        Featured = false
                    });
                }
            }

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
