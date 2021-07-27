import Link from 'next/link'
import React from 'react'
import MainLayout from '../../../../../components/layout/MainLayout'
import styles from './Calendario.module.css'
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useState } from 'react';

import 'moment/locale/pt-br';

import 'react-big-calendar/lib/css/react-big-calendar.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const localizer = momentLocalizer(moment)
// @ts-ignore
const CorrigeAiCalendar = withDragAndDrop(Calendar);

function Calendario() {
    const [events, setEvents] = useState([
        {
            id: 14,
            title: "Kellvem Fodão",
            start: new Date(new Date().setHours(new Date().getHours())),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
            eventProps: {
                color: '#72b01d',
            }
        }
    ])

    const onEventDrop = ({ event, start, end, allDay } : any) => {
        console.log(start, event, end, allDay);

        const idx = events.indexOf(event);
        const updatedEvent = { ...event, start, end };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        setEvents(nextEvents);
    };


    const addEvent = ({ event, start, end, allDay } : any) => {
        const newEvent = {
            id: events.length,
            title: "Escrever redação",
            start: new Date(new Date().setHours(new Date().getHours())),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
            eventProps : {
                color: '#72b01d'
            }
        }

        setEvents(state => [...state, newEvent]);
    };

    return (
        <MainLayout>
            <style global jsx>{`
                .rbc-month-view{ border: 1px solid #002400!important; border-radius: 1rem!important;}
                .rbc-toolbar .rbc-toolbar-label { text-align: right!important; }
            `}</style>
            <div className={styles.gridPlanejamento}>
                <div className={styles.content}>
                    <div className={styles.box} >
                        <h1>Planeje sua semana</h1>
                        <span className={styles.desc} style={{ height: 660 }}>
                            <CorrigeAiCalendar
                                localizer={localizer}
                                selectable
                                events={events}
                                // startAccessor="start"
                                // endAccessor="end"
                                defaultDate={moment().toDate()}
                                views={{ month: true}}
                                toolbar
                                resizable
                                onEventDrop={onEventDrop}
                                components={{
                                    event: EventComponent,
                                    agenda: {
                                        event: EventAgenda
                                    }
                                }}
                                onSelectSlot={addEvent}
                                // onSelectEvent={(event: any) => alert(event.title)}
                            />
                        </span>
                    </div>
                    <span className={styles.botao}>
                        <Link href="#">Planeje sua redação</Link>
                    </span>
                </div>
            </div>
        </MainLayout>
    )
}

const EventComponent = ({ id, start, end, title } : any) => {
      
    return (
      <Popup
          key={id}
          trigger={open => (
            <span>
                <p>{title}</p>
                <p>{start}</p>
                <p>{end}</p>
            </span>
          )}
          position="right center"
          on={['hover', 'focus']}
          closeOnDocumentClick
        >   
            <div>
                <span style={{ backgroundColor: 'red', color: 'red', minWidth: '120px', minHeight: '40px'}}> -- </span>
            </div>
        </Popup>
    );
  };
  
  const EventAgenda = ({ event } : any) => {
    return (
      <span>
        <em style={{ backgroundColor: event.eventProps.color }}>{event.title} </em>
        <p>{event.desc}</p>
      </span>
    );
  };

export default Calendario
