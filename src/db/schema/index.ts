import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Data } from "~/db/schema/type";

export const data = sqliteTable("data", {
  id: integer("id").primaryKey(),
  kbi: text("kbi").notNull(),
  image: text("image"),
  tanggal: text("tanggal").notNull(),
  kejadian: text("kejadian").notNull(),
  kategori: text("kategori").notNull(),
  lokasi: text("lokasi").notNull(),
  posisi: text("posisi").notNull(),
  sumber: text("sumber").notNull(),
  petugas: text("petugas").notNull(),
  barcode: text("barcode"),
  keterangan: text("keterangan").notNull(),
  penyebab: text("penyebab").notNull(),

  kronologi: text("kronologi", { mode: "json" })
    .notNull()
    .$type<Data["kronologi"]>(),

  upaya: text("upaya", { mode: "json" }).notNull().$type<Data["upaya"]>(),

  wilayahTerdampak: text("wilayah_terdampak", { mode: "json" })
    .notNull()
    .$type<Data["wilayahTerdampak"]>(),

  korbanJiwa: text("korban_jiwa", { mode: "json" })
    .notNull()
    .$type<Data["korbanJiwa"]>(),

  kerusakanInfrastruktur: text("kerusakan_infrastruktur", {
    mode: "json",
  }).$type<Data["kerusakanInfrastruktur"]>(),

  kerusakanLainnya: text("kerusakan_lainnya", { mode: "json" })
    .notNull()
    .$type<Data["kerusakanLainnya"]>(),

  multimedia: text("multimedia"),

  statusTanggapDarurat: text("status_tanggap_darurat", { mode: "json" })
    .notNull()
    .$type<Data["statusTanggapDarurat"]>(),

  beritaTerkait: text("berita_terkait", { mode: "json" })
    .notNull()
    .$type<Data["beritaTerkait"]>(),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
