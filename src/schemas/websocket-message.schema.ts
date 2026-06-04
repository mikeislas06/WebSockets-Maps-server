import { z } from 'zod';

const latLngSchema = z.object({
  lat: z.number("Latitude is requires"),
  lng: z.number("Longitude is requires"),
})

export const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('GET_CLIENTS'),
    payload: z.undefined().optional()
  }),
  z.object({
    type: z.literal('CLIENT_REGISTERED'),
    payload: z.object({
      clientId: z.string('ClientID is required').min(1),
      name: z.string('Name is required').min(1),
      color: z.string('Color is required').min(1),
      coords: latLngSchema,
    })
  }),
  z.object({
    type: z.literal('CLIENT_MOVED'),
    payload: z.object({
      clientId: z.string('ClientID is required').min(1),
      coords: latLngSchema
    })
  }),
  z.object({
    type: z.literal('CLIENT_LEFT'),
    payload: z.object({
      clientId: z.string("ClientID is required").min(1),
    })
  })
]);

export type MessageParsed = z.infer<typeof messageSchema>;

export type ClientRegisteredPayload = Extract<
  MessageParsed,
  { type: 'CLIENT_REGISTERED' }
>['payload'];

export type ClientMovedPayload = Extract<
  MessageParsed,
  { type: 'CLIENT_MOVED' }
>['payload'];

export type ClientLeftPayload = Extract<
  MessageParsed,
  { type: 'CLIENT_LEFT' }
>['payload'];

export type GetClientsPayload = Extract<
  MessageParsed,
  { type: 'GET_CLIENTS' }
>['payload'];