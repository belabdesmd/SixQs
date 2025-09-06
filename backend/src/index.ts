import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { startFlowServer } from '@genkit-ai/express';
import {Article, ArticleSchema, Summary, SummarySchema} from './types';
import {
  addArticle,
  addSummarizer,
  getArticle,
  getSummarizationSettings,
  updateSummarizationSettings
} from './utilities';
import {credential} from "firebase-admin";
import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from "firebase-admin/firestore";
import {configDotenv} from 'dotenv';

// ----------------------------------------- Initializations
const app = initializeApp({credential: credential.cert("./firebase-creds.json"),});
const firestore = getFirestore(app);

// ----------------------------------------- Configurations
configDotenv()
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

// ----------------------------------------- Prompts
const summaryPrompt = ai.definePrompt(
  {
    name: "summaryPrompt",
    input: {schema: z.object({URL: z.string()})},
    output: {
      format: "json",
      schema: SummarySchema.or(z.object({error: z.string()}).describe("The error message in case of an error summarizing the article")),
    },
  },
  `
You are a News Analysis Assistant. Given the following:

URL: {{URL}}

Instructions:

1. First, check if the domain in the URL belongs to a known and reputable news organization. Examples include:
cnn.com, bbc.com, nytimes.com, reuters.com, aljazeera.com, theguardian.com, washingtonpost.com, nbcnews.com, apnews.com,
bloomberg.com, politico.com

If the domain is **not** in this list, respond with: The website is not recognized as a supported news source.

Do not proceed to the next steps.

---

If the domain **is** a recognized news source, continue:

2. Provide a concise medium-length summary of the article on this URL.

3. Search the web for news articles published **after** the date of {{URL}} on the same topic.

4. Combine all information (from original + newer articles) and answer the following **independently**:

- **Who:** [List of people or organizations]
- **What:** One sentence
- **When:** One sentence
- **Where:** [List of locations]
- **Why:** One sentence explaining the reason
- **How:** One sentence explaining the process or method

Leave any answer blank if no relevant information is found. Do not explain or add any other information.
`
);

// ----------------------------------------- Flows
const summarizeArticleFlow = ai.defineFlow(
  {
    name: "summarize-article-flow",
    inputSchema: z.object({userId: z.string(), url: z.string()}),
    outputSchema: ArticleSchema.or(z.object({error: z.string()})),
  },
  async (input, {context}) => {
    // Check if there's summarization allowed
    const userDetails = await getSummarizationSettings(firestore, input.userId);
    if (!userDetails.dailySummarization && userDetails.summarizationsLeft == 0) {
      return {error: "You have reached your limit of summarizations. Please get new credits to continue."};
    }

    // Check if the Article already exists
    const article = await getArticle(firestore, input.url);
    if (article) {
      await addSummarizer(firestore, article.articleId!, [input.userId, ...article.summarizerIds]);
      return article; // already exists, return it
    }

    // ------------------------ Summarize The Article
    const response = (await summaryPrompt({URL: input.url}));
    const summary: Summary | { error: string } = response.output!;

    // ------------------------ Prepare and Save Article
    if ("error" in summary) {
      return {error: summary.error};
    } else {
      const article: Article = {
        summarizerIds: [input.userId],
        url: input.url,
        summary: summary.summary,
        detailed_summary: summary.detailed_summary,
        citations: [], //TODO: handle citations
        created_at: new Date().toDateString(),
      };

      try {
        const articleId = await addArticle(firestore, article);
        await updateSummarizationSettings(firestore, input.userId, userDetails);
        return {articleId: articleId, ...article};
      } catch (e) {
        // not saved, it's ok for now
        return {articleId: "NULL", ...article};
      }
    }
  },
);

startFlowServer({flows: [summarizeArticleFlow]});
