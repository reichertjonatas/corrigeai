import create from "zustand";
import { ICalenderEvents } from "../models/User";
import { strapi } from "../services/strapi";
import { initialEvent } from "../utils/helpers";

export interface ICalenderInterface {
    events: ICalenderEvents[],
    getAllEvents: (user: string, token: string | undefined | unknown) => void;
    addEvent: (user: string, nEvent: ICalenderEvents, token: string | undefined | unknown) => void;
    removeEvent: (id: string, token: string | undefined | unknown) => void;
    updateEvent: (id: string, nColor: string, token: string | undefined | unknown) => void;
    updateDragDrop: (id: string, nEvent: ICalenderEvents, token: string | undefined | unknown) => void;
}

const calenderStore = create<ICalenderInterface>((set, get) => ({
    events: [initialEvent],
    getAllEvents: async (user: string, token: string | undefined | unknown) => {
        const response = await strapi(token).find('events', { user: user });
        const events: any = response as any;

        const enventsFormated = events.map((event: any) => {
            return { ...event, start: new Date(event.start), end: new Date(event.end) };
        })
        set({ events: [...enventsFormated, ...get().events] })
    },
    addEvent: async (user: string, nEvent: ICalenderEvents, token: string | undefined | unknown) => {
        console.log(" ===> addEvent: " , user);
        const response = await strapi(token).create('events', { ...nEvent, user: user });
        const event: any = response as any;
        set({
            events: [
                ...get().events,
                { ...nEvent, _id: event.id, start: new Date(nEvent.start), end: new Date(nEvent.end), }
            ]
        });
    },
    removeEvent: async (id: string, token: string | undefined | unknown) => {
        await strapi(token).delete('events', id);
        set({
            events: [...get().events.filter((event: ICalenderEvents) => event._id != id)]
        });
    },
    updateEvent: async (id: string, nColor: string, token: string | undefined | unknown) => {
        await strapi(token).update('events', id, { eventProps: { color: nColor } });
        set({ events: get().events.map((event) => event._id === id ? { ...event, eventProps: { color: nColor } } : event) })
    },
    updateDragDrop: async (id: string, nEvent: ICalenderEvents, token: string | undefined | unknown) => {
        await strapi(token).update('events', id, { start: nEvent.start, end: nEvent.end });
        set({ events: get().events.map((event) => event._id === id ? nEvent : event) })
    },

}))

export const useCalenderStore = calenderStore;