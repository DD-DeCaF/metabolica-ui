import {Injectable} from '@angular/core';
import {Location} from "@angular/common";

@Injectable()
export class AppAuthService {
  isRequired: boolean = true;
  trustedURLs = new Set();

  constructor(private location: Location) {
  }

  isTrustedURL(url: string): boolean {
    const currentURL = this.location.prepareExternalUrl(this.location.path());
    const currentHostname = (new URL(currentURL)).hostname;

    const urlObj = new URL(url, currentURL);
    return urlObj.hostname === currentHostname || Array.from(this.trustedURLs).some(trustedURL => urlObj.href.startsWith(trustedURL));
  }
}
