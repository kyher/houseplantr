import faker from "@faker-js/faker";

import {
  nameInput,
  locationInput,
  purchasedAtInput,
  wateredAtInput,
  addWateringBtn,
  submitWateringBtn,
  addFeedingBtn,
  fedAtInput,
  submitFeedingBtn
} from "../fixtures/testDataIds.json";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /plants/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to make a plant", () => {
    const testPlant = {
      name: faker.lorem.words(1),
      location: faker.lorem.words(1),
      purchasedAt: "2022-05-09",
    };
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /plants/i }).click();
    cy.findByText("No plants yet");

    cy.findByRole("link", { name: /\+ new plant/i }).click();

    cy.get(nameInput).type(testPlant.name);
    cy.get(locationInput).type(testPlant.location);
    cy.get(purchasedAtInput).type(testPlant.purchasedAt);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByText("No plants yet");
  });
  it("should allow you to add waterings", () => {
    const testPlant = {
      name: faker.lorem.words(1),
      location: faker.lorem.words(1),
      purchasedAt: "2022-05-09",
      wateredAt: "2022-05-12",
    };
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /plants/i }).click();
    cy.findByText("No plants yet");

    cy.findByRole("link", { name: /\+ new plant/i }).click();

    cy.get(nameInput).type(testPlant.name);
    cy.get(locationInput).type(testPlant.location);
    cy.get(purchasedAtInput).type(testPlant.purchasedAt);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByText("No waterings logged for this plant.");

    cy.get(addWateringBtn).click();

    cy.get(wateredAtInput).type(testPlant.wateredAt);

    cy.get(submitWateringBtn).click();

    cy.findByText("12/05/2022");
  });
  it("should allow you to add feedings", () => {
    const testPlant = {
      name: faker.lorem.words(1),
      location: faker.lorem.words(1),
      purchasedAt: "2022-05-09",
      fedAt: "2022-05-13"
    };
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /plants/i }).click();
    cy.findByText("No plants yet");

    cy.findByRole("link", { name: /\+ new plant/i }).click();

    cy.get(nameInput).type(testPlant.name);
    cy.get(locationInput).type(testPlant.location);
    cy.get(purchasedAtInput).type(testPlant.purchasedAt);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByText("No feedings logged for this plant.");

    cy.get(addFeedingBtn).click();

    cy.get(fedAtInput).type(testPlant.fedAt);

    cy.get(submitFeedingBtn).click();

    cy.findByText("13/05/2022");
  });
  it("should allow you to add waterings and feedings", () => {
    const testPlant = {
      name: faker.lorem.words(1),
      location: faker.lorem.words(1),
      purchasedAt: "2022-05-09",
      wateredAt: "2022-05-12",
      fedAt: "2022-05-13"
    };
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /plants/i }).click();
    cy.findByText("No plants yet");

    cy.findByRole("link", { name: /\+ new plant/i }).click();

    cy.get(nameInput).type(testPlant.name);
    cy.get(locationInput).type(testPlant.location);
    cy.get(purchasedAtInput).type(testPlant.purchasedAt);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByText("No feedings logged for this plant.");

    cy.get(addFeedingBtn).click();

    cy.get(fedAtInput).type(testPlant.fedAt);

    cy.get(submitFeedingBtn).click();

    cy.findByText("13/05/2022");

    cy.findByText("No waterings logged for this plant.");

    cy.get(addWateringBtn).click();

    cy.get(wateredAtInput).type(testPlant.wateredAt);

    cy.get(submitWateringBtn).click();

    cy.findByText("12/05/2022");    
  });
});
