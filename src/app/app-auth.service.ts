import {Injectable} from '@angular/core';
import {Location} from '@angular/common';

@Injectable()
export class AppAuthService {
  isRequired = true;
  trustedURLs = new Set();
  location: any;

  constructor(private _location: Location) {
    this.location = _location;
  }

  getCurrentURL() {
    if (this.location._baseHref.startsWith('https://') || this.location._baseHref.startsWith('https://')) {
      return this.location.prepareExternalUrl(this.location.path());
    }
    // TODO - It does not seem like there is a clean way to do this.
    return this.location._platformStrategy._platformLocation._location.href;
  }

  isTrustedURL(url: string): boolean {
    const currentURL = this.getCurrentURL();
    const currentHostname = (new URL(currentURL)).hostname;

    const urlObj = new URL(url, currentURL);
    return urlObj.hostname === currentHostname || Array.from(this.trustedURLs)
      .some(trustedURL => urlObj.href.startsWith(trustedURL));
  }
}
