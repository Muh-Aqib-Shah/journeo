CREATE TABLE IF NOT EXISTS "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"destination" text NOT NULL,
	"destination_start" integer NOT NULL,
	"destination_end" integer NOT NULL,
	"day_start_time" integer NOT NULL,
	"day_end_time" integer NOT NULL,
	"visibility" boolean NOT NULL,
	"flight_city_from" text NOT NULL,
	"flight_city_to" text NOT NULL,
	"flight_date" integer NOT NULL,
	"flight_no" text NOT NULL,
	"ticket_no" text NOT NULL,
	"hotel_booking" text NOT NULL,
	"hotel_name" text NOT NULL,
	"hotel_location" text NOT NULL,
	"hotel_phone" text,
	"checkIn_start" integer NOT NULL,
	"checkIn_end" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
