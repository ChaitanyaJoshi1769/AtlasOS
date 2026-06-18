import { Injectable } from '@nestjs/common';
import { Connector, ConnectorType } from '../entities/connector.entity';

@Injectable()
export class SalesforceConnector {
  async connect(connector: Connector): Promise<any> {
    const { clientId, clientSecret, instanceUrl } = connector.credentials;

    // Authenticate with Salesforce
    const authUrl = `${instanceUrl}/services/oauth2/token`;
    const tokenResponse = await this.getAccessToken(authUrl, clientId, clientSecret);

    return {
      accessToken: tokenResponse.access_token,
      instanceUrl: instanceUrl,
      isConnected: true,
    };
  }

  async fetchData(connector: Connector, sobject: string, limit: number = 1000): Promise<any[]> {
    const config = await this.connect(connector);

    const query = `SELECT fields(all) FROM ${sobject} LIMIT ${limit}`;
    const url = `${config.instanceUrl}/services/data/v57.0/query`;

    const response = await fetch(`${url}?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.records;
  }

  async getObjects(connector: Connector): Promise<any[]> {
    const config = await this.connect(connector);

    const url = `${config.instanceUrl}/services/data/v57.0/sobjects`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sobjects;
  }

  private async getAccessToken(
    authUrl: string,
    clientId: string,
    clientSecret: string,
  ): Promise<any> {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Salesforce');
    }

    return response.json();
  }
}
