export type Account = {
  userId: String,
  summarizationsLeft: number;
  dailySummarization: boolean;
  lastTimePasswordUpdate?: Date;
}

export type DetailedSummary = {
  what?: string;
  who?: string[];
  where?: string[];
  why?: string;
  how?: string;
  when?: string;
}

export type Article = {
  articleId: string;
  title: string;
  url: string;
  summary: string;
  summarizerIds: string[];
  detailed_summary: DetailedSummary;
  citations: string[];
  created_at: string;
}

export type ArticleHead = {
  articleId: string;
  title: string;
  url: string;
  created_at: string;
  summarizerIds: string[];
}
