import { Injectable } from '@nestjs/common';
import { Role } from '../../../../packages/shared/src/rbac';

type UserPayload = { email: string; role: Role; tenantId: string };

@Injectable()
export class AuthService {
  async register(dto: { email: string; password: string; role: Role }): Promise<{ status: string; user: UserPayload }> {
    return {
      status: dto.role === 'Doctor' || dto.role === 'Nurse' ? 'pending_validation' : 'active',
      user: { email: dto.email, role: dto.role, tenantId: 'tenant-placeholder' }
    };
  }

  async login(dto: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
    const token = Buffer.from(`${dto.email}:access`).toString('base64');
    const refresh = Buffer.from(`${dto.email}:refresh`).toString('base64');
    return { accessToken: token, refreshToken: refresh };
  }
}
