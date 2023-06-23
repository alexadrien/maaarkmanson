describe("Tests", () => {
  const scenarios = [
    ["I'm good how are you?"],
    ["I'm Paul\n I'm feeling lonely today."],
  ];

  const timeoutInSeconds = 120;
  const sendMessage = (message: string) => {
    cy.get("textarea").eq(0).type(message);
    cy.get("button").click();
    cy.get("textarea", { timeout: timeoutInSeconds * 1000 }).should(
      "not.be.disabled"
    );
  };
  const doABarrelRoll = (messages: string[]) => () => {
    cy.viewport(600, 1200);
    cy.visit(
      `http://localhost:8888/?openAIApiKey=${Cypress.env("OPENAI_API_KEY")}`
    );
    cy.intercept("POST").as("post");
    cy.get("svg[data-testid=RefreshIcon]").click();
    // cy.wait("@post");
    cy.get("textarea", { timeout: timeoutInSeconds * 1000 }).should(
      "not.be.disabled"
    );
    for (let i = 0; i < messages.length; i++) {
      sendMessage(messages[i]);
    }
    cy.screenshot();
  };
  scenarios.forEach((scenario, index) => {
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
    it(`Scenario-${index}`, doABarrelRoll(scenario));
  });
});
