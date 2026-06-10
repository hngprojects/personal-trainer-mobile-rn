import { Text } from 'react-native';

/**
 * Global ceiling on system-driven font scaling.
 *
 * Without a cap, text at max Android "Font size" (~2x) overflows every
 * fixed-height container in the app — trainer cards, hero pills, modal
 * actions, footer buttons, badge chips. WCAG 1.4.4 asks for content to be
 * resizable to 200% without loss of content/functionality; in our codebase
 * "without loss of content" wins only if we also significantly redesign the
 * layouts. As a pragmatic compromise we cap at 1.5x globally and let
 * specific layouts opt back into larger scaling case by case — large enough
 * to noticeably help low-vision users, small enough that fixed-height
 * containers don't clip or overlap.
 *
 * This applies to every `<Text>` rendered after this module is imported,
 * including text inside third-party components. The Typography component
 * has its own per-variant caps that are tighter than this where applicable
 * (e.g., headings).
 */
const GLOBAL_MAX_FONT_SCALE = 1.5;

// react-native still supports the legacy defaultProps shape for Text in 0.83;
// the upgrade path is to wrap Text in a custom component, which we already
// do via Typography. This handles the raw <Text> call sites we haven't
// migrated yet.
const TextWithDefaults = Text as unknown as {
  defaultProps?: { maxFontSizeMultiplier?: number; [key: string]: unknown };
};
TextWithDefaults.defaultProps = TextWithDefaults.defaultProps ?? {};
if (TextWithDefaults.defaultProps.maxFontSizeMultiplier == null) {
  TextWithDefaults.defaultProps.maxFontSizeMultiplier = GLOBAL_MAX_FONT_SCALE;
}
