import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXECUTE = 'execute',
  EXPORT = 'export',
}

export enum AuditResource {
  CONNECTOR = 'connector',
  DATASET = 'dataset',
  PIPELINE = 'pipeline',
  USER = 'user',
  ROLE = 'role',
  POLICY = 'policy',
}

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
@Index(['resource', 'action'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('varchar', {
    enum: AuditAction,
  })
  action: AuditAction;

  @Column('varchar', {
    enum: AuditResource,
  })
  resource: AuditResource;

  @Column()
  resourceId: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  changes: Record<string, any>;

  @Column('text', { nullable: true })
  ipAddress: string;

  @Column('text', { nullable: true })
  userAgent: string;

  @Column('integer')
  statusCode: number;

  @Column('text', { nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
