import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { imageOptimizer } from "../middleware/imageOptimizer";

describe("Image Optimizer Middleware", () => {
  const uploadDir = path.join(__dirname, "../../uploads/products");
  let testFilesCreated: string[] = [];

  afterEach(async () => {
    for (const file of testFilesCreated) {
      if (fs.existsSync(file)) {
        await fs.promises.unlink(file);
      }
    }
    testFilesCreated = [];
  });

  it("should resize non-square images to 800x800, pad with white, and convert to WebP", async () => {
    // 1. Create a 1200x600 rectangular sample image
    const sampleBuffer = await sharp({
      create: {
        width: 1200,
        height: 600,
        channels: 3,
        background: { r: 220, g: 100, b: 50 },
      },
    })
      .jpeg()
      .toBuffer();

    const mockFile: Express.Multer.File = {
      fieldname: "images",
      originalname: "furniture-sample.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      buffer: sampleBuffer,
      size: sampleBuffer.length,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    const req = {
      files: [mockFile],
      body: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    // 2. Run middleware
    await imageOptimizer(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockFile.filename).toMatch(/^product-\d+-\d+\.webp$/);
    expect(mockFile.mimetype).toBe("image/webp");
    expect(req.body.images).toBeDefined();
    expect(req.body.images[0]).toContain(mockFile.filename);

    const savedFilePath = path.join(uploadDir, mockFile.filename);
    testFilesCreated.push(savedFilePath);
    expect(fs.existsSync(savedFilePath)).toBe(true);

    // 3. Inspect saved WebP file dimensions & metadata using sharp
    const metadata = await sharp(savedFilePath).metadata();
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(800);
    expect(metadata.format).toBe("webp");
  });

  it("should handle single file upload (e.g., req.file for categories)", async () => {
    const sampleBuffer = await sharp({
      create: {
        width: 400,
        height: 900,
        channels: 3,
        background: { r: 50, g: 120, b: 200 },
      },
    })
      .png()
      .toBuffer();

    const mockFile: Express.Multer.File = {
      fieldname: "image",
      originalname: "category-tall.png",
      encoding: "7bit",
      mimetype: "image/png",
      buffer: sampleBuffer,
      size: sampleBuffer.length,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    const req = {
      file: mockFile,
      body: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await imageOptimizer(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockFile.filename).toMatch(/^product-\d+-\d+\.webp$/);
    expect(req.body.imageUrl).toContain(mockFile.filename);

    const savedFilePath = path.join(uploadDir, mockFile.filename);
    testFilesCreated.push(savedFilePath);
    expect(fs.existsSync(savedFilePath)).toBe(true);

    const metadata = await sharp(savedFilePath).metadata();
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(800);
    expect(metadata.format).toBe("webp");
  });

  it("should proceed normally if no files are uploaded", async () => {
    const req = {
      body: { name: "Product update with no images" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await imageOptimizer(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
