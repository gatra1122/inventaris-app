export type UserType = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  password: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
  role: string;
};

export type BarangType = {
  id: number;
  kode: string;
  nama: string;
  kategori_id: string;
  supplier_id: string;
  supplier: string;
  kategori: string;
  merk: string;
  spesifikasi: string;
  satuan: string;
  stok: number;
  stok_minimum: number;
  gambar: string;
  created_at: string;
  updated_at: string;
};

export type KategoriType = {
  id: number;
  kategori: string;
  created_at: string;
  updated_at: string;
};

export type SupplierType = {
  id: number;
  supplier: string;
  alamat: string;
  kontak: string;
  email: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};