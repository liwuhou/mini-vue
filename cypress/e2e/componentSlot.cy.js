describe("componentSlots", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/componentSlot/");
    cy.contains("App");
      cy.contains("header18");
      cy.contains("你好呀");
      cy.contains("foo");
      cy.contains("footer");
  });
});



