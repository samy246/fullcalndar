import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form } from "react-bootstrap";
import Datetime from "react-datetime";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
//import Modal from "react-modal"
//import "./Modal.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

// const events = [

//         { title: 'event 1', date: '2023-01-01' },
//         { title: 'event 2', start: '2023-01-02T14:00:00',end:'2023-01-02T15:00:00',allday:false }

//   ];

function Calender() {
  const store = [];

  const [show, setShow] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    contactno: "",
    title: "",
    start: "",
    end: "",
  });
  const [allEvent, setAllEvents] = useState([]);
  const { name, contactno, title, start, end } = newEvent;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:3005/api/get");
    console.log("========>",response.data);
    setAllEvents(response.data);
  };
  useEffect(() => {
    loadData();
  }, []);
  console.log(setData);

  const validate = () => {
    let proceed = true;
    let errormsg = " Please ";
    if (newEvent.name == "") {
      proceed = false;
      errormsg += " Enter Your Name";
    }
    if (newEvent.title == "") {
      proceed = false;
      errormsg += " Select Beautician";
    }
    if (newEvent.start == "") {
      proceed = false;
      errormsg += " Select Start Time";
    }
    if (newEvent.end == "") {
      proceed = false;
      errormsg += " Select End Time";
    }
    if (!proceed) {
      toast.error(errormsg);
    }
    return proceed;
  };

  const duplicatevalidate = () => {
    let ok = true;
    for (var i = 0; i < allEvent.length; i++) {
      console.log("allEvent[i].start", allEvent[i].start);
      console.log("newEvent.titl", newEvent.title);

      console.log("start", start);
      console.log("cvt", new Date(allEvent[i].start).toLocaleString());
      console.log("cvt start", new Date(start).toLocaleString());
      if (
        new Date(allEvent[i].start).toLocaleString() ===
          new Date(start).toLocaleString() &&
        newEvent.title === allEvent[i].title
      ) {
        toast.warning(
          "Your Selected Technician '" +
            newEvent.title +
            "' Busy that Start Time! TRY ANOTHER START TIME"
        );
        ok = false;
      }
    }
    return ok;
  };

  function handleaddEvent() {
    if (validate()) {
      console.log("newEvent.titl", newEvent.title);
      console.log("newEvent", newEvent);
      console.log("all", allEvent);

      handleClose();

      if (duplicatevalidate()) {
        axios
          .post("http://localhost:3005/api/post", {
            name,
            contactno,
            title,
            start,
            end,
          })
          .then(() => {

          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" Booked SUccessfully");
        setAllEvents([...allEvent, newEvent]);

        setNewEvent({ name: "", contactno: "", title: "", start: "", end: "" });
        // .catch((err)=>toast.error(err.response.data));
        // toast.success(" Booked SUccessfully");
        // const api = calendarRef.current.getApi();
        // api.addEvent(event);
      }
    }
  }

  const isWeekday = (date) => {
    const day = date.getDay();

    return day !== 5;
  };

  return (
    <>
      <ToastContainer theme="colored"></ToastContainer>

      <h2>Welcome To Beauty Saloon Shop</h2>
      <Button variant="primary" onClick={handleShow}>
       Create Appointment
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-grid align-items-left justify-content-left">
          <lable> Your Name:</lable>

          <input
            type="text"
            placeholder="Add Title"
            className="form-control"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <label>Contact No</label>
          <input
            type="text"
            placeholder="Add ContactNo"
            className="form-control"
            value={newEvent.contactno}
            onChange={(e) =>
              setNewEvent({ ...newEvent, contactno: e.target.value })
            }
          />

          <label>Select Beautician</label>
          <select
            id="lang"
            className="form-control"
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            value={newEvent.title}
          >
            <option value="">Select</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="B3">B3</option>
            <option value="B4">B4</option>
            <option value="B5">B5</option>
          </select>
          <label>Start Time</label>
          <DatePicker
            placeholderText="start"
            className="form-control"
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mmaa"
            timeIntervals={60}
            // dateFormat="dd/MM/yyyy"
            // style={{marginRight:"10px"}}
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })}
            filterDate={isWeekday}
          />
          <label>End Time</label>
          <DatePicker
            placeholderText="End"
            className="form-control"
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mmaa"
            timeIntervals={60}
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })}
            filterDate={isWeekday}
          />

          <Button
            style={{ marginTop: "10px", width: "50%" }}
            variant="success"
            onClick={handleaddEvent}
          >
            Book Schedule
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close Modal
          </Button>
        </Modal.Footer>
      </Modal>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          center: "dayGridMonth,timeGridWeek,timeGridDay",
        }}

        events=  {allEvent.map((event) => {
          return {
            id: event.id,

            start: event.start,
            end: event.end,
            title: `technician${event.title}, `+"\n"+` Name ${event.name} `,
          }
        })}





        hiddenDays={[5]}
        // eventColor="blue"
        eventBackgroundColor="blue"
        // nowIndicator
        eventDisplay
        dateClick={(e) => console.log(e.dateStr)}
        eventClick={(e) => console.log(e.event.id)}
      />
    </>
  );
}

export default Calender;
