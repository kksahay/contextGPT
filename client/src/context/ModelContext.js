import { createContext, useContext } from "react";

export const ModelContext = createContext({
    model: {},
    modelInit: () => {},
});

export const useModel = () => {
    return useContext(ModelContext);
}

export const ModelProvider = ModelContext.Provider;

