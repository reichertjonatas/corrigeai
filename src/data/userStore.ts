import create from 'zustand'
import User, { ICalenderEvents } from '../models/user';
import { API } from '../services/api';
import { initialEvent } from '../utils/helpers';

interface IEventState {
    userInfo: {
        events: ICalenderEvents[];
    }

    addEvent: (event: ICalenderEvents) => void;
    removeEvent: (id: number) => void;
    updateEvent: (id: number, nColor: string) => void;
    updateDragDrop: (id: number, nEvent: ICalenderEvents) => void;

    initialLoad: (events: ICalenderEvents[]) => void;
}


const userStore = create<IEventState>((set) => ({

    userInfo: {
        events: [
            initialEvent
        ]
    },

    initialLoad: (events) => {
        if(events){
            const eventsFormated = events.map(event => {
                return { ...event, start: new Date(event.start), end: new Date(event.end) };
            });

            set((state) => ({ userInfo: { events: [...state.userInfo.events, ...eventsFormated] } }))
        }
    },

    addEvent: async (event: ICalenderEvents) => {
        API.post('/painel/calendario/addEvent', { evento: event }).then((response) => {
            if (response.status === 204) {
                set((state) => ({
                    userInfo: {
                        events: [
                            ...state.userInfo.events,
                            event
                        ]
                    }
                }));
            }
        })
    },

    removeEvent: (id: number) => {
        set((state) => ({
            userInfo: {
                events: state.userInfo.events.filter((event) => event.id != id)
            }
        }))
    },

    updateEvent: (id: number, nColor: string) => {
        API.post('/painel/calendario/updateEvent', { id, color: nColor }).then((response) => {
            if (response.status === 204) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.map((event) => event.id === id ? { ...event, eventProps: { color: nColor } } : event)
                    }
                }))
            }
        })
    },

    updateDragDrop: (id: number, nEvent: ICalenderEvents) => {
        set((state) => ({
            userInfo: {
                events: state.userInfo.events.map((event) => event.id === id ? nEvent : event)
            }
        }))
    }

}));

export const useUserStore = userStore;