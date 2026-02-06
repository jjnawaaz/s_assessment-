import { Router } from "express";
import multer from "multer";
import { extractFieldsFromText } from "../services/fieldExtractor";
import { PDFParse } from "pdf-parse";
import { validateClaimFields } from "../services/claimValidator";
import { routeClaim } from "../services/claimrouter";
import { explainRoute } from "../services/routeExplanation";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { mimetype, buffer } = req.file;
    let rawText = "";

    // pdf handling
    if (mimetype.includes("pdf")) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      rawText = result.text || "";
    }
    // Txt handling
    else if (mimetype === "text/plain") {
      rawText = buffer.toString("utf-8");
    }
    // Unsupported
    else {
      return res.status(400).json({
        error: "Unsupported file type. Only PDF and TXT allowed.",
      });
    }

    const extractedFields = await extractFieldsFromText(rawText);
    const { missingFields } = validateClaimFields(extractedFields);
    const recommendedRoute = routeClaim({
      extractedFields,
      missingFields,
    });

    const routingExplanation = explainRoute({
      route: recommendedRoute,
      missingFields,
    });

    return res.json({
      extractedFields,
      missingFields,
      recommendedRoute,
      routingExplanation,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Failed to process file" });
  }
});

export default router;
