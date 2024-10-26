import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

const endpoints = [
  // Products
  { method: "get", url: "/products", access: "public", description: "Show all products" },
  { method: "get", url: "/products/:id", access: "public", description: "Show details of a specific product" },
  { method: "post", url: "/products", access: "admin", description: "Store new product" },
  { method: "put", url: "/products/:id", access: "admin", description: "Update product" },
  { method: "delete", url: "/products/:id", access: "admin", description: "Destroy product" },
  { method: "get", url: "/products/search", access: "public", description: "Search for products" },

  // Category
  { method: "get", url: "/categories", access: "public", description: "Show all categories" },
  { method: "get", url: "/categories/:id", access: "public", description: "Show details of a specific category" },
  { method: "post", url: "/categories", access: "admin", description: "Store new category" },
  { method: "put", url: "/categories/:id", access: "admin", description: "Update category" },
  { method: "delete", url: "/categories/:id", access: "admin", description: "Destroy category" },

  // Pages
  { method: "get", url: "/pages", access: "public", description: "Show all pages" },
  { method: "get", url: "/pages/:id", access: "public", description: "Show details of a specific page" },
  { method: "post", url: "/pages", access: "admin", description: "Store new page" },
  { method: "put", url: "/pages/:id", access: "admin", description: "Update page" },
  { method: "delete", url: "/pages/:id", access: "admin", description: "Destroy page" },

  // Auth
  { method: "post", url: "/register", access: "public", description: "Store new user" },
  { method: "post", url: "/login", access: "public", description: "Login user" },
  { method: "post", url: "/logout", access: "auth", description: "Logout user" },
  { method: "post", url: "/reset-password", access: "public", description: "Reset password" },

  // Users
  { method: "get", url: "/users", access: "admin", description: "Show all users" },
  { method: "get", url: "/users/:id", access: "user, admin", description: "Show user information" },
  { method: "put", url: "/users/:id", access: "user, admin", description: "Update user information" },
  { method: "get", url: "/users/:id/orders", access: "user, admin", description: "Show user orders" },

  // Orders
  { method: "get", url: "/orders", access: "admin", description: "Show all orders" },
  { method: "get", url: "/orders/:id", access: "user, admin", description: "Show order information" },
  { method: "post", url: "/orders", access: "user", description: "Store new order for authorized user" },
  { method: "post", url: "/orders/guest", access: "public", description: "Store new order for unauthorized user" },
  { method: "put", url: "/orders/:id", access: "user, admin", description: "Update order information" },
  { method: "patch", url: "/orders/:id/status", access: "admin", description: "Update order status" }
];

describe("GET /products", () => {
  test("return status code 200 ", async () => {
    await request.get("/products").expect(200);
  });
});

describe("Public Endpoints", () => {
  endpoints.forEach((endpoint) => {
    if (endpoint.access === "public") {
      test(`returns 200 for ${endpoint.method.toUpperCase()} ${
        endpoint.url
      }`, async () => {
        const res = await request[endpoint.method](
          endpoint.url.replace(":id", "1")
        );
        expect(res.status).toBe(200);
      });
    }
  });
});
