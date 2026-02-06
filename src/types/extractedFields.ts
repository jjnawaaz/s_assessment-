export type ExtractedFields = {
  policyInformation: {
    policyNumber: string | null;
    policyholderName: string | null;
    effectiveDates: string | null;
  };
  incidentInformation: {
    date: string | null;
    time: string | null;
    location: string | null;
    description: string | null;
  };
  involvedParties: {
    claimant: string | null;
    thirdParties: string[] | null;
    contactDetails: string | null;
  };
  assetDetails: {
    assetType: string | null;
    assetId: string | null;
    estimatedDamage: number | null;
  };
  otherMandatoryFields: {
    claimType: "injury" | "property" | "auto" | null;
    attachments: string[] | null;
    initialEstimate: number | null;
  };
};
