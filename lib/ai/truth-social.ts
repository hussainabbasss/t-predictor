/**
 * ScrapeCreators Truth Social — Donald Trump posts only.
 * Gracefully degrades when credits are exhausted or the API is unavailable.
 */

const API_BASE = "https://api.scrapecreators.com";
const TRUMP_HANDLE = "realDonaldTrump";
const TRUMP_USER_ID = "107780257626128497";
const CACHE_TTL_MS = 5 * 60 * 1000;
const CIRCUIT_BREAKER_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12_000;
const DEFAULT_POST_LIMIT = 12;

export type TruthSocialFetchStatus =
  | "ok"
  | "skipped_no_key"
  | "skipped_circuit_open"
  | "skipped_no_posts"
  | "error_credits"
  | "error_auth"
  | "error_unavailable";

type TruthSocialPost = {
  id: string;
  text?: string;
  content?: string;
  created_at?: string;
  url?: string;
  account?: {
    username?: string;
    acct?: string;
    display_name?: string;
  };
};

type TruthSocialApiResponse = {
  success?: boolean;
  posts?: TruthSocialPost[];
  message?: string;
  error?: string;
};

type CacheEntry = {
  posts: TruthSocialPost[];
  fetchedAt: number;
};

let postCache: CacheEntry | null = null;
let circuitOpenUntil = 0;
let circuitReason: TruthSocialFetchStatus | null = null;

function getApiKey(): string | undefined {
  return process.env.SCRAPECREATORS_API_KEY;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function postBody(post: TruthSocialPost): string {
  if (post.text?.trim()) return post.text.trim();
  if (post.content) return stripHtml(post.content);
  return "";
}

function isTrumpPost(post: TruthSocialPost): boolean {
  const username = post.account?.username ?? post.account?.acct ?? "";
  return username.toLowerCase() === TRUMP_HANDLE.toLowerCase();
}

function openCircuit(reason: "error_credits" | "error_auth") {
  circuitOpenUntil = Date.now() + CIRCUIT_BREAKER_MS;
  circuitReason = reason;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function scorePost(post: TruthSocialPost, queryWords: string[]): number {
  const body = postBody(post).toLowerCase();
  if (!body) return 0;

  let score = 0;
  for (const word of queryWords) {
    if (body.includes(word)) score += 2;
  }
  return score;
}

function rankPosts(posts: TruthSocialPost[], query: string): TruthSocialPost[] {
  const queryWords = tokenize(query);
  if (!queryWords.length) {
    return posts.slice(0, 6);
  }

  return [...posts]
    .map((post) => ({ post, score: scorePost(post, queryWords) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aTime = a.post.created_at ? Date.parse(a.post.created_at) : 0;
      const bTime = b.post.created_at ? Date.parse(b.post.created_at) : 0;
      return bTime - aTime;
    })
    .slice(0, 6)
    .map(({ post }) => post);
}

async function fetchPostsFromApi(): Promise<TruthSocialPost[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const url = new URL(`${API_BASE}/v1/truthsocial/user/posts`);
  url.searchParams.set("user_id", TRUMP_USER_ID);
  url.searchParams.set("handle", TRUMP_HANDLE);
  url.searchParams.set("trim", "true");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.status === 402) {
      openCircuit("error_credits");
      return [];
    }

    if (response.status === 401) {
      openCircuit("error_auth");
      return [];
    }

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as TruthSocialApiResponse;

    if (!data.success || !Array.isArray(data.posts)) {
      return [];
    }

    return data.posts.filter(isTrumpPost).slice(0, DEFAULT_POST_LIMIT);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function getTrumpPosts(): Promise<TruthSocialPost[]> {
  const now = Date.now();

  if (circuitOpenUntil > now) {
    return [];
  }

  if (postCache && now - postCache.fetchedAt < CACHE_TTL_MS) {
    return postCache.posts;
  }

  const posts = await fetchPostsFromApi();

  if (posts.length > 0) {
    postCache = { posts, fetchedAt: now };
  }

  return posts;
}

export type TruthSocialContextResult = {
  status: TruthSocialFetchStatus;
  context: string;
};

export async function fetchTruthSocialContext(
  query: string,
): Promise<TruthSocialContextResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      status: "skipped_no_key",
      context: "",
    };
  }

  if (circuitOpenUntil > Date.now()) {
    return {
      status: circuitReason ?? "skipped_circuit_open",
      context: "",
    };
  }

  const posts = await getTrumpPosts();

  if (!posts.length) {
    if (circuitOpenUntil > Date.now()) {
      return {
        status: circuitReason ?? "error_unavailable",
        context: "",
      };
    }

    return { status: "skipped_no_posts", context: "" };
  }

  const ranked = rankPosts(posts, query);

  const formatted = ranked
    .map((post, index) => {
      const body = postBody(post);
      if (!body) return null;

      const date = post.created_at
        ? new Date(post.created_at).toISOString().slice(0, 10)
        : "unknown date";

      return `### ${index + 1}. ${date} (@${TRUMP_HANDLE})
${body}
${post.url ? `Source: ${post.url}` : ""}`;
    })
    .filter(Boolean)
    .join("\n\n");

  if (!formatted) {
    return { status: "skipped_no_posts", context: "" };
  }

  return {
    status: "ok",
    context: formatted,
  };
}

export function formatTruthSocialStatus(status: TruthSocialFetchStatus): string {
  switch (status) {
    case "ok":
      return "Truth Social posts loaded.";
    case "skipped_no_key":
      return "Truth Social skipped (no API key).";
    case "skipped_circuit_open":
      return "Truth Social temporarily skipped (credits exhausted or auth failed earlier).";
    case "skipped_no_posts":
      return "Truth Social returned no usable Trump posts.";
    case "error_credits":
      return "Truth Social credits exhausted — continuing without live posts.";
    case "error_auth":
      return "Truth Social auth failed — continuing without live posts.";
    default:
      return "Truth Social unavailable — continuing without live posts.";
  }
}
