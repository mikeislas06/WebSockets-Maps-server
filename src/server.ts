import { SERVER_CONFIG } from './config/server-config';

import indexHtml from '../public/index.html';
import { generateUuid } from './utils/generate-uuid';
import type { WebSocketData } from './types';
import { handleClientLeft, handleClientRegistered, handleMessage } from './handlers/message.handler';

export const createServer = () => {
  const server = Bun.serve<WebSocketData>({
    port: SERVER_CONFIG.port,

    routes: {
      '/': indexHtml,
    },

    fetch(req, server) {

      const cookies = new Bun.CookieMap(req.headers.get('cookie') || '')
      const url = new URL(req.url);

      const clientId = generateUuid();
      const name = url.searchParams.get('name') || cookies.get('name');
      const color = url.searchParams.get('color') || cookies.get('color') || 'gray';
      const coordsStr = url.searchParams.get('coords') || cookies.get('coords');
      const coords = coordsStr ? JSON.parse(coordsStr) : null;

      if (!name || !coords) {
        return new Response("Name and coords are required", {
          status: 400
        })
      }


      const upgraded = server.upgrade(req, {
        data: { clientId, name, color, coords },
      });

      if (upgraded) {
        return undefined;
      }

      return new Response('Upgrade failed', { status: 500 });
    },
    websocket: {
      open(ws) {
        ws.subscribe(SERVER_CONFIG.defaultChannelName);

        const welcomeMessage = handleClientRegistered(ws.data.clientId, ws.data);

        for (const personalMessage of welcomeMessage.personal) {
          ws.send(JSON.stringify(personalMessage));
        }

        for (const broadcastMessage of welcomeMessage.broadcast) {
          ws.publish(SERVER_CONFIG.defaultChannelName, JSON.stringify(broadcastMessage));
        }

      },
      message(ws, message: string) {
        const response = handleMessage(ws.data.clientId, message);
        const responseString = JSON.stringify(response);

        for (const personalMessage of response.personal) {
          ws.send(JSON.stringify(personalMessage));
        }

        for (const broadcastMessage of response.broadcast) {
          ws.publish(SERVER_CONFIG.defaultChannelName, JSON.stringify(broadcastMessage));
        }
      },
      close(ws, code, message) {
        ws.unsubscribe(SERVER_CONFIG.defaultChannelName);

        const result = handleClientLeft(ws.data.clientId);

        for (const broadcastMessage of result.broadcast) {
          ws.publish(SERVER_CONFIG.defaultChannelName, JSON.stringify(broadcastMessage));
        }

      }, // a socket is closed
    }, // handlers
  });

  return server;
};
