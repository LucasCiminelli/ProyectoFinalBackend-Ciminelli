import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de actualizar producto", () => {
  it("Debería actualizar un producto al hacer PUT a /api/products/:pid", async () => {
    const productId = "6585b1ffc83b7973bc3c0e6a";
    const payload = {
      title: "ProductoTest4",
    };
    const { statusCode, ok, _body } = await requester
      .put(`/api/products/${productId}`)
      .send(payload);

    console.log(statusCode, ok, _body);
  });
});
