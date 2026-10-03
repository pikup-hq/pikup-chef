import api from "./api";
import type { Extra } from "@/types";

export interface ExtraInput {
  name: string;
  price: number;
  image?: string;
  available?: boolean;
}

export const extrasApi = {
  mine: () => api.get("/product/extras/me").then((r) => (r.data.data || []) as Extra[]),
  create: (input: ExtraInput) =>
    api.post("/product/extras", input).then((r) => r.data.data as Extra),
  update: (id: string, input: Partial<ExtraInput>) =>
    api.put(`/product/extras/${id}`, input).then((r) => r.data.data as Extra),
  remove: (id: string) => api.delete(`/product/extras/${id}`).then((r) => r.data),
};
