export interface Broker {
    id: string,
    identifier: string,
    image?: string,
    name: string,
    isActive: boolean,
    metadata?: unknown,
    description: string,
    subTitle?: string
  }
