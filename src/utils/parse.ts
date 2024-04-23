import { load } from "cheerio";
import { z } from "zod";
import type { Data } from "~/db/schema/type";

export const getData = async (id: number): Promise<Data> => {
	const data = await fetch(`https://dibi.bnpb.go.id/xdibi2/read2/${id}`).then(
		(res) => res.text(),
	);

	const $ = load(data);

	const kbi = $("span:contains('Kode Bencana Indonesia (KBI) :')")
		.text()
		.split(":")[1]
		.trim();
	const image = $(".card-body .row.p-4 img").attr("src");

	const tanggal = $("span:contains('Tanggal :')").next().text();
	const kejadian = $("span:contains('Kejadian :')").next().text();
	const kategori = $("span:contains('Kategori :')").next().text();
	const lokasi = $("span:contains('Lokasi :')").next().text();
	const posisi = $("span:contains('Posisi :')")
		.next()
		.text()
		.replace("(", "")
		.replace(")", "")
		.split(",")
		.map((x) => Number.parseFloat(x));
	const posisiRaw = $("span:contains('Posisi :')").next().text();
	const sumber = $("span:contains('Sumber :')").next().text();
	const petugas = $("span:contains('Petugas :')").next().text();
	const barcode = $("span:contains('Barcode :')").next().attr("src");
	const keterangan = $("span:contains('Keterangan :')").next().text();
	const penyebab = $("span:contains('Penyebab :')").next().text();

	// KRONOLOGI
	const kronologi = [] as Data["kronologi"];
	$("div.card-header:contains('Kronologi')")
		.next()
		.find("tr")
		.each((i, el) => {
			const no = $(el).find("td:nth-child(1)").text();
			const tanggal = $(el).find("td:nth-child(2)").text();
			const kronologiTd = $(el).find("td:nth-child(3)").text();
			const keterangan = $(el).find("td:nth-child(4)").text();

			if (!no && !tanggal && !kronologiTd && !keterangan) return;

			kronologi.push({ no, tanggal, kronologi: kronologiTd, keterangan });
		});

	// UPAYA
	const upaya = [] as Data["upaya"];
	$("div.card-header:contains('Upaya')")
		.next()
		.find("tr")
		.each((i, el) => {
			const tanggal = $(el).find("td:nth-child(1)").text();
			const institusi = $(el).find("td:nth-child(2)").text();
			const pelaku = $(el).find("td:nth-child(3)").text();
			const upayaTd = $(el).find("td:nth-child(4)").text();
			const keterangan = $(el).find("td:nth-child(5)").text();

			if (!tanggal && !institusi && !pelaku && !upayaTd && !keterangan) return;

			upaya.push({ tanggal, institusi, pelaku, upaya: upayaTd, keterangan });
		});
	const wilayahTerdampak = [] as Data["wilayahTerdampak"];
	$("div.card-header:contains('Wilayah Terdampak')")
		.next()
		.find("tr")
		.each((i, el) => {
			const kode = $(el).find("td:nth-child(1)").text();
			const wilayah = $(el).find("td:nth-child(2)").text();

			if (!kode && !wilayah) return;

			wilayahTerdampak.push({ kode, wilayah });
		});

	// KORBAN JIWA
	const korbanJiwa = [] as Data["korbanJiwa"];
	$("div.card-header:contains('Korban Jiwa')")
		.next()
		.find("tr")
		.each((i, el) => {
			if (i === 0) return;

			const t = $(el).find("th").text();

			const typesEnum = [
				"Anak-anak (L)",
				"Anak-anak (P)",
				"Anak-anak (L+P)",
				"Dewasa (L)",
				"Dewasa (P)",
				"Dewasa (L+P)",
				"Lansia (L)",
				"Lansia (P)",
				"Lansia (L+P)",
				"Ibu hamil",
				"Total",
			] as const;

			const type = z.enum(typesEnum).parse(t);

			const result = {
				jenis: type,
				detail: {
					meninggal: $(el).find("td:nth-child(2)").text(),
					hilang: $(el).find("td:nth-child(3)").text(),
					terluka: $(el).find("td:nth-child(4)").text(),
					menderita: $(el).find("td:nth-child(5)").text(),
					mengungsi: $(el).find("td:nth-child(6)").text(),
					jumlah: $(el).find("td:nth-child(7)").text(),
				},
			};

			korbanJiwa.push({ ...result });
		});

	// KERUSAKAN INFRASTRUKTUR
	const kerusakanInfrastruktur = [] as Data["kerusakanInfrastruktur"];
	$("div.card-header:contains('Kerusakan Infrastruktur')")
		.next()
		.find("tr")
		.each((i, el) => {
			if (i === 0 || i === 1) return;

			const t = $(el).find("th").text();

			const typesEnum = [
				"1.Rumah",
				"2.Fasilitas Pendidikan",
				"3.Fasilitas Kesehatan",
				"4.Fasilitas Peribadatan",
				"5.Fasilitas Umum",
				"6.Perkantoran",
				"7.Pertokoan",
				"8.Pabrik",
				"9.Jembatan",
			] as const;

			const type = z.enum(typesEnum).parse(t);

			const trimType = type.split(".")[1].trim().toLowerCase();

			const result = {
				tipe: trimType,
				detail: {
					rusakBerat: $(el).find("td:nth-child(2)").text(),
					rusakSedang: $(el).find("td:nth-child(3)").text(),
					rusakRingan: $(el).find("td:nth-child(4)").text(),
					jumlah: $(el).find("td:nth-child(5)").text(),
					terendam: $(el).find("td:nth-child(6)").text(),
				},
			};

			kerusakanInfrastruktur.push({ ...result });
		});

	// KERUSAKAN LAINNYA
	const kerusakanLainnya = [] as Data["kerusakanLainnya"];
	$("div.card-header:contains('Kerusakan Lainnya')")
		.next()
		.find("th")
		.each((i, el) => {
			const t = $(el).text();

			const typesEnum = [
				"1.Sawah (ha)",
				"2.Kebun (ha)",
				"3.Lahan (ha)",
				"4.Jalan (km)",
				"5.Irigasi (km)",
				"6.Kolam (ha)",
				"7.Perkebunan (ha)",
				"8.Hutan (ha)",
				"9.Kerugian (jt Rp)",
				"10.Catatan",
			] as const;

			const type = z.enum(typesEnum).parse(t);

			const trimType = type.split(".")[1].trim().toLowerCase();

			const result = {
				tipe: trimType,
				jumlah: $(el).next().text(),
			};

			kerusakanLainnya.push({ ...result });
		});

	// MULTIMEDIA
	// const multimedia = [];
	const multimedia = $("div.card-header:contains('Multimedia')")
		.next()
		.html()
		?.trim();

	// STATUS TANGGAP DARURAT
	const statusTanggapDarurat = [] as Data["statusTanggapDarurat"];
	$("div.card-header:contains('Status Tanggap Darurat')")
		.next()
		.find("tr")
		.each((i, el) => {
			const no = $(el).find("td:nth-child(1)").text();
			const noSurat = $(el).find("td:nth-child(2)").text();
			const ditetapkan = $(el).find("td:nth-child(3)").text();
			const berlaku = $(el).find("td:nth-child(4)").text();
			const level = $(el).find("td:nth-child(5)").text();
			const keterangan = $(el).find("td:nth-child(6)").text().trim();
			const lampiran = $(el).find("td:nth-child(7)").text();

			if (
				!no &&
				!noSurat &&
				!ditetapkan &&
				!berlaku &&
				!level &&
				!keterangan &&
				!lampiran
			) {
				return;
			}

			statusTanggapDarurat.push({
				no,
				noSurat,
				ditetapkan,
				berlaku,
				level,
				keterangan,
				lampiran,
			});
		});

	// BERITA TERKAIT
	const beritaTerkait = [] as Data["beritaTerkait"];
	$("div.card-header:contains('Berita Terkait')")
		.next()
		.find("tr")
		.each((i, el) => {
			const terbit = $(el).find("td:nth-child(1)").text();
			const judul = $(el).find("td:nth-child(2)").text();
			const link = $(el).find("td:nth-child(3)").text();
			const sumber = $(el).find("td:nth-child(4)").text();
			const keterangan = $(el).find("td:nth-child(5)").text();

			if (!terbit && !judul && !link && !sumber && !keterangan) return;

			beritaTerkait.push({ terbit, judul, link, sumber, keterangan });
		});

	return {
		kbi,
		image,
		tanggal,
		kejadian,
		kategori,
		lokasi,
		posisi: posisiRaw,
		// posisiRaw,
		sumber,
		petugas,
		barcode,
		keterangan,
		penyebab,
		kronologi,
		upaya,
		wilayahTerdampak,
		korbanJiwa,
		kerusakanInfrastruktur,
		kerusakanLainnya,
		// multimedia,
		statusTanggapDarurat,
		beritaTerkait,
	};
};
