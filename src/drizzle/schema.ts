import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
});

export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  destination: text('destination').notNull(),
  durationStart: integer('destination_start').notNull(),
  durationEnd: integer('destination_end').notNull(),
  tripStartTime: integer('day_start_time').notNull(),
  tripEndTime: integer('day_end_time').notNull(),
  visibility: boolean('visibility').notNull(),
  flightFrom: text('flight_city_from').notNull(),
  flightTo: text('flight_city_to').notNull(),
  flightDate: integer('flight_date').notNull(),
  flightNo: text('flight_no').notNull(),
  ticketNo: text('ticket_no').notNull(),
  hotelBooking: text('hotel_booking').notNull(),
  hotelName: text('hotel_name').notNull(),
  hotelLocation: text('hotel_location').notNull(),
  hotelPhone: text('hotel_phone'),
  checkInStart: integer('checkIn_start').notNull(),
  checkInEnd: integer('checkIn_end').notNull(),
});

export const tripsRelations = relations(trips, ({ one }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
}));
export const userRelations = relations(users, ({ many }) => ({
  trips: many(trips),
}));
