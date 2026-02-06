import { ClaimRoute } from "../types/claimRoute";

type ExplanationContext = {
  route: ClaimRoute;
  missingFields: string[];
};

export function explainRoute({
  route,
  missingFields,
}: ExplanationContext): string {
  switch (route) {
    case "Manual Review":
      return `The claim was routed to Manual Review because the following mandatory fields are missing: ${missingFields.join(
        ", ",
      )}.`;

    case "Fast-track":
      return "The claim qualifies for Fast-track processing due to low estimated damage.";

    case "Investigation Flag":
      return "The claim was flagged for investigation due to potential fraud indicators in the incident description.";

    case "Specialist Queue":
      return "The claim involves an injury and requires specialist handling.";

    case "Standard Processing":
      return "The claim meets all requirements and was routed for standard processing.";

    default:
      return "No explanation available for the selected route.";
  }
}
