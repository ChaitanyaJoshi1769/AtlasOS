import { IsString, IsOptional, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { ConnectorType, ConnectorStatus } from '../entities/connector.entity';

export class CreateConnectorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ConnectorType)
  type: ConnectorType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsObject()
  config: Record<string, any>;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsEnum(ConnectorStatus)
  status?: ConnectorStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateConnectorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsEnum(ConnectorStatus)
  status?: ConnectorStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class TestConnectorDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class ConnectorResponseDto {
  id: string;
  name: string;
  type: ConnectorType;
  description?: string;
  status: ConnectorStatus;
  totalSyncs: number;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
