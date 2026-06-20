const rooms = [
  {
    id: "main-bar",
    name: "Main Bar and Alfresco Area",
    image: "assets/main-bar-alfresco-fire.jpg",
    gallery: [
      "assets/main-bar-alfresco-fire.jpg",
      "assets/main-bar-alfresco-tables.jpg",
      "assets/main-bar-evening.jpg",
      "assets/main-bar-garden-party.jpg",
      "assets/main-bar-garden-picnic.jpg",
      "assets/main-bar-cocktail.png",
      "assets/main-bar-picnic-lounge.png",
      "assets/main-bar-indoor-lounge.png",
      "assets/main-bar-event-setting.png",
      "assets/main-bar-fireplace.jpg"
    ],
    summary: "Casual lounge and bar facilities with a large outdoor alfresco area.",
    capacity: { cocktail: 300, seated: 80, theatre: 0, meeting: 80 },
    notes: ["Bar: 80 standing with limited seating", "Alfresco: 300 standing or cocktail"],
    rates: { weekdayDay: [300, 400], weekdayNight: [400, 500], weekendDay: [450, 550], weekendNight: [550, 650] }
  },
  {
    id: "long-room",
    name: "The Long Room",
    image: "assets/long-room-ceremony.png",
    gallery: [
      "assets/long-room-ceremony.png",
      "assets/long-room-dinner.png"
    ],
    summary: "A flexible heritage room suited to cocktail events, theatre layouts, and smaller seated functions.",
    capacity: { cocktail: 100, seated: 60, theatre: 60, meeting: 60 },
    notes: ["Cocktail: 100", "Theatre: 60", "Seated: dependent on setup"],
    rates: { weekdayDay: [300, 400], weekdayNight: [400, 500], weekendDay: [450, 550], weekendNight: [550, 650] }
  },
  {
    id: "billards-room",
    name: "The Billards Room",
    image: "assets/billiards-dining.png",
    gallery: [
      "assets/billiards-dining.png",
      "assets/billiards-performance.jpg",
      "assets/billiards-theatre.jpg",
      "assets/billiards-entry.jpg"
    ],
    summary: "A larger function room with a small stage at the front of the room.",
    capacity: { cocktail: 150, seated: 100, theatre: 100, meeting: 100 },
    notes: ["Seated: 100", "Cocktail: 150", "Small stage included"],
    rates: { weekdayDay: [300, 400], weekdayNight: [350, 450], weekendDay: [400, 500], weekendNight: [450, 550] }
  },
  {
    id: "old-bowling-lawn",
    name: "The Old Bowling Lawn",
    image: "assets/old-lawn-night-dinner.jpg",
    gallery: [
      "assets/old-lawn-night-dinner.jpg",
      "assets/old-lawn-large-night.png",
      "assets/old-lawn-cocktail.jpg",
      "assets/old-lawn-ceremony.png",
      "assets/old-lawn-picnic.jpg",
      "assets/old-lawn-seated-event.png"
    ],
    summary: "The biggest blank-canvas space for weddings, community events, and large celebrations.",
    capacity: { cocktail: 600, seated: 400, theatre: 400, meeting: 400 },
    notes: ["Seated: 400", "Cocktail: 600", "Outdoor large-format events"],
    rates: { weekdayDay: [550, 650], weekdayNight: [650, 750], weekendDay: [650, 750], weekendNight: [750, 850] }
  }
];

const MEMBER_LOOKUP_ENDPOINT = window.HANNANS_MEMBER_LOOKUP_URL || "/api/member-lookup";

const sampleMembers = [
  {
    memberNumber: "1001",
    name: "Demo Member",
    phone: "0400 000 000",
    phoneLast4: "0000",
    email: "member@example.com",
    status: "active",
    membershipType: "Single or couple member"
  },
  {
    memberNumber: "HC1896",
    name: "Hannans Sample",
    phone: "08 9021 1234",
    phoneLast4: "1234",
    email: "sample@hannansclub.com.au",
    status: "active",
    membershipType: "Social member"
  }
];

const vendors = [
  ["Browns Party Hire", "(08) 9091 2555 | 0407 370 714 | brownspartyhire1@bigpond.com"],
  ["Celebration City", "(08) 9091 8866 | sales@celebrationcity.com.au"],
  ["Goldfields Audio Visiual Services", "0417 249 075 | chuck@rdi.email"],
  ["BMG Productions", "(08) 9021 1777 | 0415 889 029 | hire@bmgproductions.com.au"],
  ["Kalgoorlie Weddings and Events", "0413 631 802 | info@kalgoorlieweddingsandevents.com.au"],
  ["Red Edge Events", "0413 631 802 | events@rededgeevents.com"],
  ["Party Boss", "0488 991 776 | 0439 444 402 | events@partyboss.com.au"]
];

const importedBookingData = window.HANNANS_IMPORTED_BOOKINGS || {};
let savedAdminBookings = JSON.parse(localStorage.getItem("hannansAdminBookings") || "[]");
let savedBookingEdits = JSON.parse(localStorage.getItem("hannansBookingEdits") || "{}");
let runSheetTasks = JSON.parse(localStorage.getItem("hannansRunSheetTasks") || "{}");
let deletedBookingIds = JSON.parse(localStorage.getItem("hannansDeletedBookingIds") || "[]");

const baseAdminBookings = importedBookingData.bookings?.length ? importedBookingData.bookings : [
  {
    id: "BK-1027",
    client: "Samantha Rivers",
    eventName: "Rivers Wedding Reception",
    date: "2026-06-20",
    roomId: "billards-room",
    guests: 92,
    start: "5:00 PM",
    finish: "11:30 PM",
    package: "Arrival bubbles, 2-hour beverage package",
    catering: "Raj's Copper Bowl",
    setup: "Seated dining, stage for speeches, gift table near entry",
    staff: "2 bar staff, 1 floor staff",
    suppliers: "Goldfields Audio Visual Service, Browns Party Hire",
    notes: "Security required. Last drinks at 11:15 PM. Confirm cake table and microphone on arrival."
  },
  {
    id: "BK-1031",
    client: "Goldfields Business Network",
    eventName: "Networking Sundowner",
    date: "2026-06-21",
    roomId: "main-bar",
    guests: 130,
    start: "2:00 PM",
    finish: "5:00 PM",
    package: "Bar tab with set limit",
    catering: "Outside catering",
    setup: "Cocktail tables across alfresco, lectern by patio doors",
    staff: "2 bar staff",
    suppliers: "Celebration City",
    notes: "Host responsible for outside catering cleanup. Keep access clear to bar."
  },
  {
    id: "BK-1040",
    client: "Kalgoorlie Community Arts",
    eventName: "Outdoor Awards Night",
    date: "2026-06-27",
    roomId: "old-bowling-lawn",
    guests: 240,
    start: "4:00 PM",
    finish: "10:00 PM",
    package: "Arrival cocktail, beverage package",
    catering: "Raj's Copper Bowl",
    setup: "Outdoor seated tables, small stage, awards table, lighting rig",
    staff: "3 bar staff, 2 floor staff",
    suppliers: "BMG Productions, Party Boss",
    notes: "Security required. Wet weather check required two days prior."
  }
];

let adminBookings = [];

const defaultStaffMembers = [
  "Unassigned",
  "Alison Melia",
  "Amalia Talet",
  "Angel Cachumbo",
  "Charlotte Juster",
  "Emeline Miller",
  "Emma Dimmack",
  "Hope Nicklin",
  "Kaita Adams",
  "Katrina Hansen",
  "Kayla Fairbairn",
  "Martin Lahbari",
  "Mathis Besel",
  "Meg Cusick",
  "Melissa Horcholle",
  "Sarah Hughes",
  "Sunshine Muchanyangi"
];

let staffMembers = JSON.parse(localStorage.getItem("hannansStaffMembers") || "null") || [...defaultStaffMembers];
let staffAssignments = JSON.parse(localStorage.getItem("hannansStaffAssignments") || "{}");
let eventChecklists = JSON.parse(localStorage.getItem("hannansEventChecklists") || "{}");

const defaultChecklistItems = [
  "Booking details reviewed",
  "Deposit or venue hire payment confirmed",
  "Membership status confirmed",
  "Room setup confirmed",
  "Catering confirmed",
  "Beverage details confirmed",
  "Vendors and suppliers confirmed",
  "Staff assigned",
  "Follow-up email/contact with event holder completed",
  "Final numbers confirmed",
  "Run sheet printed"
];

const sampleBookings = Object.keys(importedBookingData.availability || {}).length ? importedBookingData.availability : {
  "2026-06-20": {
    "billards-room": "Wedding reception",
    "long-room": "Private lunch"
  },
  "2026-06-21": {
    "main-bar": "Member event",
    "old-bowling-lawn": "Community function"
  },
  "2026-06-27": {
    "old-bowling-lawn": "Large celebration"
  },
  "2026-07-04": {
    "main-bar": "Birthday function",
    "billards-room": "Corporate dinner",
    "long-room": "Training day"
  },
  "2026-07-12": {
    "old-bowling-lawn": "Wedding ceremony"
  },
  "2026-07-18": {
    "main-bar": "Cocktail evening",
    "long-room": "Board dinner",
    "billards-room": "Awards night",
    "old-bowling-lawn": "Festival booking"
  }
};

const roomColours = {
  "main-bar": "#3b82f6",
  "long-room": "#ef4444",
  "billards-room": "#10b981",
  "old-bowling-lawn": "#bd8f48"
};

