import { useMenu, useShop } from "../../App";
import { PartySizeList } from "../../Components/PartySizeList";
import { useMutableState } from "../../utils/useMutableState";
import { PartySize } from "./PartySize";

type Controller = {
  title: string;
  isCTAOpen: boolean;
  // Added partySize to satisfy typing
  partySize: PartySize;
  openCTA(): void;
  closeCTA(): void;
  renderModal(): JSX.Element;
};

export function useController(): Controller {
  const shop = useShop();
  const menu = useMenu();
  const [state, setState] = useMutableState({
    isCTAOpen: false,
    partySize: new PartySize(shop.config, menu.items),
  });

  const api: Controller = {
    ...state,
    title: `welcome to ${shop.config.slug}`,
    openCTA() {
      setState((d) => {
        d.isCTAOpen = true;
      });
    },
    closeCTA() {
      setState((d) => {
        d.isCTAOpen = false;
      });
    },
    renderModal() {
      return (
        // this -> api, avoids complications with 'this'
        <dialog open={api.isCTAOpen} data-testid="Party Size Modal">
          <PartySizeList partySize={api.partySize} />
          <button onClick={api.closeCTA}>close</button>
        </dialog>
      );
    },
  };

  return api;
}
