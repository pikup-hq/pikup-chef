import api from "./api";
import type { MenuItem } from "@/types";

export interface MenuInput {
  name: string;
  description: string;
  price: number;
  image: string;
  available?: boolean;
}

export const menuApi = {
  list: (vendorId: string) =>
    api.get(`/product/get/${vendorId}`).then((r) => (r.data.data || []) as MenuItem[]),
  create: (input: MenuInput) =>
    api.post("/product", input).then((r) => r.data.menu as MenuItem),
  update: (menuId: string, input: Partial<MenuInput>) =>
    api.put("/product/edit", { menuId, ...input }).then((r) => r.data.menu as MenuItem),
  setAvailability: (menuId: string, available: boolean) =>
    api.put("/product/editAvailability", { menuId, available }).then((r) => r.data),
  remove: (menuId: string) => api.delete(`/product/${menuId}`).then((r) => r.data),
  setExtras: (menuId: string, extraIds: string[]) =>
    api.put(`/product/${menuId}/extras`, { extraIds }).then((r) => r.data.menu as MenuItem),
};
