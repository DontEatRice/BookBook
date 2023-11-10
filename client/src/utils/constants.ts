export type Role = 'User' | 'Admin' | 'Employee';

export type ErrorResponse = {
  type: string;
  code?: string;
};

export const LocalStorageTokenKey = 'token';

export type Claims = {
  idenityid: string;
  role: string | Array<string>;
  exp: number;
  email: string;
  libraryid?: string;
};

export type Order = 'asc' | 'desc';

export const languages = [
  "Angielski",
  "Chiński",
  "Hiszpański",
  "Hindi",
  "Arabski",
  "Bengalski",
  "Portugalski",
  "Rosyjski",
  "Japoński",
  "Niemiecki",
  "Jawajski",
  "Lahnda (pandżabski)",
  "Koreański",
  "Francuski",
  "Telugu",
  "Marathi",
  "Turecki",
  "Tamilski",
  "Włoski",
  "Ukraiński",
  "Indonezyjski",
  "Urdu",
  "Gujarati",
  "Polski",
  "Kantoński",
  "Kanada (Hokkien)",
  "Malajalam",
  "Sundajski",
  "Hausa",
  "Perski",
  "Wietnamski",
  "Joruba",
  "Thajski",
  "Birmański",
  "Haka (Hakka)",
  "Uzbecki",
  "Orija",
  "Azerbejdżański",
  "Holenderski",
  "Yoruba",
  "Birmajski",
  "Igbo",
  "Amharski",
  "Bulu",
  "Fula",
  "Rumuński",
  "Nepalski",
  "Maithili",
  "Bhojpuri",
  "Akan"
]
