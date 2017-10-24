import {Injectable} from '@angular/core';
import {Location} from "@angular/common";

@Injectable()
export class AppAuthService {
  isRequired: boolean = true;
  trustedURLs = new Set();

  constructor(private location: Location) {
  }

  isTrustedURL(url: string): boolean {
    console.log('url', url);
    const currentURL = this.location.prepareExternalUrl(this.location.path());
    console.log('currentURL', currentURL);
    const currentHostname = (new URL(currentURL)).hostname;
    console.log('currentHostname', currentHostname);

    const urlObj = new URL(url, currentURL);
    return urlObj.hostname === currentHostname || Array.from(this.trustedURLs).some(trustedURL => urlObj.href.startsWith(trustedURL));
  }
}
