import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

// set the value we want to use for store.
interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

// create context.
const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// make react hook to use StoreContext.
// you can just get the context by useContext.
const useStoreContext = () => {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error("Oops - we do not seem to be inside the provider");
  }

  return context;
};

const StoreProvider = ({ children }: PropsWithChildren<unknown>) => {
  // implement all StoreContextValue
  const [basket, setBasket] = useState<Basket | null>(null);

  const removeItem = (productId: number, quantity: number) => {
    if (!basket) return;
    const items = [...basket.items];
    const itemIndex = items.findIndex((i) => i.productId == productId);

    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;
      if (items[itemIndex].quantity === 0) {
        items.splice(itemIndex, 1);
      }

      setBasket((prevState) => {
        return { ...prevState!, items };
      });
    }
  };

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, useStoreContext, StoreProvider };
