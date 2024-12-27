import { db } from '@/server/db';
import { summarizeCommitAI } from '@/lib/gemini';
import { Octokit } from 'octokit';
import axios from 'axios';

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  // https://github.com/<owner>/<repo>
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('invalid github url');
  }

  const { data } = await octokit.rest.repos.listCommits({ owner, repo });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  );

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? '',
    commitAuthorName: commit.commit?.author?.name ?? '',
    commitAuthorAvatar: commit?.author?.avatar_url ?? '',
    commitDate: commit.commit?.author.date ?? '',
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value as string;
    }
    return '';
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      const currCommit = unprocessedCommits[index]!;
      return {
        projectId,
        commitHash: currCommit.commitHash,
        commitMessage: currCommit.commitMessage,
        commitAuthorName: currCommit.commitAuthorName,
        commitAuthorAvatar: currCommit.commitAuthorAvatar,
        commitDate: currCommit.commitDate,
        summary,
      };
    }),
  });

  return commits;
};

const summarizeCommit = async (githubUrl: string, commitHash: string) => {
  // get the diff from commitHash, and then pass diff to gemini
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: 'application/vnd.github.v3.diff',
    },
  });
  return (await summarizeCommitAI(data)) || '';
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error('Project has no github url');
  }

  return { project, githubUrl: project.githubUrl };
};

const filterUnprocessedCommits = async (
  projectId: string,
  commitHashes: Response[],
) => {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  return commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
};
