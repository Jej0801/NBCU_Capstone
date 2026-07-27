import express from "express";
import { getNavigationGuidance, getNavigationGuidanceStream } from "../services/claudeService.js";
import { findRelevantResources } from "../services/retrievalService.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    const sessionId = req.body?.sessionId || null;
    const stream = req.body?.stream === true;

    if (!question) {
      return res.status(400).json({
        error: "Question is required.",
      });
    }

    if (question.length > 1000) {
      return res.status(400).json({
        error: "Question is too long. Please keep it under 1000 characters.",
      });
    }

    const relevantResources = await findRelevantResources(question);

    // Handle streaming request
    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      try {
        for await (const chunk of getNavigationGuidanceStream(
          question,
          relevantResources,
          sessionId
        )) {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);

          if (chunk.type === "complete") {
            res.end();
            return;
          }
        }
      } catch (streamError) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            error: "Streaming failed. Please try again.",
          })}\n\n`
        );
        res.end();
      }
    } else {
      // Standard non-streaming request
      const guidance = await getNavigationGuidance(question, relevantResources, sessionId);
      res.json(guidance);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
