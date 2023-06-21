describe("Multiple Tests", () => {
  const doABarrelRoll = () => {
    const timeoutInSeconds = 60;
    cy.viewport(2 * 375, 2 * 667);
    cy.visit(
      `http://localhost:8888/?openAIApiKey=${Cypress.env("OPENAI_API_KEY")}`
    );
    cy.intercept("POST").as("post");
    cy.get("svg[data-testid=RefreshIcon]").click();
    // cy.wait("@post");
    cy.get("textarea", { timeout: timeoutInSeconds * 1000 }).should(
      "not.be.disabled"
    );
    cy.get("textarea").eq(0).type("Hey\nI'm Mark\nI'm feeling lonely.");
    cy.get("button").click();
    cy.get("textarea", { timeout: timeoutInSeconds * 1000 }).should(
      "not.be.disabled"
    );
    cy.screenshot();
  };
  it("Do a barrel roll-01", doABarrelRoll);
  it("Do a barrel roll-02", doABarrelRoll);
  it("Do a barrel roll-03", doABarrelRoll);
  it("Do a barrel roll-04", doABarrelRoll);
  it("Do a barrel roll-05", doABarrelRoll);
  it("Do a barrel roll-06", doABarrelRoll);
  it("Do a barrel roll-07", doABarrelRoll);
  it("Do a barrel roll-08", doABarrelRoll);
  it("Do a barrel roll-09", doABarrelRoll);
  it("Do a barrel roll-10", doABarrelRoll);
});
