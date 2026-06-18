import { Injectable } from '@nestjs/common';
import { Connector } from '../entities/connector.entity';

@Injectable()
export class GitHubConnector {
  private baseUrl = 'https://api.github.com';

  async fetchRepositories(connector: Connector): Promise<any[]> {
    const { token } = connector.credentials;
    const owner = connector.config.owner;

    const url = `${this.baseUrl}/users/${owner}/repos`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchIssues(connector: Connector, repo: string): Promise<any[]> {
    const { token } = connector.credentials;
    const owner = connector.config.owner;

    const url = `${this.baseUrl}/repos/${owner}/${repo}/issues`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchPullRequests(connector: Connector, repo: string): Promise<any[]> {
    const { token } = connector.credentials;
    const owner = connector.config.owner;

    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchContributors(connector: Connector, repo: string): Promise<any[]> {
    const { token } = connector.credentials;
    const owner = connector.config.owner;

    const url = `${this.baseUrl}/repos/${owner}/${repo}/contributors`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }
}
