import { settings } from "../config/settings.js";

export default class DataClient {
  #resource = "";
  #url = "";

  constructor(resource) {
    this.#resource = resource;
    this.#url = `${settings.BASE_API_URL}/${resource}`;
  }

  async add(data) {
    this.#assertWritable();
    return await this.#request("", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async listAll() {
    if (!settings.IS_LOCAL) {
      const data = await this.#loadStaticData();
      return data[this.#resource] || [];
    }

    return await this.#request();
  }

  async findById(id) {
    if (!settings.IS_LOCAL) {
      const items = await this.listAll();
      const item = items.find((entry) => String(entry.id) === String(id));

      if (!item) {
        throw new Error(`Kunde inte hitta ${this.#resource} med id ${id}`);
      }

      return item;
    }

    return await this.#request(`/${id}`);
  }

  async update(id, data) {
    this.#assertWritable();
    return await this.#request(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async #loadStaticData() {
    const response = await fetch(settings.STATIC_DATA_URL);

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  #assertWritable() {
    if (!settings.IS_LOCAL) {
      throw new Error("Skrivoperationer kräver den lokala databasservern.");
    }
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
