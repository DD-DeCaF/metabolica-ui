import {Item, PotionResources, Route} from 'potion-client';


export class User extends Item {
  // displayName: string;
  // firstName: string;
  // isStaff: boolean;
  // title: string;
  // lastName: boolean;
  // username: string;

  static current = Route.GET('/me');
  static readSettings = Route.GET('/settings');
  static updateSettings = Route.POST('/settings');
  static roles = Route.GET('/roles');
  static changePassword = Route.POST('/change-password');

  shortFullName() {
    return `${(this.firstName || '').split(' ')[0]} ${this.lastName}`;
  }

}

export const resources: PotionResources = {
  '/user': User
};
