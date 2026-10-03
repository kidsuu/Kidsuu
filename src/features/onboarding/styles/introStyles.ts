import { StyleSheet } from 'react-native';
export const introStyles = StyleSheet.create({
  opening: {
    flex: 1,
    backgroundColor: '#FFFAF2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  openingContent: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginTop: -35,
  },
  launchArt: {
    width: 245,
    height: 245,
    borderRadius: 48,
  },
  splashLogo: {
    width: '100%',
    height: 236,
  },
  openingSubtitle: {
    fontSize: 13,
    color: '#8D7D8B',
    marginTop: 19,
    textAlign: 'center',
  },
  skip: {
    position: 'absolute',
    right: 17,
    top: 10,
    padding: 12,
    minHeight: 44,
    zIndex: 2,
    borderRadius: 14,
    backgroundColor: '#FFFAF2DD',
  },
  openingFooter: {
    position: 'absolute',
    bottom: 65,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 21,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footerCaps: {
    fontSize: 9,
    letterSpacing: 1.6,
    color: '#A0919E',
  },
  link: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8960AA',
  },
});
