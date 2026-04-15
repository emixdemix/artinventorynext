import { createContext } from 'react';
import { StoreContext } from './interfaces';


export const ContextStorage = createContext({
   profile: {}
} as StoreContext);