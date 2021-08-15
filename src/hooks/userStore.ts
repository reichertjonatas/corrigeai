import create from 'zustand'
import { ICalenderEvents, IRedacoes, IUser } from '../models/user';
import { API } from '../services/api';
import { debugPrint } from '../utils/debugPrint';
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
    removeEvent: (_id: string) => void;
    updateEvent: (_id: string, nColor: string) => void;
    updateDragDrop: (_id: string, nEvent: ICalenderEvents) => void;

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

                set((state) => ({ userInfo: { events: [...eventsFormated, ...state.userInfo.events]}}))
            }
        });
    },

    addEvent: async (event: ICalenderEvents) => {
        API.post('/painel/calendario/addEvent', { evento: event }).then((response) => {
            if (response.status === 200) {
                debugPrint("==> ", response.data.data , " ==> ID ", response.data.data._id)
                set((state) => ({
                    userInfo: {
                        events: [
                            ...state.userInfo.events,
                            {_id: response.data.data._id, ...event}
                        ]
                    }
                }));
            }
        })
    },

    removeEvent: (_id: string) => {
        if(_id != '1') API.post('/painel/calendario/removeEvent', { _id }).then((response) => {
            if (response.status === 200) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.filter((event) => event._id != _id)
                    }
                }))
            }
        })
    },

    updateEvent: (_id: string, nColor: string) => {
        if(_id != '1') API.post('/painel/calendario/updateEvent', { _id, color: nColor }).then((response) => {
            if (response.status === 200) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.map((event) => event._id === _id ? { ...event, eventProps: { color: nColor } } : event)
                    }
                }))
            }
        })
    },

    updateDragDrop: (_id: string, nEvent: ICalenderEvents) => {
        console.log('updateDragDrop', { _id, evento: { ...nEvent } });

        if(_id != '1') API.post('/painel/calendario/updateDragDrop', { _id, evento: { ...nEvent } }).then((response) => {
            if (response.status === 200) {
                set((state) => ({
                    userInfo: {
                        events: state.userInfo.events.map((event) => event._id === _id ? nEvent : event)
                    }
                }))
            }
        })

    }

}));

export const useUserStore = userStore;