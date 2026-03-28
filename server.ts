import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";
import db from "./server/db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin' && req.user?.email !== 'pfenil903@gmail.com') {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };

  // --- Auth Routes ---
  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 10);
      const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
      const info = stmt.run(name, email, hash);
      const token = jwt.sign({ id: info.lastInsertRowid, email, role: 'user', name }, JWT_SECRET);
      res.json({ token, user: { id: info.lastInsertRowid, name, email, role: 'user' } });
    } catch (error: any) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user: any = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  });

  // --- Product Routes ---
  app.get("/api/products", (req, res) => {
    const category = req.query.category as string;
    let products;
    if (category && category !== 'All') {
      products = db.prepare('SELECT * FROM products WHERE category = ? ORDER BY createdAt DESC').all(category);
    } else {
      products = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
    }
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", authenticateToken, requireAdmin, (req, res) => {
    const { name, description, price, stock, category, image } = req.body;
    const stmt = db.prepare('INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(name, description, price, stock, category, image);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/products/:id", authenticateToken, requireAdmin, (req, res) => {
    const { name, description, price, stock, category, image } = req.body;
    const stmt = db.prepare('UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image=? WHERE id=?');
    stmt.run(name, description, price, stock, category, image, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/products/:id", authenticateToken, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // --- Order Routes ---
  app.get("/api/orders", authenticateToken, requireAdmin, (req, res) => {
    const orders: any[] = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    for (let order of orders) {
      order.items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
      order.address = JSON.parse(order.address || '{}');
    }
    res.json(orders);
  });

  app.put("/api/orders/:id/status", authenticateToken, requireAdmin, (req, res) => {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/stats", authenticateToken, requireAdmin, (req, res) => {
    const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const ordersCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const revenue = db.prepare('SELECT SUM(total) as total FROM orders').get() as any;
    
    const recentOrders: any[] = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5').all();
    for (let order of recentOrders) {
      order.address = JSON.parse(order.address || '{}');
    }

    res.json({
      products: productsCount.count,
      orders: ordersCount.count,
      revenue: revenue.total || 0,
      recentOrders
    });
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", authenticateToken, async (req: any, res: any) => {
    const { items, successUrl, cancelUrl, address } = req.body;

    try {
      // Create order in DB as pending
      const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const orderStmt = db.prepare('INSERT INTO orders (userId, total, status, address) VALUES (?, ?, ?, ?)');
      const orderInfo = orderStmt.run(req.user.id, total, 'pending', JSON.stringify(address));
      
      const itemStmt = db.prepare('INSERT INTO order_items (orderId, productId, quantity, price, name, image) VALUES (?, ?, ?, ?, ?, ?)');
      for (const item of items) {
        itemStmt.run(orderInfo.lastInsertRowid, item.id, item.quantity, item.price, item.name, item.image);
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: orderInfo.lastInsertRowid.toString(),
      });

      res.json({ id: session.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
