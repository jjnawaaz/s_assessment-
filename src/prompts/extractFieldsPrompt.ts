export function buildExtractionPrompt(rawText: string): string {
  return `
You are an insurance claims data extraction system.

Extract structured data from the FNOL document text below.

RULES:
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT guess values
- Use null if a field is missing
- Match the schema EXACTLY

SCHEMA:
{
  "policyInformation": {
    "policyNumber": string | null,
    "policyholderName": string | null,
    "effectiveDates": string | null
  },
  "incidentInformation": {
    "date": string | null,
    "time": string | null,
    "location": string | null,
    "description": string | null
  },
  "involvedParties": {
    "claimant": string | null,
    "thirdParties": string[] | null,
    "contactDetails": string | null
  },
  "assetDetails": {
    "assetType": string | null,
    "assetId": string | null,
    "estimatedDamage": number | null
  },
  "otherMandatoryFields": {
    "claimType": "injury" | "property" | "auto" | null,
    "attachments": string[] | null,
    "initialEstimate": number | null
  }
}
If the description of accident mentions injury, injuries, medical treatment,
hospitalization, or injured parties, set claimType = "injury".
Otherwise, set claimType = "auto".

FNOL DOCUMENT TEXT:
"""
${rawText}
"""
`.trim();
}
