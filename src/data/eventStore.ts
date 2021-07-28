// import create from 'zustand'
// import { ICalenderEvents } from '../models/user';
// import { initialEvent } from '../utils/helpers';

// interface IEventState {
//     events: ICalenderEvents[]
//     addEvent: (event: ICalenderEvents) => void;
//     removeEvent: (id: number) => void;
//     updateEvent: (id: number, nColor: string) => void;
//     updateDragDrop: (id: number, nEvent: ICalenderEvents) => void;
//     // saveData: (event: ICalenderEvents[]) => void;
// }


// const eventStore = create<IEventState>((set) => ({
    
//     events: [
//         initialEvent
//     ],

//     addEvent: (event: ICalenderEvents) => {
//         set((state) => ({
//             events: [
//                 ...state.events,
//                 event
//             ]
//         }));
//     },
//     removeEvent: (id: number) => {
//         set((state) => ({
//             events: state.events.filter((event) => event.id != id)
//         }))
//     },
//     updateEvent: (id: number, nColor: string) => {
//         set((state) => ({
//             events: state.events.map((event) => event.id === id ? { ...event, eventProps: { color: nColor } } : event)
//         }))
//     },

//     updateDragDrop: (id: number, nEvent: ICalenderEvents) => {
//         set((state) => ({
//             events: state.events.map((event) => event.id === id ? nEvent : event),
//         }))
//     }
// }));

export const useEventStore = 'eventStore';