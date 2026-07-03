import { 
  pgTable, 
  uuid, 
  text, 
  integer, 
  timestamp, 
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Enums untuk Konsistensi Data
export const carStatusEnum = pgEnum("car_status", ["AVAILABLE", "RENTED", "MAINTENANCE"]);
export const rentalStatusEnum = pgEnum("rental_status", ["BOOKED", "ON_GOING", "COMPLETED", "CANCELLED"]);
export const cashflowTypeEnum = pgEnum("cashflow_type", ["INCOME", "EXPENSE"]);
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER", "DRIVER"])

// 2. Tabel Mobil (Armada)
export const cars = pgTable("cars", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  plateNumber: text("plate_number").notNull().unique(),
  pricePerDay: integer("price_per_day").notNull(), // Simpan dalam angka penuh (contoh: 300000)
  status: carStatusEnum("status").default("AVAILABLE").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Tabel Pelanggan
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nik: text("nik").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Tabel Transaksi Sewa
export const rentals = pgTable("rentals", {
  id: uuid("id").primaryKey().defaultRandom(),
  carId: uuid("car_id").references(() => cars.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: rentalStatusEnum("status").default("BOOKED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Tabel Cashflow (Keuangan)
export const cashflow = pgTable("cashflow", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: cashflowTypeEnum("type").notNull(), // INCOME atau EXPENSE
  amount: integer("amount").notNull(),
  category: text("category").notNull(), // e.g., "Sewa Mobil", "Ganti Oli", "Cuci Mobil"
  date: timestamp("date").defaultNow().notNull(),
  rentalId: uuid("rental_id").references(() => rentals.id, { onDelete: 'cascade' }), // Relasi Opsional (Hanya untuk Income sewa)
  notes: text("notes"),
});

export const invoiceStatusEnum = pgEnum("invoice_status", ["UNPAID", "PARTIAL", "PAID", "CANCELLED"]);
export const paymentMethodEnum = pgEnum("payment_method", ["TRANSFER", "CASH", "QRIS"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "VERIFIED", "REJECTED"]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: text("order_id").notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  totalAmount: integer("total_amount").notNull(),
  status: invoiceStatusEnum("status").default("UNPAID").notNull(),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").references(() => invoices.id).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  amountPaid: integer("amount_paid").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  proofOfPayment: text("proof_of_payment"),
  status: paymentStatusEnum("status").default("PENDING").notNull(),
});

// Tabel User For the App
export const app_user = pgTable("app_user", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  role: userRoleEnum("role").default("USER").notNull(),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
})

// --- DEFINISI RELASI (Agar Query Lebih Mudah) ---

export const carsRelations = relations(cars, ({ many }) => ({
  rentals: many(rentals),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({ one, many }) => ({
  car: one(cars, { fields: [rentals.carId], references: [cars.id] }),
  customer: one(customers, { fields: [rentals.customerId], references: [customers.id] }),
  cashflows: many(cashflow),
}));

export const cashflowRelations = relations(cashflow, ({ one }) => ({
  rental: one(rentals, { fields: [cashflow.rentalId], references: [rentals.id] }),
}));

export const invoicesRelations = relations(invoices, ({ many }) => ({
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
}));