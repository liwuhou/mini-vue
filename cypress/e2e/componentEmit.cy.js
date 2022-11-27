describe("componentEmit", () => {
  it("render", () => {
    cy.visit("http://localhost:3000/example/componentEmit/");

    cy.window()
    .its("console")
    .then((console) => cy.spy(console, "log").as("log"));


    cy.contains("App")
    cy.contains("foo")

    cy.get("button").click()
    cy.get("@log").should("have.been.calledWith","emit add");
    cy.get("@log").should("have.been.calledWith","onAdd", 1 , 2);
    cy.get("@log").should("have.been.calledWith","onAddFoo");
  });
});
