import { Broker } from "../../model/Broker";

const HOST = process.env.HOST_API;

interface BrokerData<T> {
    data: T;
}

export class BrokerClient {
    private host: string;
    private token: string;

    constructor(token?: string) {
        this.host = `${HOST}/brokers`;
        this.token = token ?? "";
    }

    getByIdentifier = (identifier: string): Promise<BrokerData<Broker> | null> => 
        this.get(identifier, "identifier");

    getById = (id: string): Promise<BrokerData<Broker> | null> => 
        this.get(id);

    private get = (value: string, key?: string): Promise<BrokerData<Broker> | null> =>
        fetch(`${this.host}/${value}${key === "identifier" ? "?keyName=identifier" : ""}`)
            .then(response => this.handleResponse<Broker>(response));

    getAll = (): Promise<BrokerData<Broker[]> | null> => {
        const headers = this.createHeaders();

        return fetch(`${this.host}?isActive=1`, { method: "GET", headers })
            .then(response => this.handleResponse<Broker[]>(response));
    };

    store = (broker: Broker): Promise<BrokerData<Broker> | null> => {
        const headers = this.createHeaders();
        const body = this.createRequestBody(broker);

        return fetch(`${this.host}`, { method: "POST", headers, body })
            .then(response => this.handleResponse<Broker>(response));
    };

    update = (id: string, updates: Partial<Broker>): Promise<BrokerData<Broker> | null> => {
        const headers = this.createHeaders();
        const body = JSON.stringify(updates);

        return fetch(`${this.host}/${id}`, { method: "PATCH", headers, body })
            .then(response => this.handleResponse<Broker>(response));
    };

    // Función de registro de usuario
    registerUser = (username: string, password: string): Promise<BrokerData<Broker> | null> => {
        const headers = this.createHeaders();
        const body = JSON.stringify({ username, password });

        return fetch(`${HOST}/register`, { method: "POST", headers, body })
            .then(response => this.handleResponse<Broker>(response));
    };

    // Función de inicio de sesión de usuario
    loginUser = (username: string, password: string): Promise<BrokerData<Broker> | null> => {
        const headers = this.createHeaders();
        const body = JSON.stringify({ username, password });

        return fetch(`${HOST}/login`, { method: "POST", headers, body })
            .then(response => this.handleResponse<Broker>(response));
    };

    private handleResponse = async <T>(response: Response): Promise<BrokerData<T> | null> => {
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data as BrokerData<T>;
    };

    private createHeaders = (): Headers => {
        const headers = new Headers();
        headers.append("X-Api-Key", this.token);
        headers.append("Content-Type", "application/json");
        return headers;
    };

    private createRequestBody = (broker: Broker): string =>
        JSON.stringify({
            identifier: broker.identifier,
            name: broker.name,
            description: broker.description,
        });
}
