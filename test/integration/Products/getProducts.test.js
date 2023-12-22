import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de obtener productos", () => {
  it("Deberia obtener un array de productos al hacer GET a /api/products", async () => {
    const { statusCode, ok, _body } = await requester.get("/api/products");

    expect(_body).to.have.property("status");
    expect(_body).to.have.property("payload");
    expect(_body.payload).to.not.be.empty;
  });
});
