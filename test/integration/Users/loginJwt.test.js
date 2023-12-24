import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de login con jwt", () => {
  let cookie;
  it("Debería devolver una Cookie al hacer post a api/loginJwt", async () => {
    const user = {
      email: "probatik@gmail.com",
      password: "asd123",
    };
    const result = await requester.post("/api/loginJwt").send(user);
    const cookieResult = result.headers["set-cookie"][0];
    console.log(cookieResult);
    expect(cookieResult).to.be.ok;
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
    console.log(cookie);
    expect(cookie.name).to.be.equal("coderCookieToken");
    expect(cookie.value).to.be.ok;
  });
  it("Debería recibir la cookie y devolver el usuario completo al hacer GET en /api/current", async () => {
    const { _body } = await requester
      .get("/api/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    console.log(_body);
    expect(_body.email).to.be.equal("probatik@gmail.com");
  });
});
