import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de obtener carritos", () => {
  it("Debería obtener todos los carritos al hacer GET a /api/carts", async () => {
    const { statusCode, ok, _body } = await requester.get("/api/carts");

    console.log(statusCode, ok, _body);
    expect(_body).to.have.property("status");
    expect(_body).to.have.property("payload");
  });
});
