import { ExtractedFields } from "../types/extractedFields";
import { ClaimRoute } from "../types/claimRoute";

type RoutingContext = {
  extractedFields: ExtractedFields;
  missingFields: string[];
};

type RouteHandler = (ctx: RoutingContext) => ClaimRoute | null;

const fraudKeywords = ["fraud", "suspicious", "staged", "fake", "intentional"];

const handlers: RouteHandler[] = [
  // Manual Review
  ({ missingFields }) => (missingFields.length > 0 ? "Manual Review" : null),

  // Investigation Flag
  ({ extractedFields }) =>
    fraudKeywords.some((keyword) =>
      extractedFields.incidentInformation.description
        ?.toLowerCase()
        .includes(keyword),
    )
      ? "Investigation Flag"
      : null,

  // Fast-track
  ({ extractedFields }) =>
    extractedFields.assetDetails.estimatedDamage !== null &&
    extractedFields.assetDetails.estimatedDamage < 25000
      ? "Fast-track"
      : null,

  // Specialist Queue
  ({ extractedFields }) =>
    extractedFields.otherMandatoryFields.claimType === "injury"
      ? "Specialist Queue"
      : null,
];

export function routeClaim(ctx: RoutingContext): ClaimRoute {
  for (const handler of handlers) {
    const result = handler(ctx);
    if (result) return result;
  }

  return "Standard Processing";
}
