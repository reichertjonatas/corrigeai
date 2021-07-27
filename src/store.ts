import create from 'zustand'
import { initialEvent } from './utils/helpers';

export interface ICalenderEvents {
    id: number;
    title: string;
    start: any;
    end: any;
    eventProps: {
        color: string;
    };
    allDay?: boolean;
}

interface IEventState {
    events: ICalenderEvents[]
    addEvent: (event: ICalenderEvents) => void;
    removeEvent: (id: number) => void;
    updateEvent: (id: number, nColor: string) => void;
    updateDragDrop: (id: number, nEvent: ICalenderEvents) => void;
}


const eventStore = create<IEventState>((set) => ({
    events: [
        initialEvent
    ],
    addEvent: (event: ICalenderEvents) => { 
        set((state) => ({
            events: [
                ...state.events,
                event
            ]
        }));
    },
    removeEvent: (id: number) => {
        set((state) => ({
            events: state.events.filter((event) => event.id != id)
        }))
    },
    updateEvent: (id: number, nColor: string) => { 
        set((state) => ({
            events: state.events.map((event) => event.id === id ? {...event, eventProps: { color: nColor }} : event) 
        }))
    },
    updateDragDrop: (id: number, nEvent: ICalenderEvents) => {
        set((state) => ({
            events: state.events.map((event) => event.id === id ? nEvent : event),
        }))
    }
}));

export const useEventStore = eventStore; 

// interface ISate {
//     calenderEvents: ICalenderEvents[];
//     event: {
//         id: number;
//         title: string;
//         start: Date;
//         end: Date;
//         eventProps: {
//             color: string;
//         }
//     }
// }

// export const store = createState<ISate>({
//     calenderEvents: [
//         {
//             id: Date.now(),
//             title: 'Hoje',
//             start: new Date(new Date().setHours(new Date().getHours())),
//             end: new Date(new Date().setHours(new Date().getHours() + 1)),
//             eventProps: {
//                 color: '#72b01d'
//             }
//         }
//     ],
//     event: {
//         id: 1,
//         title: '',
//         start: new Date(new Date().setHours(new Date().getHours())),
//         end: new Date(new Date().setHours(new Date().getHours() + 1)),
//         eventProps: {
//             color: '#72b01d'
//         }
//     }
// });




// const useGlobalState = () => {
//     const state = useState(store);

//     return ({
//         get: () => state.calenderEvents,
//         addEvent: (event: any) => {
//             state.calenderEvents.merge([event])
//         },
//         deleteEvent: (id: number) => {
//             state.calenderEvents.keys.forEach(index => {
//                 if (state.calenderEvents[index].id.get() === id) {
//                     state.calenderEvents[index].set(none)
//                 }
//             })
//         },
//         updateEvent: (data: any) => {
//             state.calenderEvents.keys.forEach(index => {
//                 if (state.calenderEvents[index].id.get() === data.id) {
//                     state.calenderEvents[index].merge(data)
//                 }
//             })

//             // state.merge({
//             //     event: {
//             //         id: 1,
//             //         title: '',
//             //         start: new Date(new Date().setHours(new Date().getHours())),
//             //         end: new Date(new Date().setHours(new Date().getHours() + 1)),
//             //         eventProps: {
//             //             color: '#72b01d'
//             //         }
//             //     }
//             // });
//         }
//     })
// }

// export default useGlobalState;