import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let adminId: string;
let productId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create admin user and get token
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({
    fullName: 'Admin User',
    username: 'adminuser',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin',
  });

  const res = await request(app).post('/api/v1/user/login').send({
    email: 'admin@test.com',
    password: 'password123',
  });
  adminToken = res.body.accessToken;
  const profileRes = await request(app)
    .get('/api/v1/user/profile')
    .set('Authorization', `Bearer ${adminToken}`);
  adminId = profileRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product API', () => {
  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify(['Small', 'Medium']))
        .attach('images', Buffer.from('test image'), 'test.jpg');

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Test Product');
      productId = res.body._id;
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("All required fields must be filled");
    });

    it('should fail with negative price', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product Invalid Price')
        .field('description', 'Test Description')
        .field('price', '-100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify(['Small']))
        .attach('images', Buffer.from('test image'), 'test.jpg');
      expect(res.statusCode).toEqual(500); // Mongoose validation error
    });

    it('should fail with negative mrpPrice', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product Invalid MRP')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '-200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify(['Small']))
        .attach('images', Buffer.from('test image'), 'test.jpg');
      expect(res.statusCode).toEqual(500); // Mongoose validation error
    });

    it('should fail if dimensions are missing', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product No Dims')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('sizes', JSON.stringify(['Small']))
        .attach('images', Buffer.from('test image'), 'test.jpg');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Dimensions are required");
    });

    it('should fail if dimensions are incomplete', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product Incomplete Dims')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10 })) // missing height
        .field('sizes', JSON.stringify(['Small']))
        .attach('images', Buffer.from('test image'), 'test.jpg');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Dimensions (length, width, height) are required");
    });

    it('should fail if sizes array is empty', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product Empty Sizes')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify([])) // empty sizes array
        .attach('images', Buffer.from('test image'), 'test.jpg');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("At least one size is required");
    });

    it('should fail with invalid storageType', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product Invalid Storage')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Invalid Type') // invalid enum value
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify(['Small']))
        .attach('images', Buffer.from('test image'), 'test.jpg');
      expect(res.statusCode).toEqual(500); // Mongoose validation error
    });

    it('should fail if no images are provided', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product No Images')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify(['Small']));
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("At least one image is required");
    });


     it('should not allow more than 10 images', async () => {
      const req = request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product with many images')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('mrpPrice', '200')
        .field('category', 'Test Category')
        .field('storageType', 'Box Storage')
        .field('materialType', 'Wood')
        .field('finishType', 'Matte')
        .field('netWeight', '10')
        .field('warrantyMonths', '12')
        .field('dimensions', JSON.stringify({ length: 10, width: 10, height: 10 }))
        .field('sizes', JSON.stringify(['Small', 'Medium']));

      for (let i = 0; i < 11; i++) {
        req.attach('images', Buffer.from('test image'), `test${i}.jpg`);
      }

      const res = await req;
      expect(res.statusCode).toEqual(400); // Controller error
      expect(res.body.message).toEqual("Maximum 10 images allowed");
    });
  });

  describe('GET /api/v1/products', () => {
    it('should fetch all products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body.products.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/products/slug/:slug', () => {
    it('should fetch a product by slug', async () => {
      const product = await Product.findById(productId);
      const res = await request(app).get(`/api/v1/products/slug/${product?.slug}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Test Product');
    });
  });

  describe('POST /api/v1/products/:id/reviews', () => {
    it('should add a review to a product', async () => {
      const res = await request(app)
        .post(`/api/v1/products/${productId}/reviews`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rating: 5, comment: 'Great product!' });
      expect(res.statusCode).toEqual(201);
      expect(res.body.reviews.length).toEqual(1);
      expect(res.body.averageRating).toEqual(5);
    });

    it('should not allow a user to review twice', async () => {
      const res = await request(app)
        .post(`/api/v1/products/${productId}/reviews`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rating: 4, comment: 'Another great comment!' });
      expect(res.statusCode).toEqual(400);
    });
  });

   describe('POST /api/v1/products/:id/check-availability', () => {
    it('should check for pincode availability', async () => {
      const product = await Product.create({
        name: 'Pincode Test Product',
        slug: 'pincode-test-product',
        description: 'Test Description',
        price: 100,
        mrpPrice: 200,
        category: 'Test Category',
        storageType: 'Box Storage',
        materialType: 'Wood',
        finishType: 'Matte',
        netWeight: 10,
        warrantyMonths: 12,
        dimensions: { length: 10, width: 10, height: 10 },
        sizes: ['Small', 'Medium'],
        images: ['/test.jpg'],
        serviceablePinCodes: ['12345'],
      });

      const res = await request(app)
        .post(`/api/v1/products/${product._id}/check-availability`)
        .send({ pinCode: '12345' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('available', true);
    });

    it('should return not available for a non-serviceable pincode', async () => {
        const res = await request(app)
        .post(`/api/v1/products/${productId}/check-availability`)
        .send({ pinCode: '54321' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('available', false);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update a product', async () => {
        const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Updated Test Product');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated Test Product');
    });

    it('should replace product images if existingImages is not provided with new ones', async () => {
      const productWithImages = await Product.create({
        name: 'Product with images to replace',
        slug: 'product-with-images-to-replace',
        description: 'Desc',
        price: 100, mrpPrice: 200, category: 'Cat', storageType: 'Box Storage',
        materialType: 'Wood', finishType: 'Matte', netWeight: 10, warrantyMonths: 12,
        dimensions: { length: 10, width: 10, height: 10 },
        sizes: ['S'], images: ['/uploads/products/old-image.jpg']
      });

      const res = await request(app)
        .put(`/api/v1/products/${productWithImages._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('images', Buffer.from('new image'), 'new.jpg');

      expect(res.statusCode).toEqual(200);
      expect(res.body.images).toHaveLength(1);
      expect(res.body.images[0]).toContain('/uploads/products/');
    });

    it('should add new product images to existing ones and respect the 10 image limit', async () => {
      const productWithExistingImages = await Product.create({
        name: 'Product with existing images',
        slug: 'product-with-existing-images',
        description: 'Desc',
        price: 100, mrpPrice: 200, category: 'Cat', storageType: 'Box Storage',
        materialType: 'Wood', finishType: 'Matte', netWeight: 10, warrantyMonths: 12,
        dimensions: { length: 10, width: 10, height: 10 },
        sizes: ['S'],
        images: Array(5).fill(0).map((_, i) => `/uploads/products/image${i}.jpg`)
      });

      const req = request(app)
        .put(`/api/v1/products/${productWithExistingImages._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('existingImages', JSON.stringify(productWithExistingImages.images));

      for (let i = 0; i < 6; i++) { // 5 existing + 6 new = 11 images
        req.attach('images', Buffer.from(`new image ${i}`), `new-image-${i}.jpg`);
      }

      const res = await req;
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Maximum 10 images allowed");

      // Test successful addition within limit (e.g., 5 existing + 3 new = 8)
      const productToUpdate = await Product.findById(productWithExistingImages._id);
      expect(productToUpdate?.images).toHaveLength(5); // Should still have 5 from previous state

      const updateRequest = request(app)
        .put(`/api/v1/products/${productToUpdate?._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('existingImages', JSON.stringify(productToUpdate?.images));

      for (let i = 0; i < 3; i++) { // 5 existing + 3 new = 8 images
        updateRequest.attach('images', Buffer.from(`another new image ${i}`), `another-new-image-${i}.jpg`);
      }

      const res3 = await updateRequest;
      expect(res3.statusCode).toEqual(200);
      expect(res3.body.images).toHaveLength(8);
      expect(res3.body.images[5]).toContain('/uploads/products/');
    });

    it('should fail with invalid product id', async () => {
      const res = await request(app)
        .put('/api/v1/products/invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Updated Product Invalid ID');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Invalid product id");
    });

    it('should fail to update with negative price', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('price', '-50');
      expect(res.statusCode).toEqual(500); // Mongoose validation error
    });

    it('should fail to update with incomplete dimensions', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('dimensions', JSON.stringify({ length: 20, width: 20 })); // missing height
      expect(res.statusCode).toEqual(500); // Mongoose validation error (dimensions.height required)
    });

    it('should fail to update with empty sizes array', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sizes', JSON.stringify([]));
      expect(res.statusCode).toEqual(500); // Mongoose validation error (sizes required)
    });

    it('should fail to update with invalid storageType', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('storageType', 'Wrong Type');
      expect(res.statusCode).toEqual(500); // Mongoose validation error (enum validation)
    });


  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should soft delete a product', async () => {
        const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);

        const product = await Product.findById(productId);
        expect(product?.isActive).toEqual(false);
    });
  });
});
