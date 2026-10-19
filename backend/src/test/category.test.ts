import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import { Collection } from '../models/category.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    fullName: 'Admin User',
    username: 'adminuser',
    email: 'admin@kaizen.test',
    password: hashedAdminPassword,
    role: 'admin',
  });

  const adminLogin = await request(app).post('/api/v1/user/login').send({
    email: 'admin@kaizen.test',
    password: 'admin123',
  });
  adminToken = adminLogin.body.accessToken;

  // Normal user
  const hashedUserPassword = await bcrypt.hash('user1234', 10);
  await User.create({
    fullName: 'Normal User',
    username: 'normaluser',
    email: 'user@kaizen.test',
    password: hashedUserPassword,
    role: 'user',
  });

  const userLogin = await request(app).post('/api/v1/user/login').send({
    email: 'user@kaizen.test',
    password: 'user1234',
  });
  userToken = userLogin.body.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Category API', () => {
  let createdCategoryId: string;

  describe('POST /api/v1/categories', () => {
    it('should reject unauthorized request without token', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'Wooden Crafts' });
      expect(res.status).toBe(401);
    });

    it('should reject non-admin request', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Wooden Crafts' });
      expect(res.status).toBe(403);
    });

    it('should fail if name is missing or empty', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '   ' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/name is required/i);
    });

    it('should successfully create a new category', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Handmade Metal Art',
          description: 'Exquisite brass and bronze handicrafts',
          imageUrl: 'https://images.unsplash.com/photo-example',
        });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Handmade Metal Art');
      expect(res.body.slug).toBe('handmade-metal-art');
      expect(res.body.description).toBe('Exquisite brass and bronze handicrafts');
      expect(res.body.imageUrl).toBe('https://images.unsplash.com/photo-example');
      expect(res.body.isActive).toBe(true);
      createdCategoryId = res.body._id;
    });

    it('should fail when creating duplicate category name or slug', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Handmade Metal Art',
          description: 'Duplicate',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should fetch all categories', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('slug');
    });

    it('should fetch single category by id or slug', async () => {
      const resById = await request(app).get(`/api/v1/categories/${createdCategoryId}`);
      expect(resById.status).toBe(200);
      expect(resById.body.name).toBe('Handmade Metal Art');

      const resBySlug = await request(app).get('/api/v1/categories/handmade-metal-art');
      expect(resBySlug.status).toBe(200);
      expect(resBySlug.body._id).toBe(createdCategoryId);
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should update an existing category', async () => {
      const res = await request(app)
        .put(`/api/v1/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Metal Art',
          description: 'Updated description',
        });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Metal Art');
      expect(res.body.description).toBe('Updated description');
    });

    it('should fail update with empty name', async () => {
      const res = await request(app)
        .put(`/api/v1/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '  ' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should prevent deletion if products are linked to the category', async () => {
      // Create a product linked to this category
      await Product.create({
        name: 'Brass Diya',
        slug: 'brass-diya',
        description: 'Traditional Diya',
        price: 499,
        mrpPrice: 799,
        category: 'handmade-metal-art',
        collectionId: new mongoose.Types.ObjectId(createdCategoryId),
        storageType: 'Ready to Hang',
        materialType: 'Brass',
        finishType: 'Polished',
        netWeight: 1,
        warrantyMonths: 12,
        dimensions: { length: 10, width: 10, height: 10 },
        sizes: ['Standard'],
        images: ['/api/v1/uploads/products/diya.jpg'],
      });

      const res = await request(app)
        .delete(`/api/v1/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/product\(s\) are assigned to it/i);

      // Clean up linked product
      await Product.deleteMany({ collectionId: createdCategoryId });
    });

    it('should successfully delete category when no products are attached', async () => {
      const res = await request(app)
        .delete(`/api/v1/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);

      // Verify deletion
      const checkRes = await request(app).get(`/api/v1/categories/${createdCategoryId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
