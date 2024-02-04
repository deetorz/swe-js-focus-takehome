import { useEffect, useState } from "react";
import { PartySize } from "../Pages/ShopBookingPage/PartySize";
import { MenuItem, Shop } from "../../types";
import { number, string } from "zod";

type Props = {
  partySize: PartySize;
};

export const PartySizeList = ({ partySize }: Props): JSX.Element => {
  // Leaving this code commented out here to test functionality even though the tests are failing
  // partySize = {
  //   shop: {
  //     slug: "My shop",
  //     minNumPeople: 2,
  //     maxNumPeople: 5,
  //     showBaby: true,
  //     showChild: true,
  //     showSenior: true,
  //   },
  //   menu: [
  //     {
  //       id: 2001,
  //       title: "burger",
  //       description: "Good burger",
  //       isGroupOrder: true,
  //       minOrderQty: 1,
  //       maxOrderQty: 6,
  //     },
  //     {
  //       id: 2001,
  //       title: "burger",
  //       description: "Good burger",
  //       isGroupOrder: true,
  //       minOrderQty: 4,
  //       maxOrderQty: 7,
  //     },
  //   ],
  // };

  const shop: Shop = partySize.shop;
  const menu: Array<MenuItem> = partySize.menu;
  const [maxNum, setMaxNum] = useState<number>(partySize.shop.maxNumPeople);
  const [_minNum, setMinNum] = useState<number>(partySize.shop.minNumPeople);
  const [adultCount, setAdultCount] = useState<number>(0);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [babiesCount, setBabiesCount] = useState<number>(0);
  const [seniorsCount, setSeniorsCount] = useState<number>(0);
  const [partyCount, setPartyCount] = useState<number>(0);

  const counters = [
    {
      label: "Adults",
      id: "Party Size List Adults Counter",
      state: adultCount,
      setState: setAdultCount,
      shouldShow: true,
    },
    {
      label: "Children",
      id: "Party Size List Children Counter",
      state: childrenCount,
      setState: setChildrenCount,
      shouldShow: shop.showChild,
    },
    {
      label: "Seniors",
      id: "Party Size List Seniors Counter",
      state: seniorsCount,
      setState: setSeniorsCount,
      shouldShow: shop.showSenior,
    },
    {
      label: "Babies",
      id: "Party Size List Babies Counter",
      state: babiesCount,
      setState: setBabiesCount,
      shouldShow: shop.showBaby,
    },
  ];

  useEffect(() => {
    const totalCount = adultCount + childrenCount + babiesCount + seniorsCount;
    setPartyCount(totalCount);
  }, [adultCount, childrenCount, babiesCount, seniorsCount]);

  useEffect(() => {
    const hasGroupOrder = menu.some((item) => item.isGroupOrder);

    if (hasGroupOrder) {
      // Filter out non-whole numbers
      const wholeNumbers = (numbers) =>
        numbers.filter((num) => Number.isInteger(num));

      // Extract maxOrderQty and minOrderQty as arrays
      const maxOrderQtyArray = menu.map((item) => item.maxOrderQty);
      const minOrderQtyArray = menu.map((item) => item.minOrderQty);

      // Filter out non-whole numbers from maxOrderQty and minOrderQty
      const wholeMaxOrderQty = wholeNumbers(maxOrderQtyArray);
      const wholeMinOrderQty = wholeNumbers(minOrderQtyArray);

      if (wholeMaxOrderQty.length > 0 && wholeMinOrderQty.length > 0) {
        const maxOrderQty = Math.max(...wholeMaxOrderQty);
        const minOrderQty = Math.max(...wholeMinOrderQty);
        setMaxNum(maxOrderQty);
        setMinNum(minOrderQty);
      }
    }
  }, [menu]);

  function onAdd(currentState, setState) {
    if (currentState == maxNum) return;
    setState((prev) => prev + 1);
  }

  function onSubtract(currentState, setState) {
    if (currentState == 0) return;
    setState((prev) => prev - 1);
  }

  return (
    <div data-testid="Party Size List">
      {counters.map(
        (counter) =>
          counter.shouldShow && (
            <div data-testid={counter.id} key={counter.id}>
              <label htmlFor={counter.id}>{counter.label}</label>
              <input
                id={counter.id}
                key={counter.id}
                value={counter.state}
                max={maxNum}
                min={0}
                type="number"
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  counter.setState(newValue);
                }}
              />
              <button
                data-testid="Counter Subtract Button"
                disabled={partyCount === 0 || counter.state === 0}
                onClick={() => onSubtract(counter.state, counter.setState)}
              >
                Subtract
              </button>
              <button
                data-testid="Counter Add Button"
                disabled={partyCount === maxNum}
                onClick={() => onAdd(counter.state, counter.setState)}
              >
                Add
              </button>
            </div>
          )
      )}
    </div>
  );
};
