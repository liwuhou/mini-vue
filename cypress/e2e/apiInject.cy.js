describe("apiInject", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/apiInject/");
    cy.contains("apiInject")
    cy.contains("Provider")
    cy.contains("ProviderTwo foo:fooVal")
    cy.contains("Consumer: - fooTwo - barVal-bazDefault")
  });
});