const roomNameById = {
  "main-bar": "Main Bar and Alfresco Area",
  "long-room": "The Long Room",
  "billards-room": "The Billards Room",
  "old-bowling-lawn": "The Old Bowling Lawn",
  library: "Library",
  external: "External"
};

const timeSlots = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM"
];

const fallbackSlotHolds = {
  "2026-06-20": {
    "billards-room": ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"],
    "long-room": ["11:00 AM", "12:00 PM", "1:00 PM"]
  },
  "2026-06-21": {
    "main-bar": ["2:00 PM", "3:00 PM", "4:00 PM"],
    "old-bowling-lawn": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
  },
  "2026-06-27": {
    "old-bowling-lawn": ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"]
  },
  "2026-07-04": {
    "main-bar": ["6:00 PM", "7:00 PM", "8:00 PM"],
    "billards-room": ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
    "long-room": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
  },
  "2026-07-12": {
    "old-bowling-lawn": ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]
  },
  "2026-07-18": {
    "main-bar": ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
    "long-room": ["6:00 PM", "7:00 PM", "8:00 PM"],
    "billards-room": ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"],
    "old-bowling-lawn": ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"]
  }
};

const slotHolds = buildSlotHolds();

const state = {
  selectedRoomId: "billards-room",
  calendarDate: new Date(),
  selectedDate: dateKey(new Date()),
  today: dateKey(new Date()),
  lightboxImages: [],
  lightboxIndex: 0,
  lightboxTitle: "",
  verifiedMember: null,
  adminView: "upcoming",
  selectedBookingId: null,
  adminMonth: "all",
  editingBookingId: null,
  adminToken: "",
  adminLoggedIn: false,
  adminTimeoutId: null,
  selectedSlotRoomId: null,
  selectedSlotTimes: [],
  selectedSlotRangeStart: null,
  currentReport: null
};

const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
const el = (id) => document.getElementById(id);
let adminEventNotes = JSON.parse(localStorage.getItem("hannansAdminEventNotes") || "{}");

function rebuildAdminBookings() {
  adminBookings = [
    ...baseAdminBookings.map((booking) => ({
      ...booking,
      package: booking.package === "From 2026 bookings spreadsheet" ? "" : booking.package,
      ...(savedBookingEdits[booking.id] || {})
    })),
    ...savedAdminBookings.map((booking) => ({
      ...booking,
      ...(savedBookingEdits[booking.id] || {})
    }))
  ].filter((booking) => !deletedBookingIds.includes(booking.id));
}

rebuildAdminBookings();

function getInputs() {
  const date = el("eventDate").value || state.selectedDate;
  const startTime = el("eventStart").value || "09:00";
  const finishTime = el("eventFinish").value || "17:00";
  return {
    eventType: el("eventType").value,
    guests: Number(el("guestCount").value || 0),
    date,
    startTime,
    finishTime,
    hireWindow: deriveHireWindow(date, startTime, finishTime),
    membership: el("membership").value
  };
}

function inputTimeToMinutes(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function deriveHireWindow(dateValue, startTime, finishTime) {
  const date = new Date(`${dateValue || state.selectedDate}T12:00:00`);
  const day = date.getDay();
  const isWeekendRate = day === 0 || day === 5 || day === 6;
  const start = inputTimeToMinutes(startTime);
  const finish = inputTimeToMinutes(finishTime);
  const touchesEvening = start >= 17 * 60 || finish > 17 * 60 || finish <= start;
  return `${isWeekendRate ? "weekend" : "weekday"}${touchesEvening ? "Night" : "Day"}`;
}

function displayTime(value) {
  if (!value) return "TBA";
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date(2026, 0, 1, hours || 0, minutes || 0);
  return date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
}

function timeWindowText(inputs = getInputs()) {
  return `${formatDate(inputs.date)} from ${displayTime(inputs.startTime)} to ${displayTime(inputs.finishTime)}`;
}

function slotTimeToInput(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hours = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function addOneHour(value) {
  const minutes = inputTimeToMinutes(value) + 60;
  return `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function applySelectedSlotTimesToInputs() {
  const sorted = [...state.selectedSlotTimes].sort((a, b) => slotIndex(a) - slotIndex(b));
  const start = slotTimeToInput(sorted[0]);
  const last = slotTimeToInput(sorted[sorted.length - 1]);
  const finish = last ? addOneHour(last) : "";
  if (start) el("eventStart").value = start;
  if (finish) el("eventFinish").value = finish;
}

function normalizeLookup(value) {
  return String(value || "").trim().toLowerCase().replace(/[\s()-]/g, "");
}

function findSampleMember(value) {
  const lookup = normalizeLookup(value);
  if (!lookup) return null;
  return sampleMembers.find((member) => {
    return [member.memberNumber, member.phone, member.phoneLast4, member.email]
      .map(normalizeLookup)
      .includes(lookup);
  }) || null;
}

function memberDisplay(member) {
  if (!member) return "";
  const type = member.membershipType ? `, ${member.membershipType}` : "";
  return `${member.name} (${member.memberNumber}${type})`;
}

async function lookupMember(value) {
  if (MEMBER_LOOKUP_ENDPOINT) {
    let response;
    let data;
    try {
      response = await fetch(MEMBER_LOOKUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
      });
      data = await response.json();
    } catch (error) {
      throw new Error("Member lookup is available when you open the booking app with Start-Booking-App.cmd.");
    }
    if (!response.ok) throw new Error(data.error || "Member lookup failed.");
    return (data.members || [])[0] || null;
  }
  if (!window.HANNANS_ALLOW_SAMPLE_MEMBERS) return null;
  return findSampleMember(value);
}

function updateMemberStatus(message, tone = "") {
  const status = el("memberLookupStatus");
  status.textContent = message;
  status.className = tone ? `member-status ${tone}` : "member-status";
}

function roomPrice(room, inputs) {
  const index = state.verifiedMember || inputs.membership === "single" ? 0 : 1;
  return room.rates[inputs.hireWindow][index];
}

function beverageTotal(guests) {
  let total = 0;
  if (isExtraChecked("bevPackage")) total += guests * 80;
  if (isExtraChecked("arrivalCocktail")) total += guests * 18;
  if (isExtraChecked("arrivalBubbles")) total += guests * 10;
  if (isExtraChecked("basicSpirits")) total += guests * 30 * 2;
  if (isExtraChecked("barTab")) total += Number(el("barTabAmount")?.value || 0);
  if (isExtraChecked("firePit")) total += Math.min(Number(el("firePitQty")?.value || 0), 3) * 100;
  if (isExtraChecked("gasHeaters")) total += Math.min(Number(el("gasHeaterQty")?.value || 0), 5) * 20;
  return total;
}

function isExtraChecked(baseId) {
  const modalId = `extra${baseId.charAt(0).toUpperCase()}${baseId.slice(1)}`;
  return Boolean(el(baseId)?.checked || el(modalId)?.checked);
}

function syncExtra(baseId, checked) {
  const modalId = `extra${baseId.charAt(0).toUpperCase()}${baseId.slice(1)}`;
  if (el(baseId)) el(baseId).checked = checked;
  if (el(modalId)) el(modalId).checked = checked;
}

function renderRooms() {
  const inputs = getInputs();
  const grid = el("roomGrid");
  const matching = rooms.filter((room) => room.capacity[inputs.eventType] >= inputs.guests);

  el("matchCount").textContent = `${matching.length} of ${rooms.length} spaces fit ${inputs.guests} guests`;
  grid.innerHTML = rooms.map((room) => {
    const fits = room.capacity[inputs.eventType] >= inputs.guests;
    const price = roomPrice(room, inputs);
    const gallery = room.gallery || [room.image];
    const galleryClass = gallery.length > 1 ? "has-gallery" : "";
    return `
      <article class="room-card" aria-label="${room.name}">
        <div class="room-image ${galleryClass}" data-gallery-room="${room.id}" data-gallery-index="0" style="background-image: linear-gradient(0deg, rgba(30,26,22,.34), rgba(30,26,22,.08)), url('${room.image}')">
          ${gallery.length > 1 ? `<div class="room-gallery">${gallery.slice(1, 4).map((image, index) => `<span data-gallery-room="${room.id}" data-gallery-index="${index + 1}" style="background-image:url('${image}')">${index === 2 && gallery.length > 4 ? `<b>+${gallery.length - 4}</b>` : ""}</span>`).join("")}</div>` : ""}
        </div>
        <div class="room-body">
          <p class="eyebrow">${fits ? "Recommended" : "Capacity check"}</p>
          <h3>${room.name}</h3>
          <p>${room.summary}</p>
          <div class="room-meta">
            ${room.notes.map((note) => `<span class="pill">${note}</span>`).join("")}
          </div>
          <div class="room-actions">
            <span class="price">${money.format(price)}</span>
            <button type="button" data-select="${room.id}">${state.selectedRoomId === room.id ? "Selected" : "Select"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRoomId = button.dataset.select;
      render();
      openExtrasModal();
    });
  });
  grid.querySelectorAll("[data-gallery-room]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const room = rooms.find((entry) => entry.id === item.dataset.galleryRoom);
      openLightbox(room.gallery || [room.image], Number(item.dataset.galleryIndex || 0), room.name);
    });
  });
}

