CREATE TYPE "public"."invoice_status" AS ENUM('UNPAID', 'PARTIAL', 'PAID', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('TRANSFER', 'CASH', 'QRIS');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" text NOT NULL,
	"invoice_number" text NOT NULL,
	"total_amount" integer NOT NULL,
	"status" "invoice_status" DEFAULT 'UNPAID' NOT NULL,
	"due_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"amount_paid" integer NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"proof_of_payment" text,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;