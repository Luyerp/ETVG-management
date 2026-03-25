export type MemberRow = {
  id: number;
  slot_id: number | null;
  first_name: string;
  last_name: string;
  tel: string | null;
  entry_date: string | null;
  withdraw_date: string | null;
  role_id: number | null;
  role: string | null;
};

export type MembersListResponse = {
  items: MemberRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type RoleOption = { id: number; description: string };
