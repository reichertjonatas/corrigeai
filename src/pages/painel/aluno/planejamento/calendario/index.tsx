import Link from 'next/link'
import React from 'react'
import MainLayout from '../../../../../components/layout/MainLayout'
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { msToTime } from '../../../../../utils/helpers';
import { ICalenderEvents } from '../../../../../models/user';
import { useUserStore } from '../../../../../hooks/userStore';
import { API } from '../../../../../services/api';
import { debugPrint } from '../../../../../utils/debugPrint';



const localizer = momentLocalizer(moment)
// @ts-ignore
const CorrigeAiCalendar = withDragAndDrop(Calendar);

function Calendario() {

  const events = useUserStore(state => state.userInfo.events);
  const initialLoad = useUserStore((state) => state.initialLoad);
  const addNewEvent = useUserStore((state) => state.addEvent);
  const updateDragDrop = useUserStore((state) => state.updateDragDrop);

  const [open, setOpen] = React.useState(false);
  const closeModal = () => setOpen(false);
  const [event, setEvent] = React.useState({});

  // @ts-nocheck
  React.useEffect(() => {
    if(events.length == 1)
      initialLoad()

    debugPrint("==> UseEffects <===");
  }, [initialLoad])

  const onEventDrop = ({ event, start, end, allDay }: any) => {
    const updatedEvent: ICalenderEvents = { ...event, start, end };
    updateDragDrop(event._id, updatedEvent);
  };


  const addEvent = ({ title, event, start, end, allDay }: any) => {
    setOpen(false);

    var isLongTime = false;
    if (msToTime((Math.abs(start - end))).hours > 8 || msToTime((Math.abs(start - end))).minutes == 30)
      isLongTime = true;

    if (title) {
      const newEvent = {
        title: title,
        start,
        end: isLongTime ? new Date(new Date(start).setHours(new Date(start).getHours() + 1)) : end,
        eventProps: {
          color: '#72b01d'
        }
      }
      addNewEvent(newEvent);
    } else {
      const title = window.prompt('Digite seu texto:');
      if (title) {
        const newEvent = {
          title: title,
          start,
          end: isLongTime ? new Date(new Date(start).setHours(new Date(start).getHours() + 1)) : end,
          eventProps: {
            color: 'gray'
          }
        }

        addNewEvent(newEvent);
      }
    }
  }

  return (
    <MainLayout>
      <div className="gridPlanejamento">
        <div className="content">
          <div className="box">
            <h1>Planeje sua semana</h1>
            <span className="desc" style={{ height: 660 }}>
              <CorrigeAiCalendar
                localizer={localizer}
                selectable
                culture='pt-br'
                events={events}
                // startAccessor="start"
                // endAccessor="end"
                defaultDate={moment().toDate()}
                views={{ month: true, day: true }}
                toolbar
                resizable
                onEventDrop={onEventDrop}
                dayPropGetter={date => {
                  return { style: { cursor: 'pointer' } }
                }}
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

                eventPropGetter={(event: any) => {
                  return {
                    style: {
                      backgroundColor: event.eventProps.color, border: 'white solid 1px'
                    }
                  }
                }}

                messages={{ 'today': "Hoje", "previous": 'Anterior', "next": "Próximo", "month": 'Mês', "day": 'Dia', showMore: number => `-> Mais ${number}` }}
              // onSelectEvent={(event: any) => alert(event.title)}
              />
            </span>
          </div>
          <span className="botao">
            <Link href="/painel/aluno/planejamento/redacao">Planeje sua redação</Link>
          </span>
        </div>
      </div>

      <Popup open={open} closeOnDocumentClick onClose={closeModal} contentStyle={{
        width: 'auto',
        borderRadius: '1rem',
        padding: '2rem 1rem 2rem'
      }}>
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>

          <div className="title">
            <h3>Escolha uma opção:</h3>
          </div>

          <div className="opcoes">
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Estudar redação" })}>Estudar redação</span>
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Escrever redação" })}>Escrever redação</span>
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Aulda de redação" })}>Aulda de redação</span>
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Ciências Humanas" })}>Ciências Humanas</span>
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Ciências da Natureza" })}>Ciências da Natureza</span>
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Matemática" })}>Matemática</span>
            <span className="opcao" onClick={() => addEvent({ ...event, title: "Linguagens" })}>Linguagens</span>
            <span className="opcao noActive" onClick={() => addEvent({ ...event, title: null })}>Digite seu texto</span>
          </div>

        </div>
      </Popup>
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
              
              
              .tooltipDivPrincial .tooltipOrange{background: #f08026; cursor: pointer}
              .tooltipDivPrincial .tooltipYellow{background: #e5d501; cursor: pointer}
              .tooltipDivPrincial .tooltipRed{background: #c0272d; cursor: pointer}
              .tooltipDivPrincial .tooltipGreen{background: #72b01e; cursor: pointer}
              .tooltipDivPrincial .tooltipMagento{background: #93278f; cursor: pointer}
              
              .close {
                  font-size: 2.5rem;
                  position: absolute;
                  right: -6%;
                  top: -3%;
                  background: #ffff;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  text-align: center;
                  line-height: 40px;
                  cursor: pointer;
              }

              .noActive {
                  background: var(--gray40) !important;
              }
              
              .title{
                text-align: center;
                margin: 0 0 1rem;
              }
              
              .title h3{
                font-size: 1.3rem;
                color: var(--dark)
              }
              
              .opcoes{
                display: block;
                width: 100%;
              }
              
              .opcoes .opcao{
                display: block;
                background: var(--green);
                width: 100%;
                cursor: pointer;
                max-width: 16.25rem;
                margin: 0 auto 0.5rem auto;
                padding: 0.5rem;
                border-radius: 0.5rem;
                font-weight: 500;
                color: var(--white);
                font-size: 1.1rem;
                transition: all 0.5s ease;
                text-align: center;
              }
              
              .opcoes .opcao:hover{
                background: var(--dark);
              }

              .gridPlanejamento{display: grid; grid-template-columns: 1fr;}
              .gridPlanejamento .content{display: block; width: 100%;}
              .gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
              .gridPlanejamento .content .box h1{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
              .gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1.175rem; color: #72b01e}
              .gridPlanejamento .content .botao a{display: block; width: 100%; max-width: 400px; margin: 2rem auto; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
              .gridPlanejamento .content .botao a:hover{transform: scale(0.9);}




              @media(max-width: 500px){
                .gridPlanejamento{grid-template-columns: 1fr}
              }


            `}</style>
    </MainLayout>
  )
}


const EventComponent = ({ event, start, end, title }: any) => {

  const updateEvent = useUserStore((state) => state.updateEvent);
  const removeEvent = useUserStore((state) => state.removeEvent);

  return (
    event._id != '1' ? <Popup
      contentStyle={{
        width: '60px'
      }}
      key={event._id}
      trigger={open => (
        <span onContextMenu={(e) =>{ 
          e.preventDefault();
          if (confirm('Deseja excluir?')) {
            // Save it!
            removeEvent(event._id);
          }
        }}>
          <p>{title}</p>
          <p>{start}</p>
          <p>{end}</p>
        </span>
      )}
      position="right center"
      on={['hover']}
      closeOnDocumentClick={false}>
      <div className="tooltipDivPrincial">
        <span className="tooltipOrange" onClick={() => updateEvent(event._id, '#f08026')}></span>
        <span className="tooltipYellow" onClick={() => updateEvent(event._id, '#e5d501')}></span>
        <span className="tooltipRed" onClick={() => updateEvent(event._id, '#c0272d')}></span>
        <span className="tooltipGreen" onClick={() => updateEvent(event._id, '#72b01e')}></span>
        <span className="tooltipMagento" onClick={() => updateEvent(event._id, '#93278f')}></span>
      </div> 
    </Popup>: (
        <span key={event._id} onContextMenu={(e) =>{ 
          e.preventDefault();
          if (confirm('Deseja excluir?')) {
            // Save it!
            removeEvent(event._id);
          }
        } }>
          <p>{title}</p>
          <p>{start}</p>
          <p>{end}</p>
        </span>
      )
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
