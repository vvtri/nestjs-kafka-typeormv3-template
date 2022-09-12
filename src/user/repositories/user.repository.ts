import { datasource } from 'datasource';
import { User } from '../entities/user.entity';

export const UserRepository = datasource.getRepository(User).extend({});
