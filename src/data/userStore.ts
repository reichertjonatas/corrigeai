import create from 'zustand'
import { ICalenderEvents, IRedacoes, IUser } from '../models/user';
import { API } from '../services/api';
import { initialEvent } from '../utils/helpers';

interface IEventState {
    userInfo: {
        events: ICalenderEvents[];
    }
    redacoes: IRedacoes[];

    user: IUser;

    me: () => Promise<boolean>;

    createRedacao: (redacao: IRedacoes) => Promise<{ error: boolean; data: any; }>;

    addEvent: (event: ICalenderEvents) => void;
    removeEvent: (id: number) => void;
    updateEvent: (id: number, nColor: string) => void;
    updateDragDrop: (id: number, nEvent: ICalenderEvents) => void;

    initialLoad: () => void;
}


const userStore = create<IEventState>((set, get) => ({
    userInfo: {
        events: [
            initialEvent
        ]
    },
    redacoes: [],
    user: {} as IUser,

    me: async () => {
        const response = await API.post('/painel/me');
        if (response.status === 200) {
            set({ user: response.data.data })
            return true;
        }
        return false;
    },

    createRedacao: async (redacao: IRedacoes) => {
        if (get().user.subscription.envios > 0) {
            const response = await API.post('/painel/redacao/create', {
                "redacao": redacao.redacao,
                "nota_final": 0,
                "correcoes": [],
                "tema_redacao": redacao.tema_redacao,
            });

            console.log('data', response.data);

            if (response.status === 200 && !response.data.error ) {
                await get().me();
                return { error: false, data: {}};
            } else {
                return response.data.data;
            }
        }

        return {error: true, data: { message: 'Você não possui envios disponíveis!' }};
    },

    initialLoad: () => {
        API.get('/painel/calendario/getEvents').then((response) => {
            if (response.status === 200) {
                const eventsFormated = (response.data.data as ICalenderEvents[]).map(event => {
                    return { ...event, start: new Date(event.start), end: new Date(event.end) };
                });
                set({ userInfo: { events: eventsFormated } })
            }
        });
    },

    addEvent: async (event: ICalenderEvents) => {
        API.post('/painel/calendario/addEvent', { evento: event }).then((response) => {
            if (response.status === 200) {
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
        API.post('/painel/calendario/removeEvent', { id }).then((response) => {
            if (response.status === 200) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.filter((event) => event.id != id)
                    }
                }))
            }
        })
    },

    updateEvent: (id: number, nColor: string) => {
        API.post('/painel/calendario/updateEvent', { id, color: nColor }).then((response) => {
            if (response.status === 200) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.map((event) => event.id === id ? { ...event, eventProps: { color: nColor } } : event)
                    }
                }))
            }
        })
    },

    updateDragDrop: (id: number, nEvent: ICalenderEvents) => {
        console.log('updateDragDrop', { id, evento: { ...nEvent } });

        API.post('/painel/calendario/updateDragDrop', { id, evento: { ...nEvent } }).then((response) => {
            if (response.status === 200) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.map((event) => event.id === id ? nEvent : event)
                    }
                }))
            }
        })

    }

}));

export const useUserStore = userStore;