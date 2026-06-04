//! Este es el objeto que se almacena por cada cliente
export interface WebSocketData {
  clientId: string;
  name: string;
  color: string;
  coords: Coords;
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface ClientMarker {
  clientId: string;
  name: string;
  color: string;
  coords: Coords;
  updatedAt: number;
}

export type IncommingWsMessage =
  | {
    type: 'CLIENT_REGISTERED';
    payload: {
      name: string;
      color: string;
      coords: Coords
    }
  }
  | {
    type: 'CLIENT_MOVED',
    payload: {
      coords: Coords;
    }
  }
  | {
    type: 'GET_CLIENTS',
    payload?: any // TODO: Expand payload
  }

export type OutgoingWsMessage =
  | {
    type: 'ERROR',
    payload: {
      error: string
    }
  }
  | {
    type: 'WELCOME',
    payload: {
      clientId: string
    }
  }
  | {
    type: 'CLIENTS_STATE',
    payload: ClientMarker[]
  }
  | {
    type: 'CLIENT_JOINED',
    payload: ClientMarker
  }
  | {
    type: 'CLIENT_MOVED',
    payload: {
      clientId: string;
      coords: Coords;
      updatedAt: number
    }
  }
  | {
    type: "CLIENT_LEFT",
    payload: {
      clientId: string;
    }
  }