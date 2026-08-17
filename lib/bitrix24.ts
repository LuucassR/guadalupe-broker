export interface BitrixLeadPayload {
  TITLE: string;
  NAME: string;
  PHONE: { VALUE: string; VALUE_TYPE: string }[];
  EMAIL?: { VALUE: string; VALUE_TYPE: string }[];
  COMMENTS?: string;
  SOURCE_ID?: string;
  UF_CRM_SOURCE?: string;
}

export async function createBitrixLead(payload: BitrixLeadPayload) {
  const url = `${process.env.BITRIX24_WEBHOOK_URL}/crm.lead.add.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: payload,
      params: { REGISTER_SONET_EVENT: "Y" },
    }),
  });
  if (!res.ok) throw new Error(`Bitrix24 error: ${res.status}`);
  const data = await res.json();
  return data.result as string;
}
