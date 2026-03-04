import { apiGet } from "./http";

export function fetchProperties(params) {
  return apiGet("/properties", params).then(res => res.items ?? res);
}
