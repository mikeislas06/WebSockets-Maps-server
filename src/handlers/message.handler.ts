import {
  messageSchema,
  type ClientMovedPayload,
  type ClientRegisteredPayload,
} from '../schemas/websocket-message.schema';
import { clientService } from '../services/clients.service';
import type { IncommingWsMessage, OutgoingWsMessage } from '../types';

interface HandlerResult {
  personal: OutgoingWsMessage[];
  broadcast: OutgoingWsMessage[];
}

const createErrorResponse = (error: string): OutgoingWsMessage => {
  return {
    type: 'ERROR',
    payload: { error: error },
  };
};

const handleGetClients = (): HandlerResult => {
  return {
    broadcast: [],
    personal: [{
      type: 'CLIENTS_STATE',
      payload: clientService.getAllClients()
    }]
  }
}

export const handleClientRegistered = (clientId: string, payload: ClientRegisteredPayload): HandlerResult => {

  const newClient = clientService.registerClient(payload);

  if ('error' in newClient) {
    return { personal: [createErrorResponse(newClient.error)], broadcast: [] }
  }

  return {
    broadcast: [{
      type: "CLIENT_JOINED",
      payload: newClient
    }],
    personal: [
      {
        type: "WELCOME",
        payload: newClient
      },
      {
        type: "CLIENTS_STATE",
        payload: clientService.getAllClients().filter(client => client.clientId !== clientId)
      }
    ]
  }
}

const handleClientMoved = (clientId: string, payload: ClientMovedPayload): HandlerResult => {

  const updatedClient = clientService.clientMoved(clientId, payload);

  if ('error' in updatedClient) {
    return { personal: [createErrorResponse(updatedClient.error)], broadcast: [] }
  }

  return {
    broadcast: [
      {
        type: 'CLIENT_MOVED',
        payload: {
          clientId: clientId,
          coords: updatedClient.coords,
          updatedAt: updatedClient.updatedAt
        }
      }
    ],
    personal: []
  }
}

export const handleClientLeft = (clientId: string): HandlerResult => {

  const removedClient = clientService.removeClient(clientId);

  if (removedClient) {
    return {
      broadcast: [
        {
          type: 'CLIENT_LEFT',
          payload: {
            clientId: clientId
          }
        }
      ],
      personal: []
    }
  }

  return {
    broadcast: [],
    personal: []
  }

}


//! General Handler
export const handleMessage = (clientId: string, rawMessage: string): HandlerResult => {
  try {
    const jsonData: unknown = JSON.parse(rawMessage);
    const parsedResult = messageSchema.safeParse(jsonData);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      const errorMessage = parsedResult.error.issues
        .map((issue) => issue.message)
        .join(', ');

      return {
        broadcast: [],
        personal: [createErrorResponse(`Validation error ${errorMessage}`)],
      }
    }

    const { type, payload } = parsedResult.data;

    switch (type) {
      case 'GET_CLIENTS':
        return handleGetClients();

      case 'CLIENT_REGISTERED':
        return handleClientRegistered(clientId, payload)

      case 'CLIENT_MOVED':
        return handleClientMoved(clientId, payload)

      case 'CLIENT_LEFT':
        return handleClientLeft(clientId);

      default:
        return {
          broadcast: [],
          personal: [createErrorResponse(`Unknown message type: ${type}`)]
        }
    }
  } catch (error) {
    console.log({ error });
    return {
      broadcast: [],
      personal: [createErrorResponse(`Unkown error found`)],
    }
  }
};
