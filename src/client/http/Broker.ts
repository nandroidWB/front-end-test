import {Broker} from "../../model/Broker"


const HOST = process.env.HOST_API

interface BrokerData<T> {
    data: T
}

export class BrokerClient {

  private host: string
  private token: string
    
  constructor(token?: string){
    this.host = `${HOST}/brokers`
    this.token = token ?? ""
  }

  getByIdentifier(identifier: string):Promise<BrokerData<Broker> | null>{
    return this.get(identifier, "identifier")
  }

  getById(id: string):Promise<BrokerData<Broker> | null>{
    return this.get(id)
  }

  private get(value: string, key?: string):Promise<BrokerData<Broker> | null>{
    return fetch(`${this.host}/${value}${key === "identifier" ? "?keyName=identifier" : ""}`).then(response => {
          
      if (!response.ok) {
        return null
      }
          
      return response.json() as Promise<BrokerData<Broker>>
    })
  }

  getAll():Promise<BrokerData<Broker[]> | null>{

    const headers = new Headers()
    headers.append("X-Api-Key", this.token)
    headers.append("Content-Type", "application/json")

    const requestOptions = { method: "GET", headers: headers }
    
    return fetch(`${this.host}?isActive=1`, requestOptions).then(response => {
      if (!response.ok) {
        return null
      }
            
      return response.json() as Promise<BrokerData<Broker[]>>
    })
  }

  store(broker: Broker):Promise<BrokerData<Broker> | null>{

    const headers = new Headers()
    headers.append("X-Api-Key", this.token)
    headers.append("Content-Type", "application/json")

    const requestOptions = { 
      method: "POST", 
      headers: headers,
      body: JSON.stringify({
        identifier: broker.identifier,
        name: broker.name,
        description: broker.description,
      })
    }
    
    return fetch(`${this.host}`, requestOptions).then(response => {
      if (!response.ok) {
        return null
      }
            
      return response.json() as Promise<BrokerData<Broker>>
    })
  }

  update(id: string, {identifier, name, description}:{identifier?: string, name?: string, description?: string}):Promise<BrokerData<Broker> | null>{

    const headers = new Headers()
    headers.append("X-Api-Key", this.token)
    headers.append("Content-Type", "application/json")

    const requestOptions = { 
      method: "PATCH", 
      headers: headers,
      body: JSON.stringify({
        identifier, name, description,
      })
    }
    
    return fetch(`${this.host}/${id}`, requestOptions).then(response => {
      if (!response.ok) {
        return null
      }
          
      return response.json() as Promise<BrokerData<Broker>>
    })
  }
}
