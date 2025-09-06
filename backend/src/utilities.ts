import {firestore} from "firebase-admin";
import {Article, UserDetails} from "./types";
import Firestore = firestore.Firestore;

export async function getSummarizationSettings(firestore: Firestore, userId: string): Promise<UserDetails> {
  const userDetails = (await firestore.collection("users").doc(userId).get()).data()!;
  return {summarizationsLeft: userDetails.summarizationsLeft, dailySummarization: userDetails.dailySummarization};
}

export async function updateSummarizationSettings(firestore: Firestore, userId: string, userDetails: UserDetails) {
  firestore.collection("users").doc(userId).update({
    dailySummarization: false,
    summarizationsLeft: userDetails.dailySummarization ? userDetails.summarizationsLeft : userDetails.summarizationsLeft - 1,
  });
}

export async function getArticle(firestore: Firestore, url: string): Promise<Article | undefined> {
  const response = await firestore.collection("articles").where("url", "==", url).get();
  if (!response.empty) {
    return response.docs[0].data() as Article;
  } else return undefined;
}

export async function addSummarizer(firestore: Firestore, articleId: string, summarizerIds: string[]) {
  firestore.collection("articles").doc(articleId).update({summarizerIds: summarizerIds});
}

export async function addArticle(firestore: Firestore, article: Article): Promise<string> {
  return (await firestore.collection("articles").add(article)).id as string;
}
