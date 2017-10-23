import {} from "jest";
import * as supertest from "supertest";

const request = supertest("http://localhost:8001");

describe("GET /api", () => {
  it("should return 200 OK", () => {
    request
      .get("/api")
      .expect(200);
  });
});
