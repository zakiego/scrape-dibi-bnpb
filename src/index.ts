import { load } from "cheerio";
import { z } from "zod";
import { dbClient, dbSchema } from "~/db";
import { logger } from "~/utils/log";

const getData = async (id: number) => {
	const data = await fetch(`https://dibi.bnpb.go.id/xdibi2/read2/${id}`).then(
		(res) => res.text(),
	);

	const $ = load(data);

	// find div with class "card-body", then find "row p-4", then find "img
	const img = $(".card-body .row.p-4 img").attr("src");

	const tanggal = $("span:contains('Tanggal :')").next().text();
	const kejadian = $("span:contains('Kejadian :')").next().text();
	const kategori = $("span:contains('Kategori :')").next().text();
	const lokasi = $("span:contains('Lokasi :')").next().text();
	const posisi = $("span:contains('Posisi :')").next().text();
	const sumber = $("span:contains('Sumber :')").next().text();
	const petugas = $("span:contains('Petugas :')").next().text();
	const barcode = $("span:contains('Barcode :')").next().attr("src");
	const keterangan = $("span:contains('Keterangan :')").next().text();
	const penyebab = $("span:contains('Penyebab :')").next().text();

	return {
		img,
		tanggal,
		kejadian,
		kategori,
		lokasi,
		posisi,
		sumber,
		petugas,
		barcode,
		keterangan,
		penyebab,
	};
};

const main = async () => {
	const data = await Promise.all([getData(1), getData(65099), getData(65072)]);
	console.log(data);
};

main();
