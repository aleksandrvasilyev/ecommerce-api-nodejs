import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

describe("GET /products", () => {
  test("return status code 200 ", async () => {
    await request.get("/products").expect(200);
  });
});
