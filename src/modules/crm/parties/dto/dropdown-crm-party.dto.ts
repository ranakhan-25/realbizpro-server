export class CrmPartyDropdownDto {
  uuid: string;
  name: string;
  phone: string;
  email?: string;
  partyType: string;
  status: string;
  assignee?: { uuid: string; name: string };
}
