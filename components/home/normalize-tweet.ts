import type { Tweet, TweetEntities } from "react-tweet/api";

function asEntityArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function normalizeTweetEntities(
  entities?: TweetEntities | null
): TweetEntities {
  if (!entities || typeof entities !== "object" || Array.isArray(entities)) {
    return {
      hashtags: [],
      user_mentions: [],
      urls: [],
      symbols: [],
    };
  }

  const normalized: TweetEntities = {
    hashtags: asEntityArray(entities.hashtags),
    user_mentions: asEntityArray(entities.user_mentions),
    urls: asEntityArray(entities.urls),
    symbols: asEntityArray(entities.symbols),
  };

  const media = asEntityArray(entities.media);

  if (media.length > 0) {
    normalized.media = media;
  }

  return normalized;
}

export function normalizeTweet(tweet: Tweet): Tweet {
  return {
    ...tweet,
    entities: normalizeTweetEntities(tweet.entities),

    ...(tweet.quoted_tweet
      ? {
          quoted_tweet: {
            ...tweet.quoted_tweet,
            entities: normalizeTweetEntities(tweet.quoted_tweet.entities),
          },
        }
      : {}),

    ...(tweet.parent
      ? {
          parent: {
            ...tweet.parent,
            entities: normalizeTweetEntities(tweet.parent.entities),
          },
        }
      : {}),
  };
}
