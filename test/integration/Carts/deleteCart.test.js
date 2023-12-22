import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de eliminar carritos", () => {
  it("Debería eliminar un carrito al hacer DELETE a /api/carts/:cid", async () => {
    const cartId = "6585f6aea62118accec9562a";
    const { statusCode, ok, _body } = await requester.delete(
      `/api/carts/${cartId}`
    );

    expect(_body).to.have.property("status");
    expect(_body).to.have.property("message");
    expect(_body).to.have.property("payload");
  });
});
