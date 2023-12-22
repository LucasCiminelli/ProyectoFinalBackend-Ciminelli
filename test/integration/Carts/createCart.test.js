import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de crear un carrito", () => {
  it("Debería crear un carrito al hacer POST a /api/carts", async () => {
    const { statusCode, ok, _body } = await requester.post("/api/carts");

    console.log(statusCode, ok, _body);
    expect(_body).to.have.property("status");
    expect(_body).to.have.property("payload");
  });
});
