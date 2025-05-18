// AppointmentCalendar component
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppointments } from "../../../hooks/useAppointments";
import AppointmentForm from "./AppointmentForm";
import Modal from "../../common/Modal";

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({ staffId, customerId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // "view", "create", "edit"
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const { getAppointments, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  
  // Randevuları yükle
  useEffect(() => {
    loadAppointments();
  }, [staffId, customerId]);
  
  const loadAppointments = async () => {
    try {
      const filters = {};
      if (staffId) filters.staffId = staffId;
      if (customerId) filters.customerId = customerId;
      
      const result = await getAppointments(filters);
      
      // Calendar formatına dönüştür
      const formattedAppointments = result.map(appointment => ({
        id: appointment._id,
        title: appointment.service.name,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        resource: appointment
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Randevular yüklenirken hata oluştu:", error);
    }
  };
  
  // Diğer fonksiyonlar...
  
  return (
    <div className="appointment-calendar">
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={(event) => {
          setSelectedAppointment(event.resource);
          setModalType("view");
          setShowModal(true);
        }}
        onSelectSlot={(slotInfo) => {
          setSelectedSlot({
            startTime: slotInfo.start,
            endTime: slotInfo.end
          });
          setModalType("create");
          setShowModal(true);
        }}
        selectable
        step={15}
        timeslots={4}
        defaultView="week"
        views={["day", "week", "month"]}
      />
      
      {/* Modal */}
    </div>
  );
};

export default AppointmentCalendar;
