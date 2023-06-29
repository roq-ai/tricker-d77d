import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PhotoInterface {
  id?: string;
  original_photo: string;
  enhanced_photo?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PhotoGetQueryInterface extends GetQueryInterface {
  id?: string;
  original_photo?: string;
  enhanced_photo?: string;
  user_id?: string;
}
