import {z} from "genkit";

export type UserDetails = {
  summarizationsLeft: number,
  dailySummarization: boolean
}

export const SummarySchema = z.object({
  summary: z.string(),
  detailed_summary: z.object({
    who: z.array(z.string()).optional().describe("Identify the key people, organizations, or entities involved in \"what\" happened."),
    why: z.string().optional().describe("Explain the reason or cause behind the event or topic."),
    what: z.string().optional().describe("Briefly state the primary event or topic covered by the article."),
    when: z.string().optional().describe("Mention the time or date relevant to the topic."),
    where: z.array(z.string()).optional().describe("Specify the location where the event or topic is centered."),
    how: z.string().optional().describe("Describe how the event occurred or how the situation developed."),
  }),
});
export type Summary = z.infer<typeof SummarySchema>;

export const ArticleSchema = z.object({
  articleId: z.string().optional(),
  url: z.string(),
  summarizerIds: z.array(z.string()),
  created_at: z.string(),
  citations: z.array(z.string()),
}).merge(SummarySchema);
export type Article = z.infer<typeof ArticleSchema>;
