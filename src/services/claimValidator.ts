import { ExtractedFields } from "../types/extractedFields";

export type ValidationResult = {
  missingFields: string[];
};

export function validateClaimFields(
  extracted: ExtractedFields,
): ValidationResult {
  const missingFields: string[] = [];

  const requiredChecks: Record<string, unknown> = {
    "policyInformation.policyNumber": extracted.policyInformation.policyNumber,
    "incidentInformation.date": extracted.incidentInformation.date,
    "incidentInformation.description":
      extracted.incidentInformation.description,
    "assetDetails.assetType": extracted.assetDetails.assetType,
    "otherMandatoryFields.claimType": extracted.otherMandatoryFields.claimType,
  };

  for (const [fieldPath, value] of Object.entries(requiredChecks)) {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      missingFields.push(fieldPath);
    }
  }

  return { missingFields };
}