function openExtrasModal() {
  const inputs = getInputs();
  const room = rooms.find((item) => item.id === state.selectedRoomId);
  const venue = room ? roomPrice(room, inputs) : 0;
  el("extrasRoomTitle").textContent = room ? room.name : "Add extras";
  el("extrasVenuePrice").textContent = `${money.format(venue)} venue hire`;
  el("extrasGuestCount").textContent = `${inputs.guests} guests`;
  renderExtrasTotal();
  el("extrasModal").classList.add("open");
  el("extrasModal").setAttribute("aria-hidden", "false");
}

function closeExtrasModal() {
  el("extrasModal").classList.remove("open");
  el("extrasModal").setAttribute("aria-hidden", "true");
}

function renderExtrasTotal() {
  const inputs = getInputs();
  const room = rooms.find((item) => item.id === state.selectedRoomId);
  const venue = room ? roomPrice(room, inputs) : 0;
  el("extrasTotal").textContent = money.format(venue + beverageTotal(inputs.guests));
}

function selectedExtrasSummary() {
  const guests = getInputs().guests;
  const extras = [];
  if (isExtraChecked("barTab")) {
    const amount = Number(el("barTabAmount")?.value || 0);
    const included = el("barTabIncluded")?.value.trim();
    extras.push(`Bar tab: ${money.format(amount)}${included ? ` - includes ${included}` : ""}`);
  }
  if (isExtraChecked("drinksPackage")) {
    const included = el("drinksPackageIncluded")?.value.trim();
    const timeframe = el("drinksPackageTimeframe")?.value.trim();
    extras.push(`Drinks package requested${included ? ` - includes ${included}` : ""}${timeframe ? ` for ${timeframe}` : ""}`);
  }
  if (isExtraChecked("bevPackage")) extras.push(`Beverage package: 2 hours at $80 per person (${guests} guests)`);
  if (isExtraChecked("arrivalCocktail")) extras.push(`Arrival cocktail: $18 per person (${guests} guests)`);
  if (isExtraChecked("arrivalBubbles")) extras.push(`Arrival bubbles: $10 per person (${guests} guests)`);
  if (isExtraChecked("basicSpirits")) extras.push(`Basic spirits package: $30 per person per hour, estimated at 2 hours (${guests} guests)`);
  if (isExtraChecked("firePit")) {
    const qty = Math.min(Number(el("firePitQty")?.value || 0), 3);
    extras.push(`Fire pit: ${qty} x $100 per booking, includes wood`);
  }
  if (isExtraChecked("gasHeaters")) {
    const qty = Math.min(Number(el("gasHeaterQty")?.value || 0), 5);
    extras.push(`Gas heaters: ${qty} x $20 each per booking`);
  }
  if (isExtraChecked("other")) {
    const details = el("otherExtraDetails")?.value.trim();
    extras.push(`Other request${details ? `: ${details}` : ""}`);
  }
  return extras;
}

function renderEstimate() {
  const inputs = getInputs();
  const room = rooms.find((item) => item.id === state.selectedRoomId);
  const venue = room ? roomPrice(room, inputs) : 0;
  const drinks = beverageTotal(inputs.guests);
  const total = venue + drinks;
  const membershipLabel = state.verifiedMember ? `verified member: ${memberDisplay(state.verifiedMember)}` : labelFor(inputs.membership);

  el("estimateTotal").textContent = money.format(venue);

  el("selectedName").textContent = room ? room.name : "No room selected";
  el("selectedSummary").textContent = room
    ? `${timeWindowText(inputs)} for ${inputs.guests} guests, ${labelFor(inputs.eventType)}, ${labelFor(inputs.hireWindow)}, ${membershipLabel}. Estimated package: ${money.format(total)} before staffing, catering, security, and custom quotes.`
    : "Choose a space from the Spaces tab to include it in your enquiry.";
}

function labelFor(value) {
  const labels = {
    cocktail: "Cocktail",
    seated: "Seated",
    theatre: "Theatre",
    meeting: "Meeting",
    weekdayDay: "Monday to Thursday, 9am-5pm",
    weekdayNight: "Monday to Thursday, 5pm-midnight",
    weekendDay: "Friday to Sunday, 9am-5pm",
    weekendNight: "Friday to Sunday, 5pm-midnight",
    single: "single or couple member",
    social: "social member"
  };
  return labels[value] || value;
}

