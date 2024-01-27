import xssFilters from "xss-filters";

export class PreloadedDataHydrator {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  // The state object is first converted to a JSON string and then
  // made safe for HTML to prevent unwanted security risks. After
  // that, the string is split into chunks and then an array of
  // HTML elements with no display are returned. These will be passed
  // to the DOM during hydration.
  chunk(state: unknown): string[] {
    const json = JSON.stringify(state);
    const htmlSafe = json.replace(/&/gi, "&amp;");
    const filtered = xssFilters.inSingleQuotedAttr(htmlSafe);
    const chunks = filtered.match(/.{1,500000}/g);
    return (chunks as string[]).map(
      (chunk) =>
        `<input data-preloaded="${this.id}" style='display: none;' value='${chunk}' />`
    );
  }

  // After making sure the application is in a browser, the preloaded
  // data is retrieved (by using the ID), parsed, and then removed
  // from the DOM so that only the hydrated data remains.
  hydrate<TPreloaded>(): TPreloaded {
    if (typeof window === "undefined" || typeof document === "undefined") {
      throw new Error(
        "hydration should only be performed on the client as it requires the DOM to be loaded"
      );
    }

    let preloadedState = {} as TPreloaded;

    const stateInputs = document.querySelectorAll(
      `input[data-preloaded="${this.id}"]`
    );
    const joinedStateString = Array.from(stateInputs)
      .map((el) => (el as HTMLInputElement).value)
      .join("");

    if (stateInputs.length) {
      try {
        preloadedState = JSON.parse(joinedStateString);
      } catch (err) {
        console.error("malformed json, could not rehydrate store");
      }

      try {
        Array.from(stateInputs).forEach((el) => el && el.remove());
      } catch (e) {
        console.error("could not remove hidden preloaded state inputs");
      }
    }

    return preloadedState;
  }
}

// Changing the argument from a random number to a static string fixed
// the issue that was preventing the application from hydrating properly.
// I believe the issue was that ths server and client were both generating
// random numbers therefore the client and server had different HTML.
export const context = new PreloadedDataHydrator("preloadedData");
