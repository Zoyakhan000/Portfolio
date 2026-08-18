'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, User, Mail, Phone, Building, DollarSign, MessageSquare, Send, ArrowLeft, CheckCircle2, Clock, Calendar as CalendarIcon, Check, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [gcalUrl, setGcalUrl] = useState<string>('');
  const [icsContent, setIcsContent] = useState<string>('');
  
  const formRef = useRef<HTMLDivElement>(null);

  const triggerBookingConfirmationApi = (bookingObj: any) => {
    fetch('/api/booking/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingObj),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.googleCalendarUrl) setGcalUrl(data.googleCalendarUrl);
        if (data.icsContent) setIcsContent(data.icsContent);
      })
      .catch((err) => console.error('Booking confirmation email error:', err));
  };

  const downloadIcsFile = () => {
    const content =
      icsContent ||
      `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Fiza Rafi Agency//EN\nBEGIN:VEVENT\nSUMMARY:${
        submittedBooking?.service || 'Consultation Call'
      } - Fiza Rafi\nDESCRIPTION:Client: ${
        submittedBooking?.clientName
      }\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${submittedBooking?.date || 'invite'}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [whatsappConfig, setWhatsappConfig] = useState<any>({ number: "", enableWhatsapp: true, enableForm: true, message: "Hi Fiza, I would like to book an appointment on {date} at {time} for {service}." });
  const [formFields, setFormFields] = useState<any[]>([
    { id: 'name', type: 'text', label: 'Full Name *', placeholder: 'John Doe', required: true, icon: 'User', width: 'half' },
    { id: 'email', type: 'email', label: 'Work Email *', placeholder: 'john@company.com', required: true, icon: 'Mail', width: 'half' },
    { id: 'phone', type: 'tel', label: 'Phone Number *', placeholder: '+1 (555) 000-0000', required: true, icon: 'Phone', width: 'half' },
    { id: 'company', type: 'text', label: 'Company Name', placeholder: 'Enterprise Inc.', required: false, icon: 'Building', width: 'half' },
    { id: 'service', type: 'select', label: 'Area of Interest', options: 'High-Performance Sales Funnels, E-Commerce & Shopify, Brand Identity & UI/UX, Conversion Rate Optimization', required: false, icon: 'DollarSign', width: 'full' },
    { id: 'message', type: 'textarea', label: 'How can we help? *', placeholder: 'Tell us about your revenue goals...', required: true, icon: 'MessageSquare', width: 'full' }
  ]);
  const [bookingSlots, setBookingSlots] = useState<string[]>(['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM']);
  const [bookingServices, setBookingServices] = useState<any[]>([
    { id: '1', title: '30 Min Strategy Call', duration: '30 min', description: 'One-on-one high performance consulting session.' },
    { id: '2', title: 'Project Discovery', duration: '45 min', description: 'Technical scope review & architecture design.' },
    { id: '3', title: 'E-Commerce Growth Audit', duration: '60 min', description: 'Conversion rate optimization & CRO funnel review.' }
  ]);
  const [calendarBookings, setCalendarBookings] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const waStr = localStorage.getItem('rizwan_admin_whatsapp');
      if (waStr) setWhatsappConfig(JSON.parse(waStr));
    } catch {}
    try {
      const fieldsStr = localStorage.getItem('rizwan_contact_fields');
      if (fieldsStr) setFormFields(JSON.parse(fieldsStr));
    } catch {}
    try {
      const slotsStr = localStorage.getItem('rizwan_booking_slots');
      if (slotsStr) setBookingSlots(JSON.parse(slotsStr));
    } catch {}
    try {
      const servicesStr = localStorage.getItem('rizwan_booking_services');
      if (servicesStr) setBookingServices(JSON.parse(servicesStr));
    } catch {}
    try {
      const bookingsStr = localStorage.getItem('rizwan_calendar_bookings');
      if (bookingsStr) setCalendarBookings(JSON.parse(bookingsStr));
    } catch {}
    try {
      const blockedStr = localStorage.getItem('rizwan_blocked_dates');
      if (blockedStr) setBlockedDates(JSON.parse(blockedStr));
    } catch {}
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    const prevMonthDate = new Date(year, month - 1, 1);
    const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prevMonthDate >= currentMonthDate) {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (dateObj: Date) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isPastMonth = new Date(year, month, 1) <= new Date(today.getFullYear(), today.getMonth(), 1);

  const isSlotBooked = (dateObj: Date, slot: string) => {
    const dateKey = formatDateKey(dateObj);
    return calendarBookings.some(b => b.date === dateKey && b.time === slot && b.status !== 'Cancelled');
  };

  const saveNewBookingToStorage = (bookingObj: any) => {
    try {
      const existingBookings = JSON.parse(localStorage.getItem('rizwan_calendar_bookings') || '[]');
      const updatedBookings = [bookingObj, ...existingBookings];
      localStorage.setItem('rizwan_calendar_bookings', JSON.stringify(updatedBookings));
      setCalendarBookings(updatedBookings);
    } catch (e) {}
  };

  const handleBookWithWhatsApp = () => {
    if (!selectedDate || !selectedTime) return;
    const dateStr = selectedDate.toDateString();
    const dateKey = formatDateKey(selectedDate);
    
    // Save to calendar bookings
    const newBooking = {
      id: 'b_' + Date.now(),
      clientName: 'WhatsApp Client',
      email: 'Via WhatsApp',
      phone: whatsappConfig.number || 'N/A',
      date: dateKey,
      time: selectedTime,
      service: selectedService?.title || '30 Min Strategy Call',
      status: 'Confirmed',
      notes: 'Booked directly via WhatsApp booking widget'
    };
    saveNewBookingToStorage(newBooking);

    // Build message
    const template = whatsappConfig.message || "Hi Fiza, I would like to book an appointment on {date} at {time} for {service}.";
    const message = template
      .replace(/{date}/g, dateStr)
      .replace(/{time}/g, selectedTime)
      .replace(/{service}/g, selectedService?.title || 'Strategy Call');
    
    const phone = whatsappConfig.number || '1234567890';
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setSubmittedBooking(newBooking);
    triggerBookingConfirmationApi(newBooking);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select a Date and Time slot first!');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    let name = 'Unknown';
    let email = 'Unknown';
    let phone = 'Not provided';
    let company = 'Not provided';
    let service = selectedService?.title || 'Strategy Call';
    let messageBody = '';
    
    const extras: string[] = [];
    
    formFields.forEach(field => {
      const val = formData.get(field.id)?.toString() || '';
      if (field.id === 'name' || field.label.toLowerCase().includes('name')) name = val || name;
      else if (field.id === 'email' || field.type === 'email') email = val || email;
      else if (field.id === 'phone' || field.type === 'tel') phone = val || phone;
      else if (field.id === 'company' || field.label.toLowerCase().includes('company')) company = val || company;
      else if (field.id === 'service' || field.type === 'select') service = val || service;
      else if (field.id === 'message' || field.type === 'textarea') messageBody = val || messageBody;
      else {
        if (val) extras.push(`${field.label}: ${val}`);
      }
    });

    if (extras.length > 0) {
      messageBody += (messageBody ? '\n\n' : '') + '--- Additional Info ---\n' + extras.join('\n');
    }

    const dateKey = formatDateKey(selectedDate);

    // Save Calendar Booking
    const newBooking = {
      id: 'b_' + Date.now(),
      clientName: name,
      email: email,
      phone: phone,
      company: company,
      date: dateKey,
      time: selectedTime,
      service: service,
      status: 'Confirmed',
      notes: messageBody
    };
    saveNewBookingToStorage(newBooking);

    // Save Inquiry
    const newInquiry = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      company: company,
      service: service,
      budget: 'N/A',
      country: 'N/A',
      message: messageBody + `\n\n[Scheduled Appointment: ${selectedDate.toDateString()} at ${selectedTime}]`,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      read: false,
    };
    
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('rizwan_inquiries') || '[]');
      localStorage.setItem('rizwan_inquiries', JSON.stringify([newInquiry, ...existingInquiries]));
    } catch (err) {}

    setSubmittedBooking(newBooking);
    triggerBookingConfirmationApi(newBooking);
    form.reset();
  };


  return (
    <div className="min-h-screen bg-[#100D09] text-[#F9F7F2] font-sans selection:bg-[#E59500] selection:text-[#15120E]">
      <nav className="w-full p-6 flex justify-between items-center absolute top-0 left-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#1C1712] border border-[#2C2419] flex items-center justify-center group-hover:border-[#E59500] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#E59500]" />
          </div>
          <span className="font-bold tracking-widest uppercase text-xs">Back To Home</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-24 space-y-16">
        
        {/* SUCCESS MODAL / SCREEN */}
        {submittedBooking ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1C1712] border border-[#E59500]/30 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#E59500]/15 border border-[#E59500] flex items-center justify-center mx-auto text-[#E59500]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-[#F9F7F2] tracking-tight">Appointment Scheduled!</h2>
              <p className="text-xs text-[#A69D92] mt-2">Your strategy session has been locked into the calendar.</p>
            </div>

            <div className="bg-[#231F17] border border-[#2C2419] p-5 rounded-2xl text-left space-y-3 font-mono text-xs text-[#F9F7F2]">
              <div className="flex justify-between border-b border-[#2C2419] pb-2">
                <span className="text-[#A69D92]">Client:</span>
                <span className="font-bold">{submittedBooking.clientName}</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2419] pb-2">
                <span className="text-[#A69D92]">Date:</span>
                <span className="font-bold text-[#E59500]">{submittedBooking.date}</span>
              </div>
              <div className="flex justify-between border-b border-[#2C2419] pb-2">
                <span className="text-[#A69D92]">Time Slot:</span>
                <span className="font-bold text-[#E59500]">{submittedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A69D92]">Service:</span>
                <span className="font-bold">{submittedBooking.service}</span>
              </div>
            </div>

            {/* CALENDAR SYNC & INVITE ACTION BUTTONS */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={
                  gcalUrl ||
                  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    `${submittedBooking.service || 'Strategy Call'} - Fiza Rafi`
                  )}&details=${encodeURIComponent(`Client: ${submittedBooking.clientName}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#15120E] border border-[#E59500]/50 text-[#E59500] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#E59500] hover:text-[#15120E] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4" />
                Add to Google Calendar
              </a>

              <button
                onClick={downloadIcsFile}
                className="px-4 py-3 bg-[#15120E] border border-blue-500/50 text-blue-400 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-500 hover:text-[#15120E] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Download .ics Invite
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSubmittedBooking(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setShowForm(false);
                }}
                className="px-6 py-3 bg-[#E59500] text-[#15120E] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F1A417] transition-all"
              >
                Book Another Slot
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-[#231F17] border border-[#2C2419] text-[#F9F7F2] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2C2419] transition-all text-center inline-block"
              >
                Return to Portfolio
              </Link>
            </div>

          </motion.div>
        ) : (
          /* BOOKING WIDGET */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-[#2C2419] bg-[#231F17]"
          >
            {/* LEFT SIDE: SERVICES / CALL TYPES */}
            <div className="md:w-[40%] bg-[#E59500] text-[#15120E] p-8 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="inline-block px-3 py-1 bg-[#15120E]/10 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                  Interactive Calendar
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase mb-1">Fiza Rafi</h2>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-6">Strategic Growth Consultant</p>

                <div className="space-y-3">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#15120E]/70 mb-1">Select Service Type</p>
                  {bookingServices.map((service) => {
                    const isSel = selectedService?.id === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${
                          isSel 
                            ? 'bg-[#15120E] text-[#F9F7F2] border-[#15120E] shadow-lg' 
                            : 'bg-[#15120E]/10 text-[#15120E] border-transparent hover:bg-[#15120E]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{service.title}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${isSel ? 'bg-[#E59500] text-[#15120E] font-bold' : 'bg-[#15120E]/20 text-[#15120E]'}`}>
                            {service.duration || '30 min'}
                          </span>
                        </div>
                        {service.description && (
                          <p className={`text-[11px] mt-1 line-clamp-2 ${isSel ? 'text-[#A69D92]' : 'text-[#15120E]/80'}`}>
                            {service.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#15120E]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#15120E]" />
                  <span>Instant Calendar Sync</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#15120E]" />
                  <span>Direct WhatsApp or Email Confirmation</span>
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE: CALENDAR & SLOTS */}
            <div className="md:w-[60%] p-6 sm:p-8 bg-[#1C1712] flex flex-col justify-between">
              <div>
                {/* CALENDAR HEADER & MONTH NAV */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-[#F9F7F2]">Select Date & Time</h3>
                    <p className="text-xs text-[#A69D92]">Pick an open slot on the calendar.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#231F17] p-1.5 rounded-xl border border-[#2C2419]">
                    <button
                      onClick={handlePrevMonth}
                      disabled={isPastMonth}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isPastMonth ? 'opacity-30 cursor-not-allowed text-[#6B6053]' : 'hover:bg-[#2C2419] text-[#F9F7F2] cursor-pointer'
                      }`}

                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold font-mono px-2 text-[#E59500]">
                      {monthNames[month]} {year}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg hover:bg-[#2C2419] text-[#F9F7F2] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* CALENDAR DAYS GRID */}
                <div className="grid grid-cols-7 gap-1.5 mb-6">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-mono font-bold text-[#A69D92] py-1">{d}</div>
                  ))}

                  {/* Padding offset for first day of month */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateObj = new Date(year, month, dayNum);
                    dateObj.setHours(0, 0, 0, 0);

                    const dateKey = formatDateKey(dateObj);
                    const isPast = dateObj < today;
                    const isBlocked = blockedDates.includes(dateKey);
                    const isSelected = selectedDate ? formatDateKey(selectedDate) === dateKey : false;
                    const isDisabled = isPast || isBlocked;

                    return (
                      <button
                        key={dayNum}
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedDate(dateObj);
                          setSelectedTime(null);
                        }}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-[#E59500] text-[#15120E] shadow-md shadow-[#E59500]/20 scale-105 z-10' 
                            : isDisabled
                            ? 'bg-[#15120E]/40 text-[#6B6053]/40 cursor-not-allowed line-through'
                            : 'bg-[#231F17] hover:bg-[#2C2419] text-[#F9F7F2] border border-[#2C2419]/60 hover:border-[#E59500]/50 cursor-pointer'
                        }`}
                      >
                        {dayNum}
                        {isBlocked && <span className="text-[8px] font-mono text-red-400">Off</span>}
                      </button>
                    );
                  })}
                </div>

                {/* AVAILABLE TIME SLOTS */}
                {selectedDate ? (
                  <div className="space-y-3 animate-fadeIn border-t border-[#2C2419] pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#F9F7F2] uppercase font-mono tracking-wider">
                        Available Times for <span className="text-[#E59500]">{selectedDate.toDateString()}</span>
                      </h4>
                      <span className="text-[10px] text-[#A69D92] font-mono">{bookingSlots.length} Slots Configured</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {bookingSlots.map((time) => {
                        const booked = isSlotBooked(selectedDate, time);
                        const isTimeSel = selectedTime === time;

                        return (
                          <button
                            key={time}
                            disabled={booked}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                              booked 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20 cursor-not-allowed line-through' 
                                : isTimeSel 
                                ? 'bg-[#E59500] text-[#15120E] border-[#E59500] shadow-md' 
                                : 'bg-[#231F17] text-[#F9F7F2] border-[#2C2419] hover:border-[#E59500] cursor-pointer'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {time}
                            {booked && <span className="text-[8px] uppercase font-mono bg-red-500/20 px-1 rounded ml-1">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-[#2C2419] rounded-2xl bg-[#231F17]/30">
                    <CalendarIcon className="w-6 h-6 text-[#6B6053] mx-auto mb-2" />
                    <p className="text-xs text-[#A69D92]">Select a date above to view open time slots.</p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              {selectedDate && selectedTime && (
                <div className="mt-6 space-y-3 animate-fadeIn pt-4 border-t border-[#2C2419]">
                  <div className="p-3 bg-[#E59500]/10 border border-[#E59500]/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-[#A69D92]">Selected Appointment:</span>
                    <span className="font-bold text-[#E59500] font-mono">{selectedDate.toLocaleDateString()} at {selectedTime}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {whatsappConfig.enableWhatsapp && (
                      <button
                        onClick={handleBookWithWhatsApp}
                        className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Book via WhatsApp
                      </button>
                    )}
                    {whatsappConfig.enableForm && (
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                        }}
                        className="w-full py-3.5 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Proceed to Form
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CONTACT FORM SECTION */}
        <AnimatePresence>
          {showForm && !submittedBooking && (
            <motion.div 
              ref={formRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center mb-8">
                Brief Your <span className="text-[#E59500]">Project</span>
              </h2>
              <div className="w-full bg-[#1C1712] border border-[#2C2419] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                
                {selectedDate && selectedTime && (
                  <div className="mb-8 p-4 bg-[#E59500]/10 border border-[#E59500]/30 rounded-2xl flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E59500] text-[#15120E] flex items-center justify-center font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#F9F7F2]">Appointment Reserved</p>
                        <p className="text-[11px] text-[#A69D92] font-mono">{selectedDate.toDateString()} @ {selectedTime} ({selectedService?.title})</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-xs text-[#E59500] hover:underline font-mono"
                    >
                      Change Date/Time
                    </button>
                  </div>
                )}

                <form className="space-y-6 relative z-10" onSubmit={handleContactSubmit}>
                  
                  <div className="flex flex-wrap gap-y-6 -mx-3">
                    {formFields.map((field) => (
                      <div key={field.id} className={`px-3 ${field.width === 'half' ? 'w-full md:w-1/2' : 'w-full'}`}>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono tracking-widest text-[#A69D92] uppercase font-bold ml-1">
                            {field.label}
                          </label>
                          <div className="relative">
                            {field.icon === 'User' && <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6053]" />}
                            {field.icon === 'Mail' && <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6053]" />}
                            {field.icon === 'Phone' && <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6053]" />}
                            {field.icon === 'Building' && <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6053]" />}
                            {field.icon === 'DollarSign' && <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6053]" />}
                            {field.icon === 'MessageSquare' && <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#6B6053]" />}
                            
                            {field.type === 'textarea' ? (
                              <textarea
                                name={field.id}
                                required={field.required}
                                placeholder={field.placeholder}
                                rows={4}
                                className="w-full bg-[#231F17] border border-[#3C3224] focus:border-[#E59500] rounded-xl py-4 pl-12 pr-4 text-sm text-[#F9F7F2] outline-none transition-all placeholder:text-[#6B6053] resize-none"
                              ></textarea>
                            ) : field.type === 'select' ? (
                              <>
                                <select 
                                  name={field.id}
                                  required={field.required}
                                  className="w-full bg-[#231F17] border border-[#3C3224] focus:border-[#E59500] rounded-xl py-3.5 pl-12 pr-10 text-sm text-[#F9F7F2] outline-none transition-all appearance-none cursor-pointer font-medium"
                                >
                                  {field.options?.split(',').map((opt: string, i: number) => (
                                    <option key={i} value={opt.trim()}>{opt.trim()}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6053] pointer-events-none" />
                              </>
                            ) : (
                              <input 
                                type={field.type}
                                name={field.id}
                                required={field.required}
                                placeholder={field.placeholder}
                                className="w-full bg-[#231F17] border border-[#3C3224] focus:border-[#E59500] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[#F9F7F2] outline-none transition-all placeholder:text-[#6B6053]"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] font-black text-sm uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#E59500]/20 hover:shadow-[#E59500]/40 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
                    >
                      Confirm Booking & Submit Inquiry
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="text-center pt-2">
                    <p className="text-[9px] font-mono text-[#6B6053] tracking-[0.1em] uppercase">
                      Secure Calendar Protocol • Confidential Consultation
                    </p>
                  </div>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
