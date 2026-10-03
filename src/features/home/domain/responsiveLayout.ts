/** Tablet-first geometry. The complete 600×550 motion canvas must fit inside the hero. */
export function responsiveHomeLayout(width: number, height: number) {
  width = Number.isFinite(width) ? Math.max(0, width) : 0;
  height = Number.isFinite(height) ? Math.max(0, height) : 0;
  const tablet = width >= 600;
  const landscape = width > height;
  const padding = tablet ? 28 : 17;
  const contentWidth = Math.max(0, Math.min(width - 2 * padding, 1120));
  const gap = tablet ? 18 : 12;
  const sceneWidth = Math.min(
    contentWidth * (tablet ? (landscape ? 0.5 : 0.52) : 0.56),
    tablet ? (landscape ? Math.min(340, height * 0.38) : 380) : 208,
  );
  const sceneHeight = (sceneWidth * 550) / 600;
  const heroHeight = Math.max(tablet ? 280 : 195, sceneHeight + (tablet ? 32 : 28));
  const categoryColumns = contentWidth >= 680 ? 4 : 2;
  const activityColumns = contentWidth >= 980 ? 4 : contentWidth >= 680 ? 3 : 2;
  return {
    tablet,
    landscape,
    padding,
    contentWidth,
    gap,
    sceneWidth,
    sceneHeight,
    heroHeight,
    categoryColumns,
    activityColumns,
    categoryWidth: Math.max(0, (contentWidth - gap * (categoryColumns - 1)) / categoryColumns),
    activityWidth: Math.max(0, (contentWidth - gap * (activityColumns - 1)) / activityColumns),
    recommendationWidth: tablet ? (contentWidth - 2 * gap) / 3 : 164,
  };
}
