describe("currentInstance", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/currentInstance/");
    cy.contains("currentInstance demo")
    cy.contains("foo")
  });
});