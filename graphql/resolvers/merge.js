const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const events = async (eventId) => {
  try {
    const events = await Event.find({ _id: { $in: eventId } });
    events.map((event) => {
      return transformEvent(event);
    });
    return events;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);

    return {
      ...user._doc,
      createdEvent: events.bind(this, user._doc.createdEvent),
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: user.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
    return {
       ...event._doc,
       date: dateToString(event._doc.date),
       creator: user.bind(this, event.creator),
     };
}


const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
      }
}


exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
//exports.events = events;
// exports.user = user;
// exports.singleEvent = singleEvent;
