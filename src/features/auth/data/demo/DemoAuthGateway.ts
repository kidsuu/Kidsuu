import { DemoAuthEngine } from './DemoAuthEngine';
/** Composition root loads this adapter only with __DEV__ and explicit opt-in.
 * The deliberately permissive sign-in preserves the approved UI-review flow. */
export class DemoAuthGateway extends DemoAuthEngine {
  readonly mode = 'demo' as const;
  override async signIn(_mobile: string, _password: string) {
    return this.enterPreview();
  }
}
