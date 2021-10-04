import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./data');

export const storage = {
  set: (item, value) => { global.localStorage.setItem(item, value) },
  getAdmin: () => { return (global.localStorage.getItem('ADMIN') === "true") ? true : false; },
  get: (item) => { return global.localStorage.getItem(item); },
}