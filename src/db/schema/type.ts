export type Data = {
	kbi: string;
	image: string | undefined;
	tanggal: string;
	kejadian: string;
	kategori: string;
	lokasi: string;
	posisi: string;
	sumber: string;
	petugas: string;
	barcode: string | undefined;
	keterangan: string;
	penyebab: string;

	kronologi: Array<{
		no: string;
		tanggal: string;
		kronologi: string;
		keterangan: string;
	}>;

	upaya: Array<{
		tanggal: string;
		institusi: string;
		pelaku: string;
		upaya: string;
		keterangan: string;
	}>;

	wilayahTerdampak: Array<{
		kode: string;
		wilayah: string;
	}>;

	korbanJiwa: Array<{
		jenis: string;
		detail: {
			meninggal: string;
			hilang: string;
			terluka: string;
			menderita: string;
			mengungsi: string;
			jumlah: string;
		};
	}>;

	kerusakanInfrastruktur: Array<{
		tipe: string;
		detail: {
			rusakBerat: string;
			rusakSedang: string;
			rusakRingan: string;
			jumlah: string;
			terendam: string;
		};
	}>;

	kerusakanLainnya: Array<{
		tipe: string;
		jumlah: string;
	}>;

	// multimedia: any;

	statusTanggapDarurat: Array<{
		no: string;
		noSurat: string;
		ditetapkan: string;
		berlaku: string;
		level: string;
		keterangan: string;
		lampiran: string;
	}>;

	beritaTerkait: Array<{
		terbit: string;
		judul: string;
		link: string;
		sumber: string;
		keterangan: string;
	}>;
};
