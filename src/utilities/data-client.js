import { settings } from "../config/settings.js";

export default class DataClient {
  #url = "";

  constructor(resource) {
    this.#url = `${settings.BASE_API_URL}/${resource}`;
  }

  async add(data) {
    return await this.#request("", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async listAll() {
    return await this.#request();
  }

  async findById(id) {
    return await this.#request(`/${id}`);
  }

  async update(id, data) {
    return await this.#request(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async #request(path = "", options = {}) {
    try {
      const response = await fetch(`${this.#url}${path}`, {
        headers: { "content-type": "application/json" },
        ...options,
      });

      if (response.ok) {
        return response.status === 204 ? null : await response.json();
      }

      throw new Error(`${response.status} - ${response.statusText}`);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