function renderVendors() {
  el("vendorList").innerHTML = vendors
    .map(([name, contact]) => `<li><strong>${name}</strong>${contact}</li>`)
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getAdminBookingsForView() {
  const visible = adminBookings
    .filter((booking) => {
      if (state.adminView === "cancelled") return booking.status === "cancelled";
      if (booking.status === "cancelled") return false;
      return state.adminView === "past" ? booking.date < state.today : booking.date >= state.today;
    })
    .sort((a, b) => compareBookings(a, b, state.adminView === "past" || state.adminView === "cancelled" ? "desc" : "asc"));
  if (state.adminView === "upcoming" && state.adminMonth === "all") {
    const months = upcomingMonthKeys();
    return visible.filter((booking) => months.includes(booking.date.slice(0, 7)));
  }
  if (state.adminMonth === "all") return visible;
  return visible.filter((booking) => booking.date.slice(0, 7) === state.adminMonth);
}

function upcomingMonthKeys() {
  const upcomingDates = adminBookings
    .filter((booking) => booking.status !== "cancelled" && booking.date >= state.today)
    .map((booking) => booking.date)
    .sort();
  const anchorDate = upcomingDates[0] || state.today;
  const start = new Date(`${anchorDate}T12:00:00`);
  return [0, 1, 2].map((offset) => {
    const month = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  });
}

function monthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

function adminMonthsForView() {
  const months = [...new Set(adminBookings
    .filter((booking) => {
      if (state.adminView === "cancelled") return booking.status === "cancelled";
      if (booking.status === "cancelled") return false;
      return state.adminView === "past" ? booking.date < state.today : booking.date >= state.today;
    })
    .map((booking) => booking.date.slice(0, 7)))];
  return months.sort((a, b) => state.adminView === "past" || state.adminView === "cancelled" ? b.localeCompare(a) : a.localeCompare(b));
}

function renderAdminMonthFilter() {
  const months = adminMonthsForView();
  if (state.adminMonth !== "all" && !months.includes(state.adminMonth)) state.adminMonth = months[0] || "all";
  el("adminMonthFilter").innerHTML = [
    `<option value="all">${state.adminView === "upcoming" ? "Next 3 months" : state.adminView === "cancelled" ? "All cancelled" : "All past"}</option>`,
    ...months.map((month) => `<option value="${month}" ${state.adminMonth === month ? "selected" : ""}>${monthLabel(month)}</option>`)
  ].join("");
}

function setAdminView(view, resetMonth = true) {
  state.adminView = view;
  if (resetMonth) state.adminMonth = "all";
  el("upcomingEventsButton").classList.toggle("active", view === "upcoming");
  el("pastEventsButton").classList.toggle("active", view === "past");
  el("cancelledEventsButton").classList.toggle("active", view === "cancelled");
  el("adminBookingListTitle").textContent = view === "cancelled" ? "Cancelled events" : view === "past" ? "Past events" : "Upcoming bookings";
  renderAdminMonthFilter();
  const bookings = getAdminBookingsForView();
  renderAdminBookings(bookings[0]?.id);
}

function renderAdminBookings(selectedId) {
  closeAdminReport();
  renderAdminMonthFilter();
  const visibleBookings = getAdminBookingsForView();
  const showEmptyUpcomingMonths = state.adminView === "upcoming" && state.adminMonth === "all";
  if (!visibleBookings.length && !showEmptyUpcomingMonths) {
    state.selectedBookingId = null;
    el("bookingList").innerHTML = `<p class="empty-bookings">No ${state.adminView === "cancelled" ? "cancelled events" : state.adminView === "past" ? "past events" : "upcoming bookings"} to show.</p>`;
    el("runSheetContent").innerHTML = "";
    el("adminEventNotes").value = "";
    return;
  }
  const activeId = visibleBookings.some((booking) => booking.id === selectedId) ? selectedId : visibleBookings[0]?.id;
  state.selectedBookingId = activeId;
  const monthGroups = showEmptyUpcomingMonths
    ? upcomingMonthKeys().reduce((groups, month) => ({ ...groups, [month]: [] }), {})
    : {};
  visibleBookings.reduce((groups, booking) => {
    const month = booking.date.slice(0, 7);
    groups[month] ||= [];
    groups[month].push(booking);
    return groups;
  }, monthGroups);
  el("bookingList").innerHTML = Object.entries(monthGroups).map(([month, bookings]) => `
    <section class="booking-month-group">
      <h4>${monthLabel(month)}</h4>
      ${bookings.length ? bookings.map((booking) => {
    const room = rooms.find((item) => item.id === booking.roomId);
    const roomName = room?.name || booking.roomName || "Other area";
    return `
      <button type="button" class="booking-card ${booking.id === activeId ? "active" : ""}" data-booking="${booking.id}">
        <strong>${booking.status === "cancelled" ? "Cancelled: " : ""}${escapeHtml(booking.eventName)}</strong>
        <span>${formatDate(booking.date)} - ${escapeHtml(roomName)}</span>
        <span>${booking.guests || "TBA"} guests | ${escapeHtml(booking.start)} to ${escapeHtml(booking.finish)}</span>
      </button>
    `;
  }).join("") : `<p class="empty-bookings">No bookings this month.</p>`}
    </section>
  `).join("");

  el("bookingList").querySelectorAll("[data-booking]").forEach((button) => {
    button.addEventListener("click", () => renderAdminBookings(button.dataset.booking));
  });
  if (activeId) {
    renderStaffAssignmentControls(activeId);
    renderNotesEditor(activeId);
    renderRunSheet(activeId);
  } else {
    renderStaffAssignmentControls("");
    renderNotesEditor("");
    el("runSheetContent").innerHTML = "";
  }
}

function renderStaffAssignmentControls(bookingId) {
  const assignment = staffAssignments[bookingId] || {};
  const approvedManager = assignment.approvedManager || assignment.venueManager || "Unassigned";
  const extraStaff = assignment.staffMembers || [assignment.barLead, assignment.floorStaff].filter((name) => name && name !== "Unassigned");
  el("approvedManagerSelect").innerHTML = staffMembers
    .concat(staffMembers.includes(approvedManager) ? [] : [approvedManager])
    .map((name) => `<option value="${name}" ${name === approvedManager ? "selected" : ""}>${name}</option>`)
    .join("");
  renderAdditionalStaffRows(extraStaff);
}

function staffOptions(selectedName = "Unassigned") {
  return staffMembers
    .concat(staffMembers.includes(selectedName) ? [] : [selectedName])
    .map((name) => `<option value="${escapeHtml(name)}" ${name === selectedName ? "selected" : ""}>${escapeHtml(name)}</option>`)
    .join("");
}

function renderAdditionalStaffRows(selectedStaff = []) {
  const rows = selectedStaff.length ? selectedStaff : [];
  el("additionalStaffList").innerHTML = rows.map((name, index) => `
    <div class="additional-staff-row">
      <label>Staff member ${index + 1}<select data-additional-staff>${staffOptions(name)}</select></label>
      <button type="button" class="ghost-button" data-remove-staff="${index}">Remove</button>
    </div>
  `).join("");
  el("additionalStaffList").querySelectorAll("[data-remove-staff]").forEach((button) => {
    button.addEventListener("click", () => {
      const staff = currentAdditionalStaff();
      staff.splice(Number(button.dataset.removeStaff), 1);
      renderAdditionalStaffRows(staff);
    });
  });
}

function currentAdditionalStaff() {
  return [...document.querySelectorAll("[data-additional-staff]")]
    .map((select) => select.value)
    .filter((name) => name && name !== "Unassigned");
}

function addNewStaffMember() {
  const name = el("newStaffMemberName").value.trim().replace(/\s+/g, " ");
  if (!name) {
    el("newStaffMemberName").focus();
    return;
  }
  const exists = staffMembers.some((member) => member.toLowerCase() === name.toLowerCase());
  if (!exists) {
    staffMembers = [...staffMembers.filter((member) => member !== "Unassigned"), name].sort((a, b) => a.localeCompare(b));
    staffMembers.unshift("Unassigned");
  }
  el("newStaffMemberName").value = "";
  saveAdminState();
  renderStaffAssignmentControls(state.selectedBookingId);
  renderRunSheet(state.selectedBookingId);
}

function saveStaffAssignments() {
  const bookingId = state.selectedBookingId;
  if (!bookingId) return;
  staffAssignments[bookingId] = {
    approvedManager: el("approvedManagerSelect").value,
    staffMembers: currentAdditionalStaff()
  };
  saveAdminState();
  renderRunSheet(bookingId);
}

function checklistForBooking(bookingId) {
  const saved = eventChecklists[bookingId] || {};
  return defaultChecklistItems.map((label) => ({ label, done: Boolean(saved[label]) }));
}

function saveEventChecklist(bookingId) {
  const checked = {};
  document.querySelectorAll("[data-checklist-item]").forEach((item) => {
    checked[item.dataset.checklistItem] = item.checked;
  });
  eventChecklists[bookingId] = checked;
  saveAdminState();
  renderRunSheet(bookingId);
}

function staffAssignedForBooking(booking) {
  const assignment = staffAssignments[booking.id] || {};
  const approvedManager = assignment.approvedManager || assignment.venueManager || "";
  const assignedStaff = assignment.staffMembers || [assignment.barLead, assignment.floorStaff].filter(Boolean);
  return Boolean(approvedManager && approvedManager !== "Unassigned") || assignedStaff.some((name) => name && name !== "Unassigned");
}

function reportRows(type) {
  const bookings = adminBookings
    .filter((booking) => booking.date >= state.today && booking.status !== "cancelled")
    .sort((a, b) => compareBookings(a, b));
  return type === "unstaffed"
    ? bookings.filter((booking) => !staffAssignedForBooking(booking))
    : bookings;
}

function reportTitle(type) {
  return type === "unstaffed" ? "Events without staff assigned" : "Upcoming events summary";
}

function closeAdminReport() {
  state.currentReport = null;
  if (el("adminReportOutput")) {
    el("adminReportOutput").hidden = true;
    el("adminReportOutput").innerHTML = "";
  }
}

function csvValue(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportAdminReport() {
  if (!state.currentReport) return;
  const rows = reportRows(state.currentReport);
  const headers = ["Date", "Start", "Finish", "Event", "Client", "Space", "Guests", "Catering", "Vendors", "Approved Manager", "Staff"];
  const csvRows = rows.map((booking) => {
    const room = rooms.find((item) => item.id === booking.roomId);
    const assignment = staffAssignments[booking.id] || {};
    return [
      formatDate(booking.date),
      booking.start || "TBA",
      booking.finish || "TBA",
      booking.eventName,
      booking.client,
      room?.name || booking.roomName || "Other area",
      booking.guests || "TBA",
      booking.catering || "",
      booking.suppliers || "",
      assignment.approvedManager || assignment.venueManager || "Unassigned",
      (assignment.staffMembers || [assignment.barLead, assignment.floorStaff]).filter((name) => name && name !== "Unassigned").join("; ")
    ].map(csvValue).join(",");
  });
  const blob = new Blob([[headers.map(csvValue).join(","), ...csvRows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.currentReport === "unstaffed" ? "unstaffed-events" : "upcoming-events"}-${state.today}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadAdminReport(type) {
  state.currentReport = type;
  exportAdminReport();
  closeAdminReport();
}

function renderAdminReport(type) {
  const reportBookings = reportRows(type);
  state.currentReport = type;
  const title = reportTitle(type);
  el("adminReportOutput").hidden = false;
  el("adminReportOutput").innerHTML = `
    <div class="admin-report-head">
      <h4>${title}</h4>
      <div>
        <button type="button" class="ghost-button" id="exportReportButton">Export CSV</button>
        <button type="button" class="ghost-button" id="printReportButton">Print</button>
        <button type="button" class="ghost-button" id="closeReportButton">Close</button>
      </div>
    </div>
    ${reportBookings.length ? `
      <ul>
        ${reportBookings.map((booking) => {
    const room = rooms.find((item) => item.id === booking.roomId);
    const assignment = staffAssignments[booking.id] || {};
    const staff = [
      assignment.approvedManager && assignment.approvedManager !== "Unassigned" ? `Approved Manager: ${assignment.approvedManager}` : "",
      ...(assignment.staffMembers || []).filter((name) => name && name !== "Unassigned")
    ].filter(Boolean).join(", ") || "No staff assigned";
    return `<li><strong>${escapeHtml(formatDate(booking.date))}, ${escapeHtml(booking.start || "TBA")}</strong> - ${escapeHtml(booking.eventName)} (${escapeHtml(room?.name || booking.roomName || "Other area")}, ${booking.guests || "TBA"} guests). ${escapeHtml(staff)}</li>`;
  }).join("")}
      </ul>
    ` : `<p class="empty-bookings">No matching upcoming events.</p>`}
  `;
  el("exportReportButton").addEventListener("click", exportAdminReport);
  el("printReportButton").addEventListener("click", () => window.print());
  el("closeReportButton").addEventListener("click", closeAdminReport);
}

function renderNotesEditor(bookingId) {
  el("adminEventNotes").value = adminEventNotes[bookingId] || "";
  el("eventNotesSaved").textContent = "";
}

function saveEventNotes() {
  const bookingId = state.selectedBookingId;
  if (!bookingId) return;
  const note = el("adminEventNotes").value.trim();
  if (note) {
    adminEventNotes[bookingId] = note;
  } else {
    delete adminEventNotes[bookingId];
  }
  saveAdminState();
  el("eventNotesSaved").textContent = "Notes saved.";
  renderRunSheet(bookingId);
}

function populateAdminEventForm() {
  const options = ['<option value="TBA">TBA</option>', ...timeSlots.map((time) => `<option value="${time}">${time}</option>`)].join("");
  el("newEventStart").innerHTML = options;
  el("newEventFinish").innerHTML = options;
}

function fillAdminEventForm(booking = null) {
  populateAdminEventForm();
  state.editingBookingId = booking?.id || null;
  el("adminEventModalTitle").textContent = booking ? "Edit booking" : "Add event";
  el("saveAdminEventButton").textContent = booking ? "Save changes" : "Add event";
  el("newEventName").value = booking?.eventName || "";
  el("newEventClient").value = booking?.client || "";
  el("newEventDate").value = booking?.date || state.today;
  el("newEventRoom").value = booking?.roomId || "main-bar";
  el("newEventGuests").value = booking?.guests || "";
  el("newEventStart").value = booking?.start || "TBA";
  el("newEventFinish").value = booking?.finish || "TBA";
  el("newEventPackage").value = booking?.package || "";
  if (booking?.catering && ![...el("newEventCatering").options].some((option) => option.value === booking.catering)) {
    el("newEventCatering").add(new Option(booking.catering, booking.catering));
  }
  el("newEventCatering").value = booking?.catering || "";
  el("newEventSetup").value = booking?.setup || "";
  el("newEventSuppliers").value = booking?.suppliers || "";
  el("newEventStaff").value = booking?.staff || "";
  el("newEventNotes").value = booking?.notes || "";
  el("addAdminEventStatus").textContent = "";
}

function openAdminEventModal(booking = null) {
  fillAdminEventForm(booking);
  el("adminEventModal").classList.add("open");
  el("adminEventModal").setAttribute("aria-hidden", "false");
}

function closeAdminEventModal() {
  el("adminEventModal").classList.remove("open");
  el("adminEventModal").setAttribute("aria-hidden", "true");
  state.editingBookingId = null;
}

function bookingFromAdminForm(id) {
  const eventName = el("newEventName").value.trim();
  const date = el("newEventDate").value;
  const roomId = el("newEventRoom").value;
  if (!eventName || !date || !roomId) {
    el("addAdminEventStatus").textContent = "Please enter an event name, date and room.";
    return null;
  }
  return {
    id,
    client: el("newEventClient").value.trim() || "TBA",
    eventName,
    date,
    roomId,
    roomName: roomNameById[roomId] || "Other area",
    guests: Number(el("newEventGuests").value || 0),
    start: el("newEventStart").value,
    finish: el("newEventFinish").value,
    package: el("newEventPackage").value.trim(),
    catering: el("newEventCatering").value.trim(),
    setup: el("newEventSetup").value.trim(),
    staff: el("newEventStaff").value.trim() || "Unassigned",
    suppliers: el("newEventSuppliers").value.trim(),
    notes: el("newEventNotes").value.trim() || "Added in booking app admin portal",
    contactEmail: "",
    contactPhone: "",
    sourceCell: id.startsWith("ADMIN-") ? "Admin portal" : "Edited in admin portal"
  };
}

function saveAdminEvent() {
  const editingId = state.editingBookingId;
  const booking = bookingFromAdminForm(editingId || `ADMIN-${Date.now()}`);
  if (!booking) return;
  const existingIndex = adminBookings.findIndex((item) => item.id === booking.id);
  if (existingIndex >= 0) {
    adminBookings[existingIndex] = { ...adminBookings[existingIndex], ...booking };
    savedBookingEdits[booking.id] = { ...savedBookingEdits[booking.id], ...booking };
    saveBookingEdits();
  } else {
    adminBookings.push(booking);
    saveAddedBookings();
  }
  rebuildAvailabilityAndSlots();
  state.adminView = booking.date < state.today ? "past" : "upcoming";
  state.adminMonth = booking.date.slice(0, 7);
  setAdminView(state.adminView, false);
  renderAdminBookings(booking.id);
  renderCalendar();
  renderDateAvailability();
  renderDaySlots();
  closeAdminEventModal();
}

function cancelSelectedBooking() {
  const booking = adminBookings.find((item) => item.id === state.selectedBookingId);
  if (!booking) return;
  if (booking.status === "cancelled") {
    savedBookingEdits[booking.id] = { ...savedBookingEdits[booking.id], status: "" };
  } else {
    savedBookingEdits[booking.id] = { ...savedBookingEdits[booking.id], status: "cancelled", cancelledAt: new Date().toISOString() };
  }
  saveBookingEdits();
  rebuildAdminBookings();
  rebuildAvailabilityAndSlots();
  renderCalendar();
  renderDateAvailability();
  renderDaySlots();
  setAdminView(booking.status === "cancelled" ? "upcoming" : "cancelled");
}

function deleteSelectedBooking() {
  const booking = adminBookings.find((item) => item.id === state.selectedBookingId);
  if (!booking) return;
  const ok = window.confirm(`Delete "${booking.eventName}" permanently from the booking app?`);
  if (!ok) return;
  deletedBookingIds = [...new Set([...deletedBookingIds, booking.id])];
  savedAdminBookings = savedAdminBookings.filter((item) => item.id !== booking.id);
  delete savedBookingEdits[booking.id];
  delete adminEventNotes[booking.id];
  delete staffAssignments[booking.id];
  delete runSheetTasks[booking.id];
  delete eventChecklists[booking.id];
  localStorage.setItem("hannansDeletedBookingIds", JSON.stringify(deletedBookingIds));
  saveAdminState();
  rebuildAdminBookings();
  rebuildAvailabilityAndSlots();
  renderCalendar();
  renderDateAvailability();
  renderDaySlots();
  renderAdminBookings();
}

function defaultRunSheetTasks(booking) {
  return [
    { time: booking.start, task: "Client arrival and supplier check-in", owner: "Venue Manager" },
    { time: "30 mins after arrival", task: "Bar and catering service underway", owner: "Bar Lead" },
    { time: "1 hour before finish", task: "Confirm final drinks timing and pack-down plan", owner: "Venue Manager" },
    { time: booking.finish, task: "Event concludes and room check begins", owner: "Duty Staff" }
  ];
}

function tasksForBooking(booking) {
  return runSheetTasks[booking.id] || defaultRunSheetTasks(booking);
}

function saveRunSheetTasks(bookingId) {
  const rows = [...document.querySelectorAll("[data-run-task-row]")].map((row) => ({
    time: row.querySelector("[data-run-time]").value.trim(),
    task: row.querySelector("[data-run-task]").value.trim(),
    owner: row.querySelector("[data-run-owner]").value.trim()
  })).filter((row) => row.time || row.task || row.owner);
  if (rows.length) {
    runSheetTasks[bookingId] = rows;
  } else {
    delete runSheetTasks[bookingId];
  }
  saveAdminState();
  renderRunSheet(bookingId);
}

function saveRunSheetSetup(bookingId) {
  const booking = adminBookings.find((item) => item.id === bookingId);
  if (!booking) return;
  booking.setup = el("runSheetSetup").value.trim();
  savedBookingEdits[booking.id] = { ...savedBookingEdits[booking.id], setup: booking.setup };
  saveBookingEdits();
  renderRunSheet(bookingId);
}

function addRunSheetTaskRow(bookingId) {
  const booking = adminBookings.find((item) => item.id === bookingId);
  if (!booking) return;
  runSheetTasks[bookingId] = [...tasksForBooking(booking), { time: "", task: "", owner: "" }];
  renderRunSheet(bookingId);
}

function renderRunSheet(bookingId) {
  const booking = adminBookings.find((item) => item.id === bookingId);
  if (!booking) return;
  const room = rooms.find((item) => item.id === booking.roomId);
  const roomName = room?.name || booking.roomName || "Other area";
  const assignment = staffAssignments[booking.id] || {};
  const internalNote = adminEventNotes[booking.id] || "";
  const taskRows = tasksForBooking(booking);
  const checklist = checklistForBooking(booking.id);
  const approvedManager = assignment.approvedManager || assignment.venueManager || "Unassigned";
  const assignedStaff = assignment.staffMembers || [assignment.barLead, assignment.floorStaff].filter((name) => name && name !== "Unassigned");
  const ownerOptions = (selectedOwner) => staffMembers
    .map((name) => `<option value="${escapeHtml(name)}" ${name === selectedOwner ? "selected" : ""}>${escapeHtml(name)}</option>`)
    .join("");
  el("cancelBookingButton").textContent = booking.status === "cancelled" ? "Restore event" : "Cancel event";
  el("runSheetContent").innerHTML = `
    <div class="run-sheet-title">
      <p class="eyebrow">${escapeHtml(booking.id)}</p>
      <h2>${escapeHtml(booking.eventName)}</h2>
      <p>${formatDate(booking.date)} | ${escapeHtml(booking.start)} to ${escapeHtml(booking.finish)}</p>
    </div>
    <div class="run-sheet-grid">
      <section>
        <h3>Client</h3>
        <p>${escapeHtml(booking.client)}</p>
      </section>
      <section>
        <h3>Room</h3>
        <p>${escapeHtml(roomName)}</p>
      </section>
      <section>
        <h3>Guests</h3>
        <p>${booking.guests || "TBA"}</p>
      </section>
      <section>
        <h3>Package</h3>
        <p>${escapeHtml(booking.package || "Not set")}</p>
      </section>
      <section>
        <h3>Catering</h3>
        <p>${escapeHtml(booking.catering || "Not set")}</p>
      </section>
      <section>
        <h3>Staffing</h3>
        <p>${escapeHtml(booking.staff || "Unassigned")}</p>
      </section>
    </div>
    <section class="run-block">
      <h3>Assigned staff</h3>
      <p><strong>Approved Manager:</strong> ${escapeHtml(approvedManager)}</p>
      <p><strong>Staff:</strong> ${assignedStaff.length ? escapeHtml(assignedStaff.join(", ")) : "Unassigned"}</p>
    </section>
    <section class="run-block">
      <h3>Room setup</h3>
      <textarea id="runSheetSetup" rows="3">${escapeHtml(booking.setup || "")}</textarea>
      <button type="button" class="ghost-button run-sheet-save-inline" id="saveRunSheetSetup">Save room setup</button>
    </section>
    <section class="run-block">
      <h3>Vendors / suppliers</h3>
      <p>${escapeHtml(booking.suppliers || "Not set")}</p>
    </section>
    <section class="run-block">
      <h3>Event checklist</h3>
      <div class="event-checklist">
        ${checklist.map((item) => `
          <label>
            <input type="checkbox" data-checklist-item="${escapeHtml(item.label)}" ${item.done ? "checked" : ""} />
            <span>${escapeHtml(item.label)}</span>
          </label>
        `).join("")}
      </div>
      <button type="button" class="ghost-button run-sheet-save-inline" id="saveEventChecklist">Save checklist</button>
    </section>
    ${internalNote ? `
      <section class="run-block internal-note">
        <h3>Internal event notes</h3>
        <p>${escapeHtml(internalNote)}</p>
      </section>
    ` : ""}
    <table class="run-table">
      <thead><tr><th>Time</th><th>Run sheet task</th><th>Owner</th></tr></thead>
      <tbody>
        ${taskRows.map((row, index) => `
          <tr data-run-task-row="${index}">
            <td><input data-run-time value="${escapeHtml(row.time)}" /></td>
            <td><input data-run-task value="${escapeHtml(row.task)}" /></td>
            <td><select data-run-owner>${ownerOptions(row.owner)}</select></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="run-sheet-editor-actions">
      <button type="button" class="ghost-button" id="addRunSheetTask">Add row</button>
      <button type="button" id="saveRunSheetTasks">Save run sheet</button>
    </div>
  `;
  el("addRunSheetTask").addEventListener("click", () => addRunSheetTaskRow(booking.id));
  el("saveRunSheetTasks").addEventListener("click", () => saveRunSheetTasks(booking.id));
  el("saveRunSheetSetup").addEventListener("click", () => saveRunSheetSetup(booking.id));
  el("saveEventChecklist").addEventListener("click", () => saveEventChecklist(booking.id));
}

async function loginAdmin() {
  const password = el("adminPassword").value.trim();
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const data = await response.json();
  if (!response.ok) {
    el("adminError").textContent = data.error || "Incorrect admin password.";
    return;
  }
  state.adminToken = data.token || "";
  state.adminLoggedIn = true;
  applyAdminState(data.state || {});
  el("adminError").textContent = "";
  el("adminLogin").hidden = true;
  el("adminDashboard").hidden = false;
  populateAdminEventForm();
  resetAdminTimeout();
  setAdminView("upcoming");
}

function logoutAdmin(message = "") {
  if (state.adminToken) {
    fetch("/api/admin/logout", {
      method: "POST",
      headers: { "X-Admin-Token": state.adminToken }
    }).catch(() => {});
  }
  state.adminToken = "";
  state.adminLoggedIn = false;
  clearTimeout(state.adminTimeoutId);
  state.adminTimeoutId = null;
  el("adminDashboard").hidden = true;
  el("adminLogin").hidden = false;
  el("adminPassword").value = "";
  el("adminError").textContent = message;
}

function resetAdminTimeout() {
  if (!state.adminLoggedIn) return;
  clearTimeout(state.adminTimeoutId);
  state.adminTimeoutId = setTimeout(() => {
    logoutAdmin("Admin session timed out after 5 minutes of inactivity. Please log in again.");
  }, 5 * 60 * 1000);
}

function applyAdminState(stateData) {
  savedAdminBookings = Array.isArray(stateData.addedBookings) ? stateData.addedBookings : savedAdminBookings;
  savedBookingEdits = stateData.bookingEdits || savedBookingEdits;
  adminEventNotes = stateData.eventNotes || adminEventNotes;
  staffAssignments = stateData.staffAssignments || staffAssignments;
  runSheetTasks = stateData.runSheetTasks || runSheetTasks;
  staffMembers = Array.isArray(stateData.staffMembers) && stateData.staffMembers.length ? stateData.staffMembers : staffMembers;
  eventChecklists = stateData.eventChecklists || eventChecklists;
  deletedBookingIds = Array.isArray(stateData.deletedBookingIds) ? stateData.deletedBookingIds : deletedBookingIds;
  localStorage.setItem("hannansAdminBookings", JSON.stringify(savedAdminBookings));
  localStorage.setItem("hannansBookingEdits", JSON.stringify(savedBookingEdits));
  localStorage.setItem("hannansAdminEventNotes", JSON.stringify(adminEventNotes));
  localStorage.setItem("hannansStaffAssignments", JSON.stringify(staffAssignments));
  localStorage.setItem("hannansRunSheetTasks", JSON.stringify(runSheetTasks));
  localStorage.setItem("hannansStaffMembers", JSON.stringify(staffMembers));
  localStorage.setItem("hannansEventChecklists", JSON.stringify(eventChecklists));
  localStorage.setItem("hannansDeletedBookingIds", JSON.stringify(deletedBookingIds));
  rebuildAdminBookings();
  rebuildAvailabilityAndSlots();
}

async function saveAdminState() {
  const stateData = {
    addedBookings: savedAdminBookings,
    bookingEdits: savedBookingEdits,
    eventNotes: adminEventNotes,
    staffAssignments,
    runSheetTasks,
    staffMembers,
    eventChecklists,
    deletedBookingIds
  };
  localStorage.setItem("hannansAdminBookings", JSON.stringify(savedAdminBookings));
  localStorage.setItem("hannansBookingEdits", JSON.stringify(savedBookingEdits));
  localStorage.setItem("hannansAdminEventNotes", JSON.stringify(adminEventNotes));
  localStorage.setItem("hannansStaffAssignments", JSON.stringify(staffAssignments));
  localStorage.setItem("hannansRunSheetTasks", JSON.stringify(runSheetTasks));
  localStorage.setItem("hannansStaffMembers", JSON.stringify(staffMembers));
  localStorage.setItem("hannansEventChecklists", JSON.stringify(eventChecklists));
  localStorage.setItem("hannansDeletedBookingIds", JSON.stringify(deletedBookingIds));
  try {
    const response = await fetch("/api/admin/state", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": state.adminToken },
      body: JSON.stringify(stateData)
    });
    if (response.status === 401) {
      logoutAdmin("Admin session timed out after 5 minutes of inactivity. Please log in again.");
      return;
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Could not save admin changes.");
    }
    resetAdminTimeout();
  } catch (error) {
    console.warn(error.message);
  }
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function timeToMinutes(time) {
  if (!time || time === "TBA") return null;
  const match = String(time).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const suffix = match[3].toUpperCase();
  if (suffix === "PM" && hour !== 12) hour += 12;
  if (suffix === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function compareBookings(a, b, direction = "asc") {
  const dateCompare = a.date.localeCompare(b.date);
  if (dateCompare !== 0) return direction === "desc" ? -dateCompare : dateCompare;
  const aStart = timeToMinutes(a.start) ?? 9999;
  const bStart = timeToMinutes(b.start) ?? 9999;
  return direction === "desc" ? bStart - aStart : aStart - bStart;
}

function heldSlotsForBooking(booking) {
  const startMinutes = timeToMinutes(booking.start);
  const finishMinutes = timeToMinutes(booking.finish);
  if (startMinutes === null || finishMinutes === null) return [...timeSlots];
  return timeSlots.filter((time) => {
    const minutes = timeToMinutes(time);
    return minutes !== null && minutes >= startMinutes && minutes <= finishMinutes;
  });
}

function buildSlotHolds() {
  const holds = JSON.parse(JSON.stringify(fallbackSlotHolds));
  adminBookings.forEach((booking) => {
    if (!booking.date || !booking.roomId) return;
    holds[booking.date] ||= {};
    holds[booking.date][booking.roomId] ||= [];
    heldSlotsForBooking(booking).forEach((time) => {
      if (!holds[booking.date][booking.roomId].includes(time)) {
        holds[booking.date][booking.roomId].push(time);
      }
    });
  });
  return holds;
}

function saveAddedBookings() {
  savedAdminBookings = adminBookings.filter((booking) => booking.id.startsWith("ADMIN-"));
  saveAdminState();
}

function saveBookingEdits() {
  saveAdminState();
}

function addAvailabilityBooking(booking) {
  if (booking.status === "cancelled") return;
  if (!rooms.some((room) => room.id === booking.roomId)) return;
  sampleBookings[booking.date] ||= {};
  sampleBookings[booking.date][booking.roomId] = booking.eventName;
  slotHolds[booking.date] ||= {};
  slotHolds[booking.date][booking.roomId] ||= [];
  heldSlotsForBooking(booking).forEach((time) => {
    if (!slotHolds[booking.date][booking.roomId].includes(time)) {
      slotHolds[booking.date][booking.roomId].push(time);
    }
  });
}

function rebuildAvailabilityAndSlots() {
  Object.keys(sampleBookings).forEach((key) => delete sampleBookings[key]);
  Object.keys(slotHolds).forEach((key) => delete slotHolds[key]);
  adminBookings.forEach(addAvailabilityBooking);
}

rebuildAvailabilityAndSlots();

function bookingStatusFor(key) {
  const booked = Object.keys(sampleBookings[key] || {});
  if (booked.length === 0) return "free";
  if (booked.length === rooms.length) return "booked";
  return "partial";
}

function availabilityLabel(status) {
  if (status === "free") return "Available";
  if (status === "booked") return "Booked";
  return "Limited";
}

function renderCalendar() {
  const grid = el("calendarGrid");
  const monthDate = state.calendarDate;
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  el("calendarTitle").textContent = monthDate.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric"
  });

  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const key = dateKey(day);
    const bookedRooms = Object.keys(sampleBookings[key] || {}).length;
    const freeRooms = rooms.length - bookedRooms;
    const status = bookingStatusFor(key);
    const isPast = key < state.today;
    const cellLabel = isPast ? "Past" : `${freeRooms} ${freeRooms === 1 ? "room" : "rooms"} free`;
    const eventText = bookedRooms > 0 ? `${bookedRooms} event${bookedRooms === 1 ? "" : "s"}` : "";
    days.push(`
      <button type="button" class="calendar-day ${day.getMonth() === month ? "" : "is-muted"} ${isPast ? "is-past" : ""} ${state.today === key ? "is-today" : ""} ${state.selectedDate === key ? "selected" : ""}" data-date="${key}">
        <span class="day-number">${day.getDate()}</span>
        <span class="day-summary">
          <span class="day-label">${cellLabel}</span>
          ${eventText ? `<span class="status-line"><i class="status-dot ${status}"></i>${eventText}</span>` : ""}
        </span>
      </button>
    `);
  }
  grid.innerHTML = days.join("");
  grid.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = button.dataset.date;
      el("eventDate").value = state.selectedDate;
      renderCalendar();
      renderDateAvailability();
      renderDaySlots();
      renderEstimate();
      openAvailabilityModal();
    });
  });
}

function renderDateAvailability() {
  const bookings = sampleBookings[state.selectedDate] || {};
  const bookedCount = Object.keys(bookings).length;
  el("dateTitle").textContent = formatDate(state.selectedDate);
  el("dateSummary").textContent = bookedCount === 0
    ? "All listed Hannans Club spaces are currently showing as available for this sample date."
    : `${rooms.length - bookedCount} spaces are showing as available and ${bookedCount} ${bookedCount === 1 ? "space is" : "spaces are"} already held.`;

  el("roomStatusList").innerHTML = rooms.map((room) => {
    const booking = bookings[room.id];
    const status = booking ? "booked" : "free";
    return `
      <div class="room-status">
        <div>
          <strong>${room.name}</strong>
          <span>${booking || "Available for enquiry"}</span>
        </div>
        <span><i class="status-dot ${status}"></i>${booking ? "Unavailable" : "Available"}</span>
      </div>
    `;
  }).join("");
}

function slotStatus(date, roomId, time) {
  if (date < state.today) return "unavailable";
  const roomHolds = slotHolds[date]?.[roomId] || [];
  return roomHolds.includes(time) ? "booked" : "available";
}

function slotIndex(time) {
  return timeSlots.indexOf(time);
}

function selectedTimeRangeText() {
  if (!state.selectedSlotTimes.length) return "";
  const sorted = [...state.selectedSlotTimes].sort((a, b) => slotIndex(a) - slotIndex(b));
  if (sorted.length === 1) return sorted[0];
  return `${sorted[0]} to ${sorted[sorted.length - 1]}`;
}

function clearSlotSelection() {
  state.selectedSlotRoomId = null;
  state.selectedSlotTimes = [];
  state.selectedSlotRangeStart = null;
}

function toggleSlotSelection(roomId, time) {
  if (state.selectedSlotRoomId !== roomId || !state.selectedSlotRangeStart || state.selectedSlotTimes.length > 1) {
    state.selectedSlotRoomId = roomId;
    state.selectedSlotTimes = [time];
    state.selectedSlotRangeStart = time;
    return;
  }

  const startIndex = slotIndex(state.selectedSlotRangeStart);
  const finishIndex = slotIndex(time);
  const [from, to] = startIndex <= finishIndex ? [startIndex, finishIndex] : [finishIndex, startIndex];
  const range = timeSlots.slice(from, to + 1);
  const allAvailable = range.every((slot) => slotStatus(state.selectedDate, roomId, slot) === "available");
  if (!allAvailable) {
    state.selectedSlotTimes = [time];
    state.selectedSlotRangeStart = time;
    return;
  }
  state.selectedSlotTimes = range;
}

function updateModalTimeSelectionSummary() {
  const room = rooms.find((item) => item.id === state.selectedSlotRoomId);
  const range = selectedTimeRangeText();
  el("modalTimeSelectionSummary").textContent = room && range
    ? `${room.name}: ${range}. Select a different start time to reset the range.`
    : "Select a start time, then select a finish time in the same room.";
}

function renderDaySlots() {
  el("dayViewTitle").textContent = formatDate(state.selectedDate);
  el("dayViewSubtitle").textContent = "Choose an available time to include it in your enquiry.";
  el("roomSlotGrid").innerHTML = rooms.map((room) => {
    const slots = timeSlots.map((time) => {
      const status = slotStatus(state.selectedDate, room.id, time);
      const label = status === "available" ? "Available" : status === "booked" ? "Booked" : "Unavailable";
      const disabled = status === "available" ? "" : "disabled";
      return `
        <button type="button" class="time-slot ${status}" data-room="${room.id}" data-time="${time}" ${disabled}>
          <span>${time}</span>
          <span>${label}</span>
        </button>
      `;
    }).join("");

    return `
      <article class="slot-card">
        <div class="slot-room-title">
          <i class="room-dot" style="background:${roomColours[room.id]}"></i>
          <h3>${room.name}</h3>
        </div>
        <div class="slot-list">${slots}</div>
      </article>
    `;
  }).join("");

  el("roomSlotGrid").querySelectorAll(".time-slot.available").forEach((button) => {
    button.addEventListener("click", () => {
      const room = rooms.find((item) => item.id === button.dataset.room);
      const existingNotes = el("eventNotes").value.trim();
      state.selectedRoomId = room.id;
      el("eventDate").value = state.selectedDate;
      const selectedStart = slotTimeToInput(button.dataset.time);
      if (selectedStart) {
        el("eventStart").value = selectedStart;
        el("eventFinish").value = addOneHour(selectedStart);
      }
      el("eventNotes").value = [
        `Preferred time: ${button.dataset.time}`,
        `Preferred room: ${room.name}`,
        "",
        existingNotes
      ].join("\n").trim();
      renderEstimate();
      showTab("enquiry");
    });
  });
}

function renderModalDaySlots() {
  el("modalDayViewTitle").textContent = formatDate(state.selectedDate);
  el("modalDayViewSubtitle").textContent = "Choose a start time and finish time. The available times between them will be selected automatically.";
  el("modalRoomSlotGrid").innerHTML = rooms.map((room) => {
    const slots = timeSlots.map((time) => {
      const status = slotStatus(state.selectedDate, room.id, time);
      const label = status === "available" ? "Available" : status === "booked" ? "Booked" : "Unavailable";
      const disabled = status === "available" ? "" : "disabled";
      const selected = state.selectedSlotRoomId === room.id && state.selectedSlotTimes.includes(time);
      return `
        <button type="button" class="time-slot ${status} ${selected ? "selected" : ""}" data-room="${room.id}" data-time="${time}" ${disabled}>
          <span>${time}</span>
          <span>${selected ? "Selected" : label}</span>
        </button>
      `;
    }).join("");

    return `
      <article class="slot-card">
        <div class="slot-room-title">
          <i class="room-dot" style="background:${roomColours[room.id]}"></i>
          <h3>${room.name}</h3>
        </div>
        <div class="slot-list">${slots}</div>
      </article>
    `;
  }).join("");

  el("modalRoomSlotGrid").querySelectorAll(".time-slot.available").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSlotSelection(button.dataset.room, button.dataset.time);
      renderModalDaySlots();
    });
  });
  updateModalTimeSelectionSummary();
}

function openAvailabilityModal() {
  clearSlotSelection();
  renderModalDaySlots();
  el("availabilityModal").classList.add("open");
  el("availabilityModal").setAttribute("aria-hidden", "false");
}

function closeAvailabilityModal() {
  el("availabilityModal").classList.remove("open");
  el("availabilityModal").setAttribute("aria-hidden", "true");
}

function updateLightbox() {
  el("lightboxImage").src = state.lightboxImages[state.lightboxIndex];
  el("lightboxCaption").textContent = `${state.lightboxTitle} - ${state.lightboxIndex + 1} of ${state.lightboxImages.length}`;
}

function openLightbox(images, index, title) {
  state.lightboxImages = images;
  state.lightboxIndex = index;
  state.lightboxTitle = title;
  updateLightbox();
  el("lightbox").classList.add("open");
  el("lightbox").setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  el("lightbox").classList.remove("open");
  el("lightbox").setAttribute("aria-hidden", "true");
}

function moveLightbox(direction) {
  const count = state.lightboxImages.length;
  state.lightboxIndex = (state.lightboxIndex + direction + count) % count;
  updateLightbox();
}

function showTab(name) {
  if (name === "admin" && !state.adminLoggedIn) {
    el("adminDashboard").hidden = true;
    el("adminLogin").hidden = false;
    el("adminPassword").value = "";
  }
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === name));
  document.body.classList.toggle("admin-view", name === "admin");
  if (name === "admin") {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    resetAdminTimeout();
  }
}

async function verifyMember() {
  const value = el("memberLookup").value.trim();
  if (!value) {
    updateMemberStatus("Enter a member number, phone number or email address.", "error");
    el("memberLookup").focus();
    return;
  }

  updateMemberStatus("Checking membership...");
  try {
    const member = await lookupMember(value);
    if (!member || member.status === "inactive") {
      state.verifiedMember = null;
      updateMemberStatus("No active member found. The standard selected rate will apply.", "error");
      render();
      return;
    }
    state.verifiedMember = member;
    el("membership").value = "single";
    updateMemberStatus(`Member verified: ${memberDisplay(member)}. Member venue hire rate applied.`, "success");
    render();
  } catch (error) {
    state.verifiedMember = null;
    updateMemberStatus(`${error.message} The standard selected rate will apply.`, "error");
    render();
  }
}

function clearMemberLookup() {
  state.verifiedMember = null;
  el("memberLookup").value = "";
  updateMemberStatus("Verified members receive the member venue hire rate.");
  render();
}

function openEmail() {
  const inputs = getInputs();
  const room = rooms.find((item) => item.id === state.selectedRoomId);
  const name = el("clientName").value.trim();
  const email = el("clientEmail").value.trim();
  const date = el("eventDate").value || state.selectedDate;
  const notes = el("eventNotes").value.trim();
  const total = el("estimateTotal").textContent;
  const extras = selectedExtrasSummary();

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Preferred date and time: ${timeWindowText(inputs)}`,
    `Selected space: ${room ? room.name : "Not selected"}`,
    `Guests: ${inputs.guests}`,
    `Event type: ${labelFor(inputs.eventType)}`,
    `Rate band: ${labelFor(inputs.hireWindow)}`,
    `Membership: ${state.verifiedMember ? `Verified - ${memberDisplay(state.verifiedMember)}` : labelFor(inputs.membership)}`,
    `Estimated package: ${total}`,
    "",
    "Requested extras:",
    extras.length ? extras.map((item) => `- ${item}`).join("\n") : "None selected",
    "",
    "Notes:",
    notes
  ].join("\n");

  window.location.href = `mailto:manager@hannansclub.com.au?subject=${encodeURIComponent("Venue hire enquiry")}&body=${encodeURIComponent(body)}`;
}

function emailEstimateToClient() {
  const inputs = getInputs();
  const room = rooms.find((item) => item.id === state.selectedRoomId);
  const name = el("clientName").value.trim() || "there";
  const email = el("clientEmail").value.trim();
  const date = el("eventDate").value || state.selectedDate;
  const venue = room ? roomPrice(room, inputs) : 0;
  const extras = selectedExtrasSummary();

  if (!email) {
    alert("Please enter your email address first.");
    el("clientEmail").focus();
    return;
  }

  const body = [
    `Hi ${name},`,
    "",
    "Here is your venue hire estimate for The Hannans Club.",
    "",
    `Selected room: ${room ? room.name : "Not selected"}`,
    `Preferred date and time: ${timeWindowText(inputs)}`,
    `Guests: ${inputs.guests}`,
    `Event type: ${labelFor(inputs.eventType)}`,
    `Rate band: ${labelFor(inputs.hireWindow)}`,
    `Membership: ${state.verifiedMember ? `Verified - ${memberDisplay(state.verifiedMember)}` : labelFor(inputs.membership)}`,
    "",
    `Estimate inclusive of venue hire only: ${money.format(venue)}`,
    `Selected extras estimate: ${money.format(beverageTotal(inputs.guests))}`,
    "",
    "Selected extras:",
    extras.length ? extras.map((item) => `- ${item}`).join("\n") : "None selected",
    "",
    "This is an estimate only and is subject to confirmation by The Hannans Club.",
    "",
    "Kind regards,",
    "The Hannans Club"
  ].join("\n");

  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Your Hannans Club venue hire estimate")}&body=${encodeURIComponent(body)}`;
}

function render() {
  renderRooms();
  renderEstimate();
  renderCalendar();
  renderDateAvailability();
  renderDaySlots();
}

document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.tab)));
document.querySelector(".admin-corner-link").addEventListener("click", () => showTab("admin"));
["eventType", "guestCount", "eventStart", "eventFinish", "membership", "bevPackage", "arrivalCocktail", "arrivalBubbles", "basicSpirits", "barTab", "drinksPackage", "firePit", "gasHeaters"]
  .forEach((id) => el(id).addEventListener("input", render));
el("membership").addEventListener("change", () => {
  if (state.verifiedMember) clearMemberLookup();
});
el("verifyMemberButton").addEventListener("click", verifyMember);
el("clearMemberButton").addEventListener("click", clearMemberLookup);
el("memberLookup").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    verifyMember();
  }
});
["bevPackage", "arrivalCocktail", "arrivalBubbles", "basicSpirits", "barTab", "drinksPackage", "firePit", "gasHeaters"].forEach((id) => {
  el(id).addEventListener("change", () => {
    syncExtra(id, el(id).checked);
    renderExtrasTotal();
  });
});
[
  ["extraBevPackage", "bevPackage"],
  ["extraArrivalCocktail", "arrivalCocktail"],
  ["extraArrivalBubbles", "arrivalBubbles"],
  ["extraBasicSpirits", "basicSpirits"],
  ["extraBarTab", "barTab"],
  ["extraDrinksPackage", "drinksPackage"],
  ["extraFirePit", "firePit"],
  ["extraGasHeaters", "gasHeaters"]
].forEach(([modalId, packageId]) => {
  el(modalId).addEventListener("change", () => {
    syncExtra(packageId, el(modalId).checked);
    renderEstimate();
    renderExtrasTotal();
  });
});
el("extraOther").addEventListener("change", () => {
  renderEstimate();
  renderExtrasTotal();
});
["barTabAmount", "barTabIncluded", "drinksPackageIncluded", "drinksPackageTimeframe", "firePitQty", "gasHeaterQty", "otherExtraDetails"].forEach((id) => {
  el(id).addEventListener("input", () => {
    renderEstimate();
    renderExtrasTotal();
  });
});
el("emailButton").addEventListener("click", openEmail);
el("emailEstimateButton").addEventListener("click", emailEstimateToClient);
el("adminLoginButton").addEventListener("click", loginAdmin);
el("adminPassword").addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginAdmin();
});
el("adminLogoutButton").addEventListener("click", () => logoutAdmin(""));
el("backToBookingButton").addEventListener("click", () => {
  resetAdminTimeout();
  showTab("rooms");
});
el("printRunSheet").addEventListener("click", () => window.print());
el("saveStaffAssignments").addEventListener("click", saveStaffAssignments);
el("addStaffMemberButton").addEventListener("click", () => {
  renderAdditionalStaffRows([...currentAdditionalStaff(), "Unassigned"]);
});
el("saveNewStaffMember").addEventListener("click", addNewStaffMember);
el("newStaffMemberName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addNewStaffMember();
  }
});
el("upcomingReportButton").addEventListener("click", () => downloadAdminReport("upcoming"));
el("unstaffedReportButton").addEventListener("click", () => downloadAdminReport("unstaffed"));
el("saveEventNotes").addEventListener("click", saveEventNotes);
el("openAddEventModal").addEventListener("click", () => openAdminEventModal());
el("saveAdminEventButton").addEventListener("click", saveAdminEvent);
el("editBookingButton").addEventListener("click", () => {
  const booking = adminBookings.find((item) => item.id === state.selectedBookingId);
  if (booking) openAdminEventModal(booking);
});
el("cancelBookingButton").addEventListener("click", cancelSelectedBooking);
el("deleteBookingButton").addEventListener("click", deleteSelectedBooking);
el("adminMonthFilter").addEventListener("change", () => {
  state.adminMonth = el("adminMonthFilter").value;
  renderAdminBookings();
});
document.querySelectorAll("[data-close-admin-event]").forEach((item) => item.addEventListener("click", closeAdminEventModal));
el("upcomingEventsButton").addEventListener("click", () => setAdminView("upcoming"));
el("pastEventsButton").addEventListener("click", () => setAdminView("past"));
el("cancelledEventsButton").addEventListener("click", () => setAdminView("cancelled"));
document.querySelectorAll("[data-close-extras]").forEach((item) => item.addEventListener("click", closeExtrasModal));
el("continueToEnquiry").addEventListener("click", () => {
  closeExtrasModal();
  showTab("enquiry");
});
document.querySelectorAll("[data-close-availability]").forEach((item) => item.addEventListener("click", closeAvailabilityModal));
el("modalUseDateButton").addEventListener("click", () => {
  const room = rooms.find((item) => item.id === state.selectedSlotRoomId);
  const timeRange = selectedTimeRangeText();
  el("eventDate").value = state.selectedDate;
  applySelectedSlotTimesToInputs();
  if (room && timeRange) {
    const existingNotes = el("eventNotes").value.trim();
    state.selectedRoomId = room.id;
    el("eventNotes").value = [
      `Preferred time: ${timeRange}`,
      `Preferred room: ${room.name}`,
      "",
      existingNotes
    ].join("\n").trim();
  }
  closeAvailabilityModal();
  renderEstimate();
  showTab("enquiry");
});
document.querySelectorAll("[data-close-lightbox]").forEach((item) => item.addEventListener("click", closeLightbox));
el("lightboxPrev").addEventListener("click", () => moveLightbox(-1));
el("lightboxNext").addEventListener("click", () => moveLightbox(1));
["click", "input", "change", "keydown", "scroll"].forEach((eventName) => {
  el("admin").addEventListener(eventName, resetAdminTimeout, true);
});
document.addEventListener("keydown", (event) => {
  if (el("availabilityModal").classList.contains("open") && event.key === "Escape") closeAvailabilityModal();
  if (!el("lightbox").classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
el("prevMonth").addEventListener("click", () => {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
  renderCalendar();
});
el("nextMonth").addEventListener("click", () => {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
  renderCalendar();
});
el("useDateButton").addEventListener("click", () => {
  el("eventDate").value = state.selectedDate;
  renderRooms();
  renderEstimate();
  showTab("enquiry");
});
el("eventDate").value = state.selectedDate;
el("eventDate").addEventListener("input", () => {
  if (el("eventDate").value) {
    state.selectedDate = el("eventDate").value;
    const [year, month] = state.selectedDate.split("-").map(Number);
    state.calendarDate = new Date(year, month - 1, 1);
    renderCalendar();
    renderDateAvailability();
    renderDaySlots();
    renderRooms();
    renderEstimate();
  }
});

renderVendors();
render();
