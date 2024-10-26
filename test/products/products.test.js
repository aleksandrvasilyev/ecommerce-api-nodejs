import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

describe("GET /products", () => {
  test("return status code 200 ", async () => {
    await request.get("/products").expect(200);
  });
});

describe("GET /products/1", () => {
  test("return status code 200 ", async () => {
    await request.get("/products/1").expect(200);
  });
});

describe("GET /products/search?q=Prod", () => {
  test("return status code 200 ", async () => {
    await request.get("/products/search?q=Prod").expect(200);
  });
});
