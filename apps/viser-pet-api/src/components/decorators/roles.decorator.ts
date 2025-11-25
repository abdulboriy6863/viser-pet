import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
//shu yerga kiirb kelayotgan req ichiga roles s'zi bilan metadata ni qoshib beryapmiz
