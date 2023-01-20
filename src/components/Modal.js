import React, { useState } from "react";
import Modal from "react-modal"
import "./Modal.css";
import Datetime from 'react-datetime';
export default function (isopen,onclose,onEventAdded) {
    const [title,setTitle]=useState(" ");
    const [start,setStart]=useState(new Date());
    const [end,setEnd]=useState(new Date());

const onSubmit=(event)=>{
event.preventDefault();

onEventAdded({
    title,
    start,
    end
})
onclose();
}

return(
    <Modal>
        <form onSubmit={onSubmit}>
            <input placeholder="Title" value={title} onChange={e=>SVGTextPositioningElement(e.target.value)}/>
            <div>
                <labe>Start Date</labe>
            <Datetime value={start} onChange={date=>setStart(date)} />
            </div>
            <div>
                <labe>End Date</labe>
            <Datetime value={end} onChange={date=>setEnd(date)} />
            </div>
<button>Add Evenet</button>
        </form>
    </Modal>
)
}