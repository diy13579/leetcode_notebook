const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const QUESTION_DETAIL_QUERY = `
  query questionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      difficulty
      topicTags {
        name
        slug
      }
    }
  }
`;

const QUESTION_BY_NUMBER_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
      questions: data {
        questionFrontendId
        titleSlug
      }
    }
  }
`;

async function graphqlRequest(query, variables) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`LeetCode API returned ${res.status}`);
  }
  return res.json();
}

export async function fetchBySlug(titleSlug) {
  const { data } = await graphqlRequest(QUESTION_DETAIL_QUERY, { titleSlug });
  if (!data?.question) {
    throw new Error(`Problem "${titleSlug}" not found`);
  }
  const q = data.question;
  return {
    number: parseInt(q.questionFrontendId, 10),
    title: q.title,
    titleSlug: q.titleSlug,
    difficulty: q.difficulty,
    tags: q.topicTags.map(t => t.name),
    question: q.content || '',
  };
}

export async function findSlugByNumber(number) {
  // LeetCode doesn't have a direct "get by number" query, so we search
  const { data } = await graphqlRequest(QUESTION_BY_NUMBER_QUERY, {
    categorySlug: '',
    limit: 1,
    skip: 0,
    filters: { searchKeywords: String(number) },
  });
  const questions = data?.problemsetQuestionList?.questions || [];
  const match = questions.find(q => parseInt(q.questionFrontendId, 10) === number);
  if (!match) {
    throw new Error(`Problem #${number} not found`);
  }
  return match.titleSlug;
}

export async function fetchLeetCodeProblem(input) {
  // input can be a number or a slug string
  const num = parseInt(input, 10);
  if (!isNaN(num) && String(num) === String(input).trim()) {
    const slug = await findSlugByNumber(num);
    return fetchBySlug(slug);
  }
  // Treat as slug: normalize by lowercasing and replacing spaces with dashes
  const slug = String(input).trim().toLowerCase().replace(/\s+/g, '-');
  return fetchBySlug(slug);
}
