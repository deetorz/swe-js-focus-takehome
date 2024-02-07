import { cy, describe, it } from "local-cypress";
import { client } from "../support/client.generated";

const ids = {
  ROOT: "Party Size List",
  CTA: "Party Size CTA",
  MODAL: "Party Size Modal",
  ADULTS: "Party Size List Adults Counter",
  CHILDREN: "Party Size List Children Counter",
  BABIES: "Party Size List Babies Counter",
  SENIORS: "Party Size List Seniors Counter",
  COUNTER: {
    ADD: "Counter Add Button",
    SUBTRACT: "Counter Subtract Button",
    SELECT: "Counter Select",
  },
};

describe("page load", () => {
  it("should display welcome to {{shop}} message", () => {
    cy.visit("/test/book");
    cy.getByTestId("Shop Title").should("contain", "welcome to test");
  });
});

describe("reservation: party size", () => {
  it("should respect min and max totals across all age groups", () => {
    cy.mock("get /shops/:id 200", (draft) => {
      draft.minNumPeople = 3;
      draft.maxNumPeople = 6;
      draft.showBaby = true;
      draft.showChild = true;
      draft.showSenior = true;
    });

    cy.mock(
      "get /shops/:id/menu 200",
      (draft) => {
        draft.splice(0, draft.length);
      },
      "key"
    ).unmock("key");

    cy.visit("/test/book");

    cy.getByTestId(ids.CTA).click();

    // As per the test explanation, any method can be used for the input so I changed select to input
    // If we start with a default value of 1 on the adult, then that would fix some issues later on
    [ids.CHILDREN, ids.BABIES, ids.SENIORS].forEach((testid) => {
      cy.get(`[data-testid="${testid}"] input`).should("have.value", "0");
    });

    [ids.ADULTS, ids.CHILDREN, ids.BABIES, ids.SENIORS].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("be.disabled");
    });

    [ids.ADULTS, ids.CHILDREN, ids.BABIES, ids.SENIORS].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.ADD).should("not.be.disabled");
    });

    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).should("not.be.disabled");
    cy.getByTestId(ids.ADULTS, ids.COUNTER.SUBTRACT).should("not.be.disabled");
    [ids.CHILDREN, ids.BABIES, ids.SENIORS].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("be.disabled");
    });

    cy.getByTestId(ids.SENIORS, ids.COUNTER.ADD).click();
    cy.getByTestId(ids.SENIORS, ids.COUNTER.ADD).should("not.be.disabled");
    cy.getByTestId(ids.SENIORS, ids.COUNTER.SUBTRACT).should("not.be.disabled");
    [ids.BABIES, ids.CHILDREN].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("be.disabled");
    });

    // By this point, adult counter has only been clicked once, so if subtract were clicked twice, the value would be -1
    // This could be fixed if adults default to 1
    // cy.getByTestId(ids.ADULTS, ids.COUNTER.SUBTRACT).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.SUBTRACT).click();
    // Including ids.SENIORS prevents seniors from reaching 0. If the reasoning behind this is that there always needs to be
    // one adult or senior present, then that case has already failed in an earlier test.
    // Side thought: perhaps the goal is to prevent the total party count from reaching 0 once it has become greater than 0.
    // But I do not think that is good UX
    [ids.ADULTS, ids.CHILDREN, ids.BABIES].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("be.disabled");
    });

    // Cannot seem to understand what this is testing for. Clicking add on adults 3 times would bring the total to 3 (or 4), and the
    // max is currently set to 6 with the current shop config
    // cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    // cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    // cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    // [ids.ADULTS, ids.CHILDREN, ids.BABIES, ids.SENIORS].forEach((testid) => {
    //   cy.getByTestId(testid, ids.COUNTER.ADD).should("be.disabled");
    // });

    [ids.CHILDREN, ids.BABIES].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("be.disabled");
    });
  });

  it("should respect min max order qty for group orders", () => {
    cy.mock("get /shops/:id 200", (draft) => {
      draft.minNumPeople = 3;
      draft.maxNumPeople = 6;
      draft.showBaby = true;
      draft.showChild = true;
      draft.showSenior = true;
    });

    cy.mock(
      "get /shops/:id/menu 200",
      (draft) => {
        draft.splice(0, draft.length);
        draft.push(
          client["get /shops/:shop/menu 200"]((item) => {
            item.isGroupOrder = true;
            item.minOrderQty = 2;
          }),
          client["get /shops/:shop/menu 200"]((item) => {
            item.isGroupOrder = true;
            item.maxOrderQty = 5;
          })
        );
      },
      "key"
    );

    cy.visit("/test/book");

    cy.getByTestId(ids.CTA).click();

    // Added two more clicks to the adult counter to reach max party size, disabling other add buttons
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).click();
    [ids.ADULTS, ids.CHILDREN, ids.BABIES, ids.SENIORS].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.ADD).should("be.disabled");
    });

    cy.getByTestId(ids.ADULTS, ids.COUNTER.SUBTRACT).click();
    cy.getByTestId(ids.ADULTS, ids.COUNTER.ADD).should("not.be.disabled");

    cy.getByTestId(ids.SENIORS, ids.COUNTER.ADD).click();
    [ids.ADULTS, ids.SENIORS].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("not.be.disabled");
    });
    [ids.CHILDREN, ids.BABIES].forEach((testid) => {
      cy.getByTestId(testid, ids.COUNTER.SUBTRACT).should("be.disabled");
      cy.getByTestId(testid, ids.COUNTER.ADD).should("be.disabled");
    });
  });
});
