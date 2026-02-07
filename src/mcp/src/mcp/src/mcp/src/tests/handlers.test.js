const { handleRequest } = require("../src/mcp/handlers");

describe("PEGINTICHAT MCP handlers", () => {

  test("ping returns pong", () => {
    const res = handleRequest({ method: "ping" });
    expect(res.reply).toBe("pong");
  });

  test("identity returns project info", () => {
    const res = handleRequest({ method: "identity" });
    expect(res.name).toBe("PEGINTICHAT");
    expect(res.protocol).toBe("MCP-compatible");
  });

  test("about detects French", () => {
    const res = handleRequest({
      method: "about",
      params: { question: "Bonjour qui est Peginti ?" }
    });

    expect(res.language).toBe("fr");
    expect(res.response).toContain("Je suis PEGINTI");
  });

  test("about detects English", () => {
    const res = handleRequest({
      method: "about",
      params: { question: "Hello who is Peginti ?" }
    });

    expect(res.language).toBe("en");
    expect(res.response).toContain("I am PEGINTI");
  });

});
