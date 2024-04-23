import ConcurrentManager from "concurrent-manager";
import { dbClient, dbSchema } from "~/db";
import { logger } from "~/utils/log";
import { getData } from "~/utils/parse";

const main = async () => {
	// const data = await Promise.all([
	// 	getData(1),
	// 	getData(65099),
	// 	getData(65072),
	// 	getData(65016),
	// 	getData(59310),
	// 	getData(64176),
	// 	getData(60448), // kronologi & kerusakan lainnya & kerusakan infrastruktur && korban jiwa
	// 	getData(59310), // kerusakan infrastruktur
	// ]);

	// for (const d of data) {
	// 	// console.log(d);
	// 	console.dir(d.multimedia, { depth: null });
	// }

	const ids = Array.from({ length: 65_000 }, (_, i) => i + 1);

	const alreadyInserted = await dbClient
		.select({ id: dbSchema.data.id })
		.from(dbSchema.data);

	const alreadyInsertedIds = new Set(alreadyInserted.map((x) => x.id));

	const notInsertedIds = ids.filter((x) => !alreadyInsertedIds.has(x));

	const concurrent = new ConcurrentManager({
		concurrent: 50, // max concurrent process to be run
		withMillis: true, // add millisecond tracing to process
	});

	for (const id of notInsertedIds) {
		concurrent.queue(async () => {
			const data = await getData(id);

			try {
				await dbClient.insert(dbSchema.data).values({
					id: id,
					kbi: data.kbi,
					image: data.image,
					tanggal: data.tanggal,
					kejadian: data.kejadian,
					kategori: data.kategori,
					lokasi: data.lokasi,
					posisi: data.posisi,
					sumber: data.sumber,
					petugas: data.petugas,
					barcode: data.barcode,
					keterangan: data.keterangan,
					penyebab: data.penyebab,

					kronologi: data.kronologi,
					upaya: data.upaya,
					wilayahTerdampak: data.wilayahTerdampak,
					korbanJiwa: data.korbanJiwa,
					kerusakanInfrastruktur: data.kerusakanInfrastruktur,
					kerusakanLainnya: data.kerusakanLainnya,

					statusTanggapDarurat: data.statusTanggapDarurat,
					beritaTerkait: data.beritaTerkait,
				});

				logger.info(`Inserted ${id}`);
			} catch (error) {
				logger.error(`Error inserting ${id}, because of ${error}`);
				logger.error(error);
			}
		});
	}

	concurrent.run();
};

main();
