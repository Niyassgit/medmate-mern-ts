export interface IGuestListItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isBlocked: boolean | null;
  territoryName: string | null;
  createdAt: Date | null;
  loginId: string | null;
}

