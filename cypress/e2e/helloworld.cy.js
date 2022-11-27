describe("helloworld", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/helloWorld/");
    cy.contains("hi,mini-vue-haha");
    cy.contains("foo: 1");
  });
});
