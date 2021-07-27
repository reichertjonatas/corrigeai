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

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const [event, setEvent] = useState({});

  const onEventDrop = ({ event, start, end, allDay }: any) => {
    console.log(start, event, end, allDay);

    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
  };


  const addEvent = ({ title, event, start, end, allDay }: any) => {
    setOpen(false);
    if(title) {
      const newEvent = {
        id: events.length,
        title: title,
        start,
        end,
        eventProps: {
          color: '#72b01d'
        }
      }
      setEvents(state => [...state, newEvent]);
    } else {
      const title = window.prompt('Digite seu texto:');
      if(title){
        const newEvent = {
          id: events.length,
          title: title,
          start,
          end,
          eventProps: {
            color: '#72b01d'
          }
        }

        setEvents(state => [...state, newEvent]);
      }
    }
  }
  
  return (
    <MainLayout>
      <style global jsx>{`
                .rbc-month-view{ border: 1px solid #002400!important; border-radius: 1rem!important;}
                .rbc-toolbar .rbc-toolbar-label { text-align: right!important; }
                .Calendario_gridPlanejamento__2khI8 .Calendario_content__1EgyD .Calendario_box__nQ-yB .Calendario_desc__3Qmag{
                    color: var(--dark) !important;
                    text-transform: capitalize;
              }
              
              .rbc-month-view {
                  border: 1px solid #55653d!important;
                  border-radius: 1rem!important;
              }
              
              .rbc-header{
                padding: 0.6rem 0;
                border-bottom: 1px solid #55653d!important;
                font-weight: 500;
              }
              
              .rbc-header+.rbc-header{
                border-left: 1px solid #55653d!important;
              }
              
              .rbc-day-bg+.rbc-day-bg{
                border-left: 1px solid #55653d!important;
              }
              
              .rbc-month-row+.rbc-month-row{
                border-top: 1px solid #55653d!important;
              }
              
              .rbc-date-cell{
                text-align: center;
              }
              
              .rbc-date-cell>a, .rbc-date-cell>a:active, .rbc-date-cell>a:visited{
                font-size: 1rem;
                color: var(--gray40);
              }
              
              .rbc-day-slot .rbc-background-event, .rbc-event{
                font-size: 0.8rem !important;
                padding: 0.3rem 0.5rem;
                margin: 0 auto 0.2rem;
                max-width: 90%;
              }
              .tooltipDivPrincial{
                display: flex;
                flex-direction: column;
                gap: 0.4rem;
              }
              
              .tooltipDivPrincial span{
                display: block;
                width:100%;
                height: 20px;
                max-width: 7.5rem;
                margin: 0 auto;
                border-radius: 0.5rem;
              }
              
              
              .tooltipDivPrincial .tooltipOrange{background: #f08026}
              .tooltipDivPrincial .tooltipYellow{background: #e5d501}
              .tooltipDivPrincial .tooltipRed{background: #c0272d}
              .tooltipDivPrincial .tooltipGreen{background: #72b01e}
              .tooltipDivPrincial .tooltipMagento{background: #93278f}
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
                views={{ month: true }}
                toolbar
                resizable
                onEventDrop={onEventDrop}
                components={{
                  event: EventComponent,
                  agenda: {
                    event: EventAgenda
                  }
                }}
                onSelectSlot={(event: any) => {
                  setOpen(true);
                  setEvent(event);
                }}
              // onSelectEvent={(event: any) => alert(event.title)}
              />
            </span>
          </div>
          <span className={styles.botao}>
            <Link href="#">Planeje sua redação</Link>
          </span>
        </div>
      </div>

      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>

          <div className="title">
            <h3>Escolha uma opção:</h3>
          </div>

          <div className="opcoes">
            <span className="opcao" onClick={() => addEvent({...event, title: "Estudar redação"})}>Estudar redação</span>
            <span className="opcao" onClick={() => addEvent({...event, title: "Escrever redação"})}>Escrever redação</span>
            <span className="opcao" onClick={() => addEvent({...event, title: "Aulda de redação"})}>Aulda de redação</span>
            <span className="opcao" onClick={() => addEvent({...event, title: "Ciências Humanas"})}>Ciências Humanas</span>
            <span className="opcao" onClick={() => addEvent({...event, title: "Ciências da Natureza"})}>Ciências da Natureza</span>
            <span className="opcao" onClick={() => addEvent({...event, title: "Matemática"})}>Matemática</span>
            <span className="opcao" onClick={() => addEvent({...event, title: "Linguagens"})}>Linguagens</span>
            <span className="opcao noActive" onClick={() => addEvent({...event, title: null })}>Digite seu texto</span>
          </div>

        </div>
      </Popup>
    </MainLayout>
  )
}

const EventComponent = ({ id, start, end, title, eventProps }: any) => {
  return (
    <Popup
      contentStyle={{
        width: '60px'
      }}
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
      <div className="tooltipDivPrincial">
        <span className="tooltipOrange"></span>
        <span className="tooltipYellow"></span>
        <span className="tooltipRed"></span>
        <span className="tooltipGreen"></span>
        <span className="tooltipMagento"></span>
      </div>
    </Popup>
  );
};

const EventAgenda = ({ event }: any) => {
  return (
    <span>
      <em style={{ backgroundColor: event.eventProps.color }}>{event.title} </em>
      <p>{event.desc}</p>
    </span>
  );
};

export default Calendario
