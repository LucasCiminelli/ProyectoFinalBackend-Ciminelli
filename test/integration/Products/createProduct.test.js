import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de crear producto", () => {
  it("Debería crear un producto al hacer POST a /api/products", async () => {
    const productMock = {
      title: "ProductoTestConPayload4",
      description: "Producto de testeo CP4",
      code: "test345678",
      price: 1234,
      stock: "10",
      category: "Producto de prueba",
      thumbnails: ["foto1", "foto2"],
    };

    const { statusCode, ok, _body } = await requester
      .post("/api/products")
      .send(productMock);

    expect(_body.payload).to.have.property("_id");
  });

  it("Debería arrojar status 500 si falta completar algun campo al POST a /api/products", async () => {
    const productMock = {
      description: "Producto de testeo CP3",
      code: "test34567",
      price: 1234,
      stock: "10",
      category: "Producto de prueba",
      thumbnails: ["foto1", "foto2"],
    };

    const { statusCode, ok, _body } = await requester
      .post("/api/products")
      .send(productMock);

    expect(statusCode).to.be.equal(500);
  });
});
